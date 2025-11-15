import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";
import HeroSection from "@/components/HeroSection";
import UserTypeSelector, { type UserType } from "@/components/UserTypeSelector";
import DynamicContentSection from "@/components/DynamicContentSection";
import MarketSnapshot from "@/components/MarketSnapshot";
import TrustSection from "@/components/TrustSection";
import PropertyCard from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import PropertyFilters from "@/components/PropertyFilters";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Property, MarketTrend } from "@shared/schema";

export default function HomePage() {
  const { language, toggleLanguage } = useLanguage();
  const { toast } = useToast();
  const { trackTestimonialView, trackFormSubmit, sessionId, trackBehavior } = useFunnelTracking();
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  const handleUserTypeSelection = (type: UserType) => {
    setSelectedUserType(type);
    
    if (type) {
      trackBehavior({
        behaviorType: "user_interaction",
        action: "select_user_type",
        target: "user_type_selector",
        targetId: type,
        metadata: {
          userType: type,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

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
      // Add sessionId to lead data
      const leadWithSession = {
        ...leadData,
        sessionId,
      };
      const response = await apiRequest("POST", "/api/leads", leadWithSession);
      return response.json();
    },
    onSuccess: (data) => {
      // Track form submission with leadId
      if (data?.id) {
        trackFormSubmit("contact_form", data.id);
      }
      
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
    id: trend.id,
    city: trend.city,
    avgPrice: `${(Number(trend.avgPrice) / 1000000).toFixed(1)}M EGP`,
    changePercent: Number(trend.changePercent),
    demandLevel: trend.demandLevel as "high" | "medium" | "low",
    views: 0 // Default value for views
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
      name: "أحمد محمود الشافعي",
      role: "مستثمر عقاري - القاهرة الجديدة",
      content: "اشتريت 3 وحدات في التجمع الخامس بناءً على نصيحته. كان دقيق جداً في تحليل السوق ونصحني بالتوقيت المثالي للشراء. استثماري نما بنسبة 42% في 14 شهر فقط. ما كنتش هوصل للنتيجة دي من غير خبرته.",
      initial: "أ"
    },
    {
      name: "سارة عبد الله منصور",
      role: "مديرة تنفيذية - المعادي",
      content: "مش مجرد مستشار عقاري، ده شريك نجاح حقيقي. فهم احتياجات عائلتي بدقة وساعدني أوصل لفيلا الأحلام في المعادي الجديدة. كل التفاصيل كانت مظبوطة: المساحة، الموقع، السعر، وحتى الجيران. شكراً من القلب.",
      initial: "س"
    },
    {
      name: "محمد علي حسن",
      role: "رجل أعمال - الساحل الشمالي",
      content: "الخبرة والاحترافية في أعلى مستوياتها. ساعدني في شراء شاليه على البحر بسعر ممتاز وفي أفضل موقع. كل نصيحة كانت مبنية على دراسة عميقة للسوق والأسعار الحقيقية مش المبالغ فيها. أنصح بشدة بالتعامل معه لأي حد عايز يستثمر صح.",
      initial: "م"
    },
    {
      name: "منى إبراهيم السيد",
      role: "صيدلانية - 6 أكتوبر",
      content: "كنت خايفة من خطوة شراء أول عقار، بس هو طمّنّي وشرح لي كل حاجة بالتفصيل. ساعدني أختار شقة في 6 أكتوبر بسعر مناسب وموقع ممتاز. دلوقتي أنا وعائلتي عايشين في بيت أحلامنا. ربنا يباركله في شغله.",
      initial: "م"
    },
    {
      name: "خالد يوسف الدمرداش",
      role: "مهندس - الشروق",
      content: "أفضل قرار اتخذته كان الاستعانة به قبل ما أشتري. وفّر علي وقت ومجهود كبير، ونصحني بعقار في الشروق بسعر تنافسي جداً. دلوقتي بعد سنتين، قيمة العقار زادت بنسبة كبيرة. شكراً على الأمانة والاحترافية.",
      initial: "خ"
    },
    {
      name: "دينا فؤاد عثمان",
      role: "محامية - الإسكندرية",
      content: "تعاملت معاه في شراء شقة بإطلالة على البحر في الإسكندرية. كانت تجربة استثنائية من البداية للنهاية. ساعدني في كل الإجراءات القانونية وتأكد إن كل الأوراق سليمة 100%. الاحترافية والأمانة في أعلى مستوى.",
      initial: "د"
    },
    {
      name: "عمر السيد طه",
      role: "مطوّر عقاري - القاهرة",
      content: "كمطوّر عقاري، أنا بتعامل مع محترفين كتير في المجال. بس مستوى الخبرة والتحليل اللي عنده نادر جداً. ساعدني في اختيار أرض في موقع استراتيجي بسعر ممتاز. المشروع دلوقتي من أنجح مشاريعي. أنصح أي مستثمر يستشيره.",
      initial: "ع"
    },
    {
      name: "ياسمين محمد فتحي",
      role: "ربة منزل - مدينة نصر",
      content: "أنا وزوجي كنا محتارين نختار بين عدة شقق في مدينة نصر. جه هو وساعدنا نختار الأنسب من حيث المساحة والموقع والسعر. شرح لنا كل التفاصيل ببساطة ووضوح. دلوقتي احنا سعداء جداً بقرارنا. جزاه الله خيراً.",
      initial: "ي"
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

        <UserTypeSelector 
          language={language} 
          onSelectUserType={handleUserTypeSelection}
          selectedType={selectedUserType}
        />

        <DynamicContentSection 
          language={language} 
          userType={selectedUserType}
          onCTAClick={scrollToContact}
        />

        <MarketSnapshot language={language} data={marketData} />

        <TrustSection language={language} />

        <section className="py-20 px-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black" data-testid="section-properties">
          <div className="max-w-7xl mx-auto">
            <h2 
              className={`text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
            >
              {language === "ar" ? "عقارات مميزة" : "Featured Properties"}
            </h2>

            <PropertyFilters 
              language={language}
              onFilterChange={(filters) => console.log('Filters:', filters)}
            />

            {propertiesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
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

        <TestimonialCarousel 
          language={language} 
          testimonials={testimonials}
          onView={() => trackTestimonialView()}
        />

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
