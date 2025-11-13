import type { Channel, Schema } from '../types.js';
import { isBrowser } from '../utils.js';

export function urlChannel<T>(key: string, schema?: Schema<T>): Channel<T> {
  const read = () => {
    if (!isBrowser()) return undefined;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key);
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return schema ? schema.parse(parsed) : parsed;
    } catch {
      return undefined;
    }
  };
  const write = (value: T) => {
    if (!isBrowser()) return;
    const url = new URL(window.location.href);
    const serialized = schema?.serialize ? schema.serialize(value) : value as any;
    url.searchParams.set(key, JSON.stringify(serialized));
    window.history.replaceState({}, '', url);
  };
  const subscribe = (cb: (v:T|undefined)=>void) => {
    if (!isBrowser()) return () => {};
    const onPop = () => cb(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  };
  return { id: 'url', priority: 1, read, write, subscribe };
}
