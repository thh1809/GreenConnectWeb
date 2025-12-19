
import EcoImpact from './components/ecoImpact';
import Features from './components/features';
import Footer from './components/footer';
import Header from './components/header';
import Hero from './components/hero';
import HowItWorks from './components/how-it-works';
import PriceList from './components/price-list';
import Testimonials from './components/testimonials';

export default function Homepage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <PriceList />
      <HowItWorks />
      <EcoImpact />
      <Testimonials />
      <Footer />
    </main>
  );
}
