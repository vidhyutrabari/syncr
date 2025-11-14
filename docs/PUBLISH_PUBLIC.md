
# **Publishing & Project Setup Guide**

### How to publish Syncr packages publicly to npm and automate future releases

Syncr is a **multi-package monorepo**, so publishing requires an initial manual release, followed by fully automated semantic-release pipelines.

This guide walks you through:

1. GitHub repo setup (public)
2. npm scope configuration
3. Manual first publish
4. Automated CI publishing via semantic-release
5. Repo polish (badges, docs, examples)
6. Launch checklist
7. Versioning policy
8. Troubleshooting

---

# 🚀 **0. GitHub Repo Setup**

### 1. Create a new public GitHub repo

Push the entire monorepo:

```bash
git remote add origin https://github.com/<you>/syncr.git
git push -u origin main
```

### 2. Recommended: Protect the `main` branch

Enable:

* Require PRs
* Require status checks
* Require review approvals
* Prevent force pushes

This keeps the release pipeline stable.

---

# 📦 **1. NPM Scope Setup**

Syncr currently publishes under:

```
@syncr/core
@syncr/react
@syncr/angular
@syncr/vue
@syncr/svelte
```

If this scope is **unavailable**, choose a personal or organization scope:

Examples:

```
@vidhyutrabari/syncr-core
@vidhyutrabari/syncr-react
```

Update each `package.json`:

```json
{
  "name": "@vidhyutrabari/syncr-core",
  "version": "0.1.0",
  "type": "module",
  ...
}
```

---

# 🧪 **2. Manual First Publish (Required Once)**

Before CI can publish, **npm must recognize your package**.

Install + build:

```bash
npm install
npm run build
```

Publish each package manually:

```bash
cd packages/core    && npm publish --access public
cd ../react         && npm publish --access public
cd ../vue           && npm publish --access public
cd ../svelte        && npm publish --access public
cd ../angular       && npm publish --access public
```

After this, semantic-release can handle everything automatically.

---

# 🤖 **3. Automated Publishing (semantic-release via GitHub Actions)**

### 1️⃣ Create tokens

#### **NPM_TOKEN**

```bash
npm login
```

Then create an automation token at:

[https://www.npmjs.com/settings/](https://www.npmjs.com/settings/)<username>/tokens

#### **GH_TOKEN**

Use a personal access token or GitHub App token.
Permission needed: `repo` + `workflow`.

---

### 2️⃣ Add repo secrets

In GitHub → Settings → Secrets → Actions:

```
NPM_TOKEN
GH_TOKEN
```

---

### 3️⃣ Add release job to your workflow

Create/update:

`.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install
        run: npm install

      - name: Build
        run: npm run build

      - name: Release
        run: npm run release
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

### 4️⃣ Use Conventional Commits

semantic-release reads commit messages:

#### Patch

```
fix: corrected merge logic for url channel
```

#### Minor

```
feat: added encrypted storage channel
```

#### Major (breaking)

```
feat!: changed createSyncr API to factory pattern
```

semantic-release will:

* Detect change
* Bump package versions
* Generate CHANGELOG
* Push GitHub release
* Publish updated packages to npm

No manual work needed.

---

# 🏷 **4. Badges & README polish**

Add these badges to your root README:

```md
[![npm version](https://img.shields.io/npm/v/@syncr/core)](https://www.npmjs.com/package/@syncr/core)
![CI](https://github.com/<you>/syncr/actions/workflows/release.yml/badge.svg)
![license](https://img.shields.io/github/license/<you>/syncr)
```

Also include:

* Quickstart
* Code samples
* Framework examples
* Feature list
* Examples folder
* API channel explanation
* Multi-tab sync demos

---

# 🚀 **5. Launch Checklist**

To make your library discoverable:

### 🔥 Social

* Post on **X/Twitter** (tag #webdev #reactjs #angular #vuejs #svelte #opensource)
* Post on **Reddit**:

  * r/reactjs
  * r/vuejs
  * r/angular
  * r/sveltejs
  * r/webdev
* Submit to **Hacker News** (Show HN: Syncr – unified UI state sync)

### 💡 Demos

Provide live examples via:

* CodeSandbox
* StackBlitz
* Vercel demo
* GitHub Pages docs

### 📌 Repo Organization

Pin:

* Roadmap
* Contributing
* Good first issues
* Examples

---

# 📌 **6. Versioning Policy**

Syncr uses **Semantic Versioning**:

| Type  | Example | Meaning                 |
| ----- | ------- | ----------------------- |
| Patch | `0.1.1` | Bug fixes, safe changes |
| Minor | `0.2.0` | New features            |
| Major | `1.0.0` | Breaking API changes    |

### For breaking changes:

Document:

* Before
* After
* Migration steps
* Deprecated APIs

---

# 🐞 **Troubleshooting**

### ❌ 409 “Version already exists”

Means the version exists on npm.
semantic-release will fix this automatically by bumping.

### ❌ “You must be logged in to publish”

Run:

```bash
npm login
npm whoami
```

### ❌ “Forbidden: invalid token”

Regenerate your `NPM_TOKEN`.

### ❌ “Cannot publish inside workspace”

Add in each package.json:

```json
"private": false
```

### ❌ “Missing README on npm”

Each package must contain:

```
README.md
package.json
dist/
```

### ❌ semantic-release not running

Ensure:

```
npm run release
```

works locally.

Run dry run:

```bash
npx semantic-release --dry-run
```

---

# 🎯 **Summary**

You now have a **complete professional publication pipeline**:

* Public GitHub repo
* Multi-package monorepo
* Manual first publish
* Fully automated CI publishing
* Semantic-release versioning
* Polished README + badges
* Launch plan
* Troubleshooting
* Versioning policy

Syncr is now ready for real-world adoption and open-source growth.

---

