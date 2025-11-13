# Syncr Mock API

Simple Express server that stores state per key with naive versioning via ETag.

## Run
```bash
pnpm install
pnpm --filter syncr-mock-api start
```

- GET  /state/:key → { value, version }, sets ETag
- POST /state/:key → { ok, version }, sets ETag
