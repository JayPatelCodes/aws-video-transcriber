import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME!;

if (!region || !bucketName) {
  throw new Error('Missing AWS_REGION or S3_BUCKET_NAME in environment variables. Please add them to your .env file.');
}

app.use(cors()); // Allow all origins (for local dev)
app.use(express.json());

app.get('/generate-upload-url', async (req: Request, res: Response) => {
  try {
    const key = `${uuidv4()}.mp4`;

    // Signed PUT URL (upload)
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: 'video/mp4',
    });
    const uploadUrl = await getSignedUrl(s3, uploadCommand, { expiresIn: 3600 });

    // Signed GET URL (play)
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const fileUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    res.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).send('Failed to generate upload URL');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
