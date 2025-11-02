"use client";

import { Scale, Leaf, Users, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { theme } from "@/config/theme";

const statistics = [
  {
    icon: Scale,
    number: "10,000+",
    title: "Tons Recycled",
    description: "Tons diverted from landfills",
    progress: 70,
  },
  {
    icon: Leaf,
    number: "500,000",
    title: "Tons CO2 Saved",
    description: "Like planting 50K trees",
    progress: 80,
  },
  {
    icon: Users,
    number: "50,000",
    title: "Users Connected",
    description: "Building greener communities",
    progress: 60,
  },
  {
    icon: Star,
    number: "1,000,000",
    title: "Points Redeemed",
    description: "Turned into eco-actions",
    progress: 90,
  },
];

export function GreenImpactSection() {
  const buttonGradientStyle = {
    background: `linear-gradient(to right, ${theme.colors.gradients.primary[0]}, ${theme.colors.gradients.primary[1]})`,
  };

  return (
    <section
      className="py-20"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: "#21BC5A" }}
          >
            Our Green Impact So Far
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "#525252" }}
          >
            Join thousands making a difference - every scrap counts toward a
            circular economy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border shadow-lg hover:shadow-xl transition-shadow"
                style={{ borderColor: "#E0E0E0", backgroundColor: "#FFFFFF" }}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#E8F5E9" }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: "#21BC5A" }}
                    />
                  </div>
                  <div
                    className="text-5xl font-bold mb-2"
                    style={{ color: "#333333" }}
                  >
                    {stat.number}
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#333333" }}
                  >
                    {stat.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription
                    className="text-center text-base"
                    style={{ color: "#525252" }}
                  >
                    {stat.description}
                  </CardDescription>
                  {/* Progress Bar */}
                  <div
                    className="w-full rounded-full h-2.5 overflow-hidden"
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <div
                      className="h-2.5 rounded-full transition-all duration-1000"
                      style={{
                        width: `${stat.progress}%`,
                        background: `linear-gradient(to right, ${theme.colors.gradients.primary[0]}, ${theme.colors.gradients.primary[1]})`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            className="px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-opacity hover:opacity-90"
            style={buttonGradientStyle}
          >
            <span style={{ color: "#21BC5A", fontWeight: "bold" }}>
              See Your Impact in App
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
