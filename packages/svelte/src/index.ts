import { readable, writable, type Writable } from 'svelte/store';
import type { SyncrOptions } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function syncrStore<T>(opts: SyncrOptions<T>): Writable<T> {
  const handle = createSyncr<T>(opts);
  const store = writable(handle.value.get());
  const unsub = handle.value.subscribe(v => store.set(v));
  const { subscribe, set, update } = store;

  function setWrapper(v: T){
    handle.set(v);
  }

  function updateWrapper(fn: (prev:T)=>T){
    const next = fn(handle.value.get());
    handle.set(next);
    return next;
  }

  return {
    subscribe,
    set: setWrapper,
    update: updateWrapper
  };
}
