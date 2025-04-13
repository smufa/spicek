import { useRef, useState, useEffect } from 'react';
import { usePoseEstimation } from './usePoseEstimation';
import { useMediaRecorder } from './useMediaRecorder';
import {
  useSessionControllerUploadVideo,
  useSessionControllerUploadData,
} from '../../api/sessions/sessions';
import VideoContainer from './VideoContainer';
import { Session } from '../../api/model/session';

type Props = {
  session: Session;
};

const Testing = ({ session }: Props) => {
  // Refs for pose data management
  const poseData = useRef<{ timestamp: number; landmarks: any }[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  // Flag to indicate if pose data is being collected
  const isCollectingPoseData = useRef(false);

  // State to hold the recorded video blob and preview URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // API hooks for uploading video and pose data
  const { mutateAsync: uploadVideoApi } = useSessionControllerUploadVideo();
  const { mutateAsync: uploadDataApi } = useSessionControllerUploadData();
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initialize the pose estimation hook (with the added isLoading flag)
  const { videoRef, canvasRef, displayCanvasRef, isLoading } =
    usePoseEstimation({
      isCollectingPoseData,
      poseData,
      recordingStartTimeRef,
    });

  const { isRecording, startRecording, stopRecording } = useMediaRecorder(
    displayCanvasRef,
    async (videoBlob: Blob) => {
      const url = URL.createObjectURL(videoBlob);
      setPreviewUrl(url); // Save preview URL
      setUploadStatus('Preview ready. You can now submit.');
      setIsUploading(false);
    },
  );

  // Handler for starting/stopping the recording.
  const handleRecording = async () => {
    // If recording is in progress, stop it.
    if (isRecording) {
      stopRecording();
    } else {
      // Reset pose data and preview
      poseData.current = [];
      setUploadStatus('');
      setPreviewUrl(null);
      // Set the recording start time and enable pose data collection.
      recordingStartTimeRef.current = Date.now();
      isCollectingPoseData.current = true;
      await startRecording();
    }
  };

  const handleSubmit = async () => {
    if (!previewUrl) return;
    setIsUploading(true);
    setUploadStatus('Uploading...');

    const response = await fetch(previewUrl);
    const videoBlob = await response.blob();

    try {
      await uploadVideoApi({
        id: session.id.toString(),
        data: { video: videoBlob },
      });
      await uploadDataApi({
        id: session.id.toString(),
        data: { poseData: poseData.current },
      });
      setUploadStatus('Upload successful');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed');
    } finally {
      setIsUploading(false);
      isCollectingPoseData.current = false;
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    poseData.current = [];
    setUploadStatus('');
  };

  // Optionally, revoke the preview URL to free resources when component unmounts or the URL changes.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="app-container">
      {isLoading && <div className="loading-indicator">Loading model...</div>}
      <VideoContainer
        videoRef={videoRef}
        canvasRef={canvasRef}
        displayCanvasRef={displayCanvasRef}
      />

      <div className="controls">
        <button
          onClick={handleRecording}
          className={isRecording ? 'stop' : 'start'}
          disabled={isUploading || isLoading}
        >
          {isRecording ? 'Stop Recording' : 'Record'}
        </button>

        {previewUrl && (
          <div className="preview-section">
            <video
              controls
              src={previewUrl}
              width="640"
              height="480"
              style={{ marginTop: '1rem' }}
            />
            <div className="preview-buttons" style={{ marginTop: '1rem' }}>
              <button onClick={handleSubmit} disabled={isUploading}>
                Submit
              </button>
              <button onClick={handleReset} disabled={isUploading}>
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="pose-data-info">
          {isCollectingPoseData.current ? (
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
