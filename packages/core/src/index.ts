import type { Channel, SyncrOptions } from './types.js';
import { debounce, deepEqual } from './utils.js';
import { urlChannel } from './channels/url.js';
import { storageChannel } from './channels/storage.js';

type Subscriber<T> = (v:T)=>void;

export class ValueBox<T> {
  #value: T;
  #subs = new Set<Subscriber<T>>();
  constructor(v:T){ this.#value = v; }
  get(){ return this.#value; }
  set(v:T){
    if (deepEqual(v, this.#value)) return;
    this.#value = v;
    this.#subs.forEach(s => s(this.#value));
  }
  subscribe(cb:Subscriber<T>){ this.#subs.add(cb); return ()=>this.#subs.delete(cb); }
}

export type SyncrHandle<T> = {
  value: ValueBox<T>;
  set: (v:T)=>void;
  destroy: ()=>void;
};

export function createSyncr<T>(opts: SyncrOptions<T>): SyncrHandle<T> {
  const {
    key, defaultValue, channels = ['url','storage'],
    debounceMs = 120, schema, onConflict
  } = opts;

  const builtIns: Record<string, Channel<T>> = {
    url: urlChannel<T>(key, schema),
    storage: storageChannel<T>(key)
  };

  const resolved: Channel<T>[] = channels.map(ch => {
    if (typeof ch === 'string') return builtIns[ch];
    return ch;
  }).filter(Boolean) as Channel<T>[];

  // Initial read: pick first defined by priority desc
  const initialCandidates: Array<{v:T, from:string}> = [];
  for (const ch of resolved.sort((a,b)=>(b.priority??0)-(a.priority??0))) {
    const v = (ch.read as any)();
    if (v instanceof Promise) {
      // ignore async on init for now
    } else if (typeof v !== 'undefined') {
      initialCandidates.push({ v, from: ch.id });
      break;
    }
  }

  const box = new ValueBox<T>(initialCandidates[0]?.v ?? defaultValue);
  let logicalClock = Date.now();

  const writeAll = async (v:T, fromId?:string) => {
    logicalClock = Math.max(logicalClock + 1, Date.now());
    const tasks = resolved.map(async ch => {
      if (ch.id === fromId) return;
      await ch.write(v);
    });
    await Promise.allSettled(tasks);
  };

  const debouncedWrite = debounce(writeAll, debounceMs);

  // Subscribe to channels to receive external updates
  const unsubs: Array<()=>void> = [];
  for (const ch of resolved) {
    if (!ch.subscribe) continue;
    unsubs.push(ch.subscribe((incoming) => {
      if (typeof incoming === 'undefined') return;
      const local = box.get();
      const next = onConflict ? onConflict(local, incoming, { from: ch.id, ts: Date.now() }) : incoming;
      if (!Object.is(next, local)) {
        box.set(next);
        debouncedWrite(next, ch.id);
      }
    }));
  }

  const set = (v:T) => {
    box.set(v);
    debouncedWrite(v);
  };

  return {
    value: box,
    set,
    destroy: () => { unsubs.forEach(u=>u()); }
  };
}

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
