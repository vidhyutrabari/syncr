import { signal, effect, type Signal } from '@angular/core';
import type { SyncrOptions } from '@syncr/core';
import { createSyncr } from '@syncr/core';
import { BehaviorSubject } from 'rxjs';

export type SyncrSignal<T> = {
  state: Signal<T>;
  set: (v: T | ((prev:T)=>T)) => void;
  destroy: () => void;
  asObservable: () => import('rxjs').Observable<T>;
};

/**
 * createSyncrSignal
 * Angular 16+ Signals adapter for Syncr.
 * Usage (standalone or NgModule-based components):
 *   const syn = createSyncrSignal({ key:'filters', defaultValue, channels:['url','storage'] });
 *   const filters = syn.state(); // read signal
 *   syn.set({ ...filters, q: 'abc' });
 */
export function createSyncrSignal<T>(opts: SyncrOptions<T>): SyncrSignal<T> {
  const handle = createSyncr<T>(opts);
  const s = signal<T>(handle.value.get());
  const subj = new BehaviorSubject<T>(s());

  // Keep signal in sync with core updates
  const unsubscribe = handle.value.subscribe(v => {
    s.set(v);
    subj.next(v);
  });

  // Make sure we propagate programmatic updates back to channels
  const set = (v: T | ((prev:T)=>T)) => {
    const next = typeof v === 'function' ? (v as any)(s()) : v;
    handle.set(next);
    // signal will be set via subscription above
  };

  const destroy = () => {
    unsubscribe();
    handle.destroy();
    subj.complete();
  };

  const asObservable = () => subj.asObservable();

  return { state: s, set, destroy, asObservable };
}

/**
 * createSyncrStore
 * RxJS-first adapter that returns a BehaviorSubject-like store.
 */
export function createSyncrStore<T>(opts: SyncrOptions<T>) {
  const handle = createSyncr<T>(opts);
  const subj = new BehaviorSubject<T>(handle.value.get());
  const unsub = handle.value.subscribe(v => subj.next(v));

  return {
    value$: subj.asObservable(),
    getValue: () => subj.getValue(),
    set: (v: T | ((prev:T)=>T)) => {
      const next = typeof v === 'function' ? (v as any)(subj.getValue()) : v;
      handle.set(next);
    },
    destroy: () => { unsub(); handle.destroy(); subj.complete(); }
  };
}
