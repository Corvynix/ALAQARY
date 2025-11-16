import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      data-testid="button-language-toggle"
      className="relative"
    >
      <Globe className="w-5 h-5" />
      <span className="absolute bottom-0 end-0 text-[10px] font-bold">
        {language === 'ar' ? 'EN' : 'ع'}
      </span>
    </Button>
  );
}
