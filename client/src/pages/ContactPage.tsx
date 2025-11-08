import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactPage() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />

      <main className="py-16">
        <ContactForm 
          language={language} 
          onSubmit={(data) => {
            // Form submission handled in ContactForm component (WhatsApp/Email)
            console.log('Form submitted:', data);
          }}
        />
      </main>

      <WhatsAppButton phoneNumber="20103053555" language={language} />
      <Footer language={language} />
    </div>
  );
}
