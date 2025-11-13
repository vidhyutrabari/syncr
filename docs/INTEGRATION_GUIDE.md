# Integration Guide

## React + React Router
- Use `channels: ['url','storage']` and ensure your router does not wipe the URL on navigation.
- For SSR frameworks (Next.js), only call `useSyncr` on client components.

## Vue 3 + Vue Router
- Use the `useSyncr` composable and bind `state` to your inputs.
- To reset on route changes, watch `route.fullPath` and set new defaults.

## Svelte
- Use `syncrStore` and `$store` bindings.
- For SPA routers, ensure history updates do not clobber query params.
