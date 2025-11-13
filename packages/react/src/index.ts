import * as React from 'react';
import type { SyncrOptions } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T>(opts: SyncrOptions<T>) {
  const ref = React.useRef<ReturnType<typeof createSyncr<T>> | null>(null);
  const [, force] = React.useReducer(x => x + 1, 0);

  if (!ref.current) {
    ref.current = createSyncr<T>(opts);
  }

  React.useEffect(() => {
    const unsub = ref.current!.value.subscribe(() => force());
    return () => unsub();
  }, []);

  React.useEffect(() => {
    return () => { ref.current?.destroy(); };
  }, []);

  const state = ref.current!.value.get();
  const set = React.useCallback((v: T | ((prev:T)=>T)) => {
    const next = typeof v === 'function' ? (v as any)(ref.current!.value.get()) : v;
    ref.current!.set(next);
  }, []);

  return [state, set] as const;
}
