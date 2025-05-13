import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from './s3Client';

const app = express();
const port = 3001;

console.log(process.env.S3_BUCKET_NAME); // Should print the bucket name if loaded properly

const bucketName = process.env.S3_BUCKET_NAME;


if (!bucketName) {
  throw new Error('Missing S3_BUCKET_NAME in environment variables. Please add it to your .env file.');
}

app.use(cors());
app.use(express.json());

app.get('/generate-upload-url', async (req: Request, res: Response) => {
  try {
    const key = `${uuidv4()}.mp4`;

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: 'video/mp4',
    });

    const uploadUrl = await getSignedUrl(s3, uploadCommand, { expiresIn: 3600 });

    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const fileUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    res.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    res.status(500).send('Failed to generate signed URLs');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
