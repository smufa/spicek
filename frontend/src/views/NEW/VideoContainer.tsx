import React from 'react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  displayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef,
  canvasRef,
  displayCanvasRef,
}) => {
  return (
    <div className="video-container">
      {/* The video element and hidden canvas (for recording) */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        // style={{ position: 'absolute' }}
        width="640"
        height="480"
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: 'none' }}
      />
      {/* Visible canvas to display annotated (skeleton) video */}
      <canvas
        ref={displayCanvasRef}
        width="640"
        height="480"
        className="video-canvas"
      />
    </div>
  );
};

export default VideoContainer;
