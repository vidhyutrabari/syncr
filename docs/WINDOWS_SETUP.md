# Windows Setup (Local Dev + npm)

## 1) Install prerequisites
- **Git**: https://git-scm.com/download/win
- **Node.js 20+**: https://nodejs.org/en/download
  - During installation, check "Add to PATH".
- **pnpm** (recommended): open **PowerShell** as Admin:
  ```powershell
  corepack enable
  corepack prepare pnpm@9.0.0 --activate
  ```

## 2) Clone and install
```powershell
git clone <your-repo-url> syncr
cd syncr
pnpm install
```

If you prefer **npm** or **yarn**:
```powershell
npm install
# or
yarn install
```

## 3) Build & test
```powershell
pnpm build
pnpm test
```

## 4) Run demos
- **Mock API**:
  ```powershell
  pnpm --filter syncr-mock-api start
  ```
- **React demo**:
  ```powershell
  pnpm --filter syncr-react-demo dev
  ```
- **Angular demo**:
  ```powershell
  pnpm --filter syncr-angular-demo start
  ```
- **Storybook (React)**:
  ```powershell
  pnpm --filter syncr-storybook-react storybook
  ```

## 5) Publish to npm
```powershell
npm login
pnpm build
# publish each package (adjust scope if needed)
cd packages/core; npm publish --access public; cd ../react; npm publish --access public; cd ../vue; npm publish --access public; cd ../svelte; npm publish --access public; cd ../angular; npm publish --access public
```

## Troubleshooting
- If execution policy blocks scripts, in **PowerShell (Admin)**:
  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```
- If ports are busy, stop other dev servers or change ports in the demo configs.
- Ensure your antivirus isn’t blocking Node or Git.
