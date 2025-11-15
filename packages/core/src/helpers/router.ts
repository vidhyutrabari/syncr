export function mergeQueryParam(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState(null, '', url.toString());
}

export function preserveParams(keys: string[]): URLSearchParams | undefined {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const preserved = new URLSearchParams();
  for (const k of keys) {
    const v = url.searchParams.get(k);
    if (v !== null) preserved.set(k, v);
  }
  return preserved;
}
