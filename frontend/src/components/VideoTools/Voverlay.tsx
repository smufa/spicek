import React, { useRef, useEffect } from 'react';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

export type PoseFrameDto = {
  timestamp: number;
  landmarks: {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }[];
};

type VideoPoseOverlayProps = {
  url: string;
  poses: PoseFrameDto[];
  overlay: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
};

const VideoPoseOverlay: React.FC<VideoPoseOverlayProps> = ({
  url,
  poses,
  overlay,
  videoRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!video.paused && !video.ended && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sync pose with video timestamp
        const currentTimeMs = video.currentTime * 1000;
        const nearest = poses.findLast((p) => p.timestamp <= currentTimeMs);
        if (nearest) {
          drawConnectors(ctx, nearest.landmarks, POSE_CONNECTIONS, {
            color: '#FFFFFF',
            lineWidth: 5,
          });

          for (const lm of nearest.landmarks) {
            if (lm.visibility === undefined || lm.visibility > 0.5) {
              ctx.beginPath();
              ctx.arc(
                lm.x * canvas.width,
                lm.y * canvas.height,
                5,
                0,
                2 * Math.PI,
              );
              ctx.fillStyle = '#00A3FF';
              ctx.fill();
            }
          }

          // Draw larger circle for nose (landmark 0)
          const nose = nearest.landmarks[0];
          if (nose?.visibility === undefined || nose.visibility > 0.7) {
            ctx.beginPath();
            ctx.arc(
              nose.x * canvas.width,
              nose.y * canvas.height,
              15,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle = '#00A3FF';
            ctx.fill();
          }
        }
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    const onPlay = () => {
      render();
    };

    video.addEventListener('play', onPlay);
    return () => {
      video.removeEventListener('play', onPlay);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [poses]);

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <video
        ref={videoRef}
        src={url}
        controls={false}
        style={{ display: 'block' }}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        style={{
          display: overlay ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default VideoPoseOverlay;
