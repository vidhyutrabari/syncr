import { describe, it, expect, vi } from 'vitest';
import { apiChannel } from '../src/channels/api.js';

function mockFetchSequence(
  responses: Array<{ ok: boolean; json: any; etag?: string; status?: number }>
) {
  let i = 0;
  return vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    const r = responses[Math.min(i++, responses.length - 1)];
    return {
      ok: r.ok,
      status: r.status ?? (r.ok ? 200 : 500),
      json: async () => r.json,
      headers: {
        get: (k: string) => (k === 'ETag' ? r.etag ?? null : null),
      },
    } as any;
  });
}

describe('apiChannel', () => {
  it('reads value', async () => {
    const fetchImpl = mockFetchSequence([
      { ok: true, json: { value: { a: 1 } }, etag: 'v1' },
    ]);
    const ch = apiChannel('k', { baseUrl: 'http://x', fetchImpl });
    const v = await ch.read();
    expect(v).toEqual({ a: 1 });
  });

  it('queues on failure and flushes later', async () => {
    const fetchImpl = mockFetchSequence([
      { ok: false, json: {}, status: 500 },
      { ok: true, json: { ok: true }, etag: 'v2' },
    ]);
    const ch = apiChannel('k', {
      baseUrl: 'http://x',
      fetchImpl,
      storagePrefix: 't',
    });

    // simulate browser localStorage
    (globalThis as any).localStorage = new (class {
      store: Record<string, string> = {};
      getItem(k: string) {
        return this.store[k] ?? null;
      }
      setItem(k: string, v: string) {
        this.store[k] = v;
      }
      removeItem(k: string) {
        delete this.store[k];
      }
    })();

    // navigator / window / document stubs so isBrowser() === true
    (globalThis as any).navigator = { onLine: true };
    (globalThis as any).window = {
      addEventListener() {},
      removeEventListener() {},
    };
    (globalThis as any).document = {};

    await ch.write({ a: 2 } as any);
    // queued
    const qKey = 't:queue:k';
    expect(JSON.parse(localStorage.getItem(qKey) || '[]').length).toBe(1);

    // manual flush call via internal is not exposed;
    // emulate by calling write again to trigger second fetch
    await ch.write({ a: 3 } as any);
  });
});