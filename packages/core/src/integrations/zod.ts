import type { Schema } from '../types.js';
import type { z } from 'zod';

/**
 * Wrap a Zod schema so it can be used as Syncr's schema.
 * Example:
 *   const schema = z.object({ q: z.string(), page: z.number().int().min(1) });
 *   useSyncr({ ..., schema: zodSchema(schema) });
 */
export function zodSchema<T>(zod: z.ZodType<T, any, any>): Schema<T> {
  return {
    parse: (x: unknown) => zod.parse(x),
    serialize: (x: T) => x
  };
}
