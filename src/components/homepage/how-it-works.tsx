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
    <section
      id="how-it-works"
      className="py-24 px-4 bg-background transition-colors duration-300"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Cách hoạt động
          </h2>
          <p className="text-xl text-muted-foreground mx-auto ">
            4 bước đơn giản để bạn góp phần tạo nên thay đổi
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="grid md:grid-cols-4 gap-10 relative">
            <div
              className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-primary/25 dark:bg-primary/35"
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
                  <div className="relative mb-6 group">
                    <div
                      className={`
                    w-32 h-32 rounded-full flex items-center justify-center 
                    bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to 
                    shadow-md transition-all duration-300
                    group-hover:scale-105 group-hover:shadow-glow
                  `}
                    >
                      <Icon
                        className={`
                      w-12 h-12 text-light-dark-default 
                      transition-transform duration-300 group-hover:scale-110
                    `}
                      />
                    </div>

                    <div
                      className={`
                    absolute -top-2 -right-2 w-8 h-8 rounded-full 
                    bg-primary text-primary-foreground 
                    flex items-center justify-center font-bold text-sm 
                    shadow-soft
                  `}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm max-w-[14rem]">
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
