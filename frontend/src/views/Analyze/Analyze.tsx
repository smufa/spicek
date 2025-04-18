import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Slider,
  Stack,
} from '@mantine/core';
import {
  IconChevronCompactLeft,
  IconManFilled,
  IconTextScan2,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const {
    data,
    refetch,
    isLoading: isLoadingStats,
  } = useSessionControllerFindOne(searchParams.id || '');

  const videoRef = useRef<HTMLVideoElement>(null);
  const { time, setTime, pause, play, seek, playState } =
    useTimeManager(videoRef);

  const setTimeCb = useCallback(
    (timeMs: number) => {
      seek(timeMs);
    },
    [seek],
  );

  // run use effect every 30 ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (playState === 'playing') {
        setTime((videoRef.current?.currentTime || 0) * 1000 || 0);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [time, setTime, playState]);

  const convertedDisfluency =
    (data?.fillerDto?.disfluency &&
      convertDisfluency(data.fillerDto.disfluency)) ||
    [];

  // Set up polling only once on mount
  useEffect(() => {
    if (!data) return;

    if (!data.fillerDto) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [data]); // Empty dependency array = run once

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigate = useNavigate();

  if (!data || !data.fillerDto) {
    return (
      <Center h="100vh" w={'100%'}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  return (
    <Stack
      h="100vh"
      style={{
        overflow: 'hidden',
      }}
    >
      <ActionIcon
        pos="absolute"
        top={10}
        right={10}
        size="lg"
        variant="subtle"
        onClick={() => {
          navigate('/sessions');
        }}
      >
        <IconChevronCompactLeft />
      </ActionIcon>

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
            <Stack h="100%" pos="relative">
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
                onChange={(newTime) => {
                  setTimeCb(newTime);
                }}
                max={parseInt(data?.durationMs as unknown as string) || 0}
                step={100} // Add step for smoother updates
                onChangeEnd={(newTime) => {
                  // This ensures the final position is set when sliding ends
                  setTimeCb(newTime);
                }}
              />
            </Box>
            <Chart session={data} />
          </Paper>
        </Group>
      </Stack>
    </Stack>
  );
};
