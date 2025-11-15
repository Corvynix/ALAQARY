import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketIntelligence from "@/components/MarketIntelligence";

export default function MarketIntelligencePage() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <main>
        <MarketIntelligence language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}

