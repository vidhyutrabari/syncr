export const isServer = typeof window === 'undefined';
export const isClient = !isServer;
export function guardClient<T>(fn: () => T, fallback?: T): T | undefined {
  if (isClient) return fn();
  return fallback;
}

