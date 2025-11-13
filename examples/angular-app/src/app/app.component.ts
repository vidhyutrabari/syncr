import { Component, OnDestroy, computed, effect } from '@angular/core';
  import { createSyncrSignal } from '@syncr/angular';
import { apiChannel, enableSyncrConsoleDevtools, tapChannel, storageEncryptedChannel, broadcastChannel } from '@syncr/core';

  type Filters = { q: string; sort: 'date'|'name'; page: number };
  const defaults: Filters = { q:'', sort:'date', page:1 };

  @Component({
    selector: 'app-root',
    standalone: true,
    template: \`
      <main style="font-family: system-ui; padding: 24px;">
        <h1>Syncr Angular Demo</h1>
        <p>Search, change sort, change page, refresh the browser — state persists via URL + localStorage.</p>

        <label>
          Search:
          <input [value]="filters().q" (input)="onQ($event)" />
        </label>

        <label style="margin-left: 12px;">
          Sort:
          <select [value]="filters().sort" (change)="onSort($event)">
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </label>

        <div style="margin-top: 12px;">
          <button (click)="prevPage()" [disabled]="filters().page === 1">Prev</button>
          <span style="margin: 0 8px;">Page {{ filters().page }}</span>
          <button (click)="nextPage()">Next</button>
        </div>

        <pre style="background:#111; color:#0f0; padding:12px; border-radius:6px; margin-top:16px;">
{{ filters() | json }}
        </pre>
      </main>
    \`
  })
  export class AppComponent implements OnDestroy {
  constructor(){ enableSyncrConsoleDevtools(); }
    syn = createSyncrSignal<Filters>({
      key: 'ngFilters',
      defaultValue: defaults,
      channels: [
        'url',
        storageEncryptedChannel<Filters>('ngFilters', { passphrase: 'demo-pass' }),
        tapChannel(apiChannel<Filters>('ngFilters', { baseUrl: 'http://localhost:4321' })),
        broadcastChannel<Filters>('ngFilters')
      ],
      debounceMs: 200
    });

    filters = this.syn.state;

    onQ(ev: Event){
      const q = (ev.target as HTMLInputElement).value;
      this.syn.set(prev => ({ ...prev, q, page: 1 }));
    }
    onSort(ev: Event){
      const sort = (ev.target as HTMLSelectElement).value as Filters['sort'];
      this.syn.set(prev => ({ ...prev, sort }));
    }
    nextPage(){ this.syn.set(prev => ({ ...prev, page: prev.page + 1 })); }
    prevPage(){ this.syn.set(prev => ({ ...prev, page: Math.max(1, prev.page - 1) })); }

    ngOnDestroy(){ this.syn.destroy(); }
  }
