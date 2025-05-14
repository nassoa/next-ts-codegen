import { z } from 'zod';

export const sourceSchema = z.object({
  input: z.string(),
  type: z.string(),
  typeName: z.string(),
  options: z.record(z.any()).optional(),
});

export const configSchema = z.object({
  outputDir: z.string(),
  generateZodSchemas: z.boolean().default(true),
  generateSwrHooks: z.boolean().default(false),
  generateReactQueryHooks: z.boolean().default(false),
  hookPrefix: z.string().optional(),
  baseUrl: z.string().optional(),
  sources: z.array(sourceSchema).default([]),
});

export type Config = z.infer<typeof configSchema>;
