import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  return (
    <Header 
      language={language} 
      onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
    />
  );
}
