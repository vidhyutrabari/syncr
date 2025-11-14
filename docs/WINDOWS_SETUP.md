Windows Setup Guide (Local Dev + npm)
Step-by-step instructions for developing, testing, and publishing Syncr packages on Windows

This guide helps contributors and maintainers set up a complete Syncr development environment on Windows 10/11 using npm, PowerShell, and Git.

🧰 1. Install Prerequisites
✔ Install Git

Download and install Git for Windows:
https://git-scm.com/download/win

During install, choose: “Use Git from the command line and 3rd-party software”

✔ Install Node.js (v20+)

https://nodejs.org/en/download

Check "Add to PATH" during setup

Restart PowerShell after install

Verify:

node -v
npm -v


You should see:

node >= 20
npm >= 10

✔ (Optional) pnpm or yarn

If you want pnpm:

corepack enable
corepack prepare pnpm@9 --activate


If deploying with npm only, you can skip pnpm entirely.

📥 2. Clone the Repository
Using HTTPS
git clone https://github.com/<your-username>/syncr.git
cd syncr

Or SSH (recommended for maintainers)
git clone git@github.com:<your-username>/syncr.git
cd syncr

📦 3. Install Dependencies

Since your monorepo now uses npm, run:

npm install


(You may still run pnpm install if you prefer pnpm workspaces; both are supported.)

🔧 4. Build & Test

Build all Syncr packages:

npm run build


Run all tests:

npm test


Run type checking:

npm run typecheck

▶️ 5. Run Example Apps & Storybook

These demonstrations are helpful for contributors and for evaluating PR changes.

🟦 React Demo
npm run demo:react


or, if using filters:

npm --workspace syncr-react-demo run dev

🟥 Angular Demo
npm --workspace syncr-angular-demo start

🟧 Svelte Demo
npm --workspace syncr-svelte-demo run dev

🟩 Vue Demo
npm --workspace syncr-vue-demo dev

📚 Storybook (React)
npm --workspace syncr-storybook-react run storybook

🖥 Mock API Server (for apiChannel)
npm --workspace syncr-mock-api start


Useful for testing:

ETag versioning

Offline queue

API conflicts

Server state merging

🚀 6. Publishing to npm (Manual Only for First Release)
1) Login
npm login

2) Build all packages
npm run build

3) Publish (first manual publish only)
cd packages/core && npm publish --access public
cd ../react && npm publish --access public
cd ../vue && npm publish --access public
cd ../svelte && npm publish --access public
cd ../angular && npm publish --access public


After initial publishing, semantic-release + GitHub Actions will publish automatically on each main push.

🤖 7. CI/CD Trigger (semantic-release)

To trigger automatic release:

git commit -am "feat: added encrypted storage channel"
git push


Pipeline will:

Build

Test

Bump version

Publish new packages

Create GitHub release

Update CHANGELOG

🧪 8. Verifying Local Linking (Optional)

Useful for testing Syncr inside another project.

1) Link a package globally
cd packages/core
npm link

2) Link in your test app
cd path/to/my-react-app
npm link @syncr/core


Unlink:

npm unlink @syncr/core --no-save

🛠 9. Recommended VS Code Extensions

Your contributors will benefit from:

ESLint

Prettier

Angular Language Service

Vue Language Tools

Svelte for VS Code

Tailwind CSS IntelliSense

Vitest Runner

🐞 Troubleshooting
❌ PowerShell execution policy blocks scripts

Run as Admin:

Set-ExecutionPolicy RemoteSigned

❌ “pnpm : The term is not recognized”

Enable via:

corepack enable
corepack prepare pnpm@9 --activate

❌ Node / npm not found in PATH

Restart PowerShell, or add manually:

C:\Program Files\nodejs\

❌ Angular demo port already in use

Stop other dev servers or change ports:

npx kill-port 4200

❌ GitHub push 403 errors

Make sure you’re logged in with the correct GitHub account:

git config --get user.name
git config --get user.email

❌ NPM_TOKEN not working in CI

Your token must be Automation type:

npmjs.com/settings/<user>/tokens

📝 Summary

This Windows setup guide helps you:

Install Git, Node, npm/pnpm

Clone and build the Syncr monorepo

Run examples + Storybook

Publish packages to npm

Work with semantic-release in CI

Troubleshoot common Windows issues

You now have a full, professional onboarding experience for Windows developers.