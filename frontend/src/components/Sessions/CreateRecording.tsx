import { useState } from 'react';
import {
  Alert,
  Text,
  Button,
  Transition,
  Box,
  TextInput,
  Textarea,
  Paper,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconVideo,
  IconArrowRight,
  IconEdit,
  IconNotes,
} from '@tabler/icons-react';
import './Sessions.css';
import { useSessionControllerCreate } from '../../api/sessions/sessions';

export const CreateSessionComponent = ({ first }: { first: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const { mutateAsync: createSessionApi } = useSessionControllerCreate();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateSession = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!sessionName) {
      setError('Session name is required');
      return;
    }

    createSessionApi({
      data: {
        description: sessionDescription,
        name: sessionName,
      },
    }).then((data) => {
      navigate(`/record/${data.id}`);
    });
  };
  return (
    <Box
      style={{
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <Text fw={700} ta="center" fz={60} my={0}>
        Create Your <span>{first && "First" }</span> Recording
      </Text>
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {error && <Text c="red">{error}</Text>}
          <TextInput
            label="Session Name"
            placeholder="Enter a name for your session"
            value={sessionName}
            onChange={(event) => setSessionName(event.currentTarget.value)}
            leftSection={<IconEdit size={16} />}
            required
          />

          <Textarea
            label="Session Description"
            placeholder="Enter a brief description of what you'll be recording"
            value={sessionDescription}
            onChange={(event) =>
              setSessionDescription(event.currentTarget.value)
            }
            leftSection={<IconNotes size={16} />}
          />
        </div>
      </Paper>

      <Box
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 0',
        }}
      >
        <Transition
          mounted={true}
          transition="pop"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Button
              component={Link}
              to="/record"
              size="xl"
              radius="xl"
              style={{
                ...styles,

                position: 'relative',
                overflow: 'hidden',

                transform: isHovered ? 'translateY(-4px)' : 'none',
                transition: 'all 0.3s ease',
              }}
              onClick={handleCreateSession}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <IconVideo size={28} stroke={1.5} />
                <Text size="xl" c="white">
                  Record Now
                </Text>
                <Transition
                  mounted={isHovered}
                  transition="slide-left"
                  duration={200}
                >
                  {(styles) => <IconArrowRight style={styles} size={24} />}
                </Transition>
              </Box>
            </Button>
          )}
        </Transition>
      </Box>

      <Alert
        title="No previous sessions"
        color="gray"
        radius="md"
        style={{
          width: '100%',
          maxWidth: '600px',
          border: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Text size="sm" ta="center">
            You haven't recorded any presentation sessions yet. Start your
            journey by recording your first presentation or try a demo session.
          </Text>
        </div>
      </Alert>
    </Box>
  );
};
