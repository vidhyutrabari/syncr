import type { Channel, SyncrOptions, SyncrHandle } from './types.js';
import { debounce, deepEqual } from './utils.js';
import { urlChannel } from './channels/url.js';
import { storageChannel } from './channels/storage.js';

type Subscriber<T> = (v: T) => void;

export class ValueBox<T> {
  #value: T;
  #subs = new Set<Subscriber<T>>();

  constructor(v: T) {
    this.#value = v;
  }

  get() {
    return this.#value;
  }

  set(v: T) {
    if (deepEqual(v, this.#value)) return;
    this.#value = v;
    this.#subs.forEach((s) => s(this.#value));
  }

  subscribe(cb: Subscriber<T>) {
    this.#subs.add(cb);
    return () => this.#subs.delete(cb);
  }
}

export function createSyncr<T>(opts: SyncrOptions<T>): SyncrHandle<T> {
  const {
    key,
    defaultValue,
    channels = ['url', 'storage'],
    debounceMs = 120,
    schema,
    onConflict
  } = opts;

  const builtIns: Record<string, Channel<T>> = {
    url: urlChannel<T>(key),
    storage: storageChannel<T>(key)
  };

  const resolved: Channel<T>[] = (channels as (Channel<T> | 'url' | 'storage')[])
    .map((ch) => {
      if (typeof ch === 'string') return builtIns[ch];
      return ch;
    })
    .filter(Boolean) as Channel<T>[];

  // Apply schema centrally for ALL channels
  const applySchema = (raw: unknown): T | undefined => {
    if (!schema) return raw as T;
    try {
      return schema.parse(raw);
    } catch {
      // ignore invalid values
      return undefined;
    }
  };

  // Initial read: pick first defined by priority desc (sync only), then schema-parse
  const initialCandidates: Array<{ v: T; from: string }> = [];
  for (const ch of resolved.sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  )) {
    const v = (ch.read as any)();
    if (v instanceof Promise) {
      // ignore async channels on bootstrap
      continue;
    }
    if (typeof v !== 'undefined') {
      const parsed = applySchema(v);
      if (parsed !== undefined) {
        initialCandidates.push({ v: parsed, from: ch.id });
        break;
      }
    }
  }

  const box = new ValueBox<T>(initialCandidates[0]?.v ?? defaultValue);

  const writeAll = async (v: T, fromId?: string) => {
    const tasks = resolved.map(async (ch) => {
      if (ch.id === fromId) return;
      try {
        await ch.write(v);
      } catch {
        // ignore channel write errors
      }
    });
    await Promise.allSettled(tasks);
  };

  // ✅ your debounce accepts only (fn, wait)
  const debouncedWrite = debounce(writeAll, debounceMs);

  // Subscribe to channels to receive external updates
  const unsubs: Array<() => void> = [];
  for (const ch of resolved) {
    if (!ch.subscribe) continue;
    unsubs.push(
      ch.subscribe((incoming) => {
        if (typeof incoming === 'undefined') return;

        const parsed = applySchema(incoming);
        if (parsed === undefined) return;

        const local = box.get();
        const next = onConflict ? onConflict(local, parsed) : parsed;

        if (!Object.is(next, local) && !deepEqual(next, local)) {
          box.set(next);
          debouncedWrite(next, ch.id);
        }
      })
    );
  }

  const handle: SyncrHandle<T> = {
  get() {
    return box.get();
  },
  set(nextOrUpdater) {
    const prev = box.get();
    const next =
      typeof nextOrUpdater === 'function'
        ? (nextOrUpdater as (p: T) => T)(prev)
        : nextOrUpdater;
    box.set(next);
    debouncedWrite(next);
  },
  subscribe(cb) {
    return box.subscribe(cb);
  },
  destroy() {
    unsubs.forEach((u) => u());
  },
  // Backwards-compatible "value" view for older code/tests
  value: {
    get() {
      return box.get();
    },
    subscribe(cb: (v: T) => void) {
      return box.subscribe(cb);
    }
  }
};

  return handle;
}

// Public exports
export * from './types.js';
export * from './channels/url.js';
export * from './channels/storage.js';
export * from './channels/api.js';
export * from './helpers/ssr.js';
export * from './helpers/router.js';
export * from './devtools/logger.js';
export * from './channels/storage-encrypted.js';
export * from './channels/broadcast.js';
export * from './integrations/zod.js';
