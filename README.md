# Syncr — smart state sync for modern apps

**Syncr** keeps your UI state in sync across **URL params, storage, and server** — with zero boilerplate.
Works with **React, Vue, Svelte, and Angular**. Tiny core, framework adapters, type-safe, and offline-friendly.

## Why Syncr?
- 🔁 **Bi‑directional sync**: state ↔ URL ↔ localStorage (and optional API channel)
- 🧠 **Smart conflict resolution**: last-writer-wins with logical clocks + custom merge hook
- ⚡ **Lightweight**: framework‑agnostic core, tree‑shakable adapters
- 🧪 **Tested**: Vitest + examples
- 🧰 **DX first**: simple API, great defaults, extensible channels

---

## Install
```bash
pnpm add @syncr/core
pnpm add @syncr/react    # for React
pnpm add @syncr/vue      # for Vue
pnpm add @syncr/svelte   # for Svelte
```

## Quickstart (React)
```tsx
import { useSyncr } from '@syncr/react';

const defaults = { q: '', sort: 'date', page: 1 };

export function Users() {
  const [filters, setFilters] = useSyncr({
    key: 'userFilters',
    defaultValue: defaults,
    channels: ['url', 'storage'],
    debounceMs: 200
  });

  return (
    <input
      value={filters.q}
      onChange={e => setFilters(f => ({ ...f, q: e.target.value, page: 1 }))}
    />
  );
}
```

## Quickstart (Vue)
```ts
import { useSyncr } from '@syncr/vue';
const defaults = { q: '', sort: 'date', page: 1 };
const { state, set } = useSyncr({ key:'userFilters', defaultValue: defaults, channels:['url','storage'] });
```

## Quickstart (Svelte)
```ts
import { syncrStore } from '@syncr/svelte';
const store = syncrStore({ key:'userFilters', defaultValue:{ q:'', sort:'date', page:1 }, channels:['url','storage'] });
$: filters = $store;
```

## FAQ
**Q: Why not TanStack Query / SWR / Router-only?**  
A: Those solve *data fetching* or *routing*, not **multi-channel UI state synchronization** with conflict handling.

**Q: Does Syncr support SSR?**  
A: Yes—URL channel reads are safe on client; guard with `typeof window !== 'undefined'` in SSR frameworks.

**Q: Is it framework-locked?**  
A: No. Core is vanilla TS. React/Vue/Svelte are thin adapters.

## Roadmap
- 🔐 Encrypted storage channel
- ☁️ Managed "State Hub" (multi-device sync + history)
- 🔌 More adapters (Solid, Qwik), router bindings, devtools

## Publishing
See `/docs/PUBLISHING.md` for step-by-step npm publish instructions.

## Quickstart (Angular)
```ts
import { createSyncrSignal } from '@syncr/angular';
const syn = createSyncrSignal({ key:'userFilters', defaultValue:{ q:'', sort:'date', page:1 }, channels:['url','storage'] });
// in template: use syn.state() to read
```

## Server sync (apiChannel)
Use `apiChannel` to sync across devices and sessions via a simple HTTP API.
See `docs/API_CHANNEL.md` and run `examples/mock-api` for a local server.

## Router & SSR
See `docs/ROUTER_AND_SSR.md` for helpers and guards.

## DevTools
See `docs/DEVTOOLS.md` to enable console logging and wrap channels with `tapChannel`.

## Package managers
See `docs/PACKAGE_MANAGERS.md` for npm/yarn/pnpm install & publish steps.

## Security & Real-time
- Encrypted storage: see `docs/ENCRYPTED_STORAGE.md`
- Cross-tab sync: see `docs/BROADCAST.md`

## Schemas (Zod)
See `docs/ZOD.md` for type-safe validation/parsing.

## Storybook
See `examples/storybook-react` for interactive docs.

## Windows setup
See `docs/WINDOWS_SETUP.md` for step-by-step setup on Windows.
