import { Alert, Button, LoadingOverlay, Stack } from '@mantine/core';

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
    <Stack pos="relative" style={{ width: '100%' }} p={80}>
      <LoadingOverlay visible={isLoading} />
      {(data?.length ?? 0) > 0 && !createNew && (
        <Button onClick={() => setCreateNew(true)}>Create New Session</Button>
      )}
      {data?.length == 0 || createNew ? (
        <CreateSessionComponent first={!createNew} />
      ) : (
        data &&
        data.length > 0 &&
        data.map((session) => <SessionCard session={session} />)
      )}
    </Stack>
  );
};
