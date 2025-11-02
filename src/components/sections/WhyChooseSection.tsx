"use client";

import { Upload, MapPin, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    icon: Upload,
    title: "Create Scrap Posts",
    description:
      "Upload photos and let our AI suggest the scrap type. Easy listing for household waste.",
  },
  {
    icon: MapPin,
    title: "Find & Collect Jobs",
    description:
      "Browse nearby scrap posts on the map. Filter by type, location, and pickup time.",
  },
  {
    icon: Award,
    title: "Earn Rewards & Feedback",
    description:
      "Get points for every completed transaction. Track your eco-impact and grow your green tree.",
  },
];

export function WhyChooseSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: "#333333" }}
          >
            Why Choose Green Connect?
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "#525252" }}
          >
            A seamless platform connecting households and collectors for a
            sustainable future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                  <CardTitle className="text-xl" style={{ color: "#333333" }}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="text-base" style={{ color: "#525252" }}>
                    {feature.description}
                  </CardDescription>
                  <Link
                    href="#"
                    className="font-semibold inline-block hover:opacity-80 transition-opacity"
                    style={{ color: "#21BC5A" }}
                  >
                    Learn More →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

