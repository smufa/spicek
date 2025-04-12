import {
  Container,
  Title,
  Text,
  Timeline,
  rem,
  Card,
  Group,
} from '@mantine/core';
import { Video, MessageSquare, BarChart, Award } from 'lucide-react';
import './HowItWorksSection.css';


export function HowItWorksSection() {
  return (
    <Container
      size="xl"
      py={80}
      m={0}
      id="how-it-works"
      className="how-it-works-section"
    >
      <Title ta="center" className="section-title">
        How It <span className="how-highlight">Works</span>
      </Title>

      <Text c="#696969" ta="center" fz="lg" mx="auto" mt="md" maw={700} mb={50}>
        Our simple four-step process helps you transform your presentation
        skills with minimal effort
      </Text>

      <Card withBorder radius="md" p="xl" className="timeline-card">
        <Timeline active={4} bulletSize={30} lineWidth={2} >
          <Timeline.Item
            bullet={<Video style={{ width: rem(18), height: rem(18) }} />}
            title="Record Your Practice"
            color="red.6"
          >
            <Text c="#696969" fz="md">
              Use our platform to record yourself delivering your presentation.
              You can use your webcam or upload an existing video.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<BarChart style={{ width: rem(18), height: rem(18) }} />}
            title="AI Analysis"
            color="indigo.6"
          >
            <Text c="#696969" fz="md">
              Our AI engine analyzes your speech patterns, vocal qualities, body
              language, and overall delivery to identify strengths and areas for
              improvement.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={
              <MessageSquare style={{ width: rem(18), height: rem(18) }} />
            }
            title="Receive Feedback"
            color="teal.6"
          >
            <Text c="#696969" fz="md">
              Get detailed, actionable feedback on specific aspects of your
              presentation, including speaking pace, filler words, posture,
              gestures, and eye contact.
            </Text>

            <Group mt="md" mb="md">
              <div className="feedback-example">
                <Text fw={500} fz="sm">
                  Speech Analysis
                </Text>
                <Text fz="xs" c="#696969">
                  Speaking pace, clarity, vocal variety
                </Text>
              </div>

              <div className="feedback-example">
                <Text fw={500} fz="sm">
                  Posture Analysis
                </Text>
                <Text fz="xs" c="#696969">
                  Body language, gestures, movement
                </Text>
              </div>
            </Group>
          </Timeline.Item>

          <Timeline.Item
            bullet={<Award style={{ width: rem(18), height: rem(18) }} />}
            title="Practice & Improve"
            color='green.6'
          >
            <Text c="#696969" fz="md">
              Apply the personalized recommendations, practice again, and track
              your improvement over time. Continue refining your skills until
              you become a confident, compelling presenter.
            </Text>
          </Timeline.Item>
        </Timeline>
      </Card>
    </Container>
  );
}
