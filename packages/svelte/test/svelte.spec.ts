import { describe, it, expect } from 'vitest';
import { syncrStore } from '../src/index.js';
describe('svelte adapter', () => {
  it('exports store creator', () => {
    expect(typeof syncrStore).toBe('function');
  });
});
