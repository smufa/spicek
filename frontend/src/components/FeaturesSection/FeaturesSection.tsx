import type React from "react"
import { Container, Title, Text, SimpleGrid, ThemeIcon, rem } from "@mantine/core"
import { Mic, BarChart2, Brain, Video } from "lucide-react"
import "./FeaturesSection.css"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="feature-item">
      <ThemeIcon size={60} radius="md" className="feature-icon">
        {icon}
      </ThemeIcon>

      <Text fw={700} fz="lg" mt="md" className="feature-title">
        {title}
      </Text>

      <Text c="#696969" fz="md" className="feature-description">
        {description}
      </Text>
    </div>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Mic style={{ width: rem(24), height: rem(24) }} />,
      title: "Speech Analysis",
      description:
        "Get detailed feedback on your speaking pace, clarity, filler words, and vocal variety to improve your verbal delivery.",
    },
    {
      icon: <Video style={{ width: rem(24), height: rem(24) }} />,
      title: "Posture Detection",
      description:
        "Our AI analyzes your body language, gestures, and eye contact to help you present with confidence and authority.",
    },
    {
      icon: <BarChart2 style={{ width: rem(24), height: rem(24) }} />,
      title: "Progress Tracking",
      description:
        "Track your improvement over time with detailed metrics and visualizations of your presentation skills development.",
    },
    {
      icon: <Brain style={{ width: rem(24), height: rem(24) }} />,
      title: "AI Recommendations",
      description:
        "Receive personalized tips and actionable advice tailored to your specific presentation style and goals.",
    },
  ]

  return (
    <Container size="xl" py={80} id="features" className="features-section" mx={50}>
      <Title ta="center" className="section-title">
        Key Features That <span className="features-highlight">Transform</span> Your Presentations
      </Title>

      <Text c="#696969" ta="center" fz="lg" mx="auto" mt="md" maw={700}>
        Our comprehensive toolkit provides everything you need to elevate your presentation skills from good to
        exceptional.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={50} mt={50}>
        {features.map((feature, index) => (
          <Feature {...feature} key={index} />
        ))}
      </SimpleGrid>
    </Container>
  )
}
