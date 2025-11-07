import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
      />

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 
            className={`text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          >
            {language === "ar" ? "مدونة الوعي العقاري" : "Real Estate Insights Blog"}
          </h1>
          
          <p className={`text-center text-white/70 mb-12 max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === "ar" 
              ? "مقالات ونصائح لتحويل قراراتك العقارية إلى قرارات ثروة" 
              : "Articles and tips to transform your real estate decisions into wealth"}
          </p>

          <div className="text-center py-20">
            <p className={`text-white/60 text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === "ar" ? "المحتوى قريباً..." : "Content coming soon..."}
            </p>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
