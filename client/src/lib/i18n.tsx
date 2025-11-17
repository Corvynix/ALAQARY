import { createContext, useContext, useState, useEffect } from "react";

type Language = 'ar' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.dashboard": "لوحة التحكم",
    "nav.properties": "العقارات",
    "nav.consultations": "الاستشارات",
    "nav.market": "تحليل السوق",
    "nav.developers": "المطورين",
    "nav.profile": "الملف الشخصي",
    "nav.logout": "تسجيل الخروج",
    "nav.login": "تسجيل الدخول",
    
    // Landing Page
    "hero.title": "استثمارك العقاري يبدأ باستشارة موثوقة",
    "hero.subtitle": "احصل على تحليل سوقي متخصص وتوصيات شخصية لاستثماراتك العقارية",
    "hero.cta.primary": "ابدأ الاستشارة (200 جنيه)",
    "hero.cta.secondary": "تعرف أكثر",
    "hero.trust.clients": "أكثر من 500 عميل راضي",
    "hero.trust.deals": "نسبة نجاح 95%",
    "hero.trust.secure": "معاملات آمنة 100%",
    
    // How It Works
    "how.title": "كيف يعمل النظام",
    "how.step1.title": "احجز استشارتك",
    "how.step1.desc": "ادفع 200 جنيه مصري واحصل على استشارة شخصية",
    "how.step2.title": "املأ ملفك الشخصي",
    "how.step2.desc": "أخبرنا عن ميزانيتك وتفضيلاتك الاستثمارية",
    "how.step3.title": "احصل على التوصيات",
    "how.step3.desc": "تحليل شامل للسوق مع توصيات مخصصة",
    
    // Features
    "features.title": "لماذا تختارنا",
    "features.analysis.title": "تحليل سوقي متقدم",
    "features.analysis.desc": "بيانات دقيقة ومحدثة عن أسعار العقارات والاتجاهات",
    "features.matching.title": "مطابقة ذكية",
    "features.matching.desc": "نربطك بالعقارات والمطورين الأنسب لك",
    "features.risk.title": "تحليل المخاطر",
    "features.risk.desc": "فحص شامل للعقود وتقييم المخاطر",
    
    // Dashboard
    "dashboard.welcome": "مرحباً",
    "dashboard.stats.consultations": "الاستشارات",
    "dashboard.stats.properties": "العقارات المحفوظة",
    "dashboard.stats.completion": "اكتمال الملف",
    "dashboard.recent": "النشاطات الأخيرة",
    "dashboard.recommendations": "التوصيات",
    
    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.submit": "إرسال",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.view": "عرض",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.close": "إغلاق",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.properties": "Properties",
    "nav.consultations": "Consultations",
    "nav.market": "Market Analysis",
    "nav.developers": "Developers",
    "nav.profile": "Profile",
    "nav.logout": "Log Out",
    "nav.login": "Log In",
    
    // Landing Page
    "hero.title": "Your Real Estate Investment Starts with Trusted Advice",
    "hero.subtitle": "Get specialized market analysis and personalized recommendations for your property investments",
    "hero.cta.primary": "Start Consultation (200 EGP)",
    "hero.cta.secondary": "Learn More",
    "hero.trust.clients": "Over 500 Satisfied Clients",
    "hero.trust.deals": "95% Success Rate",
    "hero.trust.secure": "100% Secure Transactions",
    
    // How It Works
    "how.title": "How It Works",
    "how.step1.title": "Book Your Consultation",
    "how.step1.desc": "Pay 200 EGP and get a personalized consultation",
    "how.step2.title": "Complete Your Profile",
    "how.step2.desc": "Tell us about your budget and investment preferences",
    "how.step3.title": "Get Recommendations",
    "how.step3.desc": "Comprehensive market analysis with tailored recommendations",
    
    // Features
    "features.title": "Why Choose Us",
    "features.analysis.title": "Advanced Market Analysis",
    "features.analysis.desc": "Accurate and up-to-date property pricing and trend data",
    "features.matching.title": "Smart Matching",
    "features.matching.desc": "We connect you with the best properties and developers",
    "features.risk.title": "Risk Analysis",
    "features.risk.desc": "Comprehensive contract review and risk assessment",
    
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.stats.consultations": "Consultations",
    "dashboard.stats.properties": "Saved Properties",
    "dashboard.stats.completion": "Profile Completion",
    "dashboard.recent": "Recent Activity",
    "dashboard.recommendations": "Recommendations",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.close": "Close",
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'en' || stored === 'ar') ? stored : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  const value: I18nContextType = {
    language,
    setLanguage: setLanguageState,
    t,
    dir: language === 'ar' ? 'rtl' : 'ltr',
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
