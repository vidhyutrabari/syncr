BroadcastChannel Sync
Real-time state syncing across browser tabs & windows

The BroadcastChannel integration enables Syncr to keep state instantly synchronized across multiple browser tabs or windows.
This is useful for:

🛒 Cart syncing

🔎 Search filters

⚙️ Preferences

📊 Dashboard filters

🧮 Multi-window admin tools

🧪 Testing tools

💼 Multi-session enterprise apps

BroadcastChannel sync is real-time, fast, and has zero storage footprint.

🚀 Quickstart
import { createSyncr } from '@syncr/core';
import { broadcastChannel } from '@syncr/core';

const syn = createSyncr({
  key: 'filters',
  defaultValue: { q: '', sort: 'date', page: 1 },
  channels: [
    'url',
    'storage',
    broadcastChannel('filters')
  ]
});


Now open two tabs and modify a filter — both tabs will update instantly.

🔧 How It Works

Syncr wraps a native BroadcastChannel to create a simple real-time bus.

🧩 Implementation summary:

🟦 write()
Broadcasts messages to a shared channel:

{ "key": "filters", "value": { ... }, "ts": 1710000000 }


🟪 read()
Always returns undefined — BroadcastChannel is not a persistence layer.

🟥 subscribe()
Listens to messages and forwards updates only if:

msg.key === syncrKey


All subscriber components across all tabs update immediately.

Channel name

Syncr uses:

BroadcastChannel("syncr")


The per-channel namespace is handled inside the message (msg.key).

📦 Combine With Storage / URL / API

BroadcastChannel is not persistent — it only delivers real-time events.

Combine it with:

"storage" → persist settings

"url" → share state via URL

apiChannel() → multi-device sync

Example:

createSyncr({
  key: 'cart',
  defaultValue: {},
  channels: [
    'storage',            // persistence
    broadcastChannel('cart')  // real-time sync
  ]
});

⚛️ React Example
const [cart, setCart] = useSyncr({
  key: 'cart',
  defaultValue: [],
  channels: ['storage', broadcastChannel('cart')]
});

🅰️ Angular Example
const syn = createSyncrSignal({
  key: 'filters',
  defaultValue: { q: '', page: 1 },
  channels: [
    'storage',
    broadcastChannel('filters')
  ]
});

🟩 Vue Example
const { state, setState } = useSyncrVue({
  key: 'filters',
  defaultValue: {},
  channels: ['storage', broadcastChannel('filters')]
});

🟧 Svelte Example
const { store } = syncrStore({
  key: 'prefs',
  defaultValue: {},
  channels: [
    'storage',
    broadcastChannel('prefs')
  ]
});

🧠 Behavior Summary
Function	Behavior
read()	Always returns undefined (no persistence)
write(value)	Broadcasts { key, value, ts } to all tabs
subscribe(cb)	Receives updates for the matching Syncr key
Persistence	Provided by storage/api channels, not BroadcastChannel
🧼 Cleanup

Syncr automatically closes BroadcastChannel connections on:

component unmount (React)

ngOnDestroy() (Angular)

onUnmounted() (Vue)

Svelte component destroy

No manual teardown required unless using Syncr Core directly.

📡 When To Use BroadcastChannel
✔ Recommended for:

Multi-tab syncing of UI filters

Cross-window dashboards

Keeping carts, preferences, or editor state aligned

Tab messaging without storage writes

Collaborative browser tools

❌ Not ideal for:

Persistence

Offline data

Large payloads (e.g., full documents)

⚡ Performance Tips

Small payloads → good

Avoid broadcasting large arrays often

Debounce your setState calls

Use channels: ['storage', broadcastChannel()] instead of only BroadcastChannel

Syncr already debounces writes if you pass:

debounceMs: 150

🔐 Security Notes

BroadcastChannel is same-origin only, meaning:

Tabs must share the same protocol + domain + port

Data is visible to any tab on that origin

For sensitive data → use encryptedStorage channel

🧪 Testing Cross-Tab Sync

Run your frontend locally

Open two tabs

Open DevTools → Console

Update state in tab A

Tab B should instantly update

You can enable debug logging:

import { tapChannel } from '@syncr/core';

channels: [
  tapChannel(broadcastChannel('filters'))
]

🐞 Troubleshooting
❌ Sync does not happen

Make sure both tabs are on the same origin:

http://localhost:5173  ✔
http://127.0.0.1:5173  ❌

❌ No updates on Safari private mode

Safari disables BroadcastChannel in private browsing.

Use fallback:

channels: ['storage']

❌ I get duplicate updates

Ensure only ONE instance per tab:

createSyncr({ key: 'filters', ... })


Do NOT create Syncr in a loop.

🧩 Diagram
 ┌──────────┐
 │  Tab A   │
 │          │
 │ Syncr A  │
 └────┬─────┘
      │  broadcast({key,value,ts})
      ▼
  BroadcastChannel("syncr")
      ▲
      │  message({key,value,ts})
 ┌────┴─────┐
 │  Tab B   │
 │ Syncr B  │
 └──────────┘

📝 Summary

Using the BroadcastChannel:

🔁 Real-time sync across tabs

🔧 Minimal setup

⚡ Super-fast (no IO)

🧼 Auto cleaned up

🧩 Works with all Syncr adapters

💾 Combine with storage/API for persistence

This is one of the simplest but most powerful features of Syncr.

If you want, I can now upgrade: