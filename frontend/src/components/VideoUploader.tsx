import React, { useState } from "react";

interface Props {
  onUploadComplete: (videoUrl: string, jobName: string) => void;
}

const VideoUploader: React.FC<Props> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!file) return;
    setLoading(true);

    const res = await fetch("http://localhost:3001/generate-upload-url");
    const { uploadUrl, fileUrl, key } = await res.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const startRes = await fetch("http://localhost:3001/start-transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const data = await startRes.json();
    onUploadComplete(fileUrl, data.jobName);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={uploadVideo} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>
    </div>
  );
};

export default VideoUploader;
