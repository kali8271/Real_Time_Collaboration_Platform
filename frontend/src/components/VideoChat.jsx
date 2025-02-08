import React, { useRef, useEffect } from "react";

const VideoChat = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  return <video ref={videoRef} autoPlay className="w-64 border rounded shadow-md" />;
};

export default VideoChat;
