import * as React from 'react';
import type { SyncrOptions, SyncrHandle } from '@syncr/core';
import { createSyncr } from '@syncr/core';

export function useSyncr<T>(
  opts: SyncrOptions<T>
): readonly [T, (v: T | ((prev: T) => T)) => void] {
  const handleRef = React.useRef<SyncrHandle<T> | null>(null);

  // Create the Syncr handle once per component instance
  if (!handleRef.current) {
    handleRef.current = createSyncr<T>(opts);
  }

  const handle = handleRef.current;

  // Subscribe using React's official external store API
  const state = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => {
      // SyncrHandle.subscribe returns an unsubscribe function
      return handle.subscribe(() => cb());
    }, [handle]),
    React.useCallback(() => handle.get(), [handle])
  );

  // Destroy Syncr handle on unmount
  React.useEffect(
    () => () => {
      handleRef.current?.destroy();
    },
    []
  );

  const set = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      handle.set(next);
    },
    [handle]
  );

  return [state, set] as const;
}
