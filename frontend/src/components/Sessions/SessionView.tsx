import {
  Alert,
  Button,
  Card,
  Center,
  LoadingOverlay,
  SimpleGrid,
  Stack,
} from '@mantine/core';

import { SessionCard } from '../SessionCards/SessionCard';
import { useSessionControllerFindAll } from '../../api/sessions/sessions';
import { CreateSessionComponent } from './CreateRecording';
import { useState } from 'react';

export const SessionView = () => {
  const { data, isLoading, error } = useSessionControllerFindAll();

  const [createNew, setCreateNew] = useState(false);

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error.message}
      </Alert>
    );
  }

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      {(data?.length ?? 0) > 0 && !createNew && (
        <Card withBorder shadow="xl">
          <Center h="100%">
            <Button
              onClick={() => setCreateNew(true)}
              variant="gradient"
              size="xl"
            >
              Create New Session
            </Button>
          </Center>
        </Card>
      )}

      {(data?.length == 0 || createNew) && (
        <CreateSessionComponent first={!createNew} />
      )}

      <SimpleGrid pos="relative" style={{ width: '100%' }} p={80} cols={3}>
        {data &&
          !createNew &&
          data.length > 0 &&
          data.map((session) => <SessionCard session={session} />)}
      </SimpleGrid>
    </Stack>
  );
};
