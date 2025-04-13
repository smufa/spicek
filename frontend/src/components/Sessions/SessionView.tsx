import {
  Alert,
  Button,
  LoadingOverlay,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { SessionCard } from '../SessionCards/SessionCard';
import {
  useSessionControllerCreate,
  useSessionControllerFindAll,
} from '../../api/sessions/sessions';

export const SessionView = () => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchSessions,
  } = useSessionControllerFindAll();

  console.log({ data });

  const { mutateAsync: createSessionApi } = useSessionControllerCreate();

  const createDumySession = async () => {
    createSessionApi({
      data: {
        description: 'test1',
        name: 'test',
      },
    }).then((data) => {
      // navigate(`/main/${data.id}`);
      refetchSessions();
    });
  };

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error.message}
      </Alert>
    );
  }

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <SimpleGrid cols={4}>
        {data?.length == 0 && (
          <Alert title="No data">
            <Stack>
              <span>No previous sessions recorded.</span>
              <Button onClick={createDumySession}></Button>
              <Button component={Link} to="/record">
                Record now
              </Button>
            </Stack>
          </Alert>
        )}
        {data &&
          data.length > 0 &&
          data.map((session) => <SessionCard session={session} />)}
      </SimpleGrid>
    </Stack>
  );
};
