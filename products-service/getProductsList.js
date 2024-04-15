const { products } = require("./products");


module.exports.getProductsList = async event => {
  return {
    statusCode: 200,

    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(products)
  };
};
