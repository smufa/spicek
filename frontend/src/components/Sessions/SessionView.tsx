import {
  Affix,
  Alert,
  Button,

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
        <Affix position={{ bottom: 20, right: 20 }} pr={60}>
         
            <Center h="100%">
              <Button onClick={() => setCreateNew(true)} size="xl">
                Create New Session
              </Button>
            </Center>
         
        </Affix>
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
