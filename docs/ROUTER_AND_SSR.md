Router Helpers & SSR Guards
Ensuring Syncr works safely with routing, navigation, and server-side rendering

Syncr integrates cleanly with all major routers (React Router, Angular Router, Vue Router, SvelteKit Router) and works in SSR frameworks when guarded correctly.

This guide explains browser safety, router merging behavior, URL helpers, and best practices.

🧱 1. SSR Guards

Syncr uses browser APIs:

window

location

history.replaceState

localStorage

crypto.subtle

BroadcastChannel

These do not exist in SSR environments (Next.js, Nuxt, Angular Universal, SvelteKit SSR).

Use the built-in helpers from @syncr/core.

✔ Basic Guards
import { isClient, guardClient } from '@syncr/core';

if (isClient) {
  // safe: window, localStorage, history, crypto, BroadcastChannel
}

guardClient(() => {
  // safe: runs only in browser
  doBrowserThing();
});

✔ Recommended Pattern: Create Syncr only on the client
let syn;

if (isClient) {
  syn = createSyncr({...});
}

Why?

Syncr initializes channels immediately and SSR cannot use browser APIs.

🌐 2. Framework-Specific SSR Notes
🟦 Next.js (App Router / Pages Router)
✔ Syncr must run in CLIENT components
"use client";

import { useSyncr } from "@syncr/react";

✔ Safe pattern with guards
"use client";

if (typeof window !== "undefined") {
  const [filters] = useSyncr({ ... });
}

❌ Do NOT use Syncr in:

Server Components

Layout.js

Route handlers

🟥 Angular Universal

Wrap Syncr logic:

if (isClient) {
  this.syn = createSyncrSignal({ ... });
}

🟩 Vue (Nuxt 3)

Use inside onMounted() or with process.client:

onMounted(() => {
  const { state } = useSyncrVue({...});
});

🟧 SvelteKit

Use:

import { browser } from '$app/environment';

if (browser) {
  const store = syncrStore({...});
}

🧭 3. Router Helpers (URL Safe Wrappers)

Syncr modifies the URL using history.replaceState, not your framework router.

Use router helpers to avoid conflicts.

✔ mergeQueryParam(key, value)

Updates a single query param while preserving others.

import { mergeQueryParam } from '@syncr/core';

mergeQueryParam('filters', JSON.stringify({ q: 'x' }));


Result (example):

?filters={"q":"x"}&page=2

✔ preserveParams(keys: string[])

Extracts a subset of query params for navigation.

import { preserveParams } from '@syncr/core';

const preserved = preserveParams(['filters', 'sort']);


Use it with your router:

React Router:
navigate('/products?' + preserved);

Angular:
this.router.navigate(['/products'], {
  queryParams: preserved,
  queryParamsHandling: 'merge'
});

🎛 4. Router-Specific Guidance
🟦 React Router (v6+)
✔ Use Syncr for URL state

Let router handle just the path/navigation.

✔ Avoid full URL resets

These break Syncr:

navigate('/products'); // wipes query params ❌


Correct:

navigate('/products?' + preserved); // keeps Syncr params

✔ listen to URL changes only if needed
const location = useLocation();
useEffect(() => {
  // handle route changes
}, [location.search]);

🟥 Angular Router

Use:

queryParamsHandling: 'merge'


This ensures Syncr’s replaceState updates are not overwritten.

🟩 Vue Router (4+)

Syncr writes to location.search.

Vue Router preserves unknown keys, but navigation may overwrite query params.

Recommended:

router.push({
  query: {
    ...route.query,
    filters: JSON.stringify(newFilters)
  }
});


Use a watcher to reset state on route changes:

watch(() => route.fullPath, () => set(defaultValue));

🟧 SvelteKit Router

Syncr integrates fine, but SvelteKit’s SSR must be considered.

Recommended:

Use only inside browser checks.

SvelteKit preserves query params automatically during navigation.

🔄 5. Multi-Channel URL Strategy

If using URL + storage:

channels: ['url', 'storage']


Merging order:

Channel	Priority
URL	1
Storage	2
API	3

This means:

URL overrides storage on load

Storage overrides defaults

API overrides both (if provided)

⚠️ 6. Common Pitfalls
❌ Router overwrites Syncr params

Fix: Always merge query params.

❌ Creating multiple Syncr instances

Put createSyncr once per key.

❌ Using Syncr in SSR path

Use guards.

❌ Overwriting URL via router every keystroke

Do not sync router state + Syncr state simultaneously.

🧪 7. Debugging Router Issues

Enable devtools:

enableSyncrConsoleDevtools();


Add taps:

tapChannel('url')


You’ll see logs like:

[Syncr][write:url] filters ← {q:"x"}
[Syncr][read:url] filters → {"q":"x"}

🖼 8. URL Flow Diagram
User Action
     │
     ▼
 Syncr.set()
     │
     ├──► URLChannel.write()   (replaceState)
     ├──► Storage.write()
     ├──► BroadcastChannel.write()
     └──► API.write()
     │
     ▼
 Router receives new URL (no navigation triggered)

📝 Summary

The Router & SSR helpers ensure Syncr:

Works safely in SSR environments

Cooperates cleanly with all routers

Prevents query param overwrites

Supports multi-channel URL strategies

Provides safe, browser-only guards

Allows controlled query merging

Prevents navigation conflicts

Use this guide whenever integrating Syncr with routing or server-side frameworks.