import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';

import { env } from './env';

const defaultValues = {
  awsRegion: env.AWS_REGION,
  awsExecutionEnv: env.AWS_EXECUTION_ENV,
};

const logger = new Logger({
  persistentLogAttributes: defaultValues,
});

const metrics = new Metrics({
  defaultDimensions: defaultValues,
});

const tracer = new Tracer();

export { logger, metrics, tracer };
