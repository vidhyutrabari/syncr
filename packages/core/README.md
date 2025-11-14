📦 1) README for @syncr/core



@syncr/core
The core multi-channel state synchronization engine powering Syncr.


🌟 About

@syncr/core provides the framework-agnostic engine that synchronizes application state across:

🌐 URL query parameters

💾 LocalStorage / SessionStorage

🔐 Encrypted Storage (AES-GCM)

🪟 BroadcastChannel (multi-tab sync)

☁️ API (ETag/version-aware syncing)

It powers all framework adapters (React, Angular, Vue, Svelte).

📦 Installation
npm install @syncr/core

⚡ Basic Usage (Vanilla JS)
import { createSyncr } from '@syncr/core';

const { get, set, subscribe } = createSyncr({
  key: 'filters',
  defaultValue: { q: '', sort: 'date', page: 1 },
  channels: ['url', 'storage'],
});

🔌 Built-in Channels
✔ URL Channel

Syncs state with query parameters.

✔ Storage Channel

Persists state in localStorage.

✔ Encrypted Storage Channel

AES-GCM encryption using WebCrypto.

import { storageEncryptedChannel } from '@syncr/core';

const enc = storageEncryptedChannel('settings', {
  passphrase: 'my-secret-pass'
});

✔ BroadcastChannel

Real-time cross-tab sync.

broadcastChannel('cart')

✔ API Channel

Server synchronization with conflict detection.

apiChannel('profile', { baseUrl: '/api' })

🧩 Schema Validation (Zod)
import { z } from 'zod';
import { zodSchema } from '@syncr/core';

useSyncr({
  schema: zodSchema(
    z.object({ q: z.string(), page: z.number().min(1) })
  )
});

📚 Documentation

🔐 Encrypted Storage → docs/ENCRYPTED_STORAGE.md

🪟 BroadcastChannel → docs/BROADCAST.md

🌐 API Sync → docs/API_CHANNEL.md

🧩 Zod → docs/ZOD.md

SSR/Router helpers → docs/ROUTER_AND_SSR.md

📝 License

MIT © Vidhyut Rabari