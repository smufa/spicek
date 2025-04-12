import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import {
  Pose,
  Results,
  POSE_CONNECTIONS,
  NormalizedLandmarkList,
} from '@mediapipe/pose';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { Session } from '../api/model';
import {
  useSessionControllerUploadData,
  useSessionControllerUploadVideo,
} from '../api/sessions/sessions';

type Props = {
  session: Session;
};

const Testing = ({ session }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const poseData = useRef<
    { timestamp: number; landmarks: NormalizedLandmarkList }[]
  >([]);
  const isCollectingPoseData = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const { mutateAsync: uploadVideoApi } = useSessionControllerUploadVideo();
  const { mutateAsync: uploadDataApi } = useSessionControllerUploadData();

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

      // Collect pose data if recording
      if (isCollectingPoseData.current == true && results.poseLandmarks) {
        poseData.current.push({
          timestamp: Date.now(),
          landmarks: JSON.parse(JSON.stringify(results.poseLandmarks)),
        });
      }

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
        await pose.send({ image: video });
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
  }, []);

  // Set up video recording with audio
  const startRecording = async () => {
    if (!canvasRef.current) return;

    try {
      // Reset pose data array
      poseData.current = [];
      setUploadStatus('');

      // Start collecting pose data
      isCollectingPoseData.current = true;

      // Get audio stream with minimal processing
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

      // gets called in stopRecording
      recorderRef.current.onstop = () => {
        uploadRecording();
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setUploadStatus('Error starting recording');
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stop();
    setIsRecording(false);

    // Stop collecting pose data
    isCollectingPoseData.current = false;

    // Stop audio tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const uploadRecording = async () => {
    setIsUploading(true);
    setUploadStatus('Uploading...');

    // Create video blob
    const videoBlob = new Blob(recordedChunksRef.current, {
      type: 'video/webm',
    });

    // Get video size
    const videoSize = videoBlob.size;

    if (videoSize < 100) {
      console.error('Video size is too small:', videoSize);
      setIsUploading(false);

      return;
    }

    // Create form data to send
    const formData = new FormData();
    formData.append('video', videoBlob, `video.webm`);

    await uploadVideoApi({
      id: session.id.toString(),
      data: {
        video: videoBlob,
      },
    })
      .then(async () => {
        await uploadDataApi({
          id: session.id.toString(),
          data: {
            poseData: poseData.current,
          },
        });
        setUploadStatus('Upload successful');
      })
      .catch((error) => {
        console.error('Upload error:', error);
        setUploadStatus('Upload failed');
      })
      .finally(() => {
        // Clean up recorded chunks
        recordedChunksRef.current = [];
        isCollectingPoseData.current = false;
      });
  };

  return (
    <div className="app-container">
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
        <button
          onClick={() => {
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
          className={isRecording ? 'stop' : 'start'}
          disabled={isUploading}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <div className="pose-data-info">
          {isCollectingPoseData ? (
            <span>Recording pose data: {poseData.current.length} frames</span>
          ) : isUploading ? (
            <span>Uploading... Please wait.</span>
          ) : (
            uploadStatus && <span>{uploadStatus}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Testing;
