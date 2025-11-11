'use client';
import { Button } from '@/components/ui/button';
import Logo from '@public/Eco-Tech-logo-web-no-background.ico';
import { Facebook, Instagram, Leaf, Moon, Sun, Twitter } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  return (
    <footer className="bg-card text-warning">
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to py-16 px-4">
        <div className="container mx-auto text-center text-light-dark-default">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Sẵn sàng sống xanh?
            </h2>
          </div>
          <p className="text-xl mb-8 text-light-dark-default/90">
            Tải ứng dụng ngay hôm nay và bắt đầu tạo tác động tích cực
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-light-dark-default text-primary hover:bg-light-dark-default/90 transition-smooth shadow-glow text-base font-medium uppercase tracking-wide"
            >
              Tải cho Android
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-light-dark-default text-light-dark-default bg-light-dark-default/10 hover:bg-light-dark-default/20 backdrop-blur-sm transition-smooth text-base font-medium uppercase tracking-wide"
            >
              Tải cho iOS
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div id="contact" className="py-12 px-4 bg-black/90">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <a href="#home" className="flex items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src={Logo}
                    alt="logo"
                    width={50}
                    height={50}
                    priority
                  />
                </div>
                <h3
                  className={`2xl:text-2xl font-semibold text-white tracking-wide transition-all hover:opacity-70`}
                >
                  Green Connect
                </h3>
              </a>
              <p className="text-sm text-white/70">
                Kết nối cộng đồng vì một tương lai bền vững.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Tính năng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Cách hoạt động
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Bảng giá
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-background transition-smooth"
                  >
                    Chính sách cookie
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © {currentYear} Green Connect. Mọi quyền được bảo lưu.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white/70 group-hover:text-white transition-smooth" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white/70 group-hover:text-white transition-smooth" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Facebook className="w-5 h-5 text-white/70 group-hover:text-white transition-smooth" />
              </a>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-smooth flex items-center justify-center group"
                aria-label="Chuyển đổi chế độ sáng/tối"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-white/70 group-hover:text-white transition-smooth" />
                ) : (
                  <Moon className="w-5 h-5 text-white/70 group-hover:text-white transition-smooth" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
