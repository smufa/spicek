import { Alert, Badge, Button, Group, Stack, Text } from '@mantine/core';
import { Session } from '../../api/model/session';
import { useNavigate } from 'react-router-dom';
import { IconVideo } from '@tabler/icons-react';

export const SessionCard = ({ session }: { session: Session }) => {
  const { createdAt, description, name, durationMs } = session;
  const icon = <IconVideo />;
  const navigate = useNavigate();
  return (
    <Alert title={name} icon={icon}  radius="md" p="lg" mb="md">
      <Stack>
      <Group>
          {new Date(createdAt).toLocaleDateString()}
          <Badge size="sm"> {(durationMs! / (1000 * 60)).toFixed(2)} min</Badge>
        </Group>
        <Text size="sm" c="#696969">
          {description}
        </Text>
        <Group>
          <Button variant="light" onClick={
            () => {
              navigate(`/analyze/${session.id}`);
            }
          }>Analyze</Button>
          <Button
            variant="dark"
            onClick={() => {
              navigate(`/record/${session.id}`);
            }}
          >
            Record
          </Button>
        </Group>
      </Stack>
    </Alert>
  );
};
