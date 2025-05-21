import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import VideoUploader from "./components/VideoUploader";
import TranscriptDisplay from "./components/TranscriptDisplay";
import TranscriptViewer from "./components/TranscriptViewer";
import "./App.css";

const App: React.FC = () => {
  const [jobName, setJobName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                </>
              }
            />
            <Route path="/browse" element={<TranscriptViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
