'use client';
import { Button } from '@/components/ui/button';
import Logo from '@public/Eco-Tech-logo-web-no-background.ico';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Impact', href: '#impact' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-card/80 backdrop-blur-xl shadow-md py-3'
            : 'bg-primarybasic py-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-smooth">
                <Image src={Logo} alt="logo" quality={100} />
              </div>
              <span
                className={`text-xl font-semibold  text-white ${
                  isScrolled ? 'block' : 'hidden sm:block'
                }`}
              >
                Green Connect
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium relative group transition-smooth ${
                    isScrolled ? 'text-black' : 'text-white'
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                size="lg"
                variant="primary"
                className="rounded-full font-semibold tracking-wide"
              >
                Get the App
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-smooth ${
                isScrolled ? 'text-foreground' : 'text-primarybasic'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-20 left-4 right-4 bg-card rounded-2xl shadow-lg p-6 transition-all duration-500 ${
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-smooth py-2 text-center"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
            <Button
              size="lg"
              variant="primary"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full mt-4"
            >
              Get the App
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
