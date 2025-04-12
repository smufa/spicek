interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
}
const VideoPlayer = ({ videoRef }: VideoPlayerProps) => {
  // Reference to the HTML video element.

  return (
    <video
      ref={videoRef}
      height="100%"
      width="100%"
      controls={false}
      style={{
        objectFit: 'cover',
        maxWidth: '70vw',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0,0,0,0.2)',
      }}
    >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
