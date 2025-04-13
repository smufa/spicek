import {
  Box,
  Button,
  Center,
  Group,
  Paper,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconRefresh,
  IconVideo,
  IconVideoOff,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import {
  useSessionControllerUploadData,
  useSessionControllerUploadVideo,
} from '../../api/sessions/sessions';
import { NotesEditor } from '../../components/NotesEditor/NotesEditor';
import { useMediaRecorder } from '../NEW/useMediaRecorder';
import { usePoseEstimation } from '../NEW/usePoseEstimation';
import VideoContainer from '../NEW/VideoContainer';
import { useNavigate, useParams } from 'react-router-dom';

export const Record = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
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
      // setUploadStatus('Preview ready. You can now submit.');
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
      // setUploadStatus('');
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
    if (!id) {
      return 'id not defined';
    }

    try {
      await uploadVideoApi({
        id: id.toString(),
        data: { video: videoBlob },
      });
      await uploadDataApi({
        id: id.toString(),
        data: { poseData: poseData.current },
      });
      setUploadStatus('Upload successful');
      navigate(`/analyze/${id}`);
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
    <Stack>
      <Group
        justify="center"
        align="flex-start"
        id="record"
        p={80}
        style={{ minWidth: '100%' }}
      >
        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="sm"
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
          }}
        >
          <Stack gap="md">
            <Title order={3} ta="center">
              Record Your Presentation
            </Title>

            <Center
              style={{
                position: 'relative',
                width: '100%',
                margin: '0 auto',
                aspectRatio: '4/3',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#1a1b1e',
              }}
            >
              {previewUrl ? (
                <div className="preview-section">
                  <video
                    controls
                    src={previewUrl}
                    width="640"
                    height="480"
                    style={{ marginTop: '1rem' }}
                  />
                </div>
              ) : (
                <VideoContainer
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  displayCanvasRef={displayCanvasRef}
                />
              )}

              {!isRecording && isLoading && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  <IconVideo size={48} color="#fff" opacity={0.8} />
                </Box>
              )}

              {isRecording && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                  }}
                >
                  <Box
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#fa5252',
                      marginRight: 8,
                    }}
                  />
                </Box>
              )}
              <Text size="sm" c="white">
                {uploadStatus}
              </Text>
            </Center>

            <Group justify="center" gap="md">
              {!isUploading && !previewUrl && (
                <Button
                  leftSection={
                    isRecording ? (
                      <IconVideoOff size={20} />
                    ) : (
                      <IconVideo size={20} />
                    )
                  }
                  color={isRecording ? 'red' : ''}
                  onClick={handleRecording}
                  radius="md"
                  size="md"
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              )}

              {previewUrl && (
                <>
                  <Button
                    leftSection={<IconPlayerPlay size={20} />}
                    onClick={handleSubmit}
                    radius="md"
                    size="md"
                  >
                    Submit Presentation
                  </Button>
                  <Button
                    leftSection={<IconRefresh size={20} />}
                    variant="outline"
                    onClick={handleReset}
                    radius="md"
                    size="md"
                  >
                    Record Again
                  </Button>
                </>
              )}
            </Group>

            {previewUrl && (
              <Text size="sm" c="dimmed" ta="center">
                Review your recording before submitting or record again
              </Text>
            )}
          </Stack>
        </Paper>
        <NotesEditor />
      </Group>
    </Stack>
  );
};
