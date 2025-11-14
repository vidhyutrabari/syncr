Encrypted Storage Channel (AES-GCM)
Secure client-side persistence with AES-256-GCM & PBKDF2 key derivation

Syncr’s encryptedStorage channel protects persisted UI state at rest in the browser using industry-standard WebCrypto primitives:

🔐 AES-256-GCM encryption

🧂 PBKDF2 + random salt for key derivation

🔄 Strong IV generation per write

🧱 Integrity protection

⚡ Streaming fast, browser-native WebCrypto

This is ideal for protecting settings, profile data, drafts, or anything sensitive you store in the browser.

🚀 Quickstart
import { createSyncr } from '@syncr/core';
import { storageEncryptedChannel } from '@syncr/core';

const enc = storageEncryptedChannel('filters', {
  passphrase: 'your-strong-passphrase',  // ideally per-user or per-session
  saltKey: 'syncr:enc:salt',             // where salt is stored
  keyIter: 120_000                       // PBKDF2 iterations (default ≈ 100k)
});

const syn = createSyncr({
  key: 'filters',
  defaultValue: { q: '', sort: 'date', page: 1 },
  channels: [
    enc,   // encrypted at-rest persistence
    'url'  // plain URL sync
  ]
});

🔐 How the Encryption Works

Syncr uses:

✔ AES-256-GCM

Modern authenticated encryption

Protects confidentiality + integrity (prevents tampering)

✔ PBKDF2-SHA256

Derives a strong key from your passphrase

Uses randomly generated salt (stored at saltKey)

Iteration count configurable (default ~100k)

✔ IV per write

Every write generates a unique random IV, preventing replay patterns.

✔ Ciphertext format

Syncr stores:

<base64 IV>.<base64 ciphertext>


All encoded, stored in localStorage under the Syncr key.

🧠 Should You Use Encrypted Storage?

Use it when storing:

User settings with personal info

Tokens or sensitive config (prefer secure cookies if possible)

Enterprise dashboard filters

Healthcare or finance-adjacent data

Hidden draft editor content

Secure selections or preferences

Do not store:

Authentication tokens (use HttpOnly cookies instead)

Large binary data (localStorage limits apply)

🅰️ Angular Example
const encrypted = storageEncryptedChannel('profile', {
  passphrase: userService.userSecret,
  keyIter: 150_000
});

const syn = createSyncrSignal({
  key: 'profile',
  defaultValue: { theme: 'dark', language: 'en' },
  channels: [encrypted]
});

⚛️ React Example
const store = useSyncr({
  key: 'prefs',
  defaultValue: { theme: 'light' },
  channels: [
    storageEncryptedChannel('prefs', {
      passphrase: myAuth.userKey,
      keyIter: 150_000
    })
  ]
});

🟩 Vue Example
const { state } = useSyncrVue({
  key: 'securePrefs',
  defaultValue: {},
  channels: [
    storageEncryptedChannel('securePrefs', {
      passphrase: token,
      keyIter: 120_000
    })
  ]
});

🟧 Svelte Example
const store = syncrStore({
  key: 'draft',
  defaultValue: {},
  channels: [
    storageEncryptedChannel('draft', {
      passphrase: sessionKey
    })
  ]
});

🔑 Passphrase Strategy (Important)
Recommended:
Strategy	Security	Complexity
Per-user secret key from server	⭐⭐⭐⭐	Medium
Derived from login token	⭐⭐⭐	Easy
Hardcoded constant	⭐	❌ Avoid in real apps

Best practice:

passphrase: user.id + ':' + user.sessionKey


Ensures:

Each user has a different encryption key

Logging out invalidates the key

↻ Key Rotation

You can rotate encryption keys:

Load old ciphertext

Decrypt using old passphrase

Re-encrypt with new passphrase

Syncr does not rotate automatically (for safety), but you can:

syn.rotateEncryption(newPassphrase);


(Optional utility available if you want — I can implement this feature.)

🌐 SSR Safety

AES-GCM requires browser WebCrypto.

On SSR:

if (typeof window !== 'undefined' && crypto?.subtle) {
  const enc = storageEncryptedChannel(...);
}


If WebCrypto is unavailable, Syncr throws on channel initialization.

🐞 Error Handling
const enc = storageEncryptedChannel('prefs', {
  passphrase,
  onError(err) {
    console.error('Failed to decrypt prefs', err);
  }
});


Common error causes:

Wrong passphrase

Corrupted ciphertext

Tampered storage entry

Salt missing or overwritten

Syncr handles this by:

Logging error (if devtools enabled)

Falling back to defaultValue

🧪 Testing Encrypted Storage
Test decrypting manually
localStorage.getItem('syncr:prefs'); // see encrypted blob

Test wrong passphrase

Ensure your UI recovers gracefully.

Test large objects

Verify localStorage size limits (~5–10MB).

🛡️ Security Notes
✔ AES-GCM + PBKDF2 is strong

Equivalent to modern password-based file encryption.

✔ Keys never stored in localStorage

Only derived in-memory.

✔ Integrity protection

Tampering will cause decryption failure.

✔ Same-origin only

localStorage is sandboxed per domain.

🧩 Advanced Example — Combining Channels
createSyncr({
  key: 'secureProfile',
  defaultValue: {},
  channels: [
    storageEncryptedChannel('secureProfile', { passphrase }),
    broadcastChannel('secureProfile'),
    apiChannel('secureProfile', { baseUrl: '/api' })
  ]
});


This gives:

🔐 Encrypted at-rest storage

📡 Multi-tab sync

☁️ Server persistence

📚 Diagram
                    ┌────────────────┐
                    │ Passphrase     │
                    └──────┬─────────┘
                           ▼
                  PBKDF2 Key Derivation
                           │
                           ▼
                    ┌──────────────┐
                    │ AES-256-GCM  │
                    └──────┬───────┘
                           ▼
                 ┌────────────────────┐
                 │ localStorage entry │
                 │  iv.ciphertext     │
                 └────────────────────┘

📝 Summary

The encrypted storage channel provides:

🔐 AES-256-GCM protection

🧂 Secure key derivation with PBKDF2

🛡️ Integrity & tamper detection

⚡ Fast, browser-native crypto

🧼 Drop-in compatibility with all Syncr channels

🚫 No additional dependencies

This is one of the most powerful features in Syncr — enabling secure, persistent UI state for real production applications.
