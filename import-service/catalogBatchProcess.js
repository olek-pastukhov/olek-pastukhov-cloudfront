const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.catalogBatchProcess = async (event) => {
  for (const record of event.Records) {
    const product = JSON.parse(record.body);
    await documentClient.put({
      TableName: process.env.PRODUCTS_DYNAMO_DB,
      Item: product
    }).promise();

    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: `Product created: ${JSON.stringify(product)}`
    }).promise();
  }
};
