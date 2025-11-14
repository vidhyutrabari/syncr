🟦 4) README for @syncr/vue

@syncr/vue
Vue 3 Composition API adapter for Syncr

📦 Install
npm install @syncr/core @syncr/vue

⚡ Quickstart
import { useSyncrVue } from '@syncr/vue';

export default {
  setup() {
    const { state, setState } = useSyncrVue({
      key: 'filters',
      defaultValue: { q: '', sort: 'date', page: 1 },
      channels: ['url', 'storage']
    });

    return { state, setState };
  }
};

🎉 Features

Vue reacivity-compatible state syncing

URL + localStorage + encrypted storage

BroadcastChannel & API channel support

Zod validation

Tiny + fast

🪟 Multi-Tab Example
useSyncrVue({
  key: 'cart',
  channels: ['storage', broadcastChannel('cart')]
});

📚 Docs

See monorepo root README.

📝 License

MIT © Vidhyut Rabari