export interface Channel<T> {
  id: string;
  priority?: number;
  read(): T | undefined | Promise<T | undefined>;
  write(value: T): void | Promise<void>;
  subscribe?(cb: (v: T | undefined) => void): () => void;
}

export type Schema<T> = {
  parse: (x: any) => T;
  serialize?: (x: T) => any;
};

export type SyncrOptions<T> = {
  key: string;
  defaultValue: T;
  channels?: Array<'url' | 'storage' | Channel<T>>;
  debounceMs?: number;
  schema?: Schema<T>;
  onConflict?: (local: T, incoming: T, meta: { from: string, ts: number }) => T;
};
