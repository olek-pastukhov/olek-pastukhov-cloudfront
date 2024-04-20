const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.updateProductById = async event => {
  console.log(event);
  const { productId } = event.pathParameters;
  const { title, price, description, count } = JSON.parse(event.body);

  const { Item: product = {} } = await documentClient.get({
    TableName: process.env.PRODUCTS_DYNAMO_DB,
    Key: { id: productId }
  }).promise();

  const { Item: stock = {} } = await documentClient.get({
    TableName: process.env.STOCK_DYNAMO_DB,
    Key: { product_id: productId }
  }).promise();


  if (title) product.title = title;
  if (price) product.price = price;
  if (description) product.description = description;
  if (count) stock.count = count;

  const productParams = { TableName: process.env.PRODUCTS_DYNAMO_DB, Item: product };
  const stockParams = { TableName: process.env.STOCK_DYNAMO_DB, Item: stock };

  try {
    await documentClient.put(productParams).promise();
    await documentClient.put(stockParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ ...product, count: stock.count })
    };
  } catch (error) {
    console.error("Unable to create product. Error JSON:", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Cannot create product" })
    };
  }
};
