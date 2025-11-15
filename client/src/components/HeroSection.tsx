import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/luxury_city_lights_s_621ea0db.jpg";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";

interface HeroSectionProps {
  language: "ar" | "en";
  onCTAClick: () => void;
}

export default function HeroSection({ language, onCTAClick }: HeroSectionProps) {
  const { trackCTAClick } = useFunnelTracking();

  const handleCTAClick = () => {
    trackCTAClick("consultation", "hero_section");
    onCTAClick();
  };
  const content = {
    ar: {
      headline: "حوِّل المعرفة والقرارات إلى ثروة",
      subtext: "نحو حياة تستحقها — استثمارك يبدأ من قرارك التالي",
      cta: "ابدأ استشارتك المجانية"
    },
    en: {
      headline: "Turn data and decisions into wealth",
      subtext: "Toward the life you deserve — your investment starts with your next decision",
      cta: "Start Your Free Consultation"
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0d0d0d]/90 to-black/85" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-60" />

      <style>{`
        @keyframes gradientFlow {
          0% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
          100% { 
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmerWave {
          0% { 
            transform: translateX(-100%) translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% { 
            transform: translateX(100%) translateY(0);
            opacity: 0;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(217, 165, 67, 0.3),
              0 0 40px rgba(217, 165, 67, 0.2),
              0 0 60px rgba(217, 165, 67, 0.1);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(217, 165, 67, 0.5),
              0 0 60px rgba(217, 165, 67, 0.3),
              0 0 90px rgba(217, 165, 67, 0.2);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gold-shimmer {
          background: linear-gradient(
            120deg,
            #d9a543 0%,
            #f4e4b5 25%,
            #d9a543 50%,
            #f4e4b5 75%,
            #d9a543 100%
          );
          background-size: 300% 100%;
          animation: gradientFlow 4s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite;
          position: relative;
        }
        
        .gold-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: shimmerWave 3s ease-in-out infinite;
        }
        
        .text-container {
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(2deg); }
          66% { transform: translateY(-8px) rotate(-2deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .float-animation {
          animation: float 8s ease-in-out infinite;
        }
        
        .spin-slow {
          animation: spin 30s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" className="float-animation">
          <path
            d="M200 50 L350 150 L350 300 L200 380 L50 300 L50 150 Z"
            fill="none"
            stroke="hsl(43, 65%, 52%)"
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="text-reflection mb-8" data-text={content[language].headline}>
          <h1 
            className={`text-6xl md:text-8xl font-bold mb-2 ${
              language === 'ar' ? 'font-arabic' : 'font-serif'
            }`}
            data-testid="text-hero-headline"
          >
            <span className="gold-shimmer bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent">
              {content[language].headline}
            </span>
          </h1>
        </div>
        
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-8 opacity-60" />
        
        <p 
          className={`text-2xl md:text-3xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed ${
            language === 'ar' ? 'font-arabic' : 'font-serif'
          }`}
          data-testid="text-hero-subtext"
          style={{
            textShadow: '0 2px 20px rgba(217, 165, 67, 0.3)'
          }}
        >
          {content[language].subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="text-lg px-12 py-7 h-auto font-bold bg-gradient-to-r from-primary via-[#d9a543] to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 shadow-xl shadow-primary/30 border-2 border-primary/20"
            onClick={handleCTAClick}
            data-testid="button-hero-cta"
            style={{
              backgroundSize: '200% 100%',
              backgroundPosition: '0% center'
            }}
          >
            {content[language].cta}
          </Button>
        </div>

        <div className="mt-16 flex justify-center items-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' ? 'استشارة مجانية' : 'Free Consultation'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' ? 'خبراء معتمدون' : 'Certified Experts'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1s' }} />
            <span className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' ? 'نتائج مضمونة' : 'Guaranteed Results'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-primary/60"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
