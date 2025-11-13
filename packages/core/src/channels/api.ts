import type { Channel } from '../types.js';
import { isBrowser } from '../utils.js';

export type ApiChannelOptions<T> = {
  /** Base URL of your state API, e.g. http://localhost:4321 */
  baseUrl: string;
  /** Optional path builder, default: /state/:key */
  path?: (key: string) => string;
  /** Optional fetch implementation for SSR/testing */
  fetchImpl?: typeof fetch;
  /** Additional headers */
  headers?: Record<string,string>;
  /** LocalStorage key prefix for offline queue & etags */
  storagePrefix?: string;
  /** Retry flush interval (ms) when offline queue exists */
  retryMs?: number;
};

type Envelope<T> = { value: T; version?: string };

export function apiChannel<T>(key: string, opts: ApiChannelOptions<T>): Channel<T> {
  const {
    baseUrl, path = (k)=>`/state/${encodeURIComponent(k)}`,
    fetchImpl = (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined) as any,
    headers = {}, storagePrefix = 'syncr_api', retryMs = 1500
  } = opts;

  const queueKey = `${storagePrefix}:queue:${key}`;
  const etagKey  = `${storagePrefix}:etag:${key}`;

  const read = async (): Promise<T | undefined> => {
    try {
      const res = await fetchImpl(`${baseUrl}${path(key)}`, { headers });
      if (!res.ok) return undefined;
      const etag = res.headers.get('ETag') || undefined;
      if (etag && isBrowser()) localStorage.setItem(etagKey, etag);
      const body = await res.json() as Envelope<T>;
      return body?.value as T;
    } catch {
      return undefined;
    }
  };

  const write = async (value: T) => {
    const etag = isBrowser() ? localStorage.getItem(etagKey) || undefined : undefined;
    const payload: Envelope<T> = { value, version: etag };
    const req = { method: 'POST', headers: { 'Content-Type':'application/json', ...headers }, body: JSON.stringify(payload) } as RequestInit;

    try {
      const res = await fetchImpl(`${baseUrl}${path(key)}`, req);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newTag = res.headers.get('ETag') || undefined;
      if (newTag && isBrowser()) localStorage.setItem(etagKey, newTag);
    } catch (e) {
      // Offline or server error: enqueue for later
      if (isBrowser()) {
        const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
        q.push(payload);
        localStorage.setItem(queueKey, JSON.stringify(q));
        scheduleFlush();
      }
    }
  };

  const flush = async () => {
    if (!isBrowser()) return;
    const raw = localStorage.getItem(queueKey);
    if (!raw) return;
    const q: Envelope<T>[] = JSON.parse(raw);
    if (!q.length) return;
    const next: Envelope<T>[] = [];
    for (const item of q) {
      try {
        const res = await fetchImpl(`${baseUrl}${path(key)}`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', ...headers },
          body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error('failed');
        const newTag = res.headers.get('ETag') || undefined;
        if (newTag) localStorage.setItem(etagKey, newTag);
      } catch {
        next.push(item);
      }
    }
    localStorage.setItem(queueKey, JSON.stringify(next));
    if (next.length) scheduleFlush();
  };

  let flushTimer: any = null;
  const scheduleFlush = () => {
    if (!isBrowser()) return;
    if (flushTimer) return;
    flushTimer = setTimeout(async () => {
      flushTimer = null;
      if (navigator.onLine) await flush();
      else scheduleFlush();
    }, retryMs);
  };

  if (isBrowser()) {
    window.addEventListener('online', flush);
  }

  const subscribe = undefined; // server doesn't push; polling could be added by user

  return { id: 'api', priority: 2, read, write, subscribe };
}
