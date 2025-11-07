import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_luxury_penthouse_interior_f52cfacb.png";

interface HeroSectionProps {
  language: "ar" | "en";
  onCTAClick: () => void;
}

export default function HeroSection({ language, onCTAClick }: HeroSectionProps) {
  const content = {
    ar: {
      headline: "نحوّل قرارات العقار لقرارات ثروة",
      subtext: "مستشارك العقاري الذكي اللي بيخليك تختار بعين المستثمر",
      cta: "ابدأ استشارتك المجانية"
    },
    en: {
      headline: "Turn property decisions into wealth strategy",
      subtext: "Your smart real estate consultant who helps you choose with an investor's eye",
      cta: "Start Your Free Consultation"
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 
          className={`text-5xl md:text-7xl font-serif font-bold text-white mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}
          data-testid="text-hero-headline"
        >
          {content[language].headline}
        </h1>
        
        <p 
          className={`text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}
          data-testid="text-hero-subtext"
        >
          {content[language].subtext}
        </p>

        <Button 
          size="lg"
          className="text-lg px-10 py-6 h-auto font-semibold"
          onClick={onCTAClick}
          data-testid="button-hero-cta"
        >
          {content[language].cta}
        </Button>
      </div>
    </section>
  );
}
