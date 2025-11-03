import { Button } from '@/components/ui/button';
import { Instagram, Leaf, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-warning">
      {/* CTA Section */}
      <section className="bg-gradient-primary py-16 px-4">
        <div className="container mx-auto text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Go Green?
            </h2>
          </div>
          <p className="text-xl mb-8 text-white/90">
            Download now and start making an impact today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-danger">
              <h1 className="text-gradient-primary">fdsaf</h1>
            </div>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-smooth shadow-glow text-base font-medium uppercase tracking-wide"
            >
              Download for Android
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-smooth text-base font-medium uppercase tracking-wide"
            >
              Download for iOS
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div id="contact" className="py-12 px-4 bg-card/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Green Connect</span>
              </div>
              <p className="text-sm text-background/70">
                Connecting communities for a sustainable future.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/70">
              © {currentYear} Green Connect. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-background/70 group-hover:text-white transition-smooth" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-background/70 group-hover:text-white transition-smooth" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
