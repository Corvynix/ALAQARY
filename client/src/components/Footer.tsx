import { Mail, Phone, MapPin } from "lucide-react";
import { SiLinkedin, SiFacebook, SiInstagram } from "react-icons/si";

interface FooterProps {
  language: "ar" | "en";
}

export default function Footer({ language }: FooterProps) {
  const content = {
    ar: {
      brand: "مستشارك العقاري",
      tagline: "نبني قرارات ثروة مش عقارات",
      quickLinks: "روابط سريعة",
      home: "الرئيسية",
      properties: "العقارات",
      insights: "رؤى السوق",
      blog: "المدونة",
      about: "من نحن",
      contact: "اتصل بنا",
      contactInfo: "معلومات الاتصال",
      email: "info@realestate.com",
      phone: "+20 123 456 7890",
      address: "القاهرة، مصر",
      followUs: "تابعنا",
      copyright: "© 2025 جميع الحقوق محفوظة"
    },
    en: {
      brand: "Real Estate Consultant",
      tagline: "Building wealth decisions, not just properties",
      quickLinks: "Quick Links",
      home: "Home",
      properties: "Properties",
      insights: "Market Insights",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      contactInfo: "Contact Info",
      email: "info@realestate.com",
      phone: "+20 123 456 7890",
      address: "Cairo, Egypt",
      followUs: "Follow Us",
      copyright: "© 2025 All rights reserved"
    }
  };

  const links = [
    { key: "home", label: content[language].home },
    { key: "properties", label: content[language].properties },
    { key: "insights", label: content[language].insights },
    { key: "blog", label: content[language].blog },
    { key: "about", label: content[language].about },
    { key: "contact", label: content[language].contact }
  ];

  const socialLinks = [
    { icon: SiLinkedin, url: "#", label: "LinkedIn" },
    { icon: SiFacebook, url: "#", label: "Facebook" },
    { icon: SiInstagram, url: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className={`text-xl font-serif font-bold text-primary mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].brand}
            </div>
            <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].tagline}
            </p>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].quickLinks}
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.key}>
                  <button
                    className={`text-sm text-muted-foreground hover:text-primary transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}
                    data-testid={`link-footer-${link.key}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].contactInfo}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span data-testid="text-email">{content[language].email}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span data-testid="text-phone">{content[language].phone}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                <MapPin className="h-4 w-4" />
                <span data-testid="text-address">{content[language].address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].followUs}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="hover-elevate active-elevate-2 p-2 rounded-md border bg-background"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-social-${index}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
            {content[language].copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
