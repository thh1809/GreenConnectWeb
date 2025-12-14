import { Card } from '@/components/ui/card';
import { Award, MapPin, Upload } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Đăng bài thu gom phế liệu',
    description:
      'Tải lên hình ảnh phế liệu của bạn và để AI gợi ý danh mục cùng mức giá phù hợp nhất.',
    link: '#',
  },
  {
    icon: MapPin,
    title: 'Tìm & Nhận việc thu gom',
    description:
      'Duyệt các công việc thu gom có sẵn trên bản đồ tương tác. Lọc theo khoảng cách, loại phế liệu và số lượng.',
    link: '#',
  },
  {
    icon: Award,
    title: 'Nhận thưởng & Đánh giá',
    description:
      'Nhận điểm thưởng cho mỗi giao dịch. Xây dựng uy tín cá nhân qua đánh giá và gia tăng tác động tích cực.',
    link: '#',
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 px-4 bg-background text-foreground transition-colors duration-300"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Đơn giản, Thông minh, Bền vững
          </h2>
          <p className="text-xl text-muted-foreground mx-auto">
            Mọi công cụ bạn cần để biến phế liệu thành phần thưởng giá trị
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-card text-card-foreground border border-border shadow-soft hover:shadow-medium hover:bg-muted/10 transition-all duration-300 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to shadow-glow group-hover:scale-110 group-hover:brightness-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-light-dark-default drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <a
                  href={feature.link}
                  className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary-foreground"
                >
                  Tìm hiểu thêm →
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
