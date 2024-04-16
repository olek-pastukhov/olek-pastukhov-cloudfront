const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.importProductsFile = async (event) => {
  const { fileName } = event.queryStringParameters;
  const params = {
    Bucket: process.env.UPLOADS_S3_BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  const signedUrl = await s3.getSignedUrlPromise('putObject', params);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(signedUrl),
  };
};
