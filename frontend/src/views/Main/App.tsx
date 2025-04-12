import { Box } from '@mantine/core';
import { Record } from '../Record/Record';
import { HeroSection } from '../../components/HeroSection/HeroSection';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--mantine-spacing-xl)',
        }}
      >
        <HeroSection />
        <Record />
      </Box>
    </div>
  );
}

export default App;
