# Use & Publish with npm, yarn, pnpm

## Install for consumers
### npm
```bash
npm install @syncr/core @syncr/react
```
### yarn
```bash
yarn add @syncr/core @syncr/react
```
### pnpm
```bash
pnpm add @syncr/core @syncr/react
```

## Monorepo dev (contributors)
```bash
pnpm install
pnpm build
pnpm test
```

## Publish (maintainers)
1) Bump versions or use semantic-release.
2) Login:
```bash
npm login
```
3) Publish each package (first release manual):
```bash
cd packages/core && npm publish --access public
cd ../react && npm publish --access public
cd ../vue && npm publish --access public
cd ../svelte && npm publish --access public
cd ../angular && npm publish --access public
```
4) Consumers can then install with their package manager of choice.

## Yarn / pnpm specifics
- Yarn Berry and pnpm fully support ESM packages here.
- For local linking in this monorepo, we already use pnpm workspace `file:` links in examples.
