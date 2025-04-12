import { Alert, Badge, Button, Group, Stack, Text } from '@mantine/core';
import { Session } from '../../api/model/session';

export const SessionCard = ({ session }: { session: Session }) => {
  const { createdAt, description, name, durationMs } = session;
  return (
    <Alert title={name}>
      <Stack>
        <Group>
          {new Date(createdAt).toLocaleDateString()}
          <Badge size="sm"> {(durationMs / (1000 * 60)).toFixed(2)} min</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Button variant="light">Analyze</Button>
      </Stack>
    </Alert>
  );
};
