Package Managers Guide
Install, develop, test, and publish Syncr packages using npm, yarn, or pnpm

Syncr is shipped as a monorepo with multiple framework packages:

@syncr/core

@syncr/react

@syncr/angular

@syncr/vue

@syncr/svelte

All packages are fully ESM, tree-shakable, and compatible with npm, yarn, pnpm, and bun.

🔽 Installing Syncr (Consumers)

Install the core + the framework binding you need.

npm
npm install @syncr/core @syncr/react     # React
npm install @syncr/core @syncr/angular   # Angular
npm install @syncr/core @syncr/vue       # Vue
npm install @syncr/core @syncr/svelte    # Svelte

yarn
yarn add @syncr/core @syncr/react

pnpm
pnpm add @syncr/core @syncr/react

bun
bun add @syncr/core @syncr/react

🧩 ESM Compatibility Notes

Syncr packages are:

Pure ESM

No CommonJS fallback

Compatible with:

Vite

Next.js (client components)

Angular CLI (v14+)

Vue CLI & Vite

SvelteKit

Node 18+

For legacy bundlers, ensure "type": "module" is supported.

🛠 Monorepo Development (Contributors)

Syncr uses npm workspaces for contributors.

To install all dependencies:

npm install


To build all packages:

npm run build


To test:

npm test


To type-check:

npm run typecheck

🔗 Local Linking (Contributors)

When testing packages in another project:

Using npm
cd packages/core
npm link

cd path/to/your/test-app
npm link @syncr/core

Using yarn
yarn link
yarn link @syncr/core

Using pnpm
pnpm link --global
pnpm link @syncr/core

Unlink
npm unlink --global @syncr/core

🚀 Publishing Syncr Packages

There are two ways to publish:

Manual (first release)

Automatic via CI (semantic-release)

1️⃣ Manual Publish (First Release Only)

You must publish the first version manually because a package does not exist on npm yet.

Login:

npm login


Publish packages one-by-one:

cd packages/core && npm publish --access public
cd ../react && npm publish --access public
cd ../vue && npm publish --access public
cd ../svelte && npm publish --access public
cd ../angular && npm publish --access public

2️⃣ Automatic Publish (Every Release After)
via GitHub CI + semantic-release

Syncr uses:

Semantic versioning

Automated changelog

Automated npm publish

Automated GitHub Releases

Just push a commit with:

Patch release
fix: corrected URL sync edge-case

Minor release
feat: added encrypted storage support

Major release
feat!: changed createSyncr API shape


CI will:

Build the monorepo

Run tests

Bump the version

Generate CHANGELOG

Publish to npm

Create a GitHub Release tag

No manual action required.

🧭 Versioning Policy

Syncr follows SemVer:

MAJOR: Breaking API changes

MINOR: Backward-compatible features

PATCH: Fixes and internal improvements

All packages in the monorepo share aligned versions (0.2.0, etc.)

🎯 Consumer Troubleshooting
❌ “Cannot find package '@syncr/react'”

Ensure you installed both:

npm install @syncr/core @syncr/react

❌ “Unexpected token 'export'”

Your bundler must support ESM.

Use Vite, Next.js, Angular CLI 14+, SvelteKit, or similar.

❌ “Package not published yet”

Run:

npm view @syncr/core


If empty → package has never been published.

🎯 Contributor Troubleshooting
❌ Version already exists (npm 409)

Increment version or use semantic-release:

feat: my new feature

❌ Workspace errors

Ensure you are in monorepo root:

npm install

❌ Lockfile mismatch

Delete + regenerate:

rm -f package-lock.json
npm install

📚 Summary

Syncr packages:

Install cleanly via npm / yarn / pnpm / bun

Support all modern frameworks via thin adapters

Use ESM only for optimal tree-shaking

Publish automatically via GitHub CI

Follow semantic versioning

Are easy to test locally via workspace linking

This guide covers everything consumers and contributors need to install, build, test, and publish Syncr packages.