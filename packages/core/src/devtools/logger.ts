import type { Channel } from '../types.js';

export type LogEvent<T> = {
  type: 'read' | 'write' | 'subscribe';
  channel: string;
  payload?: T | undefined;
  ts: number;
};

type Sink<T> = (e: LogEvent<T>) => void;

let globalSink: Sink<any> | null = null;

export function enableSyncrConsoleDevtools() {
  globalSink = (e) => {
    // eslint-disable-next-line no-console
    console.debug(`[Syncr] ${e.type} via ${e.channel}`, e);
  };
}

export function disableSyncrConsoleDevtools() {
  globalSink = null;
}

export function tapChannel<T>(channel: Channel<T>): Channel<T> {
  return {
    ...channel,
    async read() {
      const v = await channel.read();
      globalSink?.({ type:'read', channel: channel.id, payload: v, ts: Date.now() });
      return v as any;
    },
    async write(value: T) {
      globalSink?.({ type:'write', channel: channel.id, payload: value, ts: Date.now() });
      return channel.write(value);
    },
    subscribe(cb) {
      globalSink?.({ type:'subscribe', channel: channel.id, ts: Date.now() });
      return channel.subscribe?.(cb) || (() => {});
    }
  };
}
