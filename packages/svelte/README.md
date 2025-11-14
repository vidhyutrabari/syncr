🟧 5) README for @syncr/svelte

@syncr/svelte
Svelte store adapter for Syncr

📦 Install
npm install @syncr/core @syncr/svelte

⚡ Quickstart
<script lang="ts">
  import { syncrStore } from '@syncr/svelte';

  const { store, setStore } = syncrStore({
    key: 'filters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage']
  });
</script>

<input bind:value={$store.q} />
<pre>{JSON.stringify($store, null, 2)}</pre>

🎉 Features

Svelte writable store interface

URL + storage + encrypted

Multi-tab sync

API channel

Zod support

📚 Docs

See root README.

📝 License

MIT © Vidhyut Rabari