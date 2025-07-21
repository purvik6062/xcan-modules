import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import LearningModulesSection from "../components/LearningModulesSection";
import FeaturedChallengesSection from "../components/FeaturedChallengesSection";
import WhyChooseSection from "../components/WhyChooseSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <LearningModulesSection />
        <FeaturedChallengesSection />
        <WhyChooseSection />
      </main>
    </div>
  );
}
