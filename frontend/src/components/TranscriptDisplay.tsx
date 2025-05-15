import React, { useEffect, useState } from "react";

interface Props {
  jobName: string;
}

const TranscriptDisplay: React.FC<Props> = ({ jobName }) => {
  const [transcript, setTranscript] = useState<string>("");
  const [status, setStatus] = useState<"LOADING" | "DONE" | "FAILED">("LOADING");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/get-transcription/${jobName}`);
        const data = await res.json();

        if (data.transcript) {
          setTranscript(data.transcript);
          setStatus("DONE");
          clearInterval(interval);
        } else if (data.status === "FAILED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling transcription:", error);
        setStatus("FAILED");
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [jobName]);

  if (status === "LOADING") return <p>Transcribing...</p>;
  if (status === "FAILED") return <p>Transcription failed.</p>;

  return (
    <div>
      <h2>Transcript:</h2>
      <p>{transcript}</p>
    </div>
  );
};

export default TranscriptDisplay;
