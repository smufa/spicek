import { Alert, Button, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { Session } from '../../api/model';
import { SessionCard } from '../SessionCards/SessionCard';

type Props = {
  data: Session[];
};

export const SessionDrawer = ({ data }: Props) => {
  const [opened, { close, toggle }] = useDisclosure(false);
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
