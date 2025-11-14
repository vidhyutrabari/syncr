API Channel — Server Sync for Syncr

The API Channel allows Syncr to synchronize UI state with a backend server using:

🔁 Bi-directional sync

📡 ETag-based versioning

🔄 Conflict detection & merge strategies

📦 Offline queue with automatic retry

🔐 Optional authentication headers

This is ideal for multi-device sync, persistent user settings, draft states, cart syncing, and collaborative apps.

🚀 Basic Usage
import { createSyncr } from '@syncr/core';
import { apiChannel } from '@syncr/core';

const syn = createSyncr({
  key: 'filters',
  defaultValue: { q: '', sort: 'date', page: 1 },
  channels: [
    'url',
    'storage',
    apiChannel('filters', { baseUrl: 'http://localhost:4321' })
  ]
});

🔗 How API Sync Works
1. Client starts with local state

Syncr loads defaultValue and merges any existing URL/storage values.

2. Syncr fetches server state
GET /state/filters


Server returns:

{
  "value": { "q": "", "sort": "date", "page": 1 },
  "version": "abc123"
}


Also sets header:

ETag: abc123

3. Client merges server state with local state

Uses onConflict strategy (default: server wins).

4. When client state updates

Syncr POSTs changes:

POST /state/filters
Content-Type: application/json
If-Match: abc123


Payload:

{
  "value": { "q": "shoes", "sort": "date", "page": 1 },
  "version": "abc123" 
}


If accepted, server returns:

ETag: new-version-string


Syncr stores the new version locally for future writes.

⚔️ Conflict Detection

Syncr detects conflicts by comparing the stored ETag with the server’s version.

Server must respond with:

409 Conflict


When:

Server resource has a newer version

If-Match doesn’t match

Client Behavior

If conflict:

Client fetches latest server state

Syncr applies onConflict(local, remote):

Example:

apiChannel('filters', {
  baseUrl: '/api',
  onConflict(local, remote) {
    return { ...remote, ...local }; // merge strategy
  }
})


Merged result is written back to server

Local state updated

This prevents race conditions.

📦 Offline Queue

If the POST fails (network offline or server down):

The update is stored in localStorage under:

syncr.queue.<key>


When browser regains network connectivity:

Syncr automatically retries queued writes

Queue is FIFO and version-aware

Queue is flushed only after successful sync

This enables:

✔ Offline editing
✔ Stable retries
✔ Multi-device backfill once online

🔒 Authentication & Headers

Add custom headers to all GET/POST calls:

apiChannel('profile', {
  baseUrl: '/api',
  headers: () => ({
    Authorization: `Bearer ${localStorage.token}`,
    'X-App-Version': '1.0.0'
  })
});


Supports:

JWT

Cookies

Session tokens

Signed URLs

🗂 API Channel Options
apiChannel(key, {
  baseUrl: string,                // required
  headers?: () => Record<string,string>,
  debounceMs?: number,            // default: 0 (immediate writes)
  onConflict?: (local, remote) => any,
  onServerError?: (err) => void,
});

onConflict(local, remote)

Handles version mismatch.

Default: server wins

onServerError(error)

Useful for logging:

onServerError: (err) => console.error('API error', err)

🚀 Full Example (React)
const [profile, setProfile] = useSyncr({
  key: 'profile',
  defaultValue: { name: '', theme: 'light' },
  channels: [
    storageChannel,
    apiChannel('profile', {
      baseUrl: 'https://api.example.com',
      headers: () => ({ Authorization: `Bearer ${token}` }),
      onConflict(local, remote) {
        return { ...remote, localUpdatedAt: Date.now() };
      }
    })
  ]
});

🅰️ Example (Angular)
const syn = createSyncrSignal({
  key: 'profile',
  defaultValue: { name: '', theme: 'dark' },
  channels: [
    apiChannel('profile', {
      baseUrl: '/api',
      onConflict: (local, remote) => ({ ...remote, ...local })
    })
  ]
});

🟩 Vue Example
const { state, setState } = useSyncrVue({
  key: 'prefs',
  defaultValue: {},
  channels: [
    apiChannel('prefs', { baseUrl: '/api' })
  ]
});

🟧 Svelte Example
const { store, setStore } = syncrStore({
  key: 'profile',
  defaultValue: {},
  channels: [apiChannel('profile', { baseUrl: '/api' })]
});

🖥 Sample Express Server

Below is the exact server Syncr works with.

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Map(); // key → { value, version }

app.get('/state/:key', (req, res) => {
  const key = req.params.key;
  const entry = db.get(key) || { value: null, version: '0' };
  res.set('ETag', entry.version);
  res.json(entry);
});

app.post('/state/:key', (req, res) => {
  const key = req.params.key;
  const incoming = req.body;
  const entry = db.get(key) || { value: null, version: '0' };

  // Version conflict?
  if (req.headers['if-match'] !== entry.version) {
    return res.status(409).json({ error: 'Version conflict' });
  }

  // Store update
  const newVersion = crypto.randomUUID();
  db.set(key, { value: incoming.value, version: newVersion });

  res.set('ETag', newVersion);
  res.json({ ok: true, version: newVersion });
});

app.listen(4321);

⚠️ Troubleshooting
❌ I’m getting 409 Conflict constantly

Reason: client version mismatches server version.

Fix: implement onConflict merging.

❌ Server returns old state after write

Your server must update the version (ETag) every time.

❌ I get CORS errors

Enable:

app.use(cors());

❌ How do I debug syncing?

Use tapChannel:

channels: [tapChannel(apiChannel(...))]


Logs all reads/writes/merges.

🧾 Summary

The API Channel gives Syncr:

🔁 Multi-device sync

🔄 Conflict-safe persistence

📦 Offline support with queue

🔐 Secure headers/JWT support

🧩 Zod-compatible payload validation

⚡ Light, predictable, and framework-agnostic

It turns Syncr into a real backend-syncing state system with minimal effort.