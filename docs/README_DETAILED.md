# Syncr — Detailed Documentation

## Concept
Syncr synchronizes UI state across **URL query params**, **localStorage**, and (optionally) an **API** so that filters, pagination, and view preferences persist and are shareable.

### Typical Use-Cases
- Dashboard filters that survive refresh and share via URL
- Pagination & sorting remembered between routes
- Cross-tab state updates (via `storage` events)
- Controlled forms mirrored into query params

## Design
- **Channels** implement `read/write/subscribe` for data sources.
- **ValueBox** provides a small, reactive store.
- **Conflict resolution** default is last-writer-wins; pluggable via `onConflict`.
- **Performance** uses debounced writes + deep equality checks.

## Adapters
- React: `useSyncr`
- Vue: `useSyncr`
- Svelte: `syncrStore`
- Angular: `createSyncrSignal` / `createSyncrStore`

## Channel API
```ts
interface Channel<T> {
  id: string;
  priority?: number;
  read(): T | undefined | Promise<T | undefined>;
  write(value: T): void | Promise<void>;
  subscribe?(cb: (v: T | undefined) => void): () => void;
}
```

Built-ins: `urlChannel`, `storageChannel`
Planned: `apiChannel` (with ETag/version, offline queue)

## Examples
See `examples/react-app` and `examples/angular-app` for working demos.

## Testing
- Unit tests live in each package under `/test`
- Run all: `pnpm test`

## Troubleshooting
- URL too long? Provide `schema.serialize` to compress, or store an ID in URL and full state in storage.
- Router wipes query params? Use merge/retain options when navigating.
- SSR: initialize on client; avoid touching `window` on server.
