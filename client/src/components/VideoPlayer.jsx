import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, muted = true, className = "" }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={`${className}`}
    />
  );
}
