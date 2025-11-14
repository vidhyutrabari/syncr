Below is your **fully upgraded, polished, professional root `README.md`**, rewritten for clarity, marketing impact, and developer adoption — while keeping all your original content and adding missing details, structure, diagrams, examples, and benefits.

This is on the level of popular OSS libraries (Zustand, VueUse, TanStack, Jotai, SvelteStore).

---

# 🚀 Syncr — Smart State Sync for Modern Web Apps

### *State ↔ URL ↔ Storage ↔ Server — fully synchronized, type-safe, and framework-agnostic.*

![npm version](https://img.shields.io/npm/v/@syncr/core)
![npm downloads](https://img.shields.io/npm/dm/@syncr/core)
![build](https://github.com/vidhyutrabari/syncr/actions/workflows/release.yml/badge.svg)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![license](https://img.shields.io/github/license/vidhyutrabari/syncr)

---

## 🌟 What is Syncr?

**Syncr is a next-generation state synchronization engine** for frontend applications.
It keeps your UI state perfectly synchronized across multiple channels:

### 🔄 Synced Across:

* **URL query parameters**
* **localStorage / sessionStorage**
* **Encrypted storage (AES-GCM)**
* **Multi-tab communication (BroadcastChannel)**
* **Server/API state with conflict detection**
* **Framework stores (React/Vue/Svelte/Angular Signals)**

### ✔ Works With:

React • Vue • Svelte • Angular • Vanilla JS
Tiny core + framework adapters + optional channels.

---

# 💡 Why Syncr?

Modern apps require state that is:

* Shareable via URL
* Persistent across refresh
* Consistent across tabs
* Encrypted for privacy
* Synced with the backend
* Type-safe & validated
* Fast, small, and maintanable

Traditional state management libraries don't solve this.

Here is a **beautiful, polished, world-class feature comparison chart** you can paste directly into your README.
It clearly positions **Syncr** as a unique, high-value library compared to the most known tools.

This kind of chart dramatically improves adoption and credibility.

---

# 📊 **Feature Comparison**

A side-by-side comparison with popular state & sync libraries:

| Feature / Library                 | **Syncr**                               | Zustand    | Jotai      | Redux      | TanStack Router    | URL + Storage libs | LocalStorage libs |
| --------------------------------- | --------------------------------------- | ---------- | ---------- | ---------- | ------------------ | ------------------ | ----------------- |
| **URL state sync**                | ✔ Built-in                              | ❌          | ❌          | ❌          | Partial            | ✔ (URL only)       | ❌                 |
| **localStorage sync**             | ✔ Automatic                             | Plugin     | Plugin     | Plugin     | ❌                  | ❌                  | ✔ Basic only      |
| **Encrypted storage (AES-GCM)**   | ✔ Built-in                              | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Multi-tab sync**                | ✔ Built-in (storage + BroadcastChannel) | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **API sync (GET/POST + ETag)**    | ✔ Optional                              | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Offline queue for server sync** | ✔                                       | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Conflict resolution**           | ✔ Pluggable                             | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Zod validation / parsing**      | ✔ Built-in                              | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Multi-framework adapters**      | ✔ React, Vue, Svelte, Angular           | React only | React only | React only | Framework-specific | No                 | No                |
| **Tree-shakable**                 | ✔ Tiny core                             | ✔          | ✔          | ❌          | ✔                  | ✔                  | ✔                 |
| **SSR-safe helpers**              | ✔                                       | ❌          | ❌          | ❌          | Partial            | ❌                  | ❌                 |
| **URL + Storage + API unified**   | ✔                                       | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |
| **Zero boilerplate**              | ✔ 1-line setup                          | ❌          | ❌          | ❌          | ❌                  | ❌                  | ❌                 |

---

# 🎯 **Why Syncr Wins**

While other libraries handle **local UI state** or **routing**, Syncr is the *only* system designed to unify:

* UI state
* URL
* Storage
* Encrypted storage
* Multi-tab updates
* Server persistence
* Conflict resolution
* Zod schema validation

…into **one** simple configuration.

Syncr replaces dozens of utilities and hundreds of lines of boilerplate that developers re-write every time they build dashboards, admin panels, CRMs, filters, and multi-tab web apps.

---


## ❌ Without Syncr, developers juggle:

| Concern      | Traditional Approach                   |
| ------------ | -------------------------------------- |
| UI state     | React/Vue/Svelte state                 |
| URL sync     | Custom hooks, router glue              |
| Persistence  | Manual localStorage wiring             |
| Multi-tab    | Custom BroadcastChannel code           |
| Validation   | Zod/manual parsing                     |
| API sync     | Manual fetch logic + conflict handling |
| Error states | Manual merging & rollback              |
| SSR          | Multiple guards for `window`           |

---

## ✔ With Syncr:

You define your UI state **once**:

```ts
useSyncr({ defaultValue, channels: [...] });
```

Syncr handles:

* Reading/writing URL params
* Serialization & parsing
* Debounced persistence
* Encryption
* Router-safe behavior
* Multi-tab broadcasting
* Schema validation
* API syncing
* Logical-clock conflict resolution
* SSR guards
* Devtools logging
* Framework reactivity

Zero boilerplate. Maximum reliability.

---

# 🧠 Key Features

### 🔁 Multi-channel sync (URL, storage, server, encrypted)

Keep your state aligned everywhere.

### 🧠 Smart conflict resolution

* Logical clocks
* Last-writer-wins (default)
* Custom merge resolver
* API ETag support

### 🔐 Secure encrypted storage

AES-GCM with PBKDF2-derived keys.

### 🧪 Fully tested

Vitest + framework examples.

### 🎛 Framework adapters

* `useSyncr` for React
* Angular Signals
* Vue Composition API
* Svelte stores

### ⚡ Tiny & performant

* Small core bundle
* Tree-shakable adapters
* Zero external dependencies

### 🧰 DX-first API

Minimal configuration.
Predictable behavior.
Extensible channels.

---

# 📦 Installation

Use **npm** (recommended):

```bash
npm install @syncr/core
npm install @syncr/react    # for React
npm install @syncr/vue      # for Vue
npm install @syncr/svelte   # for Svelte
npm install @syncr/angular  # for Angular
```

---

# ⚛️ Quickstart — React

```tsx
import { useSyncr } from '@syncr/react';

export function Users() {
  const [filters, setFilters] = useSyncr({
    key: 'userFilters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage'],
    debounceMs: 200,
  });

  return (
    <input
      value={filters.q}
      onChange={e =>
        setFilters(f => ({ ...f, q: e.target.value, page: 1 }))
      }
    />
  );
}
```

---

# 🅰️ Quickstart — Angular

```ts
import { createSyncrSignal } from '@syncr/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <input [value]="filters().q" (input)="update($event)" />
  `
})
export class AppComponent {
  { filters, setFilters } = createSyncrSignal({
    key: 'userFilters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage'],
  });

  update(e: any) {
    setFilters(f => ({ ...f, q: e.target.value }));
  }
}
```

---

# 🟩 Quickstart — Vue

```ts
import { useSyncrVue } from '@syncr/vue';

const defaults = { q: '', sort: 'date', page: 1 };

export default {
  setup() {
    const { state, setState } = useSyncrVue({
      key: 'userFilters',
      defaultValue: defaults,
      channels: ['url', 'storage'],
    });

    return { state, setState };
  },
};
```

---

# 🟧 Quickstart — Svelte

```svelte
<script lang="ts">
  import { syncrStore } from '@syncr/svelte';

  const { store, setStore } = syncrStore({
    key: 'userFilters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage'],
  });
</script>

<input bind:value={$store.q} />
```

---

# 🔐 Server Sync (apiChannel)

Syncr can sync state with your backend using:

* Conditional requests (`ETag`)
* Version checking
* Conflict detection
* Merge strategies

```ts
import { apiChannel } from '@syncr/core';

useSyncr({
  key: 'profile',
  defaultValue: {},
  channels: [
    apiChannel('profile', {
      baseUrl: '/api',
      onConflict: (local, remote) =>
        ({ ...remote, mergedAt: Date.now() })
    })
  ]
});
```

---

# 🔐 Encrypted Storage

```ts
import { storageEncryptedChannel } from '@syncr/core';

const encrypted = storageEncryptedChannel('settings', {
  passphrase: 'mySecretPass',
});
```

Uses WebCrypto AES-GCM.

---

# 🪟 Cross-Tab Sync (BroadcastChannel)

```ts
import { broadcastChannel } from '@syncr/core';

useSyncr({
  key: 'cart',
  channels: ['storage', broadcastChannel('cart')],
});
```

---

# 🧩 Schema Validation (Zod)

```ts
useSyncr({
  schema: zodSchema(
    z.object({
      q: z.string(),
      page: z.number().min(1)
    })
  )
});
```

Invalid values are rejected.

---

# ⚙️ Supported Channels

| Channel            | Description                 |
| ------------------ | --------------------------- |
| `"url"`            | URL query parameter sync    |
| `"storage"`        | localStorage/sessionStorage |
| `encryptedStorage` | AES encrypted persistence   |
| `"broadcast"`      | Multi-tab sync              |
| `"api"`            | HTTP API sync               |
| `"memory"`         | In-memory only              |
| Custom             | Build your own!             |

---

# 🧱 Architecture Overview

```
         ┌───────────────┐
         │   UI Layer     │
         │ React / Vue /  │
         │ Svelte / Angular
         └───────┬───────┘
                 │
         ┌───────▼────────┐
         │   Syncr Core    │
         │ State Controller│
         │ Validation      │
         │ Merge Logic     │
         └───────┬────────┘
   ┌──────────────┼────────────────┐
   ▼              ▼                ▼
URL Channel   Storage Channel   BroadcastChannel
   ▼              ▼                ▼
 API Channel   Encrypted Store   Custom Channels
```

---

# 🧪 Examples & Storybook

* `examples/react-demo`
* `examples/angular-demo`
* `examples/svelte-demo`
* `examples/vue-demo`
* `examples/mock-api` (API channel server)
* `examples/storybook-react` (interactive docs)

---

# 📚 Documentation Index

* 🔐 Encryption → `docs/ENCRYPTED_STORAGE.md`
* 🌐 API Sync → `docs/API_CHANNEL.md`
* 🪟 BroadcastChannel → `docs/BROADCAST.md`
* 🔁 Router & SSR → `docs/ROUTER_AND_SSR.md`
* 🧩 Schemas → `docs/ZOD.md`
* ⚙ CPU/Memory Optimization → `docs/PERFORMANCE.md`
* 🧪 DevTools → `docs/DEVTOOLS.md`
* 📦 Package Managers → `docs/PACKAGE_MANAGERS.md`
* 🖥 Windows Setup → `docs/WINDOWS_SETUP.md`

---

# 🤔 FAQ

### **Why not TanStack Query, SWR, or router-only state?**

Those solve **data fetching and caching**, not multi-channel UI state synchronization.

Syncr solves a completely different problem.

---

### **Does Syncr support SSR?**

Yes.
URL + storage channels automatically guard against `window` access.

---

### **Is it framework-locked?**

No.
Core is framework-agnostic.
Adapters are tiny wrappers.

---

### **Is it safe for sensitive data?**

Yes — encrypted storage uses:

* AES-GCM
* PBKDF2
* Random salt + IV
* No dependencies

---

# 🚧 Roadmap

* 🔐 Shared multi-device encrypted sync
* 🧭 Router bindings for all frameworks
* 🧩 DevTools panel
* 📦 SolidJS / Qwik adapters
* ☁️ “State Hub” hosted sync service
* 🔄 Undo/redo history

---

# 📝 Publishing

See: `docs/PUBLISHING.md`
Includes instructions for:

* npm
* yarn
* GitHub Actions auto-publish
* npm tokens
* verifying integrity

---

# 📄 License

MIT © 2025 **Vidhyut Rabari**

---
