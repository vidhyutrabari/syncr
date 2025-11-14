
FAQ — Syncr
❓ What problem does Syncr actually solve?

Modern apps store state in many places:

Component state

URL query params

Local/session storage

Multi-tab updates

Server persistence

Offline-first queues

Conflict resolution

Without Syncr, devs manually glue these together.

Syncr unifies them into one source of truth with multi-channel synchronization:

state ↔ URL ↔ storage ↔ broadcast ↔ server

❓ How is this different from TanStack Query / SWR?

TanStack Query & SWR are data-fetching + network caching libraries.

Syncr is UI state synchronization, not fetching.

TanStack Query → “server state” (API data)

Syncr → “client UI state” (filters/preferences/drafts)

They complement each other perfectly.

❓ How is this different from Redux / Zustand / Jotai / Signals?

State libraries store data in memory only.

Syncr provides multi-channel persistence + synchronization:

URL sync

localStorage/sessionStorage

encrypted storage (AES-GCM)

BroadcastChannel

Server sync with conflict resolution

You can even wrap Syncr inside Redux or Zustand, if desired.

❓ Does Syncr replace the router?

No.

Routers control navigation.
Syncr controls UI state, not navigation.

Syncr handles:

filters

preferences

search inputs

pagination

tabs

dashboards

editor state

It works alongside Angular Router, React Router, Vue Router, and SvelteKit.

❓ Does it work across tabs/windows?

Yes.

Two ways:

Storage channel → browser storage events

BroadcastChannel → instant, zero-storage propagation

Multi-tab sync works automatically.

❓ Does Syncr support encryption?

Yes.

Syncr includes AES-256-GCM encrypted storage:

PBKDF2 key derivation

per-write IV

tamper detection

no external dependencies

Perfect for private preferences or enterprise dashboards.

❓ Does Syncr work with SSR (Next.js / Angular Universal / Nuxt / SvelteKit)?

Yes, with one rule:

Create Syncr only in the browser.

if (typeof window !== 'undefined') {
  const syn = createSyncr(...);
}


Syncr will safely no-op channels that require browser APIs.

❓ How does conflict resolution work?

Syncr tracks versions and uses channel priority + user-defined merge strategy.

Default strategy:

Last-writer-wins (logical timestamp)

Custom:

onConflict(local, remote) {
  return { ...remote, ...local }
}


Perfect for offline-first server sync.

❓ Does Syncr support offline mode?

Yes:

API channel has an offline queue

Retries when network returns

Version-aware write merging

Local state never blocks UI

❓ Can I sync to a server?

Yes, using the built-in API channel, powered by:

GET /state/:key

POST with ETag

Conflict detection

Retry queue

Useful for:

multi-device preferences

drafts

collaborative apps

persistent dashboards

❓ Is Syncr safe for production?

Yes.

Fully type-safe

Tiny core

Well-tested

Security-focused encryption channel

Zero telemetry

Predictable channel contracts

Works in all modern browsers

❓ How do I reset state to defaults?

Three options:

1. Use Syncr API:
set(defaultValue);

2. Clear the URL query params:
?filters=

3. Remove storage key:
localStorage.removeItem('syncr:filters');

❓ Does it work with React Signals / Angular Signals / Vue Composition API / Svelte stores?

Yes.

Each framework adapter uses native patterns:

React → hooks

Angular → Signals + RxJS store

Vue → reactive()

Svelte → writable stores

All adapters are extremely small.

❓ Will Syncr slow down my app?

Syncr is designed for performance:

Debounced writes

Lazy reads

No deep clones

Tiny core

Tree-shakable adapters

Channels run independently

Suitable for dashboards, heavy UIs, and large apps.

❓ Can I write custom channels?

Yes — this is one of Syncr’s strongest features.

A channel is simply:

{
  name: string;
  read(): any;
  write(value): void;
  subscribe(cb): () => void;
}


This allows:

IndexedDB channels

Redis channels (via websockets)

File system sync (Electron)

Cloud sync

Session-based channels

❓ Does Syncr store telemetry or analytics?

No.
Syncr is fully privacy-friendly.

❓ How do I debug Syncr?

Enable DevTools:

enableSyncrConsoleDevtools();


Add tapChannel() to inspect specific channels:

tapChannel('storage')
tapChannel(apiChannel(...))
tapChannel(broadcastChannel(...))

❓ How do I uninstall Syncr from a project?

Syncr leaves no side-effects.

Just remove:

Syncr imports

storage keys

URL params (optional)

❓ Will there be devtools UI (browser panel)?

Planned for roadmap v0.5:

Timeline view

Channel activity panel

State diffs

Merge/conflict inspector

✅ Summary

Syncr is designed to be:

🔁 Multi-channel (URL, storage, encrypted, broadcast, API)

💨 Fast + tiny

🔐 Secure

⚛️ Framework-native

🧠 Conflict-aware

🌐 Multi-device and multi-tab

🧪 Well-tested

🔧 Extensible (custom channels)

🚫 Zero telemetry

If your app has filters, preferences, drafts, settings, carts, or any persistent UI state, Syncr solves the exact pain developers face every day.