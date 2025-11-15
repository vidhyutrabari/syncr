import { Injectable, signal, type Signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  createSyncr,
  type SyncrHandle,
  type SyncrOptions,
} from '@syncr/core';

// Simple wrapper class (optional, but often useful)
export class SyncrState<T> {
  private handle: SyncrHandle<T>;

  constructor(opts: SyncrOptions<T>) {
    this.handle = createSyncr<T>(opts);
  }

  get value(): T {
    return this.handle.get();
  }

  subscribe(fn: (v: T) => void): () => void {
    return this.handle.subscribe(fn);
  }

  set(v: T | ((prev: T) => T)) {
    this.handle.set(v);
  }

  destroy() {
    this.handle.destroy();
  }
}

@Injectable({ providedIn: 'root' })
export class SyncrService {
  create<T>(opts: SyncrOptions<T>): SyncrState<T> {
    return new SyncrState<T>(opts);
  }
}

/**
 * Angular signal-based adapter.
 * Used in tests as: createSyncrSignal(...)
 */
export function createSyncrSignal<T>(opts: SyncrOptions<T>): {
  state: Signal<T>;
  set(v: T | ((prev: T) => T)): void;
  destroy(): void;
} {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);
  const state = signal<T>(handle.get());

  const unsubscribe = handle.subscribe((v: T) => {
    state.set(v);
  });

  const set = (v: T | ((prev: T) => T)) => {
    handle.set(v);
  };

  const destroy = () => {
    unsubscribe();
    handle.destroy();
  };

  return { state, set, destroy };
}

/**
 * RxJS store-based adapter.
 * Used in tests as: createSyncrStore(...)
 */
export function createSyncrStore<T>(opts: SyncrOptions<T>): {
  value$: Observable<T>;
  getValue(): T;
  set(v: T | ((prev: T) => T)): void;
  destroy(): void;
} {
  const handle: SyncrHandle<T> = createSyncr<T>(opts);
  const subject = new BehaviorSubject<T>(handle.get());

  const unsubscribe = handle.subscribe((v: T) => {
    subject.next(v);
  });

  const set = (v: T | ((prev: T) => T)) => {
    handle.set(v);
  };

  const destroy = () => {
    unsubscribe();
    subject.complete();
    handle.destroy();
  };

  return {
    value$: subject.asObservable(),
    getValue: () => subject.getValue(),
    set,
    destroy,
  };
}
