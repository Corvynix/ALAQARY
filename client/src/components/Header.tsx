import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  language: "ar" | "en";
  onLanguageToggle: () => void;
  onNavigate: (page: string) => void;
}

export default function Header({ language, onLanguageToggle, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = {
    ar: {
      brand: "العقاري",
      home: "الرئيسية",
      properties: "العقارات",
      insights: "رؤى السوق",
      blog: "المدونة",
      about: "من نحن",
      contact: "اتصل بنا",
      cta: "استشارة مجانية"
    },
    en: {
      brand: "ALAQARY",
      home: "Home",
      properties: "Properties",
      insights: "Market Insights",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      cta: "Free Consultation"
    }
  };

  const menuItems = [
    { key: "home", label: content[language].home },
    { key: "properties", label: content[language].properties },
    { key: "insights", label: content[language].insights },
    { key: "blog", label: content[language].blog },
    { key: "about", label: content[language].about },
    { key: "contact", label: content[language].contact }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-gradient-to-b from-black/95 via-[#0d0d0d]/95 to-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate("home")}
            className={`text-2xl font-bold tracking-wider bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
            data-testid="link-brand"
            style={{
              textShadow: '0 0 30px rgba(217, 165, 67, 0.3)'
            }}
          >
            {content[language].brand}
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`text-sm font-medium text-white/80 hover:text-primary transition-all duration-300 ${language === 'ar' ? 'font-arabic' : ''}`}
                data-testid={`link-${item.key}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle language={language} onToggle={onLanguageToggle} />
          
          <Button 
            className="hidden md:inline-flex"
            onClick={() => onNavigate("contact")}
            data-testid="button-cta-header"
          >
            {content[language].cta}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-medium hover:text-primary transition-colors text-left ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                data-testid={`link-mobile-${item.key}`}
              >
                {item.label}
              </button>
            ))}
            <Button 
              className="w-full mt-2"
              onClick={() => {
                onNavigate("contact");
                setMobileMenuOpen(false);
              }}
            >
              {content[language].cta}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
