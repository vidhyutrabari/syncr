import React from 'react';
import { z } from 'zod';
import { useSyncr } from '@syncr/react';
import {
  broadcastChannel,
  zodSchema,
  enableSyncrConsoleDevtools,
  tapChannel,
} from '@syncr/core';

const FilterSchema = z.object({
  q: z.string(),
  sort: z.enum(['date', 'name']),
  page: z.number().int().min(1),
});

type Filters = z.infer<typeof FilterSchema>;

const DEFAULT_FILTERS: Filters = {
  q: '',
  sort: 'date',
  page: 1,
};

// ✅ Enable console logging in *every tab* that uses this bundle
enableSyncrConsoleDevtools();

export const App: React.FC = () => {
  const [filters, setFilters] = useSyncr<Filters>({
    key: 'demoFilters',
    defaultValue: DEFAULT_FILTERS,
    schema: zodSchema(FilterSchema),
    debounceMs: 150,
    channels: [
      'url',      // URL sync
      'storage',  // storage sync + cross-tab via `storage` event
      tapChannel(
        broadcastChannel<Filters>('demoFilters') // real-time cross-tab
      ),
    ],
  });

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setFilters((prev) => ({
      ...prev,
      q,
      page: 1,
    }));
  };

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value as Filters['sort'];
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 1,
    }));
  };

  const nextPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const reset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div style={{ fontFamily: 'system-ui', padding: '1.5rem', maxWidth: 800 }}>
      <h1>Syncr React Demo</h1>
      <p>
        Filters are synced to <strong>URL</strong>, <strong>storage</strong> and{' '}
        <strong>BroadcastChannel</strong>.
      </p>

      <section
        style={{
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
      >
        <h2>Filter Controls</h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <label>
            Search:{' '}
            <input
              value={filters.q}
              onChange={onQueryChange}
              placeholder="Type query..."
            />
          </label>

          <label>
            Sort:{' '}
            <select value={filters.sort} onChange={onSortChange}>
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </label>

          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={nextPage}>
            Next page
          </button>
          <span style={{ marginLeft: '0.5rem' }}>
            Current page: {filters.page}
          </span>
        </div>
      </section>

      <section
        style={{
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid #eee',
          borderRadius: 8,
        }}
      >
        <h2>Current Synced Filters</h2>
        <pre
          style={{
            background: '#f7f7f7',
            padding: '0.75rem',
            borderRadius: 6,
          }}
        >
          {JSON.stringify(filters, null, 2)}
        </pre>
        <p style={{ fontSize: 12, color: '#555' }}>
          Open another tab with the same URL to see{' '}
          <strong>BroadcastChannel</strong> sync. Refresh to see{' '}
          <strong>storage</strong> persistence. Copy the URL and open in another
          browser to see <strong>URL-based</strong> restore.
        </p>
      </section>
    </div>
  );
};
