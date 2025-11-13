import { writable, type Writable } from 'svelte/store';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function syncrStore<T>(opts: SyncrOptions<T>): Writable<T> {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);
  const store = writable<T>(handle.value.get());

  // keep Svelte store in sync with core value
  const unsubscribe = handle.value.subscribe((v: T) => {
    store.set(v);
  });

  const { subscribe } = store;

  function set(v: T) {
    handle.set(v);
  }

  function update(fn: (prev: T) => T) {
    const next = fn(handle.value.get());
    handle.set(next);
    return next;
  }

  // We can't expose unsubscribe directly on Writable,
  // but we do clean it up when Syncr is destroyed externally.
  return {
    subscribe,
    set,
    update
  };
}
