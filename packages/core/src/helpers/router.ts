/**
 * Merge the given query param key/value into the current URL without losing other params.
 * Works well with Syncr's URL channel to avoid clobbering state.
 */
export function mergeQueryParam(key: string, value: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  history.replaceState({}, '', url);
}

/**
 * Ensure a given set of params are preserved when navigating using pushState.
 * Call before you perform router navigations that might drop params.
 */
export function preserveParams(keys: string[]) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const preserved = new URLSearchParams();
  keys.forEach(k => {
    const v = url.searchParams.get(k);
    if (v !== null) preserved.set(k, v);
  });
  return preserved;
}
