import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { GreenImpactSection } from "@/components/sections/GreenImpactSection";
import { DownloadSection } from "@/components/sections/DownloadSection";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <HeroSection />
      <WhyChooseSection />
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="impact">
        <GreenImpactSection />
      </section>
      <DownloadSection />
      <Footer />
    </main>
  );
}
