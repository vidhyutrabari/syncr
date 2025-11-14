⚛️ 2) README for @syncr/react

Save as:
packages/react/README.md

@syncr/react
React hooks for the Syncr multi-channel state engine






📦 Install
npm install @syncr/core @syncr/react

⚡ Quickstart
import { useSyncr } from '@syncr/react';

export function Users() {
  const [filters, setFilters] = useSyncr({
    key: 'filters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage'],
  });

  return (
    <>
      <input
        value={filters.q}
        onChange={(e) => setFilters(p => ({ ...p, q: e.target.value }))}
      />
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </>
  );
}

🚀 Features
✔ useSyncr hook

Synchronizes state across channels.

✔ Debounced writes

Avoids excessive URL/storage writes.

✔ SSR Safe

Auto-detects browser vs server.

✔ Deep merging & immutability

Updater functions use React patterns.

🧩 With Encrypted Storage
const encrypted = storageEncryptedChannel('filters', {
  passphrase: 'top-secret'
});

useSyncr({
  key: 'filters',
  defaultValue: {},
  channels: ['url', encrypted]
});

🪟 Multi-Tab Sync
useSyncr({
  key: 'cart',
  channels: ['storage', broadcastChannel('cart')]
});

🧠 With Zod Validation
import { z } from 'zod';
import { zodSchema } from '@syncr/core';

useSyncr({
  schema: zodSchema(z.object({
    q: z.string(),
    page: z.number().min(1)
  }))
});

📚 Documentation

See repo root README for:

Channels

API Sync

Zod integration

Examples

Storybook playground

📝 License

MIT © Vidhyut Rabari