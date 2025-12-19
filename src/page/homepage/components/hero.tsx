'use client';

import { Button } from '@/components/ui/button';
import heroImage from '@public/hero-image.png';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to"
    >
      {/* Hiệu ứng nền nhẹ */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ========== Bên trái (Nội dung văn bản) ========== */}
          <div className="space-y-6 font-roboto">
            <h1 className="text-5xl text-light-dark-default md:text-6xl lg:text-7xl  font-bold leading-tight tracking-tight">
              Kết nối để hướng tới
              <br />
              <span className="text-light-dark-default">
                Tương lai xanh hơn
              </span>
            </h1>

            <p className="text-lg md:text-xl text-light-dark-default leading-relaxed">
              Bán phế liệu dễ dàng, nhận phần thưởng và góp phần bảo vệ môi
              trường.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                variant="primary"
                className="bg-light-dark-default/90 text-primary font-semibold uppercase tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
              >
                Tải cho Android
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold uppercase tracking-wide border-2 border-light-dark-default text-light-dark-default bg-transparent hover:bg-light-dark-default/10 backdrop-blur-sm transition-all duration-300"
              >
                Tải cho iOS
              </Button>
            </div>
          </div>

          {/* ========== Bên phải (Hình ảnh) ========== */}
          <div className="relative animate-fade-in delay-300">
            <Image
              src={heroImage}
              alt="Chu trình tái chế Green Connect"
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
              priority
            />
          </div>
        </div>

        {/* Biểu tượng cuộn xuống */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-light-dark-default/70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
