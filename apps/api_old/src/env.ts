import { z } from 'zod';

const envSchema = z.object({
  AWS_EXECUTION_ENV: z.string().optional(),
  API_PREFIX: z.string(),
  PROVISION_RESOURCE_QUEUE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
