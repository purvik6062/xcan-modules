import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import LearningModulesSection from "../components/LearningModulesSection";
import YouTubeVideoSection from "../components/YouTubeVideoSection";
import FeaturedChallengesSection from "../components/FeaturedChallengesSection";
import WhyChooseSection from "../components/WhyChooseSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <HeroSection />
        <StatsSection />
        <LearningModulesSection />
        <YouTubeVideoSection />
        <FeaturedChallengesSection />
        <WhyChooseSection />
      </main>
    </div>
  );
}
