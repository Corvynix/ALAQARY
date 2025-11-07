import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import type { Property, MarketTrend } from "@shared/schema";

export default function HomePage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const { toast } = useToast();

  // Fetch properties from backend
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  // Fetch market trends from backend
  const { data: marketTrendsData = [], isLoading: trendsLoading } = useQuery<MarketTrend[]>({
    queryKey: ["/api/market-trends"]
  });

  // Lead submission mutation
  const submitLeadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await apiRequest("POST", "/api/leads", leadData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "ar" ? "تم الإرسال بنجاح!" : "Successfully Submitted!",
        description: language === "ar" 
          ? "سنتواصل معك قريباً. شكراً لثقتك." 
          : "We will contact you soon. Thank you for your trust.",
      });
    },
    onError: (error) => {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" 
          ? "حدث خطأ أثناء إرسال طلبك. حاول مرة أخرى." 
          : "An error occurred while submitting your request. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting lead:", error);
    },
  });

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
        onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
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

            {propertiesLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading properties...</div>
            ) : (
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
            )}
          </div>
        </section>

        <TestimonialCarousel language={language} testimonials={testimonials} />

        <ContactForm 
          language={language}
          onSubmit={(data) => {
            submitLeadMutation.mutate(data);
          }}
        />
      </main>

      <Footer language={language} />

      <WhatsAppButton 
        phoneNumber="201234567890"
        language={language}
      />
    </div>
  );
}
