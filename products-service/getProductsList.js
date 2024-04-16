const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsList = async () => {
  try {
    const { Items: products } = await documentClient.scan({ TableName: process.env.PRODUCTS_DYNAMO_DB }).promise();
    const { Items: stocks } = await documentClient.scan({ TableName: process.env.STOCK_DYNAMO_DB }).promise();
    const stockMap = stocks.reduce((acc, stock) => ({
      ...acc,
      [stock.product_id]: stock.count
    }), {});

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(products ? products.map(product => {
        const stock = stockMap[product.id];
        return { ...product, count: stock ? stock : 0 };
      }) : [])
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Cannot fetch products" })
    };
  }
};
