import type { Channel } from '../types.js';
import { isBrowser } from '../utils.js';

export function storageChannel<T>(key: string): Channel<T> {
  const storageKey = `syncr:${key}`;

  const read = (): T | undefined => {
    if (!isBrowser()) return undefined;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupted JSON – treat as missing
      return undefined;
    }
  };

  const write = (value: T) => {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // quota or other storage errors – ignore for now
    }
  };

  const subscribe = (cb: (v: T | undefined) => void) => {
    if (!isBrowser()) return () => {};

    const handler = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      if (!e.newValue) {
        cb(undefined);
        return;
      }
      try {
        cb(JSON.parse(e.newValue) as T);
      } catch {
        cb(undefined);
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  };

  return {
    id: `storage:${key}`,
    priority: 0,
    read,
    write,
    subscribe
  };
}
