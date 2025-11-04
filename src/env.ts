import z from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;
