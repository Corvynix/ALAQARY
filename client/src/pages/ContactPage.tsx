import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactPage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
      />

      <main className="py-16">
        <ContactForm 
          language={language} 
          onSubmit={(data) => submitLeadMutation.mutate(data)}
        />
      </main>

      <WhatsAppButton phoneNumber="201234567890" language={language} />
      <Footer language={language} />
    </div>
  );
}
