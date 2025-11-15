declare module '@syncr/core' {
  export interface Channel<T> {
    id: string;
    priority?: number;
    read(): T | undefined | Promise<T | undefined>;
    write(value: T): void | Promise<void>;
    subscribe?(cb: (v: T | undefined) => void): () => void;
  }

  export interface Schema<T> {
    parse(x: unknown): T;
    serialize?(x: T): unknown;
  }

  export interface SyncrOptions<T> {
    key: string;
    defaultValue: T;
    channels?: Array<'url' | 'storage' | Channel<T>>;
    debounceMs?: number;
    schema?: Schema<T>;
    // simplified 2-arg onConflict in core
    onConflict?: (local: T, incoming: T) => T;
  }

  export interface SyncrHandle<T> {
    get(): T;
    set(v: T | ((prev: T) => T)): void;
    subscribe(cb: (v: T) => void): () => void;
    destroy(): void;
  }

  export function createSyncr<T>(opts: SyncrOptions<T>): SyncrHandle<T>;
}
