# Public Publishing & Project Setup

## 0) Repo
- Create a new GitHub repo (public). Push this monorepo there.
- Add branch protection for `main` (require PR + checks).

## 1) npm scope
- If `@syncr/*` is taken, change to your scope, e.g. `@yourname/syncr-core` etc.
- Update `package.json` names accordingly.

## 2) Manual publish (initial)
```bash
pnpm install
pnpm build
cd packages/core && npm publish --access public
cd ../react && npm publish --access public
cd ../vue && npm publish --access public
cd ../svelte && npm publish --access public
cd ../angular && npm publish --access public
```

## 3) Semantic Release (CI-based, optional)
- Create an npm token (automation) and GitHub token.
- Add to repo secrets: `NPM_TOKEN`, `GH_TOKEN`.
- Extend `.github/workflows/ci.yml` with a release job:
```yaml
release:
  runs-on: ubuntu-latest
  needs: build-test
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
      with: { version: 9 }
    - uses: actions/setup-node@v4
      with: { node-version: '20', cache: 'pnpm' }
    - run: pnpm install --frozen-lockfile
    - run: pnpm build
    - run: pnpm release
      env:
        GH_TOKEN: ${{ secrets.GH_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
- Follow Conventional Commits to trigger releases.

## 4) Badges & README polish
- Add npm version, bundle size, CI, license badges.
- Include quickstart + code samples in README.

## 5) Launch checklist
- Post on X/Twitter, Reddit r/reactjs / r/vuejs / r/angular / r/sveltejs, HN.
- Provide a codesandbox link for the React demo.
- Pin issues: Roadmap, Good first issues, Contributing.

## 6) Versioning policy
- Use semver; keep breaking changes in majors; document migration steps.
