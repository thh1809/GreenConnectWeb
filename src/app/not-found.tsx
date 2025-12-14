'use client';

import { Button } from '@/components/ui/button';
import { Home, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import FallingLeaves from '@/components/falling-leaf';
import leafMascot from '@public/404_dog.png';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 5000);

    return () => clearInterval(waveInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <FallingLeaves />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={leafMascot}
                  alt="Linh vật chiếc lá bối rối"
                  width={500}
                  height={500}
                  className={`object-contain animate-float drop-shadow-2xl ${
                    isWaving ? 'animate-wave' : ''
                  }`}
                />
                <div
                  className="absolute -top-4 -right-4 text-6xl animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  🌿
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="text-center lg:text-left space-y-6">
              <div className="space-y-3">
                <h1 className="font-heading font-bold text-5xl md:text-6xl text-foreground">
                  Ôi! Bạn lạc giữa khu rừng xanh rồi à?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Có vẻ như bạn đã đi chệch khỏi con đường xanh 🌱
                  <br />
                  Trang bạn tìm kiếm đang mọc ở nơi khác rồi. Hãy cùng trở về
                  trang chủ nhé.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button
                  onClick={() => router.push('/')}
                  size="lg"
                  className="relative overflow-hidden group bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold px-8 py-6 text-lg rounded-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Home size={20} />
                    Quay về Trang chủ
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    (window.location.href = 'mailto:support@greenconnect.com')
                  }
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-lg rounded-2xl transition-all duration-300"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Liên hệ Hỗ trợ
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-4 italic">
                Green Connect luôn sẵn sàng dẫn bạn trở lại con đường xanh 🌍
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
