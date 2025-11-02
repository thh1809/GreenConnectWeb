"use client";

import { Upload, Handshake, CalendarCheck, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Post Your Scrap",
    description:
      "Upload photos and details of your recyclable materials",
  },
  {
    number: 2,
    icon: Handshake,
    title: "Collector Accepts",
    description:
      "Nearby collectors view and accept your scrap post",
  },
  {
    number: 3,
    icon: CalendarCheck,
    title: "Schedule & Pickup",
    description:
      "Coordinate pickup time and location with collector",
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: "Confirm & Reward",
    description:
      "Confirm pickup and earn rewards points instantly",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: "#333333" }}
          >
            How It Works
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "#525252" }}
          >
            Four simple steps to turn your scrap into rewards while saving the
            planet.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5" style={{ backgroundColor: "#E0E0E0" }}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full">
              <div className="flex justify-between">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      index < steps.length - 1 && "flex-1 mr-4"
                    )}
                    style={{ backgroundColor: "#21BC5A" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <Card
                    className="border shadow-lg hover:shadow-xl transition-shadow h-full"
                    style={{ borderColor: "#E0E0E0", backgroundColor: "#FFFFFF" }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{ backgroundColor: "#2196F3" }}
                        >
                          {step.number}
                        </div>
                        <div
                          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#E8F5E9" }}
                        >
                          <Icon
                            className="w-8 h-8"
                            style={{ color: "#21BC5A" }}
                          />
                        </div>
                      </div>
                      <CardTitle
                        className="text-xl mt-4 text-center"
                        style={{ color: "#333333" }}
                      >
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription
                        className="text-center text-base"
                        style={{ color: "#525252" }}
                      >
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

