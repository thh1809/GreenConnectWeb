import { Card } from '@/components/ui/card';
import { Award, MapPin, Upload } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Create Scrap Posts',
    description:
      'Upload photos of your scrap materials and let our AI suggest the best category and price range.',
    link: '#',
  },
  {
    icon: MapPin,
    title: 'Find & Collect Jobs',
    description:
      'Browse available scrap jobs on an interactive map. Filter by distance, type, and quantity.',
    link: '#',
  },
  {
    icon: Award,
    title: 'Earn Rewards & Feedback',
    description:
      'Get reward points for every transaction. Build your reputation with ratings and grow your impact.',
    link: '#',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Smart, Sustainable
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to turn your scrap into rewards
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 shadow-soft hover:shadow-medium transition-smooth group cursor-pointer border-0 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-primary shadow-glow group-hover:scale-110 transition-smooth">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <a
                  href={feature.link}
                  className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-smooth"
                >
                  Learn More →
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
