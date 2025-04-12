import { Alert, Button, Drawer, LoadingOverlay, Stack } from '@mantine/core';
import { SessionCard } from '../SessionCards/SessionCard';
import { useDisclosure } from '@mantine/hooks';
import { useSessionControllerFindAll } from '../../api/sessions/sessions';
import { Link } from 'react-router-dom';

export const SessionDrawer = () => {
  const [opened, { close, toggle }] = useDisclosure(false);
  const { data, isLoading, error } = useSessionControllerFindAll();
  return (
    <>
      <Button onClick={toggle}>toggle drawer</Button>
      <Drawer
        opened={opened}
        onClose={close}
        title="Recorded sessions"
        size="md"
      >
        <Stack pos="relative">
          {isLoading && <LoadingOverlay />}
          {error && (
            <Alert c="red" title="Error">
              Error retreiving previous sessions
            </Alert>
          )}
          {data?.length == 0 && (
            <Alert title="No data">
              <Stack>
                <span>No previous sessions recorded.</span>
                <Button component={Link} to="/record">
                  Record now
                </Button>
              </Stack>
            </Alert>
          )}
          {data &&
            data.length > 0 &&
            data.map((session) => <SessionCard session={session} />)}
        </Stack>
      </Drawer>
    </>
  );
};
