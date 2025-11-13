import { describe, it, expect } from 'vitest';
import { useSyncr } from '../src/index.js';
describe('vue adapter', () => {
  it('exports composable', () => {
    expect(typeof useSyncr).toBe('function');
  });
});
