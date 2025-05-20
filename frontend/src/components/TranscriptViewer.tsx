import React, { useEffect, useState } from "react";
import "./TranscriptViewer.css";

interface TranscriptionJob {
  jobName: string;
  videoKey: string;
  createdAt: string;
  fileUrl: string;
}

const TranscriptViewer: React.FC = () => {
  const [jobs, setJobs] = useState<TranscriptionJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<TranscriptionJob | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3001/list-transcriptions");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transcription jobs:", error);
    }
  };

  const fetchTranscript = async (jobName: string) => {
    try {
      const res = await fetch(`http://localhost:3001/get-transcription/${jobName}`);
      const data = await res.json();
      setTranscript(data.transcript);
    } catch (err) {
      console.error("Failed to fetch transcript:", err);
      setTranscript("Error loading transcript.");
    }
  };

  const handleSelectJob = (job: TranscriptionJob) => {
    setSelectedJob(job);
    setTranscript(null);
    fetchTranscript(job.jobName);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transcription Jobs</h1>

      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={fetchJobs}
      >
        Refresh Jobs
      </button>

      {/* Thumbnail Grid */}
      <div className="thumbnail-grid mb-6">
        {jobs.map((job) => (
          <div
            key={job.jobName}
            onClick={() => handleSelectJob(job)}
            className="thumbnail-card"
          >
            <div className="thumbnail-video-container">
              <video src={job.fileUrl} className="thumbnail-video" muted />
            </div>
            <div className="thumbnail-date">
              {new Date(job.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Selected video and transcript */}
      {selectedJob && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Transcript</h2>
          <video
            src={selectedJob.fileUrl}
            controls
            className="selected-video mb-4"
            />
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
            {transcript || "Loading transcript..."}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TranscriptViewer;
