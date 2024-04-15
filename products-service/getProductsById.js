const { products } = require("./products");


module.exports.getProductsById = async event => {
  const { productId } = event.pathParameters;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      body: 'Product not found',
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
