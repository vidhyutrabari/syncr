import type { Channel } from '../types.js';
import { isBrowser } from '../utils.js';

export function storageChannel<T>(key:string): Channel<T> {
  const read = () => {
    if (!isBrowser()) return undefined;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  };
  const write = (value:T) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const subscribe = (cb:(v:T|undefined)=>void) => {
    if (!isBrowser()) return () => {};
    const handler = (e: StorageEvent) => {
      if (e.key === key) cb(e.newValue ? JSON.parse(e.newValue) : undefined);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  };
  return { id: 'storage', priority: 0, read, write, subscribe };
}
