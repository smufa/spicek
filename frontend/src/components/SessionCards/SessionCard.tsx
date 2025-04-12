import { Alert, Badge, Button, Group, Stack } from '@mantine/core';

interface SessCard {
  created: Date;
  title: string;
  duration: number;
}

export const SessionCard = ({ created, duration, title }: SessCard) => {
  return (
    <Alert title={title}>
      <Stack>
        <Group>
          {new Date(created).toLocaleDateString()}
          <Badge size="sm"> {(duration / 60).toFixed(2)} min</Badge>
        </Group>
        <Button variant="light">Analyze</Button>
      </Stack>
    </Alert>
  );
};
