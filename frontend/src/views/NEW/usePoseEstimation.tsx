import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import {
  Pose,
  Results,
  POSE_CONNECTIONS,
  NormalizedLandmarkList,
} from '@mediapipe/pose';
import { drawConnectors } from '@mediapipe/drawing_utils';

interface UsePoseEstimationParams {
  isCollectingPoseData: React.MutableRefObject<boolean>;
  poseData: React.MutableRefObject<
    { timestamp: number; landmarks: NormalizedLandmarkList }[]
  >;
  recordingStartTimeRef: React.MutableRefObject<number>;
}

export const usePoseEstimation = ({
  isCollectingPoseData,
  poseData,
  recordingStartTimeRef,
}: UsePoseEstimationParams) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !displayCanvasRef.current)
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const displayCtx = displayCanvas.getContext('2d');
    if (!ctx || !displayCtx) return;

    // Set up MediaPipe Pose
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results: Results) => {
      if (!ctx || !displayCtx) return;

      // Collect pose data if recording is active
      if (isCollectingPoseData.current && results.poseLandmarks) {
        const currentTime = Date.now();
        const millisFromStart = currentTime - recordingStartTimeRef.current;
        poseData.current.push({
          timestamp: millisFromStart,
          // Deep clone landmarks to avoid mutation issues
          landmarks: JSON.parse(JSON.stringify(results.poseLandmarks)),
        });
      }

      // Draw raw video frame to canvas (for recording; without skeleton)
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw video frame to display canvas (for preview; with skeleton)
      displayCtx.save();
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(
        results.image,
        0,
        0,
        displayCanvas.width,
        displayCanvas.height,
      );

      // Draw skeleton and joints if landmarks are available
      if (results.poseLandmarks) {
        drawConnectors(displayCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#FFFFFF',
          lineWidth: 5,
        });
        for (const landmark of results.poseLandmarks) {
          if (landmark.visibility && landmark.visibility > 0.5) {
            displayCtx.beginPath();
            displayCtx.arc(
              landmark.x * displayCanvas.width,
              landmark.y * displayCanvas.height,
              5, // small radius
              0,
              2 * Math.PI,
            );
            displayCtx.fillStyle = '#00A3FF';
            displayCtx.fill();
          }
        }
        // Special drawing: larger circle for head using the nose position
        if (
          results.poseLandmarks[0]?.visibility &&
          results.poseLandmarks[0].visibility > 0.7
        ) {
          const nose = results.poseLandmarks[0];
          displayCtx.beginPath();
          displayCtx.arc(
            nose.x * displayCanvas.width,
            nose.y * displayCanvas.height,
            15, // larger radius
            0,
            2 * Math.PI,
          );
          displayCtx.fillStyle = '#00A3FF';
          displayCtx.fill();
        }
      }
      displayCtx.restore();
    });

    // Set up camera and wait for it to start before clearing the loading flag
    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    // Start the camera; once started, the model is considered ready.
    camera
      .start()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Camera start failed:', err);
        setIsLoading(false);
      });

    // Cleanup when the component unmounts
    return () => {
      camera.stop();
      pose.close();
    };
  }, [isCollectingPoseData, poseData, recordingStartTimeRef]);

  return { videoRef, canvasRef, displayCanvasRef, isLoading };
};
