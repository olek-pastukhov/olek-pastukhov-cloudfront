const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsById = async event => {
  console.log(event);
  const { productId } = event.pathParameters;

  try {
    const { Item: product } = await documentClient.get({
      TableName: process.env.PRODUCTS_DYNAMO_DB,
      Key: { id: productId }
    }).promise();
    const { Item: stock } = await documentClient.get({
      TableName: process.env.STOCK_DYNAMO_DB,
      Key: { product_id: productId }
    }).promise();

    if (!product) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: "Product not found"
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ ...product, count: stock ? stock.count : 0 })
    };
  } catch (error) {
    console.error("Unable to read item. Error JSON:", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Cannot fetch product" })
    };
  }
};
