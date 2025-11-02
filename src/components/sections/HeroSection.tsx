"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { theme } from "@/config/theme";

export function HeroSection() {
  const gradientStyle = {
    background: `linear-gradient(to bottom, ${theme.colors.gradients.secondary[0]}, ${theme.colors.gradients.secondary[1]})`,
  };

  const buttonGradientStyle = {
    background: `linear-gradient(to right, ${theme.colors.gradients.primary[0]}, ${theme.colors.gradients.primary[1]})`,
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={gradientStyle}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute left-10 top-20 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-40 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute left-1/2 top-1/2 w-60 h-60 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            Connect to a Greener Future
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
            Sell your scrap easily, earn rewards, and make an impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg border-none"
              style={buttonGradientStyle}
            >
              <span className="text-[#21BC5A] font-bold">Download for iOS</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg border-none"
              style={buttonGradientStyle}
            >
              <span className="text-[#21BC5A] font-bold">
                Download for Android
              </span>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
}

