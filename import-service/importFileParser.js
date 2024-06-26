const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const csv = require("csv-parser");
const sqs = new AWS.SQS();

module.exports.importFileParser = async (event) => {
  console.log("importFileParser lambda has been invoked with event: ", event);
  const [Record] = event.Records || [];

  if (!Record) {
    return;
  }

  const s3Stream = s3.getObject({
    Bucket: Record.s3.bucket.name,
    Key: Record.s3.object.key
  }).createReadStream();

  await new Promise((resolve) => {
    s3Stream.pipe(csv())
      .on("data", async (data) => {
        await sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data)
        }).promise();
      })
      .on("end", resolve);
  });

  await s3.copyObject({
    Bucket: Record.s3.bucket.name,
    CopySource: `${Record.s3.bucket.name}/${Record.s3.object.key}`,
    Key: Record.s3.object.key.replace("uploaded", "parsed")
  }).promise();

  await s3.deleteObject({
    Bucket: Record.s3.bucket.name,
    Key: Record.s3.object.key
  }).promise();
};
