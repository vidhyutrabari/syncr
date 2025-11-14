
Syncr DevTools (Console Logger)
Inspect reads, writes, merges, conflicts, and cross-channel activity

Syncr includes a minimal, zero-dependency devtool that logs real-time events to the browser console.
This helps debug:

URL state updates

Storage persistence

BroadcastChannel events

API channel writes / conflicts

Merges between channels

SSR issues

Type validation (Zod)

Great for development, demos, debugging — and lightweight enough to ship behind feature flags.

🚀 Quickstart
import {
  enableSyncrConsoleDevtools,
  disableSyncrConsoleDevtools,
  tapChannel,
  apiChannel
} from '@syncr/core';

enableSyncrConsoleDevtools();

const channels = [
  'url',
  'storage',
  tapChannel(
    apiChannel('filters', { baseUrl: 'http://localhost:4321' })
  )
];

✔ enableSyncrConsoleDevtools()

Activates console logging globally.

✔ tapChannel(channel)

Wraps a channel, logging detailed activity.

✔ disableSyncrConsoleDevtools()

Turns off logging.

📝 What Syncr Logs

Syncr logs structured, color-coded messages:

📘 Reads
[Syncr][read:url] key=filters → { q:"", page:1 }

📙 Writes
[Syncr][write:storage] key=filters ← { q:"shoes", page:1 }

📗 Subscriptions
[Syncr][subscribe:broadcast] key=filters received update

📕 Conflicts (API channel)
[Syncr][conflict:api] key=profile local vs remote → resolving merge

🟣 Merges
[Syncr][merge] key=cart from=url,storage → finalValue=...

🔎 DevTools Example (React)
enableSyncrConsoleDevtools();

const [filters, setFilters] = useSyncr({
  key: 'filters',
  defaultValue: { q: "", page: 1 },
  channels: [
    'url',
    tapChannel('storage')
  ]
});

🅰️ Angular Example
enableSyncrConsoleDevtools();

const syn = createSyncrSignal({
  key: 'filters',
  defaultValue: { q: '', page: 1 },
  channels: [
    'storage',
    tapChannel(broadcastChannel('filters'))
  ]
});

🟩 Vue Example
enableSyncrConsoleDevtools();

const { state, setState } = useSyncrVue({
  key: 'prefs',
  defaultValue: {},
  channels: [
    tapChannel(apiChannel('prefs', { baseUrl: '/api' }))
  ]
});

🟧 Svelte Example
enableSyncrConsoleDevtools();

const { store } = syncrStore({
  key: 'session',
  defaultValue: {},
  channels: [
    tapChannel('url'),
    tapChannel('storage')
  ]
});

🔥 Best Practices
✔ 1. Use tapChannel for any channel you want deeper insight into
tapChannel(apiChannel(...))
tapChannel(broadcastChannel(...))
tapChannel('storage')

✔ 2. Use devtools only in development builds
if (import.meta.env.DEV) {
  enableSyncrConsoleDevtools();
}

✔ 3. Avoid in production unless troubleshooting

Logging can create noise in high-frequency update apps.

🛠 Advanced Usage
Filter logs by channel

Chrome/Edge console:

Filter > write:storage
Filter > broadcast
Filter > conflict

Debug merging
tapChannel({
  ...customChannel,
  name: 'custom-debug'
});

Debug Zod failures

Syncr logs parsing/validation errors:

[Syncr][schema] Invalid value received → falling back to default

⚡ Performance Notes

Logging is synchronous — keep it disabled in production.

tapChannel wraps original calls with minimal overhead.

For apps with high-frequency updates, limit tapChannel usage.

🐞 Troubleshooting
❌ "I don’t see any logs"

Call enableSyncrConsoleDevtools() before creating any Syncr instances.

❌ Logs appear twice

You created Syncr more than once (e.g., inside a loop).
Ensure:

createSyncr(...) // only once per key

❌ Safari private mode missing logs

Safari disables some dev features — expected behavior.

📚 Summary

Syncr DevTools provides:

🔍 Insight into channel operations

🧪 Debugging for URL/storage/api/broadcast

⚔️ Conflict & merge visibility

🔧 Easy enable/disable toggles

🎛 Per-channel instrumentation via tapChannel

🌐 Works across React / Angular / Vue / Svelte

This gives you complete visibility into Syncr’s internal behavior.