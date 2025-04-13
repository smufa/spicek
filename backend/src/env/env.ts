import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  NODE_ENV: z.coerce.string().optional().default('development'),
  API_KEY_SONIOX: z.coerce.string(),
  API_FILLER: z.coerce.string(),
});

export type Env = z.infer<typeof envSchema>;
