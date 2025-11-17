import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium"
      data-testid="button-language-toggle"
      aria-label="Toggle language"
    >
      {language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
}
