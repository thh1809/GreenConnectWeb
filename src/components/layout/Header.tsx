"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">🌿</span>
            <span className="text-xl font-bold">GreenConnect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#impact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Impact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

