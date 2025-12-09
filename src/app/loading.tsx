'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* --- BACKGROUND DECORATION (Hiệu ứng nền nhẹ) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Bong bóng mờ màu Primary */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"
        />
      </div>

      {/* --- MAIN LOADER CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container with Rings */}
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          {/* Ring 1: Gradient xoay tròn (Nét đứt) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent"
            style={{
              borderTopColor: 'hsl(var(--primary))',
              borderRightColor: 'hsl(var(--gradient-primary-to))',
            }}
          />

          {/* Ring 2: Xoay ngược chiều, nhỏ hơn, mờ hơn */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-primary/30"
          />

          {/* Pulsing Glow behind Logo */}
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-primary/10 rounded-full blur-md"
          />

          {/* Logo Image (Floating Effect) */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-20"
          >
            <Image
              src="/Eco-Tech-logo-web-no-background.ico"
              alt="GreenConnect Logo"
              width={48}
              height={48}
              className="object-contain drop-shadow-md"
              priority
            />
          </motion.div>
        </div>

        {/* --- TEXT ANIMATION --- */}
        <div className="flex flex-col items-center space-y-2">
          <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--gradient-primary-from))] to-[hsl(var(--gradient-primary-to))]"
          >
            GreenConnect
          </motion.h3>

          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-muted-foreground">
              Đang tải nội dung
            </span>
            {/* 3 Dấu chấm nhảy múa */}
            <div className="flex space-x-1 pb-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2, // Stagger effect
                    ease: 'easeInOut',
                  }}
                  className="w-1 h-1 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
