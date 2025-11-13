# BroadcastChannel Sync

Instantly propagate changes across browser tabs/windows.

```ts
import { broadcastChannel } from '@syncr/core';

const handle = createSyncr({
  key: 'filters',
  defaultValue: { q:'', sort:'date', page:1 },
  channels: ['url', 'storage', broadcastChannel('filters')]
});
```

**Behavior**
- `read()` returns `undefined` (bus is not storage).
- `write()` posts `{ key, value, ts }` to a `BroadcastChannel('syncr')` topic.
- `subscribe()` listens and forwards matching key updates.

Combine with `storage` or `api` channels for persistence.
