const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.deleteProductById = async event => {
  const { productId } = event.pathParameters;

  const productParams = {
    TableName: process.env.PRODUCTS_DYNAMO_DB,
    Key: {
      id: productId
    }
  };

  const stockParams = {
    TableName: process.env.STOCK_DYNAMO_DB,
    Key: {
      product_id: productId
    }
  };

  try {
    await documentClient.delete(productParams).promise();
    await documentClient.delete(stockParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: 'Product deleted successfully' })
    };
  } catch (error) {
    console.error("Unable to delete product. Error JSON:", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: 'Cannot delete product' })
    };
  }
};
