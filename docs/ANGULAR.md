# Angular Integration (Signals + RxJS)

**Requirements:** Angular 16+ (signals) or Angular 15+ (RxJS store only).

## Install
```bash
pnpm add @syncr/core @syncr/angular
```

## Quickstart (Signals, Standalone Component)
```ts
import { Component, computed } from '@angular/core';
import { createSyncrSignal } from '@syncr/angular';

type Filters = { q:string; sort:string; page:number };
const defaults: Filters = { q:'', sort:'date', page:1 };

@Component({
  selector: 'app-users',
  standalone: true,
  template: \`
    <input [value]="filters().q" (input)="onQ($event)">
    <p>Sort: {{ filters().sort }}</p>
  \`
})
export class UsersComponent {
  syn = createSyncrSignal<Filters>({
    key: 'userFilters',
    defaultValue: defaults,
    channels: ['url','storage'],
    debounceMs: 200
  });

  filters = this.syn.state;

  onQ(ev: Event){
    const q = (ev.target as HTMLInputElement).value;
    this.syn.set(prev => ({ ...prev, q, page: 1 }));
  }

  ngOnDestroy(){ this.syn.destroy(); }
}
```

## Quickstart (NgModule + RxJS store)
```ts
import { Component, OnDestroy } from '@angular/core';
import { createSyncrStore } from '@syncr/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  template: \`
    <input [value]="filters.q" (input)="onQ($event)">
    <div *ngFor="let p of items"> {{ p.name }} </div>
  \`
})
export class ProductsComponent implements OnDestroy {
  store = createSyncrStore({ key:'prodFilters', defaultValue:{ q:'', page:1 }, channels:['url','storage'] });
  filters = this.store.getValue();
  sub = this.store.value$.subscribe(v => this.filters = v);

  onQ(ev:Event){
    const q = (ev.target as HTMLInputElement).value;
    this.store.set(prev => ({ ...prev, q, page:1 }));
  }

  ngOnDestroy(){ this.sub.unsubscribe(); this.store.destroy(); }
}
```

## Router notes
- Syncr's URL channel uses `history.replaceState` under the hood.
- Ensure Angular Router doesn't overwrite query params unexpectedly; prefer `queryParamsHandling:'merge'` when navigating.

## SSR
- Signals adapter is client-only. Guard any direct `window` access in universal builds.
