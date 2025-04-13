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
import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StatsRing } from '../../components/Stats/StatRing';
import { TextElement } from '../../components/TextComponent/TextElement';
import { Controlls } from '../../components/VideoTools/Controlls';
import useTimeManager from '../../components/VideoTools/TimeTracker';
import { useSessionControllerFindOne } from '../../api/sessions/sessions';
import { convertDisfluency } from '../../components/TextComponent/convUtils';
import Chart from './Chart';
import VideoPoseOverlay from '../../components/VideoTools/Voverlay';

export const Analyze = () => {
  const searchParams = useParams();
  const [overlay, setOverlay] = useState(true);

  const { data, isLoading: isLoadingStats } = useSessionControllerFindOne(
    searchParams.id || '',
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const { time, pause, play, seek, playState } = useTimeManager(videoRef);

  const setTimeCb = useCallback(
    (timeMs: number) => {
      seek(timeMs);
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
      <LoadingOverlay visible={isLoadingStats} />
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
              {data?.poseData && (
                <VideoPoseOverlay
                  videoRef={videoRef}
                  overlay={overlay}
                  poses={data?.poseData}
                  url={`${import.meta.env.VITE_BACKEND_API}/sessions/${searchParams.id}/video`}
                />
              )}
              <Controlls
                pause={pause}
                play={play}
                state={playState}
                timeMs={time}
                overlay={overlay}
                setOverlay={setOverlay}
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
                  stats: data?.postureData.length.toString() || '/',
                },
                {
                  color: 'lime',
                  icon: <IconTextScan2 size={20} />,
                  label: 'Filler words',
                  stats: convertedDisfluency.length.toString(),
                },
              ]}
            />
            <Paper flex={4} h="100%" withBorder p="md">
              <ScrollArea h="100%" type="always">
                {/* <Box h="350vh"></Box> */}
                {data?.ttsData?.tokens == undefined && (
                  <LoadingOverlay
                    visible
                    loaderProps={{
                      children:
                        'Full transcript analysis in progress... come back later',
                    }}
                  />
                )}
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
            <Chart session={data} />
          </Paper>
        </Group>
      </Stack>
    </Stack>
  );
};
