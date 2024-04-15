const AWS = require("aws-sdk");

const productCollection = new AWS.DynamoDB.DocumentClient();

const { products } = require("./products");


module.exports.provisionProductsList = async () => {
  for (let product of products) {
    await productCollection.put({
      TableName: process.env.PRODUCTS_DYNAMO_DB,
      Item: {
        "id": product.id,
        "title": product.title,
        "description": product.description,
        "price": product.price
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
