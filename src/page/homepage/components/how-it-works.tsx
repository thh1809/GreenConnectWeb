import { Calendar, Handshake, Home, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: Home,
    title: 'Đăng bài phế liệu',
    description: 'Chụp ảnh và mô tả loại phế liệu bạn muốn bán',
  },
  {
    icon: Handshake,
    title: 'Người thu gom chấp nhận',
    description: 'Kết nối với người thu gom đã được xác minh gần bạn',
  },
  {
    icon: Calendar,
    title: 'Hẹn lịch & Thu gom',
    description: 'Chọn thời gian thuận tiện để tiến hành thu gom',
  },
  {
    icon: PartyPopper,
    title: 'Xác nhận & Nhận thưởng',
    description: 'Hoàn tất giao dịch và nhận điểm thưởng tích lũy',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cách hoạt động
          </h2>
          <p className="text-xl text-muted-foreground mx-auto">
            4 bước đơn giản để bạn góp phần tạo nên thay đổi
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Đường nối giữa các bước */}
            <div
              className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-primary/20"
              style={{ width: 'calc(100% - 8rem)', left: '4rem' }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Vòng tròn biểu tượng bước */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-card shadow-medium flex items-center justify-center bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to group-hover:shadow-glow transition-smooth">
                      <Icon className="w-12 h-12 text-light-dark-default" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-soft">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
