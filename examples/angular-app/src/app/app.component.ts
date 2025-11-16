import { Component, computed, Signal } from '@angular/core';
import { createSyncrSignal } from '@syncr/angular';
import { broadcastChannel } from '@syncr/core';

type Filters = {
  q: string;
  sort: 'date' | 'name';
  page: number;
};

const DEFAULT_FILTERS: Filters = {
  q: '',
  sort: 'date',
  page: 1
};

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="container">
      <h1>Syncr Angular Demo (Signals)</h1>

      <section class="card">
        <h2>Filter Controls</h2>

        <div class="row">
          <label>
            Search:
            <input [value]="filters().q" (input)="onQ($event)" placeholder="Type query..." />
          </label>

          <label>
            Sort:
            <select [value]="filters().sort" (change)="onSort($event)">
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </label>

          <button (click)="reset()">Reset</button>
        </div>

        <div class="row mt">
          <button (click)="nextPage()">Next page</button>
          <span class="page">Current page: {{ filters().page }}</span>
        </div>
      </section>

      <section class="card">
        <h2>Current Synced Filters</h2>
        <pre>{{ filters() | json }}</pre>

        <p class="hint">
          Open another tab with the same URL to see
          <strong>BroadcastChannel</strong> sync. Refresh to see
          <strong>storage</strong> persistence. Copy URL for
          <strong>URL-based</strong> restore.
        </p>
      </section>
    </main>
  `,
  styles: [
    `
      .container {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          sans-serif;
        padding: 1.5rem;
        max-width: 960px;
        margin: 0 auto;
      }
      .card {
        border: 1px solid #e2e2e2;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
      }
      .row {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .mt {
        margin-top: 0.75rem;
      }
      .page {
        margin-left: 0.5rem;
      }
      .hint {
        font-size: 12px;
        color: #555;
      }
    `
  ]
})
export class AppComponent {
  private syn = createSyncrSignal<Filters>({
    key: 'ngDemoFilters',
    defaultValue: DEFAULT_FILTERS,
    debounceMs: 150,
    channels: [
      'url',
      'storage',
      broadcastChannel<Filters>('ngDemoFilters')
    ]
  });

  filters: Signal<Filters> = this.syn.state;

  onQ(ev: Event) {
    const q = (ev.target as HTMLInputElement).value;
    this.syn.set(prev => ({
      ...prev,
      q,
      page: 1
    }));
  }

  onSort(ev: Event) {
    const sort = (ev.target as HTMLSelectElement).value as Filters['sort'];
    this.syn.set(prev => ({
      ...prev,
      sort,
      page: 1
    }));
  }

  nextPage() {
    this.syn.set(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }

  reset() {
    this.syn.set(DEFAULT_FILTERS);
  }

  ngOnDestroy() {
    this.syn.destroy();
  }
}
