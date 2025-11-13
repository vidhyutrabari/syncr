# API Channel

The `apiChannel` lets Syncr sync state to your server with basic versioning (ETag) and an **offline queue**.

## Usage
```ts
import { apiChannel } from '@syncr/core';

const handle = createSyncr({
  key: 'filters',
  defaultValue: { q:'', sort:'date', page:1 },
  channels: [
    'url',
    'storage',
    apiChannel('filters', { baseUrl: 'http://localhost:4321' })
  ]
});
```

## Offline queue
- Failed writes are queued in `localStorage` and retried when online.
- ETag from server is persisted and sent back on subsequent writes.

## Server contract
- `GET /state/:key` → returns `{ value, version }` and sets `ETag: <version>` header.
- `POST /state/:key` with `{ value, version? }` → server stores and returns new `ETag` header.

You can replace the mock server with your own persistence + auth.
