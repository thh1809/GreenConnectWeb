"use client";

import { Button } from "@/components/ui/button";
import { theme } from "@/config/theme";

export function DownloadSection() {
  const sectionBgStyle = {
    backgroundColor: "#21BC5A",
  };

  const buttonGradientStyle = {
    background: `linear-gradient(to right, ${theme.colors.gradients.primary[0]}, ${theme.colors.gradients.primary[1]})`,
  };

  return (
    <section className="py-20 text-white" style={sectionBgStyle}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Ready to Go Green? Download Now
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg border-none"
              style={buttonGradientStyle}
            >
              <span style={{ color: "#21BC5A", fontWeight: "bold" }}>
                Download for iOS
              </span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg border-none"
              style={buttonGradientStyle}
            >
              <span style={{ color: "#21BC5A", fontWeight: "bold" }}>
                Download for Android
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

