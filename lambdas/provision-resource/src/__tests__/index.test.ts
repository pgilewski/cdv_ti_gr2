import { Context, SQSEvent, SQSBatchResponse } from 'aws-lambda';

import { handler } from '../index';

describe('ProvisionSTEFn', () => {
  test('provision', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
          receiptHandle: 'MessageReceiptHandle',
          body: 'Hello from SQS!',
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1523232000000',
            SenderId: '123456789012',
            ApproximateFirstReceiveTimestamp: '1523232000001',
          },
          messageAttributes: {},
          md5OfBody: '7b270e59b47ff90a553787216d55d91d',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
          awsRegion: 'us-east-1',
        },
      ],
    };
    const context = {} as Context;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockCallback = jest.fn(() => {});

    const result = (await handler(event, context, mockCallback)) as SQSBatchResponse;

    expect(result).toEqual({ batchItemFailures: [] });
  });
});
