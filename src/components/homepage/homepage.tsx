import EcoImpact from './ecoImpact';
import Features from './features';
import Footer from './footer';
import Header from './header';
import Hero from './hero';
import HowItWorks from './how-it-works';
import Testimonials from './testimonials';

export default function Homepage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <EcoImpact />
      <Testimonials />
      <Footer />
    </main>
  );
}

