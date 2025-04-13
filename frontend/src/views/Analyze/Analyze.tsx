import {
  Box,
  Center,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Slider,
  Stack,
} from '@mantine/core';
import { IconManFilled, IconTextScan2 } from '@tabler/icons-react';
import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { StatsRing } from '../../components/Stats/StatRing';
import { TextElement } from '../../components/TextComponent/TextElement';
import { Controlls } from '../../components/VideoTools/Controlls';
import useTimeManager from '../../components/VideoTools/TimeTracker';
import {
  useSessionControllerFindOne,
  useSessionControllerGetSessionVideo,
} from '../../api/sessions/sessions';
import { convertDisfluency } from '../../components/TextComponent/convUtils';
import VideoPlayer from '../../components/VideoTools/VideoPlayer';
import Chart from './Chart';

export const Analyze = () => {
  const searchParams = useParams();

  // const { data: videoUrl, isLoading: isLoadingVideo } =useSessionControllerGetSessionVideo(searchParams.id || '');
  const { data, isLoading: isLoadingStats } = useSessionControllerFindOne(
    searchParams.id || '',
  );

  const { data: videoURL, isLoading: loadingURL } =
    useSessionControllerGetSessionVideo(searchParams.id || '');

  const videoRef = useRef<HTMLVideoElement>(null);
  // Use the custom hook, passing the video ref.
  const { time, pause, play, seek, playState } = useTimeManager(videoRef);

  // Handler to skip ahead by 5 seconds.
  const setTimeCb = useCallback(
    (timeMs: number) => {
      seek(timeMs); // Increase current time by 5000 milliseconds.
    },
    [seek],
  );

  const convertedDisfluency =
    (data?.fillerDto?.disfluency &&
      convertDisfluency(data.fillerDto.disfluency)) ||
    [];

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Stack
      h="100vh"
      style={{
        overflow: 'hidden',
      }}
    >
      <LoadingOverlay visible={isLoadingStats || loadingURL} />
      <Stack
        h="100%"
        p="md"
        m="0"
        style={{
          overflow: 'hidden',
        }}
      >
        <Group
          w="100%"
          h="100%"
          gap="xl"
          style={{
            overflow: 'hidden',
          }}
        >
          <Center h="100%">
            <Stack h="100%">
              <VideoPlayer
                videoRef={videoRef}
                url={`${import.meta.env.VITE_BACKEND_API}/sessions/${searchParams.id}/video`}
                // url={`/video.mp4`}
              />
              <Controlls
                pause={pause}
                play={play}
                state={playState}
                timeMs={time}
              />
            </Stack>
          </Center>
          <Stack h="100%" flex={1}>
            <StatsRing
              data={[
                {
                  color: 'lime',
                  icon: <IconManFilled size={25} />,
                  label: 'Posture alerts',
                  // progress: 32,
                  stats: data?.postureData.length.toString() || '/',
                },
                // {
                //   color: 'dark',
                //   icon: <IconClockBolt size={20}></IconClockBolt>,
                //   label: 'Cadence match',
                //   progress: 18,
                //   stats: '55',
                // },
                {
                  color: 'lime',
                  icon: <IconTextScan2 size={20} />,
                  label: 'Filler words',
                  // progress: 32,
                  stats: convertedDisfluency.length.toString(),
                },
              ]}
            />
            <Paper flex={4} h="100%" withBorder p="md">
              <ScrollArea h="100%" type="always">
                {/* <Box h="350vh"></Box> */}
                {data && (
                  <TextElement
                    fillers={convertedDisfluency}
                    tokens={data?.ttsData?.tokens || []}
                    setTime={setTimeCb}
                    timeMs={time}
                  />
                )}
              </ScrollArea>
            </Paper>
          </Stack>
        </Group>
        <Group w="100%" gap="xl">
          <Paper w="100%">
            <Box pb="xl">
              <Slider
                w="100%"
                value={time}
                onChange={(time) => {
                  setTimeCb(time);
                }}
                max={parseInt(data?.durationMs as unknown as string) || 0}
              />
            </Box>
            {/* <LineChart
              w="100%"
              h={150}
              data={datac}
              withYAxis={false}
              withXAxis={false}
              dataKey="date"
              strokeWidth={4}
              series={[
                { name: 'Apples', color: 'indigo.6' },
                // { name: 'Oranges', color: 'blue.6' },
                // { name: 'Tomatoes', color: 'teal.6' },
              ]}
              curveType="linear"
            /> */}

            <Chart session={data} />
          </Paper>
        </Group>
      </Stack>
    </Stack>
  );
};
