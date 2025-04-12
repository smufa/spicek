import { Box, Button, Center, Group, Paper, rem, RingProgress, Stack, Title, Text } from "@mantine/core";
import { IconCheck, IconPlayerPlay, IconRefresh, IconVideo, IconVideoOff } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Clean up on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Reset state
      setRecordingTime(0);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.controls = true;
        }

        setIsPreviewMode(true);
      };

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setIsPreviewMode(false);
    setRecordingTime(0);

    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.controls = false;
    }
  };

  const handleSubmit = () => {
    // In a real application, you would upload the video to your server here
    navigate("/analyze", {
      state: {
        videoUrl: recordedBlob ? URL.createObjectURL(recordedBlob) : null,
      },
    });
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Stack>
      <Group justify="center" align="flex-start">
        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="sm"
          style={{
            width: "100%",
            maxWidth: rem(500),
          }}
        >
          <Stack gap="md">
            <Title order={3} ta="center">
              Record Your Presentation
            </Title>

            <Center
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "450px",
                margin: "0 auto",
                aspectRatio: "4/3",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#1a1b1e",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted={isRecording}
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {!isRecording && !isPreviewMode && !recordedBlob && (
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <IconVideo size={48} color="#fff" opacity={0.8} />
                </Box>
              )}

              {isRecording && (
                <Box
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                  }}
                >
                  <Box
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#fa5252",
                      marginRight: 8,
                    }}
                  />
                  <Text size="sm" c="white">
                    {formatTime(recordingTime)}
                  </Text>
                </Box>
              )}
            </Center>

            <Group justify="center" gap="md">
              {!isPreviewMode ? (
                <Button
                  leftSection={
                    isRecording ? (
                      <IconVideoOff size={20} />
                    ) : (
                      <IconVideo size={20} />
                    )
                  }
                  color={isRecording ? "red" : "blue"}
                  onClick={isRecording ? stopRecording : startRecording}
                  radius="md"
                  size="md"
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              ) : (
                <>
                  <Button
                    leftSection={<IconPlayerPlay size={20} />}
                    color="blue"
                    onClick={handleSubmit}
                    radius="md"
                    size="md"
                  >
                    Submit Presentation
                  </Button>
                  <Button
                    leftSection={<IconRefresh size={20} />}
                    variant="outline"
                    onClick={resetRecording}
                    radius="md"
                    size="md"
                  >
                    Record Again
                  </Button>
                </>
              )}
            </Group>

            {isPreviewMode && (
              <Text size="sm" c="dimmed" ta="center">
                Review your recording before submitting or record again
              </Text>
            )}
          </Stack>
        </Paper>

        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="sm"
          style={{
            width: "100%",
            maxWidth: rem(500),
          }}
        >
          <Title order={3} mb="md">
            How It Works
          </Title>
          <Stack gap="md">
            <Group wrap="nowrap" align="flex-start">
              <RingProgress
                size={60}
                thickness={4}
                sections={[{ value: 100, color: "blue" }]}
                label={
                  <Center>
                    <IconVideo size={20} />
                  </Center>
                }
              />
              <div>
                <Text fw={500} size="lg">
                  Record Your Presentation
                </Text>
                <Text size="sm" c="dimmed">
                  Use the recording tool to capture your presentation. Speak
                  clearly and try to maintain good posture.
                </Text>
              </div>
            </Group>

            <Group wrap="nowrap" align="flex-start">
              <RingProgress
                size={60}
                thickness={4}
                sections={[{ value: 100, color: "green" }]}
                label={
                  <Center>
                    <IconCheck size={20} />
                  </Center>
                }
              />
              <div>
                <Text fw={500} size="lg">
                  Submit for Analysis
                </Text>
                <Text size="sm" c="dimmed">
                  Once you're satisfied with your recording, submit it for our
                  AI to analyze your speech patterns and body language.
                </Text>
              </div>
            </Group>

            <Group wrap="nowrap" align="flex-start">
              <RingProgress
                size={60}
                thickness={4}
                sections={[{ value: 100, color: "violet" }]}
                label={
                  <Center>
                    <IconPlayerPlay size={20} />
                  </Center>
                }
              />
              <div>
                <Text fw={500} size="lg">
                  Review Detailed Feedback
                </Text>
                <Text size="sm" c="dimmed">
                  Receive comprehensive feedback on your presentation style,
                  including speech analysis and posture recommendations.
                </Text>
              </div>
            </Group>
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};
