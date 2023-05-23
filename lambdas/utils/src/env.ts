import { z } from 'zod';

const envSchema = z.object({
  AWS_REGION: z.string().default('N/A'),
  AWS_EXECUTION_ENV: z.string().default('N/A'),
});

export const env = envSchema.parse(process.env);
