const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const csv = require("csv-parser");

module.exports.importFileParser = async (event) => {
  const [Record] = event.Records || [];

  if (!Record) {
    return;
  }

  const s3Stream = s3.getObject({
    Bucket: Record.s3.bucket.name,
    Key: Record.s3.object.key
  }).createReadStream();

  return await new Promise((resolve, reject) => {
    s3Stream.pipe(csv())
      .on("data", (data) => {
        console.log(data);
      })
      .on("end", () => {
        console.log("CSV processing completed");
        resolve();
      });
  });
};
