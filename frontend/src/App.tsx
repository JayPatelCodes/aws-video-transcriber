import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import TranscriptDisplay from "./components/TranscriptDisplay";
import TranscriptViewer from "./components/TranscriptViewer";

function App() {
  const [jobName, setJobName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Video Transcriber</h1>

      <VideoUploader
        onUploadComplete={(url: string, job: string) => {
          setVideoUrl(url);
          setJobName(job);
        }}
      />

      {videoUrl && (
        <div>
          <h2>Uploaded Video:</h2>
          <video src={videoUrl} controls width="500" />
        </div>
      )}

      {jobName && <TranscriptDisplay jobName={jobName} />}

      <hr style={{ margin: "40px 0" }} />

      <TranscriptViewer />
    </div>
  );
}

export default App;
