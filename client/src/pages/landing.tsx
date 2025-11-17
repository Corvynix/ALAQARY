import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { Check, TrendingUp, Shield, Target, Users, Award, Clock } from "lucide-react";
import heroImage from "@assets/generated_images/Dubai_luxury_building_hero_f0dfcf3b.png";
import consultantImage from "@assets/generated_images/Professional_consultant_headshot_6a05d1b5.png";

export default function Landing() {
  const { t } = useI18n();

  const features = [
    {
      icon: TrendingUp,
      title: t("features.analysis.title"),
      desc: t("features.analysis.desc"),
    },
    {
      icon: Target,
      title: t("features.matching.title"),
      desc: t("features.matching.desc"),
    },
    {
      icon: Shield,
      title: t("features.risk.title"),
      desc: t("features.risk.desc"),
    },
  ];

  const steps = [
    {
      number: "١",
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
    },
    {
      number: "٢",
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
    },
    {
      number: "٣",
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src={heroImage}
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="mb-6 bg-accent/20 border-accent text-white backdrop-blur-sm px-6 py-2" data-testid="badge-trust-deals">
            <Award className="w-4 h-4 inline-block me-2" />
            {t("hero.trust.deals")}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            {t("hero.title")}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-lg rounded-lg shadow-xl"
              data-testid="button-start-consultation"
            >
              {t("hero.cta.primary")}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-6 text-lg rounded-lg"
              data-testid="button-learn-more"
            >
              {t("hero.cta.secondary")}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap gap-6 md:gap-8 justify-center items-center text-white/90">
            <div className="flex items-center gap-2" data-testid="trust-clients">
              <Check className="w-5 h-5 text-accent" />
              <span className="font-medium">{t("hero.trust.clients")}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-secure">
              <Check className="w-5 h-5 text-accent" />
              <span className="font-medium">{t("hero.trust.secure")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-how-title">
              {t("how.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 hover-elevate border-border/50 bg-card" data-testid={`card-step-${index + 1}`}>
                <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-accent" data-testid={`text-step-number-${index + 1}`}>{step.number}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-4 text-center" data-testid={`text-step-title-${index + 1}`}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed" data-testid={`text-step-desc-${index + 1}`}>
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-features-title">
              {t("features.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover-elevate border-border/50" data-testid={`card-feature-${index}`}>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" data-testid={`icon-feature-${index}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-4" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-accent text-accent bg-accent/10 backdrop-blur-sm" data-testid="badge-certified">
                مستشار معتمد
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-trust-title">
                خبرة متخصصة في السوق العقاري المصري
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed" data-testid="text-trust-desc">
                نساعدك على اتخاذ قرارات استثمارية مدروسة بناءً على تحليل شامل للسوق وفهم عميق للاتجاهات العقارية
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3" data-testid="trust-stat-clients">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-lg">أكثر من 500 عميل راضي</span>
                </div>
                <div className="flex items-center gap-3" data-testid="trust-stat-service">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-lg">استجابة فورية وخدمة احترافية</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl" />
                <img 
                  src={consultantImage}
                  alt="Professional consultant"
                  className="relative w-72 h-72 object-cover rounded-full border-4 border-accent/50 shadow-2xl"
                  data-testid="img-consultant"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="mb-6 border-accent text-accent bg-accent/10" data-testid="badge-limited-offer">
            عرض محدود
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-cta-title">
            ابدأ رحلتك الاستثمارية اليوم
          </h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-cta-price">
            احصل على استشارة شاملة ب 200 جنيه مصري فقط
          </p>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-12 py-6 text-lg rounded-lg shadow-xl"
            data-testid="button-cta-consultation"
          >
            احجز استشارتك الآن
          </Button>
        </div>
      </section>
    </div>
  );
}
