# DevTools (Console logger)

Enable a minimal logger to see **reads**, **writes**, and **subscriptions** per channel in your console.
```ts
import { enableSyncrConsoleDevtools, tapChannel } from '@syncr/core';

enableSyncrConsoleDevtools();

const channels = [
  'url',
  'storage',
  tapChannel(apiChannel('filters', { baseUrl: 'http://localhost:4321' }))
];
```
- `tapChannel(channel)` wraps any channel to report activity.
- To disable: `disableSyncrConsoleDevtools()`.
