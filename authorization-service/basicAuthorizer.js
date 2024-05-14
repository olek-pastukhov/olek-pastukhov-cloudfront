const generatePolicyDocument = (effect, resource) => {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };
};

module.exports.basicAuthorizer = async (event, context) => {
  if (event.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const authorizationToken = event.authorizationToken;
  if (!authorizationToken) {
    return {
      statusCode: 401,
      body: 'Unauthorized',
    };
  }

  const encodedCreds = authorizationToken.split(' ')[1];
  const buff = Buffer.from(encodedCreds, 'base64');
  const [username, password] = buff.toString('utf-8').split(':');

  const storedUserPassword = process.env[username];
  const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

  const policyDocument = generatePolicyDocument(effect, event.methodArn);

  return {
    principalId: username,
    policyDocument,
  };
};
