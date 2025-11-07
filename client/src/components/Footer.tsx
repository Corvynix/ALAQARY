import { Mail, Phone, MapPin } from "lucide-react";
import { SiLinkedin, SiFacebook, SiInstagram } from "react-icons/si";
import { Link } from "wouter";

interface FooterProps {
  language: "ar" | "en";
}

export default function Footer({ language }: FooterProps) {
  const content = {
    ar: {
      brand: "العقاري",
      tagline: "نحوّل المعرفة والقرارات إلى ثروة",
      quickLinks: "روابط سريعة",
      home: "الرئيسية",
      properties: "العقارات",
      insights: "رؤى السوق",
      blog: "المدونة",
      about: "من نحن",
      contact: "اتصل بنا",
      contactInfo: "معلومات الاتصال",
      email: "info@alaqary.com",
      phone: "+20 123 456 7890",
      address: "القاهرة، مصر",
      followUs: "تابعنا",
      copyright: "© 2025 العقاري - جميع الحقوق محفوظة"
    },
    en: {
      brand: "ALAQARY",
      tagline: "Turn data and decisions into wealth",
      quickLinks: "Quick Links",
      home: "Home",
      properties: "Properties",
      insights: "Market Insights",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      contactInfo: "Contact Info",
      email: "info@alaqary.com",
      phone: "+20 123 456 7890",
      address: "Cairo, Egypt",
      followUs: "Follow Us",
      copyright: "© 2025 ALAQARY - All rights reserved"
    }
  };

  const links = [
    { key: "home", label: content[language].home, path: "/" },
    { key: "properties", label: content[language].properties, path: "/properties" },
    { key: "insights", label: content[language].insights, path: "/insights" },
    { key: "blog", label: content[language].blog, path: "/blog" },
    { key: "about", label: content[language].about, path: "/about" },
    { key: "contact", label: content[language].contact, path: "/contact" }
  ];

  const socialLinks = [
    { icon: SiLinkedin, url: "#", label: "LinkedIn", color: "#0A66C2" },
    { icon: SiFacebook, url: "#", label: "Facebook", color: "#1877F2" },
    { icon: SiInstagram, url: "#", label: "Instagram", color: "instagram" }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0d0d0d] to-black border-t border-primary/10 mt-20">
      <div className="container px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className={`text-2xl font-bold mb-3 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
              {content[language].brand}
            </div>
            <p className={`text-sm text-white/60 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].tagline}
            </p>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].quickLinks}
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.key}>
                  <Link href={link.path}>
                    <span
                      className={`text-sm text-white/60 hover:text-primary transition-all duration-300 cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}
                      data-testid={`link-footer-${link.key}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].contactInfo}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 text-primary" />
                <span data-testid="text-email">{content[language].email}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-primary" />
                <span data-testid="text-phone">{content[language].phone}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-white/60 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <MapPin className="h-4 w-4 text-primary" />
                <span data-testid="text-address">{content[language].address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].followUs}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                const isInstagram = social.color === "instagram";
                return (
                  <a
                    key={index}
                    href={social.url}
                    className={`hover-elevate active-elevate-2 p-2 rounded-md border transition-all duration-300 ${
                      isInstagram 
                        ? 'border-pink-500/20 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-orange-500/10 hover:border-pink-500/40' 
                        : 'border-white/10 bg-black/40 hover:border-white/30'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-social-${index}`}
                    style={!isInstagram ? { color: social.color } : undefined}
                  >
                    <Icon 
                      className="h-5 w-5" 
                      style={isInstagram ? {
                        background: 'linear-gradient(45deg, #E4405F, #F77737, #FCAF45)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : undefined}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className={`text-sm text-white/40 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {content[language].copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
