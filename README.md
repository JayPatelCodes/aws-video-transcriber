# Video Transcription App (AWS + React + TypeScript)

A full-stack video transcription app powered by AWS services. Users can upload videos, automatically transcribe audio, and browse searchable transcripts. Built with a React + TypeScript frontend and an Express + TypeScript backend.

---

## Table of Contents

1. [Description](#description)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Installation](#installation) 
5. [Demo Video](#demo-video) 
6. [Usage](#usage)

---

## Description

This project allows users to upload video files and automatically transcribes them using AWS Transcribe. Transcripts are stored and displayed alongside videos with search functionality to quickly locate relevant sections of dialogue.

---

## Features

- Upload videos using pre-signed S3 URLs  
- Automatically start AWS Transcribe jobs on upload  
- Fetch and display transcript with timestamps  
- Clickable video cards with transcript snippets  
- Searchable transcript text with match highlighting  
- Responsive layout with pagination

---

## Tech Stack

**Frontend**
- React  
- TypeScript  
- Vite

**Backend**
- Node.js  
- Express  
- TypeScript  
- AWS SDK (S3, Transcribe, DynamoDB)  
- dotenv  

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/JayPatelCodes/video-transcription-app.git
cd video-transcription-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following variables:

```env
AWS_REGION=your-region-here        # e.g. us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
DYNAMODB_TABLE_NAME=your-dynamodb-table
```

Start the backend server:

```bash
npx ts-node-dev src/server.ts
```

> **Note:** Run this command inside the `backend` directory to ensure the `.env` file loads correctly.

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
cd frontend
npm install
npm run dev
```

---

## Running the Application

- Frontend will be available at: [http://localhost:3000](http://localhost:3000)
- Backend will run at: [http://localhost:3001](http://localhost:3001)

---

## Demo Video

- Video will be available soon.

## Usage

1. Go to the **Upload** page and select an `.mp4` video file to upload.
2. A pre-signed URL is generated and the video is uploaded to S3.
3. The backend starts an AWS Transcribe job to generate the transcript.
4. Once the transcript is ready, navigate to the **Browse** page.
5. Use the search bar to find keywords within any transcript.
6. Click on a video card to view the full video and its transcript.
7. Matching transcript sections will be highlighted for easy review.

---