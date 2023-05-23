import { Context } from 'aws-lambda';
import {
  APIGatewayIAMAuthorizerResult,
  APIGatewayRequestAuthorizerEventV2,
} from 'aws-lambda/trigger/api-gateway-authorizer';

import { handler } from '../index';

describe('Authorizer', () => {
  test('authorized', async () => {
    const event: APIGatewayRequestAuthorizerEventV2 = {
      headers: {
        Authorization: 'Basic ' + Buffer.from('user:pass').toString('base64'),
      },
    } as never;
    const context = {} as Context;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockCallback = jest.fn(() => {});

    const result = (await handler(event, context, mockCallback)) as APIGatewayIAMAuthorizerResult;

    expect(result).toEqual({
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'user',
    });
  });

  test('not authorized', async () => {
    const event: APIGatewayRequestAuthorizerEventV2 = {
      // No Authorization header
    } as never;
    const context = {} as Context;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockCallback = jest.fn(() => {});

    const result = (await handler(event, context, mockCallback)) as APIGatewayIAMAuthorizerResult;

    expect(result).toEqual({
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'user',
    });
  });
});
