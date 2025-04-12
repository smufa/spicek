import { ActionIcon, Card, Group, Text } from '@mantine/core';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { PlayState } from './TimeTracker';
import { formatTime } from './timeUtils';

interface ControllsProps {
  play: () => void;
  pause: () => void;
  state: PlayState;
  timeMs: number;
}

export const Controlls = ({ pause, play, state, timeMs }: ControllsProps) => {
  return (
    <div>
      <Card withBorder style={{}} radius="5rem" w="">
        <Group w="fit">
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
      </Card>
    </div>
  );
};
