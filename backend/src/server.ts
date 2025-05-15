import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3 } from './s3Client';


const app = express();
const port = 3001;

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

if (!bucketName || !region) {
  throw new Error('Missing AWS_REGION or S3_BUCKET_NAME in environment variables.');
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

    res.json({ uploadUrl, fileUrl, key }); //  Key is used in transcription
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    res.status(500).send('Failed to generate signed URLs');
  }
});

app.post('/start-transcription', async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'Missing key in request body.' });
  }

  const transcribeClient = new TranscribeClient({ region });

  const jobName = `transcription-${uuidv4()}`;
  const mediaUri = `s3://${bucketName}/${key}`;

  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US',
    MediaFormat: 'mp4',
    Media: { MediaFileUri: mediaUri },
    OutputBucketName: bucketName,
  });

  try {
    await transcribeClient.send(command);
    res.json({ message: 'Transcription job started.', jobName });
  } catch (error) {
    console.error('Error starting transcription job:', error);
    res.status(500).json({ error: 'Failed to start transcription job.' });
  }
});

app.get("/get-transcription/:jobName", async (req: Request, res: Response) => {
  const { jobName } = req.params;

  if (!jobName) {
    return res.status(400).json({ error: "Missing jobName in request parameters." });
  }

  const transcribeClient = new TranscribeClient({ region });

  try {
    const command = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
    const response = await transcribeClient.send(command);
    const job = response.TranscriptionJob;

    if (!job) throw new Error("Job not found.");

    if (job.TranscriptionJobStatus === "COMPLETED") {
      const key = ` ${jobName}.json`;

      const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: key });
      const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

      const transcriptResponse = await axios.get<{
        results: {
          transcripts: { transcript: string }[];
        };
      }>(signedUrl);

      const transcriptText = transcriptResponse?.data?.results?.transcripts?.[0]?.transcript;

      return res.json({ transcript: transcriptText });
    } else if (job.TranscriptionJobStatus === "FAILED") {
      return res.status(500).json({ error: "Transcription job failed." });
    } else {
      return res.json({ status: job.TranscriptionJobStatus });
    }

  } catch (error) {
    console.error("Error fetching transcription job:", error);
    return res.status(500).json({ error: "Failed to fetch transcription job." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
