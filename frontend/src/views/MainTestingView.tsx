import { Button, Container } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useSessionControllerCreate,
  useSessionControllerFindAll,
} from '../api/sessions/sessions';
import { SessionDrawer } from '../components/Sessions/SessionDrawer';
import Testing from './Testing';
import { Box } from 'lucide-react';
import Playback from './Playback';

const MainTestingView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    refetch: refetchSessions,
  } = useSessionControllerFindAll();

  const { mutateAsync: createSessionApi } = useSessionControllerCreate();

  const createDumySession = async () => {
    createSessionApi({
      data: {
        description: 'test',
        name: 'test',
      },
    }).then((data) => {
      navigate(`/main/${data.id}`);
      refetchSessions();
    });
  };

  if (isLoading) {
    // TODO
    return <div>Loading...</div>;
  }

  if (!data || error) {
    // TODO
    return <div>Error</div>;
  }

  if ((data || []).length === 0) {
    return (
      <Container>
        <h1>No sessions recorded</h1>
        <p>Create a sessions pls </p>
        <Button onClick={createDumySession}>Create Dummy Session</Button>
      </Container>
    );
  }

  const session = data?.find((session) => session.id === Number(sessionId));

  if (!session) {
    navigate(`/main/${data[0].id}`);

    return <div>Redirecting...</div>;
  }

  if (session.videoFileName) {
    // TODO: Analyyze video

    return (
      <Container>
        <SessionDrawer data={data || []} />
        <h1>Session {session.name}</h1>
        <p>{session.description}</p>
        <p>{session.videoFileName}</p>
        <p>{session.durationMs}</p>
        <Playback session={session} />
      </Container>
    );
  }

  return (
    <>
      <SessionDrawer data={data || []} />
      <Testing session={session} />
    </>
  );
};

export default MainTestingView;
