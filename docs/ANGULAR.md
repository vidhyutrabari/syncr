Angular Integration (Signals + RxJS)

Syncr provides first-class Angular support through:

🟦 Signals API (Angular 16+)

🟧 RxJS store API (Angular 14+)

🚀 URL + storage sync

🔐 optional encrypted storage

🪟 optional multi-tab sync

🧩 optional Zod schema validation

📦 Install
npm install @syncr/core @syncr/angular


Supports:

Angular 16+ → Signals API

Angular 15+ → RxJS store only

⚡ Quickstart — Signals (Standalone Component)
import { Component } from '@angular/core';
import { createSyncrSignal } from '@syncr/angular';

type Filters = { q: string; sort: string; page: number };
const defaults: Filters = { q: '', sort: 'date', page: 1 };

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <input
      [value]="filters().q"
      (input)="onQ($event)"
      placeholder="Search users..."
    />

    <p>Sort: {{ filters().sort }}</p>
  `
})
export class UsersComponent {
  readonly syn = createSyncrSignal<Filters>({
    key: 'userFilters',
    defaultValue: defaults,
    channels: ['url', 'storage'],
    debounceMs: 200
  });

  readonly filters = this.syn.state;

  onQ(ev: Event) {
    const q = (ev.target as HTMLInputElement).value;
    this.syn.set(prev => ({ ...prev, q, page: 1 }));
  }

  ngOnDestroy() {
    this.syn.destroy(); // important cleanup
  }
}

✔ Recommended for new Angular apps

Signals provide better performance and fewer RxJS subscriptions.

⚡ Quickstart — RxJS Store (NgModule)

Ideal if your app still uses modules or RxJS-heavy architecture.

import { Component, OnDestroy } from '@angular/core';
import { createSyncrStore } from '@syncr/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  template: `
    <input
      [value]="filters.q"
      (input)="onQ($event)"
      placeholder="Search products..."
    />

    <div *ngFor="let p of items">
      {{ p.name }}
    </div>
  `
})
export class ProductsComponent implements OnDestroy {
  store = createSyncrStore({
    key: 'prodFilters',
    defaultValue: { q: '', page: 1 },
    channels: ['url', 'storage']
  });

  filters = this.store.getValue();
  sub = this.store.value$.subscribe(v => (this.filters = v));

  onQ(ev: Event) {
    const q = (ev.target as HTMLInputElement).value;
    this.store.set(prev => ({ ...prev, q, page: 1 }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.destroy();
  }
}

✔ Use this when:

Migrating from Angular 13–15

Heavy RxJS architecture

Global shared stores

🔐 Encrypted Storage Example (AES-GCM)
import { storageEncryptedChannel } from '@syncr/core';

const encrypted = storageEncryptedChannel('secureFilters', {
  passphrase: 'top-secret-passphrase'
});

const syn = createSyncrSignal({
  key: 'securedFilters',
  defaultValue: { q: '', page: 1 },
  channels: [encrypted]
});


Perfect for sensitive user preferences.

🪟 Multi-tab Sync Example
import { broadcastChannel } from '@syncr/core';

createSyncrSignal({
  key: 'sharedFilters',
  defaultValue: { q: '', page: 1 },
  channels: ['storage', broadcastChannel('sharedFilters')]
});

🔥 Try this:

Open two browser tabs

Change the filter in one

Watch it update instantly in the other

🧩 Zod Validation Example
import { z } from 'zod';
import { zodSchema } from '@syncr/core';

const FilterSchema = z.object({
  q: z.string(),
  page: z.number().min(1)
});

createSyncrSignal({
  key: 'validatedFilters',
  defaultValue: { q: '', page: 1 },
  schema: zodSchema(FilterSchema),
  channels: ['url']
});


Invalid values are rejected and corrected automatically.

🧭 Angular Router Notes

Syncr uses history.replaceState to update query params without triggering Angular navigation.

✔ Best Practices
Preserve existing query params
this.router.navigate([], {
  queryParams: { q: 'x' },
  queryParamsHandling: 'merge'
});

Avoid full navigations for UI-only state

Use Syncr instead of:

this.router.navigate([], { queryParams: { filter: 'x' } });

Works with:

Standalone apps

Lazy-loaded routes

Child routes

🌐 SSR (Angular Universal)
🔸 Signals adapter is client-only

Do NOT access Syncr inside server-side code.

✔ Safe usage pattern
if (typeof window !== 'undefined') {
  const syn = createSyncrSignal(...);
}


Syncr internally guards window, but wrap your logic for best Universal compatibility.

🛠 Debugging with DevTools

Enable channel logging:

import { tapChannel } from '@syncr/core';

createSyncrSignal({
  key: 'debugFilters',
  defaultValue: {...},
  channels: [
    tapChannel('url'),
    tapChannel('storage')
  ]
});


This logs:

Channel reads

Writes

Merges

Conflicts

Final applied values

🧱 Recommended Architecture Patterns
✔ 1. Feature module store

createSyncrSignal inside each feature component.

✔ 2. Global app store

Create Syncr store inside a service.

✔ 3. Hybrid

Use:

Signals for ephemeral state

RxJS stores for global shared state

📚 Related Docs

URL Channel → /docs/ROUTER_AND_SSR.md

Encrypted Storage → /docs/ENCRYPTED_STORAGE.md

BroadcastChannel → /docs/BROADCAST.md

API Sync → /docs/API_CHANNEL.md

Schemas (Zod) → /docs/ZOD.md

Performance → /docs/PERFORMANCE.md

✅ Summary

Syncr + Angular gives you:

✨ Signals or RxJS (your choice)

🔁 Automatic URL + storage sync

🪟 Multi-tab sync

🔐 Encrypted storage

⚡ Tiny + fast

🧩 Strong typing + Zod validation

🚀 Great for filters, dashboards, preferences, search UIs