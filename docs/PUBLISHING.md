# Publish guide

## 1) Prereqs
- Node 20+, pnpm 9+
- npm account (2FA recommended)
- `npm whoami` should work locally

## 2) Install
```bash
pnpm install
```

## 3) Build & Test
```bash
pnpm build
pnpm test
```

## 4) Version & Publish
Each package can be published independently. From repo root:
```bash
cd packages/core && npm publish --access public
cd ../react && npm publish --access public
cd ../vue && npm publish --access public
cd ../svelte && npm publish --access public
```
(Optional) Use semantic-release later to automate releases from `main`.

## Notes
- Ensure package names are available or change scope.
- Commit all changes; tag versions if publishing manually.
