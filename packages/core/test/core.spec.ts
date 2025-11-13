import { describe, it, expect } from 'vitest';
import { createSyncr, ValueBox } from '../src/index.js';

describe('ValueBox', () => {
  it('stores and notifies', () => {
    const vb = new ValueBox(1);
    let last = 0;
    const unsub = vb.subscribe(v => last = v);
    vb.set(2);
    expect(last).toBe(2);
    unsub();
  });
});

describe('createSyncr', () => {
  it('initializes with default', () => {
    const h = createSyncr({ key:'k', defaultValue: { a: 1 } });
    expect(h.value.get()).toEqual({ a:1 });
    h.destroy();
  });
});
