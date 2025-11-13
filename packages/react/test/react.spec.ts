import { describe, it, expect } from 'vitest';
import { useSyncr } from '../src/index.js';

describe('react adapter', () => {
  it('exports hook', () => {
    expect(typeof useSyncr).toBe('function');
  });
});
