🅰️ 3) README for @syncr/angular

@syncr/angular
Angular Signals & RxJS adapter for Syncr


📦 Install
npm install @syncr/core @syncr/angular


Requires:

Angular 16+

RxJS 7+

⚡ Quickstart
import { Component } from '@angular/core';
import { createSyncrSignal } from '@syncr/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <input [value]="filters().q" (input)="update($event.target.value)" />
    <pre>{{ filters() | json }}</pre>
  `
})
export class AppComponent {
  { filters, setFilters } = createSyncrSignal({
    key: 'filters',
    defaultValue: { q: '', sort: 'date', page: 1 },
    channels: ['url', 'storage']
  });

  update(v: string) {
    this.setFilters(p => ({ ...p, q: v }));
  }
}

🎉 Features

Angular Signals support

Optional RxJS store API

URL + storage + encrypted + API channels

SSR-safe

Built for scalable enterprise apps

🧩 Zod Schemas
schema: zodSchema(FilterSchema)

📚 Docs

See root README for:

Channels

Encrypted Storage

API Sync

Router integration

Storybook examples

📝 License

MIT © Vidhyut Rabari