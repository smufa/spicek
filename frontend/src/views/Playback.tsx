import { drawConnectors } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { useEffect, useRef, useState } from 'react';
import { Session } from '../api/model';

type Props = {
  session: Session;
};

const Playback = ({ session }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video once metadata is loaded
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      setIsLoading(false);
    };

    video.onloadeddata = () => {
      // Start playing once data is loaded
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        setError('Error playing video');
      });
    };

    video.onerror = () => {
      setError('Error loading video');
      setIsLoading(false);
    };

    // Load the video
    video.src = `${import.meta.env.VITE_BACKEND_API}/sessions/${session.id}/video`;
    video.load();

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      // Always draw the video frame, even if paused
      if (video.readyState >= 2) {
        // HAVE_CURRENT_DATA or better
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use video time in milliseconds directly for matching with pose data
        const videoTimeMs = video.currentTime * 1000; // Convert seconds to milliseconds

        if (session.poseData && session.poseData.length > 0) {
          // Find the closest frame in poseData to the current video time
          let bestFrameIndex = 0;
          let minDiff = Infinity;

          for (let i = 0; i < session.poseData.length; i++) {
            // Now timestamp is already milliseconds from start, so we can compare directly
            const diff = Math.abs(session.poseData[i].timestamp - videoTimeMs);
            if (diff < minDiff) {
              minDiff = diff;
              bestFrameIndex = i;
            }
          }

          setCurrentFrame(bestFrameIndex);

          // Draw skeleton
          const landmarks = session.poseData[bestFrameIndex].landmarks;
          if (landmarks) {
            // Draw body skeleton with connectors
            drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
              color: '#FFFFFF',
              lineWidth: 5,
            });

            // Draw joint points
            for (const landmark of landmarks) {
              // Only draw visible landmarks
              if (landmark.visibility && landmark.visibility > 0.5) {
                ctx.beginPath();
                ctx.arc(
                  landmark.x * canvas.width,
                  landmark.y * canvas.height,
                  5, // smaller radius
                  0,
                  2 * Math.PI,
                );
                ctx.fillStyle = '#00A3FF'; // blue joints
                ctx.fill();
              }
            }

            // Draw head (larger circle at nose position)
            if (landmarks[0].visibility && landmarks[0].visibility > 0.7) {
              const nose = landmarks[0];
              ctx.beginPath();
              ctx.arc(
                nose.x * canvas.width,
                nose.y * canvas.height,
                15, // larger for head
                0,
                2 * Math.PI,
              );
              ctx.fillStyle = '#00A3FF';
              ctx.fill();
            }
          }
        }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (video) {
        video.pause();
        video.src = '';
      }
    };
  }, [session.id, session.poseData]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="app-container">
      <div className="video-container">
        {isLoading && <div>Loading video...</div>}
        {error && <div className="error">{error}</div>}
        <video
          ref={videoRef}
          width="640"
          height="480"
          controls
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="video-canvas"
          onClick={togglePlayPause}
        />
      </div>

      <div className="controls">
        <div className="pose-info">
          {session.poseData && session.poseData.length > 0 && (
            <span>
              Frame: {currentFrame + 1} / {session.poseData.length} | Time:{' '}
              {Math.round(session.poseData[currentFrame]?.timestamp || 0)}ms
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playback;
