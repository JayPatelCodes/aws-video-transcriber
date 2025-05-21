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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transcriptMap, setTranscriptMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 6;

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3001/list-transcriptions");
      const data = await res.json();
      const validJobs = Array.isArray(data) ? data : [];
      setJobs(validJobs);

      const map: Record<string, string> = {};
      for (const job of validJobs) {
        try {
          const res = await fetch(`http://localhost:3001/get-transcription/${job.jobName}`);
          const data = await res.json();
          map[job.jobName] = data.transcript || "";
        } catch {
          map[job.jobName] = "";
        }
      }
      setTranscriptMap(map);
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

  const highlightMatch = (text: string) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const filteredJobs = jobs.filter((job) =>
    transcriptMap[job.jobName]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="main-title">Your Videos</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <button className="refresh-button" onClick={fetchJobs}>
          Refresh
        </button>
      </div>

      <div className="thumbnail-grid mb-6">
        {paginatedJobs.map((job) => (
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
            {searchTerm && transcriptMap[job.jobName] && (
              <div
                className="transcript-snippet"
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(
                    transcriptMap[job.jobName]
                      .split(" ")
                      .slice(0, 50)
                      .join(" ") + "..."
                  ),
                }}
              />
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={page === currentPage}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="transcript-card no-title">
          <video
            src={selectedJob.fileUrl}
            controls
            className="selected-video mb-3"
          />
          <pre
            className="transcript-text"
            dangerouslySetInnerHTML={{
              __html: transcript ? highlightMatch(transcript) : "Loading transcript...",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TranscriptViewer;
