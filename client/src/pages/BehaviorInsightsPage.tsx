import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BehaviorInsights from "@/components/BehaviorInsights";

export default function BehaviorInsightsPage() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <main>
        <BehaviorInsights language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}

