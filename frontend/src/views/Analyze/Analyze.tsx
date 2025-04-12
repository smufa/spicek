import {
  Box,
  Center,
  Group,
  Paper,
  ScrollArea,
  Slider,
  Stack,
} from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { SessionDrawer } from '../../components/Sessions/SessionDrawer';
import { TextElement } from '../../components/TextComponent/TextElement';
import {
  fillerTokens,
  transcriptionTokens,
} from '../../components/TextComponent/dummy';
import VideoPlayer from '../../components/VideoTools/VideoPlayer';
import { useCallback, useRef } from 'react';
import useTimeManager from '../../components/VideoTools/TimeTracker';
import { Controlls } from '../../components/VideoTools/Controlls';

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
      <SessionDrawer />
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
              h={200}
              data={data}
              withYAxis={false}
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
