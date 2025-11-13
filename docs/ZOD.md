# Zod Schema Integration

Syncr can validate/parse state via **Zod** to guarantee correct shapes.

## Usage
```ts
import { z } from 'zod';
import { zodSchema } from '@syncr/core';
import { useSyncr } from '@syncr/react';

const FilterSchema = z.object({
  q: z.string(),
  sort: z.enum(['date','name']),
  page: z.number().int().min(1)
});
type Filters = z.infer<typeof FilterSchema>;

const [filters, setFilters] = useSyncr<Filters>({
  key: 'filters',
  defaultValue: { q:'', sort:'date', page:1 },
  channels: ['url','storage'],
  schema: zodSchema(FilterSchema)
});
```

- Invalid URL/storage values are rejected by Zod; Syncr keeps last valid state.
- Provide custom `serialize` if you need minified URL payloads.
