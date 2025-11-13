import * as React from 'react';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T>(
  opts: SyncrOptions<T>
): readonly [T, (v: T | ((prev: T) => T)) => void] {
  const handleRef = React.useRef<SyncrHandle<T> | null>(null);
  const [, forceRender] = React.useReducer((x: number) => x + 1, 0);

  if (!handleRef.current) {
    handleRef.current = createSyncr<T>(opts);
  }

  React.useEffect(() => {
    const unsub = handleRef.current!.value.subscribe(() => {
      forceRender();
    });

    return () => {
      unsub();
    };
  }, []);

  React.useEffect(() => {
    return () => {
      handleRef.current?.destroy();
    };
  }, []);

  const state = handleRef.current!.value.get();

  const set = React.useCallback(
    (v: T | ((prev: T) => T)) => {
      const next =
        typeof v === 'function'
          ? (v as (prev: T) => T)(handleRef.current!.value.get())
          : v;

      handleRef.current!.set(next);
    },
    []
  );

  return [state, set] as const;
}
