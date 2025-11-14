
Syncr — Detailed Documentation
A unified multi-channel state synchronization layer for modern frontend apps

Syncr synchronizes UI state across:

URL query params

localStorage / sessionStorage

Encrypted storage (AES-GCM)

BroadcastChannel (multi-tab)

Optional server sync (API + ETag)

…giving you a single source of truth for UI state that is persistent, shareable, multi-tab aware, and conflict-resilient.

⭐ Concept Overview

Modern UI state exists in many places:

React / Angular / Vue component state

URL search params (filters, pagination)

Browser storage (preferences, drafts)

Multi-tab coordination

Server persistence

Syncr unifies them.

UI State
   ↕
 Syncr
   ↕
┌──────────┬─────────────┬───────────────┬────────────┐
│   URL    │   Storage    │ BroadcastChan │   Server   │
└──────────┴─────────────┴───────────────┴────────────┘

🎯 Typical Use Cases
Persistent UI State

Filters preserved on refresh

Sorting remembered across pages

Pagination state as shareable URL parameters

Multi-tab Collaboration

Changing filters in one tab updates others

Editing drafts across windows

Offline-first Sync

State changes saved locally

Synced to server when back online

Sensitive Apps

Encrypted preferences (AES-GCM)

Tamper-resistant localStorage

🧩 Core Design Principles
1. Channels

A channel defines how to read/write/subscribe from a data source.

Built-in channels:

Channel	Purpose
url	Read/write state to URL query params
storage	Persist state to localStorage
encryptedStorage	AES-GCM encrypted state at rest
broadcastChannel	Sync across tabs/windows
apiChannel	Server sync with versioning & offline queue
2. ValueBox

A tiny reactive store that:

Holds the canonical state

Interacts with channels

Applies conflict resolution

Notifies adapters (React/Vue/Angular/Svelte)

3. Conflict Resolution

Default: last-writer-wins based on logical timestamp.

Custom:

onConflict(local, remote) {
  return { ...remote, ...local };
}


Useful for merging drafts, collaborative filters, etc.

4. Performance

Debounced writes

Deep equality checks

No unnecessary re-renders

Only changed fields propagated

Tree-shakable ESM design

Zero heavy dependencies

🧩 Channel API (Architecture)
interface Channel<T> {
  id: string;
  priority?: number;
  read(): T | undefined | Promise<T | undefined>;
  write(value: T): void | Promise<void>;
  subscribe?(cb: (value: T | undefined) => void): () => void;
}

Important Notes:

priority controls merge order (apiChannel > storage > url, etc.)

read() runs on initialization

write() triggers when state changes

subscribe() enables multi-source reactivity (e.g. storage events)

⚙️ Built-In Channels
✔ URL Channel

Syncs values to/from query params

Uses history.replaceState (no navigation)

✔ Storage Channel

Persists to localStorage

Listens to the storage event for multi-tab sync

✔ Encrypted Storage Channel (AES-GCM)

Encrypts values at rest

Uses PBKDF2 for key derivation

Prevents tampering + plaintext leakage

✔ BroadcastChannel Sync

Real-time multi-tab sync

No storage usage

Zero-latency updates

✔ API Channel (optional server sync)

ETag-based versioning

Conflict detection

Offline queue

Multi-device sync

Ideal for persistent preferences or drafts

🧱 Adapters (Frontend Frameworks)

Every framework gets a thin adapter wrapping the Syncr core.

🟦 React — useSyncr
const [filters, setFilters] = useSyncr({
  key: 'filters',
  defaultValue: { q:'', page:1 },
  channels: ['url','storage']
});


Re-renders only when values change.

🟧 Angular — createSyncrSignal / createSyncrStore
Signals:
syn = createSyncrSignal({ key:'filters', defaultValue, channels:['url'] });
filters = syn.state; // signal()

RxJS Store:
store = createSyncrStore({ key:'filters', defaultValue, channels:['storage'] });

🟩 Vue (Composition API) — useSyncrVue
const { state, set } = useSyncrVue({
  key:'prefs',
  defaultValue:{},
  channels:['storage']
});


state is a reactive object.

🟧 Svelte — syncrStore
const store = syncrStore({
  key:'prefs',
  defaultValue:{ theme:'dark' },
  channels:['url']
});

<input bind:value={$store.q} />

🔄 State Lifecycle
Initialize
   ↓
read() from all channels
   ↓
merge initial values
   ↓
notify frameworks
   ↓
subscribe to channel events
   ↓
write() changes to channels


Channels behave independently but Syncr coordinates:

ordering

merging

deduplication

conflict detection

🔀 Merging & Conflict Resolution

Each channel’s read() result is merged in priority order:

Example:

URL: { page: 2 }

Storage: { q: "cars" }

Server/API: { sort: "date" }

Result:

{ "page":2, "q":"cars", "sort":"date" }


On conflicts:

Default: last writer wins

Based on timestamp.

Custom merge:
onConflict(local, remote) {
  return { ...remote, ...local };
}

Schema validation:

If using Zod validation:

Invalid values are rejected

Defaults restored

🧪 Testing
Run all tests:
npm test

Per-package:
packages/core/test
packages/react/test
packages/angular/test
...

Tools:

Vitest

jsdom

ESM test environment

🐞 Troubleshooting
❌ URL too long?

Recommended solutions:

Use schemas to compress:

schema: {
  serialize: (v) => compress(JSON.stringify(v)),
  parse: (s) => JSON.parse(decompress(s))
}


Put only the ID in URL, full state in storage

Use encrypted storage or API channel

❌ Router overwrites query params

Fix in:

React Router:
navigate('/products', { queryParamsHandling: 'merge' });

Angular:
this.router.navigate([], {
  queryParamsHandling: 'merge'
});

❌ SSR warnings

Syncr uses browser APIs such as:

window

localStorage

history.replaceState

crypto.subtle

Guard usage:

if (typeof window !== 'undefined') {
  useSyncr(...)
}

❌ Multi-tab not syncing

Use:

channels: ['storage', broadcastChannel('filters')]

⚡ Performance Considerations

Writes are debounced

No deep watches (uses shallow checks)

URL updates use replaceState (no reflow/navigation)

Storage interaction only on change

BroadcastChannel events are cheap

API writes are batched via offline queue

Syncr is safe for:

Dashboards

E-commerce

Admin tools

Search forms

Complex filtering

Multi-step UIs

📚 Examples

Your repo includes complete working demos:

examples/react-app

examples/angular-app

examples/svelte-app

examples/vue-app

Each demonstrates:

URL sync

Storage persistence

Multi-tab updates

Devtools logging

Filters, pagination, preferences

📝 Summary

Syncr provides a unified, multi-channel state layer that:

Syncs across URL, storage, encrypted storage, broadcast, and server

Handles conflicts intelligently

Works natively with React/Vue/Angular/Svelte

Supports SSR (client-side instantiation)

Provides real-time multi-tab sync

Enables secure and persistent UI state

Syncr replaces thousands of lines of "glue code" with one API designed exactly for modern web apps.