import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { language, toggleLanguage } = useLanguage();

  const content = {
    ar: {
      title: "من نحن",
      vision: "رؤيتنا",
      visionText: "نحوّل المعرفة والقرارات إلى ثروة",
      mission: "مهمتنا",
      missionText: "نبني قرارات ثروة مش عقارات. نساعد عملائنا على اتخاذ قرارات استثمارية ذكية مبنية على بيانات دقيقة وخبرة عميقة في السوق العقاري."
    },
    en: {
      title: "About Us",
      vision: "Our Vision",
      visionText: "Turn data and decisions into wealth",
      mission: "Our Mission",
      missionText: "We build wealth decisions, not just properties. We help our clients make smart investment decisions based on accurate data and deep expertise in the real estate market."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />

      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 
            className={`text-5xl font-bold text-center mb-16 heading-gold ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          >
            {content[language].title}
          </h1>

          <div className="space-y-12">
            <div className="text-center">
              <h2 className={`text-3xl font-bold text-primary mb-4 ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
                {content[language].vision}
              </h2>
              <p className={`text-2xl text-white/80 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {content[language].visionText}
              </p>
            </div>

            <div className="text-center">
              <h2 className={`text-3xl font-bold text-primary mb-4 ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
                {content[language].mission}
              </h2>
              <p className={`text-lg text-white/70 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                {content[language].missionText}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
