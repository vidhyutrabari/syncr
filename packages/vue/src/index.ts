import { reactive } from 'vue';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T extends object>(opts: SyncrOptions<T>) {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);

  // Initialize a reactive object from Syncr's current value
  const state = reactive(handle.get() as T) as T;

  // Keep reactive object in sync with Syncr core
  const unsubscribe = handle.subscribe((v: T) => {
    Object.assign(state as any, v);
  });

  const set = (v: T | ((prev: T) => T)) => {
    // Core already supports functional updates
    handle.set(v);
  };

  const destroy = () => {
    unsubscribe();
    handle.destroy();
  };

  return {
    state,
    set,
    destroy
  };
}
