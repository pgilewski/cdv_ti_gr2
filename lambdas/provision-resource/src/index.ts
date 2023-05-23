import { SQSHandler, SQSEvent, SQSRecord, SQSBatchItemFailure } from 'aws-lambda';
import { logger } from '@cdv/techint-lambdas-utils';

const provisionResource = (body: string) => {
  logger.info(`Provision Resource: ${body}`);
  // TODO: Implement
};

export const handler: SQSHandler = async (event: SQSEvent) => {
  const records: SQSRecord[] = event.Records;
  const batchItemFailures: SQSBatchItemFailure[] = [];

  await Promise.allSettled(
    records.map(async (record: SQSRecord) => {
      const body = record.body;
      try {
        provisionResource(body);
      } catch (e) {
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    })
  );

  return { batchItemFailures };
};
