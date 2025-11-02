"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const footerBgStyle = {
    backgroundColor: "#21BC5A",
  };

  return (
    <footer className="text-white py-12" style={footerBgStyle}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Navigation Links */}
          <nav className="flex gap-6 text-sm">
            <Link
              href="/about"
              className="text-white hover:opacity-80 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-white hover:opacity-80 transition-opacity"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-white hover:opacity-80 transition-opacity"
            >
              Contact
            </Link>
          </nav>

          {/* Social Media & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-sm text-white/80">
              © 2025 Green Connect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

