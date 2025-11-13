import type { Channel } from '../types.js';
import { isBrowser } from '../utils.js';

export type EncryptedStorageOptions = {
  passphrase: string;          // human passphrase (derive key via PBKDF2)
  saltKey?: string;            // localStorage key for salt
  keyIter?: number;            // PBKDF2 iterations
  ivBytes?: number;            // IV size in bytes
  storage?: Storage;           // custom storage (for testing)
};

const enc = new TextEncoder();
const dec = new TextDecoder();

async function getCrypto(): Promise<Crypto> {
  const c = (globalThis as any).crypto;
  if (!c || !c.subtle) throw new Error('WebCrypto not available');
  return c as Crypto;
}

/**
 * Derive AES-GCM key using PBKDF2
 */
async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iter: number
): Promise<CryptoKey> {
  const crypto = await getCrypto();

  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // 👇 Force the underlying buffer to be treated as a real ArrayBuffer
  const saltView = new Uint8Array(salt.buffer as ArrayBuffer);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltView,          // 👈 now Uint8Array<ArrayBuffer>, OK for BufferSource
      iterations: iter,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Load or create salt stored in localStorage
 */
function getOrCreateSalt(storage: Storage, key: string): Uint8Array {
  const existing = storage.getItem(key);
  if (existing) {
    return Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
  }

  const salt = new Uint8Array(16);
  (globalThis.crypto || ({} as any)).getRandomValues?.(salt);

  storage.setItem(key, btoa(String.fromCharCode(...salt)));
  return salt;
}

export function storageEncryptedChannel<T>(
  key: string,
  opts: EncryptedStorageOptions
): Channel<T> {
  const {
    passphrase,
    saltKey = `syncr:enc:salt`,
    keyIter = 120000,
    ivBytes = 12,
    storage = (isBrowser() ? window.localStorage : undefined) as
      | Storage
      | undefined
  } = opts;

  /**
   * READ (decrypt)
   */
  const read = async (): Promise<T | undefined> => {
    if (!storage) return undefined;

    const b64 = storage.getItem(key);
    if (!b64) return undefined;

    const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const iv = raw.slice(0, ivBytes);
    const data = raw.slice(ivBytes);

    const salt = getOrCreateSalt(storage, saltKey);
    const k = await deriveKey(passphrase, salt, keyIter);

    const crypto = await getCrypto();

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        k,
        data
      );

      const txt = dec.decode(new Uint8Array(decrypted));
      return JSON.parse(txt) as T;
    } catch {
      return undefined;
    }
  };

  /**
   * WRITE (encrypt)
   */
  const write = async (value: T) => {
    if (!storage) return;

    const salt = getOrCreateSalt(storage, saltKey);
    const k = await deriveKey(passphrase, salt, keyIter);
    const crypto = await getCrypto();

    const iv = new Uint8Array(ivBytes);
    crypto.getRandomValues(iv);

    const payload = enc.encode(JSON.stringify(value));

    const ct = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      k,
      payload
    );

    const ctBytes = new Uint8Array(ct);
    const out = new Uint8Array(iv.length + ctBytes.length);
    out.set(iv, 0);
    out.set(ctBytes, iv.length);

    const b64 = btoa(String.fromCharCode(...out));
    storage.setItem(key, b64);
  };

  /**
   * SUBSCRIBE (via window.storage events)
   */
  const subscribe = (cb: (v: T | undefined) => void) => {
    if (!storage) return () => {};

    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        read()
          .then((v) => cb(v))
          .catch(() => {});
      }
    };

    if (isBrowser()) window.addEventListener('storage', handler);

    return () => {
      if (isBrowser()) window.removeEventListener('storage', handler);
    };
  };

  return {
    id: 'storage-encrypted',
    priority: 0,
    read,
    write,
    subscribe
  };
}
