'use client';
import { Recycle, Sprout, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stats = [
  {
    icon: Recycle,
    value: 10000,
    suffix: '+',
    label: 'Tấn phế liệu đã được tái chế',
  },
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'Người dùng đã kết nối',
  },
  {
    icon: Sprout,
    value: 1000000,
    suffix: '+',
    label: 'Điểm thưởng đã được quy đổi',
  },
];

const AnimatedCounter = ({ end, suffix }: { end: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div
      ref={ref}
      className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to bg-clip-text text-transparent"
    >
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

const EcoImpact = () => {
  return (
    <section
      id="impact"
      className="py-24 px-4 bg-gradient-to-b from-secondary/30 to-background"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tác động của chúng ta
          </h2>
          <p className="text-xl text-muted-foreground mx-auto">
            Cùng nhau, chúng ta đang tạo nên sự thay đổi mỗi ngày
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 animate-counter-grow"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to shadow-glow mb-4">
                  <Icon className="w-12 h-12 text-light-dark-default" />
                </div>

                <AnimatedCounter end={stat.value} suffix={stat.suffix} />

                <p className="text-xl font-medium text-muted-foreground">
                  {stat.label}
                </p>

                {/* Thanh tiến trình */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: '100%',
                      animationDelay: `${index * 200}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EcoImpact;
