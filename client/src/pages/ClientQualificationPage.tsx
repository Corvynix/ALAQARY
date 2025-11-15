import { useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientQualification from "@/components/ClientQualification";

export default function ClientQualificationPage() {
  const [, params] = useRoute("/clients/:leadId/qualification");
  const { language, toggleLanguage } = useLanguage();

  if (!params?.leadId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
        <Header language={language} onLanguageToggle={toggleLanguage} />
        <main className="p-6">
          <div className="text-center text-muted-foreground">Lead ID required</div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <main>
        <ClientQualification leadId={params.leadId} language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}

