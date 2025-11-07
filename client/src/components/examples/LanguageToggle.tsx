import { useState } from 'react';
import LanguageToggle from '../LanguageToggle';

export default function LanguageToggleExample() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  return (
    <div className="p-6">
      <LanguageToggle 
        language={language} 
        onToggle={() => setLanguage(language === "ar" ? "en" : "ar")} 
      />
      <p className="mt-4 text-sm text-muted-foreground">
        Current language: {language === "ar" ? "Arabic" : "English"}
      </p>
    </div>
  );
}
