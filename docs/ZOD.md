Zod Schema Integration
Type-safe parsing, validation, and sanitization for Syncr state

Syncr supports Zod schemas for:

Validating state from URL, storage, and API

Rejecting invalid or tampered values

Enforcing types and ranges

Auto-correcting malformed inputs

Custom serialization (compression, base64, compact formats)

This ensures your UI state remains trusted, typed, and safe, even when users manipulate query params directly.

🧩 Why Zod?

UI state can become corrupted via:

Manually edited query params

Old localStorage entries

Incorrect types ("1" instead of 1)

Missing or extra fields

Malicious injections

Syncr + Zod gives you:

Guaranteed state shape

Automatic parsing & cleaning

Fallback to defaults if invalid

Type inference for framework bindings

SSR-safe schema validation

🛠 Basic Usage
import { z } from 'zod';
import { zodSchema } from '@syncr/core';
import { useSyncr } from '@syncr/react';

const FilterSchema = z.object({
  q: z.string(),
  sort: z.enum(['date', 'name']),
  page: z.number().int().min(1)
});

type Filters = z.infer<typeof FilterSchema>;

const [filters, setFilters] = useSyncr<Filters>({
  key: 'filters',
  defaultValue: { q: '', sort: 'date', page: 1 },
  channels: ['url', 'storage'],
  schema: zodSchema(FilterSchema)
});

Behavior:

Syncr validates every value coming from:

URL query params

localStorage

broadcast channels

server API

Invalid values are rejected.

The previous valid state is kept.

If no valid data exists → defaultValue is used.

🧬 How Validation Works In Syncr

Syncr uses this pipeline:

rawValue → parse with Zod → validValue OR reject → apply defaults → merge → notify


Zod’s .safeParse() ensures untrusted data never enters the UI.

📦 Zod With All Framework Adapters
🟦 React
const [filters] = useSyncr({
  key: 'filters',
  defaultValue,
  channels: ['url','storage'],
  schema: zodSchema(FilterSchema)
});

🟥 Angular (Signals)
syn = createSyncrSignal({
  key: 'filters',
  defaultValue,
  channels: ['url','storage'],
  schema: zodSchema(FilterSchema)
});

🟩 Vue (Composition API)
const { state, set } = useSyncrVue({
  key:'filters',
  defaultValue,
  channels:['url','storage'],
  schema: zodSchema(FilterSchema)
});

🟧 Svelte
const store = syncrStore({
  key:'filters',
  defaultValue,
  channels:['url','storage'],
  schema: zodSchema(FilterSchema)
});

🗜 Custom Serialization (compressed URLs)

If you need:

Shorter URLs

Base64 safe encoding

Compression (pako, lz-string, etc.)

Obfuscation

Use:

schema: zodSchema(FilterSchema, {
  serialize: (value) => compress(JSON.stringify(value)),
  parse: (text) => JSON.parse(decompress(text))
})


Example using lz-string:

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

schema: zodSchema(FilterSchema, {
  serialize: v => compressToEncodedURIComponent(JSON.stringify(v)),
  parse: s => JSON.parse(decompressFromEncodedURIComponent(s)!)
});

🔍 Partial vs Strict Validation
✔ Strict schema (default)

Rejects:

extra fields

missing fields

wrong types

✔ Allow partial URL state
const FilterSchema = z.object({
  q: z.string(),
  page: z.number().optional()
}).partial();


Useful when migrating from older URLs.

🛡 Security Benefits

Zod protects against:

Arbitrary object injection

Unexpected nested objects

Prototype pollution via query params

Corrupted storage entries

JSON parsing errors

Syncr will never set invalid state.

🔄 Error Handling

Invalid values are ignored silently by default.

If you want custom error reporting:

schema: zodSchema(FilterSchema, {
  onError(err, raw) {
    console.warn('Invalid state from URL or storage:', raw);
  }
})

🧪 Testing With Zod

Syncr test scenario:

setFilters({ q: 123 }); // wrong type
→ Rejected
→ filters remains unchanged


Unit tests should cover:

malformed values

corrupted query params

string/number mismatches

missing fields

URL decoding issues

🐞 Troubleshooting
❌ "URL value rejected by schema"

Cause: schema mismatch
Fix: update defaults OR modify schema

❌ Date parsing issues

Use Zod transformers:

z.string().transform(s => new Date(s))

❌ Enum mismatch

If migrating:

sort: z.enum(['date','name']).catch('date')

❌ URL contains encoded schema errors

Ensure:

serialize/parse


match exactly.

📝 Best Practices

✔ Keep schemas small and predictable
✔ Use enums for filter values
✔ Use .min() / .max() for pagination
✔ Use transformers for dates and numbers
✔ Use compression for large state
✔ Validate server API responses as well

📘 Summary

Syncr + Zod gives you:

Typed state

Validated state

Secure state

Predictable state

Across:

URL

Storage

Broadcast

API channel

This keeps your filters, preferences, drafts, and view settings correct and safe, even under unpredictable user input.