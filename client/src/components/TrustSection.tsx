import { useEffect, useState } from "react";
import { Users, Building2, Award, TrendingUp } from "lucide-react";

interface TrustSectionProps {
  language: "ar" | "en";
}

export default function TrustSection({ language }: TrustSectionProps) {
  const [counters, setCounters] = useState({ clients: 0, properties: 0, satisfaction: 0, growth: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasAnimated(true);
            animateCounters();
          }
        },
        { threshold: 0.3 }
      );

      const element = document.querySelector('[data-testid="section-trust"]');
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { clients: 500, properties: 1200, satisfaction: 98, growth: 45 };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounters({
        clients: Math.floor(targets.clients * progress),
        properties: Math.floor(targets.properties * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
        growth: Math.floor(targets.growth * progress)
      });

      if (step >= steps) {
        setCounters(targets);
        clearInterval(timer);
      }
    }, interval);
  };

  const content = {
    ar: {
      title: "لماذا يثق الناس بي",
      clients: "عميل موثوق",
      properties: "عقار تم تسويقه",
      satisfaction: "رضا العملاء",
      growth: "نمو في الاستثمار"
    },
    en: {
      title: "Why People Trust Me",
      clients: "Trusted Clients",
      properties: "Properties Marketed",
      satisfaction: "Client Satisfaction",
      growth: "Investment Growth"
    }
  };

  const stats = [
    { icon: Users, value: counters.clients, label: content[language].clients, suffix: "+" },
    { icon: Building2, value: counters.properties, label: content[language].properties, suffix: "+" },
    { icon: Award, value: counters.satisfaction, label: content[language].satisfaction, suffix: "%" },
    { icon: TrendingUp, value: counters.growth, label: content[language].growth, suffix: "%" }
  ];

  return (
    <section className="py-20 px-6 bg-card" data-testid="section-trust">
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`text-4xl font-serif font-bold text-center mb-16 ${language === 'ar' ? 'font-arabic' : ''}`}
          data-testid="text-trust-title"
        >
          {content[language].title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
