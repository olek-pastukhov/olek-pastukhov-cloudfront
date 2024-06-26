const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.catalogBatchProcess = async (event) => {
  for (const record of event.Records) {
    const { count, ...product } = JSON.parse(record.body);
    await documentClient.put({
      TableName: process.env.PRODUCTS_DYNAMO_DB,
      Item: product
    }).promise();

    await documentClient.put({
      TableName: process.env.STOCK_DYNAMO_DB,
      Item: { count, product_id: product.id}
    }).promise();

    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        vip: {
          DataType: 'String',
          StringValue: String(product.vip)
        }
      },
      Message: `Product created: ${JSON.stringify(product)}`
    }).promise();
  }
};
