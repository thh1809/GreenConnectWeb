import { Calendar, Handshake, Home, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: Home,
    title: 'Post Your Scrap',
    description: 'Take a photo and describe your scrap materials',
  },
  {
    icon: Handshake,
    title: 'Collector Accepts',
    description: 'Get matched with verified collectors nearby',
  },
  {
    icon: Calendar,
    title: 'Schedule & Pickup',
    description: 'Choose a convenient time for collection',
  },
  {
    icon: PartyPopper,
    title: 'Confirm & Reward',
    description: 'Complete the transaction and earn points',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 ">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to make a difference
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
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
                  {/* Step Number Circle */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-card shadow-medium flex items-center justify-center gradient-primary group-hover:shadow-glow transition-smooth">
                      <Icon className="w-12 h-12 text-white" />
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
