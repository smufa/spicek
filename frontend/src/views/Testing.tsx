import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors } from '@mediapipe/drawing_utils';

const Testing = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);

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
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
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

      // Draw video frame to the recording canvas (without skeleton)
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw video frame to the display canvas
      displayCtx.save();
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(
        results.image,
        0,
        0,
        displayCanvas.width,
        displayCanvas.height,
      );

      // Draw skeleton on display canvas only
      if (results.poseLandmarks) {
        // Draw body skeleton with connectors
        drawConnectors(displayCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#FFFFFF',
          lineWidth: 5,
        });

        // Draw joint points (making them smaller and subtler)
        for (const landmark of results.poseLandmarks) {
          // Only draw visible landmarks
          if (landmark.visibility && landmark.visibility > 0.5) {
            displayCtx.beginPath();
            displayCtx.arc(
              landmark.x * displayCanvas.width,
              landmark.y * displayCanvas.height,
              5, // smaller radius
              0,
              2 * Math.PI,
            );
            displayCtx.fillStyle = '#00A3FF'; // blue joints
            displayCtx.fill();
          }
        }

        // Draw head (larger circle at nose position)
        if (
          results.poseLandmarks[0].visibility &&
          results.poseLandmarks[0].visibility > 0.7
        ) {
          const nose = results.poseLandmarks[0];
          displayCtx.beginPath();
          displayCtx.arc(
            nose.x * displayCanvas.width,
            nose.y * displayCanvas.height,
            15, // larger for head
            0,
            2 * Math.PI,
          );
          displayCtx.fillStyle = '#00A3FF';
          displayCtx.fill();
        }
      }

      displayCtx.restore();
    });

    // Set up camera
    const camera = new Camera(video, {
      onFrame: async () => {
        if (isPoseDetectionActive) {
          await pose.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    // Clean up
    return () => {
      camera.stop();
      pose.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isPoseDetectionActive]);

  // Set up video recording with audio
  const startRecording = async () => {
    if (!canvasRef.current) return;

    try {
      // Get audio stream
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Get canvas stream (video without skeleton)
      const canvas = canvasRef.current;
      const videoStream = canvas.captureStream(30); // 30 FPS

      // Combine video and audio streams
      const combinedTracks = [
        ...videoStream.getVideoTracks(),
        ...audioStreamRef.current.getAudioTracks(),
      ];
      streamRef.current = new MediaStream(combinedTracks);

      recordedChunksRef.current = [];
      recorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm; codecs=vp9',
      });

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorderRef.current.onstop = () => {
        saveRecording();
      };

      recorderRef.current.start();
      setIsRecording(true);
      setIsPoseDetectionActive(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
      setIsRecording(false);

      // Stop audio tracks
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const saveRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.style.display = 'none';
    a.href = url;
    a.download = `pose-detection-${new Date().toISOString()}.webm`;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const togglePoseDetection = () => {
    setIsPoseDetectionActive(!isPoseDetectionActive);
  };

  return (
    <div className="app-container">
      <h1>Pose Detection with Video and Audio Recording</h1>

      <div className="video-container">
        <video
          ref={videoRef}
          style={{ display: 'none' }}
          width="640"
          height="480"
        />
        {/* Hidden canvas for recording (without skeleton) */}
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ display: 'none' }}
        />
        {/* Visible canvas for display (with skeleton) */}
        <canvas
          ref={displayCanvasRef}
          width="640"
          height="480"
          className="video-canvas"
        />
      </div>

      <div className="controls">
        <button onClick={togglePoseDetection} disabled={isRecording}>
          {isPoseDetectionActive ? 'Disable' : 'Enable'} Pose Detection
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'stop' : 'start'}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
};

export default Testing;
