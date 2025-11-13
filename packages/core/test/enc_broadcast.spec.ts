import { describe, it, expect } from 'vitest';
import { storageEncryptedChannel, broadcastChannel } from '../src/index.js';

describe('channels exist', () => {
  it('exports encrypted storage channel', () => {
    expect(typeof storageEncryptedChannel).toBe('function');
  });
  it('exports broadcast channel', () => {
    expect(typeof broadcastChannel).toBe('function');
  });
});
