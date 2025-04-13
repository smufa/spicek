interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
  url: string;
}
const VideoPlayer = ({ videoRef, url }: VideoPlayerProps) => {
  // Reference to the HTML video element.

  return (
    <video
      ref={videoRef}
      width="100%"
      // height="100%"
      controls={false}
      style={{
        objectFit: 'contain',
        maxWidth: '70vw',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0,0,0,0.2)',
      }}
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
