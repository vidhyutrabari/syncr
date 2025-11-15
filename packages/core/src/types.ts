export interface Channel<T> {
  id: string;
  priority?: number;
  read(): T | undefined | Promise<T | undefined>;
  write(value: T): void | Promise<void>;
  subscribe?(cb: (value: T | undefined) => void): () => void;
}

export interface Schema<T> {
  parse: (value: unknown) => T;
  serialize?: (value: T) => unknown;
  onError?: (err: unknown, raw: unknown) => void;
}

export interface SyncrOptions<T> {
  key: string;
  defaultValue: T;
  channels: (Channel<T> | 'url' | 'storage')[];
  debounceMs?: number;
  schema?: Schema<T>;
  onConflict?: (a: T, b: T) => T; // default: last-writer-wins
}

export interface SyncrHandle<T> {
  get(): T;
  set(updater: T | ((prev: T) => T)): void;
  subscribe(cb: (value: T) => void): () => void;
  destroy(): void;

  // Backwards compatibility shim for older adapters/tests
  value?: {
    get(): T;
    subscribe(cb: (v: T) => void): () => void;
  };
}

