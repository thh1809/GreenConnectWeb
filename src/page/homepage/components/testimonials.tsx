'use client';
import { Card } from '@/components/ui/card';
import { Leaf, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Los Angeles, CA',
    avatar: '👩',
    rating: 5,
    comment:
      'Green Connect giúp việc tái chế trở nên thật dễ dàng! Tôi đã tích được hơn 500 điểm chỉ trong hai tháng và rất thích khi thấy tác động môi trường của mình ngày càng lớn.',
  },
  {
    name: 'Mike Chen',
    role: 'San Francisco, CA',
    avatar: '👨',
    rating: 4,
    comment:
      'Tính năng bản đồ thật tuyệt vời. Tôi có thể lên kế hoạch thu gom hiệu quả, và gợi ý từ AI giúp tôi định giá chính xác hơn.',
  },
  {
    name: 'Priya Sharma',
    role: 'Seattle, WA',
    avatar: '👩‍🦱',
    rating: 3,
    comment:
      'Cuối cùng cũng có một ứng dụng khiến việc sống xanh trở nên thú vị! Cộng đồng thật tuyệt và tôi cảm thấy mình đang góp phần tạo ra sự khác biệt.',
  },
  {
    name: 'David Martinez',
    role: 'Austin, TX',
    avatar: '🧔',
    rating: 5,
    comment:
      'Tôi đã kết nối được với nhiều người thu gom đáng tin cậy và có thêm thu nhập. Hệ thống điểm thưởng giúp tôi có thêm động lực mỗi ngày!',
  },
  {
    name: 'Emma Wilson',
    role: 'Portland, OR',
    avatar: '👱‍♀️',
    rating: 5,
    comment:
      'Ứng dụng xanh tốt nhất mà tôi từng dùng! Giao diện rất thân thiện và việc đăng bài tái chế thật dễ dàng.',
  },
  {
    name: 'James Lee',
    role: 'Denver, CO',
    avatar: '👨‍🦱',
    rating: 5,
    comment:
      'Là một người thu gom, ứng dụng này đã thay đổi công việc của tôi. Tôi có thể tìm việc nhanh chóng và hệ thống đánh giá giúp xây dựng niềm tin.',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section
      id="testimonials"
      className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-gradient-secondary-from to-gradient-secondary-to"
    >
      {/* Trang trí lá động */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf
          className="absolute top-20 left-10 w-16 h-16 text-primary/10 animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <Leaf
          className="absolute top-40 right-20 w-12 h-12 text-primary/10 animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
        <Leaf
          className="absolute bottom-20 left-1/4 w-20 h-20 text-primary/10 animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '2s' }}
        />
        <Leaf
          className="absolute bottom-40 right-1/3 w-14 h-14 text-primary/10 animate-pulse"
          style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-black text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            Người dùng nói gì <span className="text-3xl">🌱</span>
          </h2>
          <p className="text-xl text-muted-foreground mx-auto">
            Câu chuyện thật từ cộng đồng xanh của chúng ta
          </p>
        </div>

        {/* Desktop: 3 thẻ hiển thị */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <Card
              key={`${testimonial.name}-${index}`}
              className="p-6 bg-card shadow-soft hover:shadow-medium hover:scale-105 transition-all duration-300 border-0 rounded-xl"
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to rounded-full blur-sm" />
                  <div className="relative w-20 h-20 rounded-full bg-card flex items-center justify-center text-4xl border-4 border-light-dark-default">
                    {testimonial.avatar}
                  </div>
                </div>
              </div>

              <div className="text-center mb-3">
                <p className="font-bold text-lg">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>

              <div className="flex gap-1 justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed italic text-center">
                "{testimonial.comment}"
              </p>
            </Card>
          ))}
        </div>

        {/* Mobile: 1 thẻ hiển thị */}
        <div className="md:hidden max-w-sm mx-auto mb-8">
          <Card className="p-6 bg-card shadow-soft border-0 rounded-xl transition-smooth">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-sm" />
                <div className="relative w-24 h-24 rounded-full bg-card flex items-center justify-center text-5xl border-4 border-white">
                  {testimonials[currentIndex].avatar}
                </div>
              </div>
            </div>

            <div className="text-center mb-3">
              <p className="font-bold text-xl">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonials[currentIndex].role}
              </p>
            </div>

            <div className="flex gap-1 justify-center mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>

            <p className="text-base text-foreground leading-relaxed italic text-center">
              "{testimonials[currentIndex].comment}"
            </p>
          </Card>
        </div>

        {/* Nút điều hướng chấm tròn */}
        <div className="flex gap-2 justify-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-primary w-8 shadow-soft'
                  : 'bg-primary/30 w-3 hover:bg-primary/50'
              }`}
              aria-label={`Chuyển đến đánh giá ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
