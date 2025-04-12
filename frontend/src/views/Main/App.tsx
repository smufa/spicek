import { Button, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <Stack>
      <Group>
        <Button
          onClick={() => {
            navigate('/record');
          }}
        >
          Record
        </Button>
        <Button
          onClick={() => {
            navigate('/analyze');
          }}
        >
          Analyze
        </Button>
      </Group>
    </Stack>
  );
}

export default App;
