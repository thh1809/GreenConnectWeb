'use client';
import { Button } from '@/components/ui/button';
import Logo from '@public/Eco-Tech-logo-web-no-background.ico';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clientNavLinks } from '../routes/client-route';

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-roboto ${
          isScrolled
            ? 'bg-card/80 backdrop-blur-xl shadow-md py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image src={Logo} alt="logo" width={50} height={50} priority />
              </div>
              <h3
                className={`2xl:text-2xl font-semibold text-white tracking-wide transition-all hover:opacity-70 ${
                  isScrolled ? 'opacity-1' : 'hidden sm:block opacity-90'
                }`}
              >
                Green Connect
              </h3>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {clientNavLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-300 group ${
                    isScrolled
                      ? 'text-light-dark-reverse hover:text-primary'
                      : 'text-light-dark-default hover:text-light-dark-reverse'
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
                className="font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                Tải ứng dụng
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-all duration-300"
              aria-label="Chuyển menu"
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
          className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-24 left-4 right-4 bg-card rounded-2xl shadow-lg p-6 transition-all duration-500 ${
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-4 text-center">
            {clientNavLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-all duration-300 py-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
            <Button
              size="lg"
              variant="primary"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full mt-4 font-semibold tracking-wide"
            >
              Tải ứng dụng
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
