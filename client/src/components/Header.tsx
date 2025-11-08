import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  language: "ar" | "en";
  onLanguageToggle: () => void;
}

export default function Header({ language, onLanguageToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = {
    ar: {
      brand: "العقري",
      home: "الرئيسية",
      properties: "العقارات",
      insights: "رؤى السوق",
      blog: "المدونة",
      roiCalculator: "حاسبة الاستثمار",
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
      roiCalculator: "ROI Calculator",
      about: "About",
      contact: "Contact",
      cta: "Free Consultation"
    }
  };

  const menuItems = [
    { key: "home", label: content[language].home, path: "/" },
    { key: "properties", label: content[language].properties, path: "/properties" },
    { key: "insights", label: content[language].insights, path: "/insights" },
    { key: "blog", label: content[language].blog, path: "/blog" },
    { key: "roiCalculator", label: content[language].roiCalculator, path: "/roi-calculator" },
    { key: "about", label: content[language].about, path: "/about" },
    { key: "contact", label: content[language].contact, path: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-gradient-to-b from-black/95 via-[#0d0d0d]/95 to-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span 
              className={`text-2xl font-bold tracking-wider bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text cursor-pointer ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
              data-testid="link-brand"
              style={{
                textShadow: '0 0 30px rgba(217, 165, 67, 0.3)'
              }}
            >
              {content[language].brand}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link key={item.key} href={item.path}>
                <span
                  className={`text-sm font-medium text-white/80 hover:text-primary transition-all duration-300 cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}
                  data-testid={`link-${item.key}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle language={language} onToggle={onLanguageToggle} />
          
          <Button 
            className="hidden md:inline-flex"
            data-testid="button-cta-header"
            onClick={() => window.location.href = '/contact'}
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
        <div className="md:hidden border-t border-primary/10 bg-black/95 p-4">
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span
                  className={`text-sm font-medium hover:text-primary transition-colors text-left cursor-pointer ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                  data-testid={`link-mobile-${item.key}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Button 
              className="w-full mt-2"
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = '/contact';
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
