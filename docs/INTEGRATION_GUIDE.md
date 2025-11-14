
Integration Guide
Using Syncr in React, Angular, Vue, and Svelte Applications

Syncr is framework-agnostic, but each frontend framework has its own routing, reactivity model, SSR rules, and lifecycle patterns. This guide shows how to integrate Syncr cleanly and correctly in all modern setups.

🟦 React Integration
📌 Basic React
const [filters, setFilters] = useSyncr({
  key: 'filters',
  defaultValue: { q:'', page:1 },
  channels: ['url', 'storage'],
});

📍 React Router (v6+)
Best Practices

Ensure navigation does not replace your query params:

navigate('/products', { replace: true, state: {} });


should be:

navigate('/products', { replace: false });


Avoid router-based query param sync in combination with Syncr.

Typical Setup

Syncr updates URL via history.replaceState, so React Router won’t re-render unless your component depends on location.search.

If you want the router to react to Syncr updates:

let location = useLocation();
useEffect(() => {
  // Hooks react when URL changes
}, [location.search]);

🟨 Next.js (13+ App Router)
✔ Use Syncr only in Client Components
"use client";
import { useSyncr } from "@syncr/react";

✔ Do not instantiate Syncr in a Server Component
✔ Use:

useSearchParams() for SSR-safe reads

Syncr’s URL channel for client-side writes

Recommended Pattern

Wrap Syncr usage in:

if (typeof window !== 'undefined') {
  // safe to call useSyncr
}

🟥 Angular Integration

Use either Signals (recommended) or RxJS Store.

Signals
const syn = createSyncrSignal({
  key:'filters',
  defaultValue:{ q:'', page:1 },
  channels:['url','storage'],
});

Angular Router Notes

Prefer queryParamsHandling: 'merge' when navigating:

this.router.navigate([], {
  queryParams: { sort: 'asc' },
  queryParamsHandling: 'merge'
});


Syncr uses replaceState, which does not trigger router navigation.

🟩 Vue 3 Integration
const { state, set } = useSyncrVue({
  key:'filters',
  defaultValue:{ q:'', page:1 },
  channels:['url','storage'],
});

Vue Router Notes

Avoid router overwriting the query params you’re syncing.

To reset state when route changes:

watch(() => route.fullPath, () => {
  set({ q: '', page: 1 });
});

🟧 Svelte / SvelteKit Integration
import { syncrStore } from '@syncr/svelte';

const store = syncrStore({
  key:'filters',
  defaultValue:{ q:'', page:1 },
  channels:['url','storage']
});


Use it in components:

<input bind:value={$store.q} />

SvelteKit Notes

SvelteKit performs SSR by default.

✔ Use Syncr only in the browser:
import { browser } from '$app/environment';

if (browser) {
  const store = syncrStore(...);
}

✔ Avoid syncing page load data through Syncr—use it for UI-only state.
📡 Multi-Tab, Multi-Window Support

To sync state instantly across tabs:

channels: [
  'storage',
  broadcastChannel('filters')
]

When to use:

Dashboards

Filters

Carts

Settings pages

🔐 Encrypted Storage Integration

Protect stored data:

channels: [
  storageEncryptedChannel('prefs', { passphrase }),
  'url'
]


Use encrypted storage for:

Private preferences

Sensitive dashboards

Enterprise apps

🌐 API Sync Integration (Server Sync)

To sync state across devices:

channels: [
  'storage',
  apiChannel('filters', { baseUrl:'/api' })
]


Best for:

Persistent settings

Multi-device profiles

Draft documents

Offline-first workflows

❗ Common Patterns & Gotchas
❌ DO NOT put Syncr in a loop or conditional

Correct:

const syn = createSyncr(...);


Incorrect:

if (something) {
  const syn = createSyncr(...);
}

❌ DO NOT combine Syncr + Router for the same query param

Let Syncr control the URL.

❌ DO NOT use Syncr in SSR code paths

It uses browser APIs.

✔ Recommended Patterns
1. Per-feature instance

Per filter panel, per page, per dashboard.

2. Global settings instance

Theme, language, layout mode, etc.

3. Combined channels for full power
channels: [
  storageEncryptedChannel('profile', { passphrase }),
  broadcastChannel('profile'),
  apiChannel('profile', { baseUrl: '/api' }),
  'url'
]

🧩 Framework-Specific Reset Patterns
React
set(defaultValue);

Angular
syn.set(defaults);

Vue
set(defaults);

Svelte
store.set(defaults);

📝 Summary

Syncr integrates cleanly with:

React + React Router

Angular + Router

Vue 3 + Vue Router

Svelte + SvelteKit

Next.js (client components)

And supports:

URL syncing

Local/storage syncing

Encrypted storage

Multi-tab broadcast

Server sync

Offline queue

Conflict resolution

SSR-safe fallbacks

Use this guide whenever adding Syncr to a new app or framework.