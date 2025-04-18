import { Button, Container } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useSessionControllerCreate,
  useSessionControllerFindAll,
} from '../api/sessions/sessions';
import { SessionDrawer } from '../components/Sessions/SessionDrawer';
import Playback from './Playback';
// import Testing from './NEW/NewRecPage';
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
        <p>{JSON.stringify(session.ttsData)}</p>
        <p>{JSON.stringify(session.fillerDto)}</p>
        <p>{JSON.stringify(session.postureData)}</p>
        <Playback session={session} />
      </Container>
    );
  }

  return (
    <>
      {/* <SessionDrawer data={data || []} /> */}
      {/* <Testing session={session} /> */}
    </>
  );
};

export default MainTestingView;
