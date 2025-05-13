import React, { useState } from "react";

const VideoUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!file) return;

    const res = await fetch("http://localhost:3001/generate-upload-url");
    const { uploadUrl, fileUrl } = await res.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    setVideoUrl(fileUrl);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={uploadVideo}>Upload</button>
      {videoUrl && (
        <div>
          <h2>Uploaded Video:</h2>
          <video src={videoUrl} controls width="500" />
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
