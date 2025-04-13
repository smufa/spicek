import { LineChart } from '@mantine/charts';
import {
  Box,
  Center,
  Group,
  Paper,
  ScrollArea,
  Slider,
  Stack,
} from '@mantine/core';
import {
  IconClockBolt,
  IconManFilled,
  IconTextScan2,
} from '@tabler/icons-react';
import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { StatsRing } from '../../components/Stats/StatRing';
import { TextElement } from '../../components/TextComponent/TextElement';
import {
  fillerTokens,
  transcriptionTokens,
} from '../../components/TextComponent/dummy';
import { Controlls } from '../../components/VideoTools/Controlls';
import useTimeManager from '../../components/VideoTools/TimeTracker';
import VideoPlayer from '../../components/VideoTools/VideoPlayer';

const data = [
  {
    date: 'Mar 22',
    Apples: 2890,
    Oranges: 2338,
    Tomatoes: 2452,
  },
  {
    date: 'Mar 23',
    Apples: 2756,
    Oranges: 2103,
    Tomatoes: 2402,
  },
  {
    date: 'Mar 24',
    Apples: 3322,
    Oranges: 986,
    Tomatoes: 1821,
  },
  {
    date: 'Mar 25',
    Apples: 3470,
    Oranges: 2108,
    Tomatoes: 2809,
  },
  {
    date: 'Mar 26',
    Apples: 3129,
    Oranges: 1726,
    Tomatoes: 2290,
  },
];

export const Analyze = () => {
  const searchParams = useParams();
  console.log(searchParams.id);

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

  return (
    <Stack
      h="100vh"
      style={{
        overflow: 'hidden',
      }}
    >
      {/* <SessionDrawer /> */}
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
              <VideoPlayer videoRef={videoRef} />
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
                  stats: '55',
                },
                {
                  color: 'dark',
                  icon: <IconClockBolt size={20}></IconClockBolt>,
                  label: 'Cadence match',
                  progress: 18,
                  stats: '55',
                },
                {
                  color: 'lime',
                  icon: <IconTextScan2 size={20} />,
                  label: 'Filler words',
                  // progress: 32,
                  stats: '55',
                },
              ]}
            />
            <Paper flex={4} h="100%" withBorder p="md">
              <ScrollArea h="100%" type="always">
                {/* <Box h="350vh"></Box> */}
                <TextElement
                  fillers={fillerTokens}
                  tokens={transcriptionTokens}
                  setTime={setTimeCb}
                  timeMs={time}
                />
              </ScrollArea>
            </Paper>
          </Stack>
        </Group>
        <Group w="100%" gap="xl">
          <Paper w="100%">
            <Box pb="xl">
              <Slider
                marks={fillerTokens.map((token) => ({
                  value: (token.timeFromMs + token.timeToMs) / 2.0,
                  label: token.fillerType,
                }))}
                w="100%"
                value={time}
                onChange={(time) => {
                  setTimeCb(time);
                }}
                max={4000}
              />
            </Box>
            <LineChart
              w="100%"
              h={150}
              data={data}
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
            />
          </Paper>
        </Group>
      </Stack>
    </Stack>
  );
};
