import { reactive } from 'vue';
import type { SyncrOptions } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T>(opts: SyncrOptions<T>) {
  const handle = createSyncr<T>(opts);
  const state = reactive(handle.value.get() as any) as T;

  // keep reactive object in sync
  handle.value.subscribe((v) => {
    Object.assign(state as any, v);
  });

  const set = (v: T | ((prev:T)=>T)) => {
    const next = typeof v === 'function' ? (v as any)(handle.value.get()) : v;
    handle.set(next);
  };

  return { state, set, destroy: handle.destroy };
}
