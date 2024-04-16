const AWS = require("aws-sdk");
const { products } = require("./products");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.provisionProductsList = async () => {
  for (let product of products) {
    await documentClient.put({
      TableName: process.env.PRODUCTS_DYNAMO_DB,
      Item: {
        "id": product.id,
        "title": product.title,
        "description": product.description,
        "price": product.price
      }
    }).promise();

    await documentClient.put({
      TableName: process.env.STOCK_DYNAMO_DB,
      Item: {
        "product_id": product.id,
        "count": Math.floor(Math.random() * 30)
      }
    }).promise();
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({ ok: true })
  };
};
