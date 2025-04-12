import { Box } from '@mantine/core';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { FeaturesSection } from '../../components/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from '../../components/HowItWorksSection/HowItWorksSection';

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
        <FeaturesSection />
        <HowItWorksSection />
       
      </Box>
    </div>
  );
}

export default App;
