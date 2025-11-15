import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";
import HeroSection from "@/components/HeroSection";
import UserTypeSelector, { type UserType } from "@/components/UserTypeSelector";
import DynamicContentSection from "@/components/DynamicContentSection";
import TrustSection from "@/components/TrustSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const testimonialsData = {
    ar: [
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
    ],
    en: [
      {
        name: "Ahmed Mahmoud El-Shafei",
        role: "Real Estate Investor - New Cairo",
        content: "I purchased 3 units in the Fifth Settlement based on his advice. He was extremely precise in market analysis and advised me on the perfect timing to buy. My investment grew by 42% in just 14 months. I would never have achieved this result without his expertise.",
        initial: "A"
      },
      {
        name: "Sarah Abdullah Mansour",
        role: "Executive Manager - Maadi",
        content: "Not just a real estate consultant, but a true success partner. He understood my family's needs accurately and helped me reach my dream villa in New Maadi. Every detail was perfect: space, location, price, and even the neighbors. Thank you from the heart.",
        initial: "S"
      },
      {
        name: "Mohamed Ali Hassan",
        role: "Businessman - North Coast",
        content: "Expertise and professionalism at their highest levels. He helped me purchase a beachfront chalet at an excellent price and in the best location. Every piece of advice was based on deep market research and real prices, not inflated ones. I highly recommend working with him for anyone looking to invest wisely.",
        initial: "M"
      },
      {
        name: "Mona Ibrahim El-Sayed",
        role: "Pharmacist - 6th of October",
        content: "I was afraid of taking the step to buy my first property, but he reassured me and explained everything in detail. He helped me choose an apartment in 6th of October at a suitable price and excellent location. Now my family and I are living in our dream home. May God bless his work.",
        initial: "M"
      },
      {
        name: "Khaled Youssef El-Damardash",
        role: "Engineer - El Shorouk",
        content: "The best decision I made was consulting him before buying. He saved me a lot of time and effort, and advised me on a property in El Shorouk at a very competitive price. Now after two years, the property value has increased significantly. Thank you for the honesty and professionalism.",
        initial: "K"
      },
      {
        name: "Dina Fouad Osman",
        role: "Lawyer - Alexandria",
        content: "I worked with him on purchasing a sea-view apartment in Alexandria. It was an exceptional experience from start to finish. He helped me with all legal procedures and ensured all documents were 100% sound. Professionalism and honesty at the highest level.",
        initial: "D"
      },
      {
        name: "Omar El-Sayed Taha",
        role: "Real Estate Developer - Cairo",
        content: "As a real estate developer, I work with many professionals in the field. But the level of expertise and analysis he has is very rare. He helped me choose land in a strategic location at an excellent price. The project is now one of my most successful projects. I advise any investor to consult him.",
        initial: "O"
      },
      {
        name: "Yasmine Mohamed Fathy",
        role: "Homemaker - Nasr City",
        content: "My husband and I were confused about choosing between several apartments in Nasr City. He came and helped us choose the most suitable one in terms of space, location, and price. He explained all the details simply and clearly. Now we are very happy with our decision. May God reward him.",
        initial: "Y"
      }
    ]
  };

  const testimonials = testimonialsData[language];

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

        <TrustSection language={language} />

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
