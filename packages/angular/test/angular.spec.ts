import { describe, it, expect } from 'vitest';
import { createSyncrSignal, createSyncrStore } from '../src/index.js';

describe('angular adapter', () => {
  it('exports signal adapter', () => {
    expect(typeof createSyncrSignal).toBe('function');
  });
  it('exports rxjs store adapter', () => {
    expect(typeof createSyncrStore).toBe('function');
  });
});
