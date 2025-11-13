import type { Channel } from '../types.js';

export function broadcastChannel<T>(key: string, topic = 'syncr'): Channel<T> {
  const hasBC = typeof BroadcastChannel !== 'undefined';
  let bc: BroadcastChannel | null = hasBC ? new BroadcastChannel(topic) : null;

  const read = () => undefined as any; // no initial value from bus
  const write = async (value: T) => {
    if (!bc) return;
    try { bc.postMessage({ key, value, ts: Date.now() }); } catch {}
  };
  const subscribe = (cb: (v:T|undefined)=>void) => {
    if (!bc) return () => {};
    const handler = (msg: MessageEvent) => {
      const data = msg.data || {};
      if (data.key === key) cb(data.value as T);
    };
    bc.addEventListener('message', handler);
    return () => bc && bc.removeEventListener('message', handler);
  };

  return { id: 'broadcast', priority: -1, read, write, subscribe };
}
