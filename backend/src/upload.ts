import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Initialize
const s3 = new S3Client({
  region: "us-east-1",
  logger: console,
});


async function generateUploadUrl() {
  const command = new PutObjectCommand({
    Bucket: "my-video-bucket-f00f7a43f83d43aa871ecd6911844a70",
    Key: `${uuidv4()}.mp4`,
    ContentType: "video/mp4",  
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log("Pre-signed URL:", url);  
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
  }
}

generateUploadUrl();
