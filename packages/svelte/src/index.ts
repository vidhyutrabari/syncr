import { writable, type Writable } from 'svelte/store';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function syncrStore<T>(opts: SyncrOptions<T>): Writable<T> {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);

  // Initialize Svelte store from core state
  const store = writable<T>(handle.get());

  // Keep Svelte store in sync with Syncr core
  const unsubscribe = handle.subscribe((v: T) => {
    store.set(v);
  });

  const { subscribe } = store;

  function set(v: T) {
    // delegate directly to Syncr core (core supports functional updates too)
    handle.set(v);
  }

  function update(fn: (prev: T) => T) {
    handle.set(fn);
    // We don't have to manually compute next; core will call fn(prev)
    // and our subscription will update the Svelte store
    return undefined as unknown as T; // return value not really used by Svelte
  }

  // NOTE: Writable<T> doesn't have a destroy hook, so we can't expose
  // handle.destroy() here. If you need manual cleanup, you can manage
  // the SyncrHandle directly instead of using syncrStore.
  // The 'unsubscribe' from handle is kept for completeness if you later
  // add a wrapper that calls handle.destroy().

  return {
    subscribe,
    set,
    update
  };
}
