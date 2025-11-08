import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import MarketSnapshot from "@/components/MarketSnapshot";
import TrustSection from "@/components/TrustSection";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProperties, mockMarketTrends } from "@/data/mockData";

export default function HomePage() {
  const { language, toggleLanguage } = useLanguage();

  // Use mock data instead of API calls
  const properties = mockProperties;
  const marketTrendsData = mockMarketTrends;

  // Transform market trends data for MarketSnapshot component
  const marketData = marketTrendsData.map(trend => ({
    city: trend.city,
    avgPrice: `${(Number(trend.avgPrice) / 1000000).toFixed(1)}M EGP`,
    changePercent: Number(trend.changePercent),
    demandLevel: trend.demandLevel as "high" | "medium" | "low"
  }));

  // Transform properties data for PropertyCard component
  const transformedProperties = properties.slice(0, 6).map(property => ({
    id: property.id,
    title: language === "ar" ? property.title : (property.titleEn || property.title),
    city: property.city,
    propertyType: property.propertyType,
    price: `${(Number(property.price) / 1000000).toFixed(1)}M EGP`,
    sizeSqm: Number(property.sizeSqm),
    description: language === "ar" ? (property.description || "") : (property.descriptionEn || property.description || ""),
    image: property.images[0] || "/placeholder.png",
    status: property.status as "available" | "sold" | "reserved"
  }));

  const testimonials = [
    {
      name: "أحمد محمود",
      role: "مستثمر عقاري",
      content: "ساعدني في اختيار العقار المثالي. التوجيه كان احترافي جداً والنتيجة فاقت توقعاتي. استثماري نما بنسبة 40% في سنة واحدة.",
      initial: "أ"
    },
    {
      name: "سارة عبد الله",
      role: "مالكة منزل",
      content: "مش مجرد مستشار عقاري، ده شريك نجاح حقيقي. فهم احتياجاتي وساعدني أوصل لحلم البيت اللي كنت بحلم بيه.",
      initial: "س"
    },
    {
      name: "محمد علي",
      role: "رجل أعمال",
      content: "الخبرة والاحترافية في أعلى مستوياتها. كل نصيحة كانت مبنية على دراسة عميقة للسوق. أنصح بشدة بالتعامل معه.",
      initial: "م"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.querySelector('[data-testid="section-contact"]');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />

      <main>
        <HeroSection 
          language={language} 
          onCTAClick={scrollToContact}
        />

        <MarketSnapshot language={language} data={marketData} />

        <TrustSection language={language} />

        <section className="py-16 px-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black" data-testid="section-properties">
          <div className="max-w-7xl mx-auto">
            <h2 
              className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
            >
              {language === "ar" ? "عقارات مميزة" : "Featured Properties"}
            </h2>

            <PropertyFilters 
              language={language}
              onFilterChange={(filters) => console.log('Filters:', filters)}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  language={language}
                  onLearnMore={(id) => console.log('Learn more:', id)}
                />
              ))}
            </div>
          </div>
        </section>

        <TestimonialCarousel language={language} testimonials={testimonials} />

        <ContactForm 
          language={language}
          onSubmit={(data) => {
            // Form submission handled in ContactForm component (WhatsApp/Email)
            console.log('Form submitted:', data);
          }}
        />
      </main>

      <Footer language={language} />

      <WhatsAppButton 
        phoneNumber="20103053555"
        language={language}
      />
    </div>
  );
}
