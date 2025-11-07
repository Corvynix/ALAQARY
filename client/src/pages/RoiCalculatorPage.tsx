import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";

export default function RoiCalculatorPage() {
  const { language, toggleLanguage } = useLanguage();

  const content = {
    ar: {
      pageTitle: "حاسبة العائد على الاستثمار",
      subtitle: "أداة مجانية لحساب عائد استثمارك العقاري"
    },
    en: {
      pageTitle: "ROI Calculator",
      subtitle: "Free tool to calculate your real estate investment return"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.pageTitle}
          </h1>
          <p className={`text-xl text-white/70 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </p>
        </div>

        <RoiCalculator language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
}
