import { ActionIcon, Card, Group, Switch, Text } from '@mantine/core';
import {
  IconManFilled,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconVideo,
} from '@tabler/icons-react';
import { PlayState } from './TimeTracker';
import { formatTime } from './timeUtils';

interface ControllsProps {
  play: () => void;
  pause: () => void;
  state: PlayState;
  timeMs: number;
  overlay: boolean;
  setOverlay: (arg: boolean) => void;
}

export const Controlls = ({
  pause,
  play,
  state,
  timeMs,
  overlay,
  setOverlay,
}: ControllsProps) => {
  return (
    <Card
      withBorder
      style={{}}
      radius="1rem"
      w=""
      pos="absolute"
      bottom={10}
      shadow="sm"
    >
      <Group justify="space-between">
        <Group>
          <ActionIcon
            onClick={play}
            disabled={state == 'playing'}
            variant="light"
            size="lg"
          >
            <IconPlayerPlayFilled size={24} />
          </ActionIcon>
          <Text fw="bold">{formatTime(timeMs)}</Text>
          <ActionIcon
            onClick={pause}
            disabled={state == 'paused'}
            variant="light"
            size="lg"
          >
            <IconPlayerPauseFilled size={24} />
          </ActionIcon>
        </Group>
        <Switch
          size="md"
          color="dark"
          checked={overlay} // Make sure 'overlay' is used for checked status
          onChange={(e) => setOverlay(e.currentTarget.checked)} // Set 'overlay' value based on the switch state
          offLabel={
            <IconVideo
              size={16}
              stroke={2.5}
              color="var(--mantine-color-blue-6)"
            />
          }
          onLabel={
            <IconManFilled
              size={16}
              stroke={2.5}
              color="var(--mantine-color-yellow-4)"
            />
          }
        />
      </Group>
    </Card>
  );
};
