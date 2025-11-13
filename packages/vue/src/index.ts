import { reactive } from 'vue';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T extends object>(opts: SyncrOptions<T>) {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);

  const state = reactive(handle.value.get() as T) as T;

  // keep reactive object in sync
  handle.value.subscribe((v: T) => {
    Object.assign(state as any, v);
  });

  const set = (v: T | ((prev: T) => T)) => {
    const next =
      typeof v === 'function'
        ? (v as (prev: T) => T)(handle.value.get())
        : v;

    handle.set(next);
  };

  return {
    state,
    set,
    destroy: handle.destroy
  };
}
