# Encrypted Storage Channel (AES-GCM)

Protect persisted UI state at rest using WebCrypto AES-GCM.

```ts
import { storageEncryptedChannel } from '@syncr/core';

const enc = storageEncryptedChannel('filters', {
  passphrase: 'your-strong-passphrase',   // or derive per-user
  saltKey: 'syncr:enc:salt',              // where salt lives in localStorage
  keyIter: 120_000                        // PBKDF2 iterations
});

const handle = createSyncr({
  key: 'filters',
  defaultValue: { q:'', sort:'date', page:1 },
  channels: [enc, 'url']                  // encrypted + url
});
```

**Notes**
- Uses PBKDF2 (SHA-256) to derive an AES-256-GCM key from a passphrase.
- IV is randomly generated per write and stored prepended to ciphertext.
- Salt is stored once in localStorage under `saltKey`.
- If `crypto.subtle` is unavailable, the channel throws on init—guard for SSR.
