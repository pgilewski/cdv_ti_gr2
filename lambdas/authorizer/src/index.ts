import { PolicyDocument } from 'aws-lambda';
import {
  APIGatewayRequestIAMAuthorizerHandlerV2,
  APIGatewayRequestAuthorizerEventV2,
} from 'aws-lambda/trigger/api-gateway-authorizer';

const isAuthorized = (event: APIGatewayRequestAuthorizerEventV2) => {
  // TODO implement authorization check
  return event.headers && (event.headers.Authorization || event.headers.authorization);
};

// Doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
const generatePolicyDocument = function (effect: string, resource: string): PolicyDocument {
  const policyDocument = {} as PolicyDocument;
  if (effect && resource) {
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    policyDocument.Statement[0] = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };
  }
  return policyDocument;
};

export const handler: APIGatewayRequestIAMAuthorizerHandlerV2 = async (event) => {
  const effect = isAuthorized(event) ? 'Allow' : 'Deny';
  const policyDocument = generatePolicyDocument(effect, '*');

  return {
    principalId: 'user',
    policyDocument: policyDocument,
  };
};
