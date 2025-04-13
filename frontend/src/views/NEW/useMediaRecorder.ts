import { useState, useRef } from 'react';

interface UseMediaRecorderResult {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export function useMediaRecorder(
  canvasRef: React.RefObject<HTMLMediaElement | null>,
  onRecordingComplete: (videoBlob: Blob) => void,
): UseMediaRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    if (!canvasRef.current) return;
    try {
      // Get audio stream with minimal processing
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Capture the canvas stream (video only)
      //@ts-expect-error asd
      const videoStream = canvasRef.current.captureStream();
      // Combine video and audio tracks
      const combinedTracks = [
        ...videoStream.getVideoTracks(),
        ...audioStreamRef.current.getAudioTracks(),
      ];
      streamRef.current = new MediaStream(combinedTracks);

      // Reset recorded chunks
      recordedChunksRef.current = [];
      recorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm; codecs=vp9',
      });

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      // When recording stops, combine blobs and notify via callback
      recorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        onRecordingComplete(videoBlob);
        recordedChunksRef.current = [];
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;
    recorderRef.current.stop();
    setIsRecording(false);
    // Stop audio tracks to clean up
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return { isRecording, startRecording, stopRecording };
}
