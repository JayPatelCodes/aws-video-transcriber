import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import TranscriptDisplay from "./components/TranscriptDisplay";

function App() {
  const [jobName, setJobName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div>
      <h1>Video Upload</h1>
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
    </div>
  );
}

export default App;
