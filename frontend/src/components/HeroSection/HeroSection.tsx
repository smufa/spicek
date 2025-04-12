import { ArrowRight } from "lucide-react";
import { Button, Title, Text, Container, rem } from "@mantine/core";
import "./HeroSection.css";

export function HeroSection() {
  return (
    <Container size="xl" px="md" className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-content">
          <Title component="h1" className="hero-title" size={48}>
            Master Your{" "}
            <span className="hero-highlight">Presentation Skills</span> with AI
          </Title>

          <Text className="hero-description" m="lg" mx={50} size="lg">
            Our AI-powered tool analyzes your speech, body language, and
            delivery to give you personalized feedback. Record your practice
            sessions and get actionable insights to become a more confident and
            effective speaker.
          </Text>

          <div className="hero-buttons">
            <Button
              component="a"
              href="#record"
              size="lg"
              rightSection={
                <ArrowRight style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Start
            </Button>

            <Button
              component="a"
              href="#how-it-works"
              variant="outline"
              size="lg"
            >
              More info
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
