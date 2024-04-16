const AWS = require("aws-sdk");
const { randomUUID } = require('crypto');
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async event => {
  console.log(event);
  const { title, price, description, count = 1 } = JSON.parse(event.body);
  const productId = randomUUID();

  const productParams = {
    TableName: process.env.PRODUCTS_DYNAMO_DB,
    Item: {
      id: productId,
      title,
      price,
      description
    }
  };

  const stockParams = {
    TableName: process.env.STOCK_DYNAMO_DB,
    Item: {
      product_id: productId,
      count
    }
  };

  try {
    await documentClient.put(productParams).promise();
    await documentClient.put(stockParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ id: productId, title, price, description, count})
    };
  } catch (error) {
    console.error("Unable to create product. Error JSON:", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: 'Cannot create product' })
    };
  }
};
