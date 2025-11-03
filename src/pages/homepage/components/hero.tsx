import { Button } from '@/components/ui/button';
import heroImage from '@public/hero-image.png';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-95" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-6 animate-leaf-fall">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Connect to a<br />
              <span className="text-white/90">Greener Future</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-xl">
              Sell your scrap easily, earn rewards, and make an impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="bg-primary">
                <h1 className="text-white">fkldjsaklfjsdkl</h1>
              </div>
              <Button
                size="lg"
                variant={'default'}
                className="bg-primary text-primary hover:bg-white/90 hover:text-black transition-smooth shadow-glow text-base font-medium uppercase tracking-wide"
              >
                Download for iOS
              </Button>
              <Button
                size="lg"
                className="border-2 border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-smooth text-base font-medium uppercase tracking-wide"
              >
                Download for Android
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in delay-300">
            <Image
              src={heroImage}
              alt="Green Connect Recycling Cycle"
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-white/80" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
