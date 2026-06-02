import {
  HeroSection,
  TrendingSection,
  MoodSection,
  LocationSection,
  DirectorsSection,
  CtaSection,
} from "@/components/landing";

/**
 * Frame — Landing Page
 *
 * A cinematic movie discovery platform.
 * Composed of 6 immersive sections designed for
 * visual impact and storytelling.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrendingSection />
      <MoodSection />
      <LocationSection />
      <DirectorsSection />
      <CtaSection />
    </>
  );
}
