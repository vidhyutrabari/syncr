import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export class SyncrState<T> {
  private handle: SyncrHandle<T>;
  private subject: BehaviorSubject<T>;

  constructor(opts: SyncrOptions<T>) {
    this.handle = createSyncr<T>(opts);
    this.subject = new BehaviorSubject<T>(this.handle.value.get());

    this.handle.value.subscribe((v: T) => {
      this.subject.next(v);
    });
  }

  asObservable(): Observable<T> {
    return this.subject.asObservable();
  }

  get value(): T {
    return this.handle.value.get();
  }

  set(v: T | ((prev: T) => T)) {
    const next =
      typeof v === 'function'
        ? (v as (prev: T) => T)(this.handle.value.get())
        : v;

    this.handle.set(next);
  }

  destroy() {
    this.handle.destroy();
    this.subject.complete();
  }
}

@Injectable({ providedIn: 'root' })
export class SyncrService {
  create<T>(opts: SyncrOptions<T>): SyncrState<T> {
    return new SyncrState<T>(opts);
  }
}
