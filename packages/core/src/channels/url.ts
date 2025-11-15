import type { Channel } from '../types.js';
import { isBrowser } from '../utils.js';

export function urlChannel<T>(key: string): Channel<T> {
  const read = (): T | undefined => {
    if (!isBrowser()) return undefined;

    try {
      const url = new URL(window.location.href);
      const raw = url.searchParams.get(key);
      if (!raw) return undefined;

      return JSON.parse(raw) as T;
    } catch {
      // malformed URL or JSON – treat as no value
      return undefined;
    }
  };

  const write = (value: T) => {
    if (!isBrowser()) return;

    try {
      const url = new URL(window.location.href);
      url.searchParams.set(key, JSON.stringify(value));
      // Use replaceState to avoid history spam
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore URL errors
    }
  };

  const subscribe = (cb: (v: T | undefined) => void) => {
    if (!isBrowser()) return () => {};

    const onPopState = () => {
      cb(read());
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  };

  return {
    id: `url:${key}`,
    priority: 1,
    read,
    write,
    subscribe
  };
}
