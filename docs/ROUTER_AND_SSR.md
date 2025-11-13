# Router Helpers & SSR Guards

## SSR
- Use `isClient` / `isServer` from `@syncr/core`:
```ts
import { isClient, guardClient } from '@syncr/core';
if (isClient) { /* safe to use window/location */ }
guardClient(() => doBrowserThing());
```

## Router helpers
```ts
import { mergeQueryParam, preserveParams } from '@syncr/core';
mergeQueryParam('filters', JSON.stringify({ q:'x' }));
const preserved = preserveParams(['filters']); // pass preserved when navigating
```
Use router-specific options (React Router, Angular Router `queryParamsHandling:'merge'`) to keep Syncr params intact.
