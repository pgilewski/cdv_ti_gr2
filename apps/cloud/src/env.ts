import { z } from 'zod';

const envSchema = z.object({
  CDK_DEFAULT_ACCOUNT: z.string(),
  CDK_DEFAULT_REGION: z.string(),
  CDK_DEPLOY_ACCOUNT: z.string().optional(),
  CDK_DEPLOY_REGION: z.string().optional(),
});

export const env = envSchema.parse(process.env);
