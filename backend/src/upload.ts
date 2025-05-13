import { config } from "dotenv";
config();

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "./s3Client"; 

const bucket = process.env.S3_BUCKET_NAME;
if (!bucket) {
  throw new Error("Missing S3_BUCKET_NAME in .env");
}

async function generateUploadUrl() {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME, 
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
