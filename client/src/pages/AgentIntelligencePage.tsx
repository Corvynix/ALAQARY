import { useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentIntelligence from "@/components/AgentIntelligence";

export default function AgentIntelligencePage() {
  const [, params] = useRoute("/agents/:id/intelligence");
  const { language, toggleLanguage } = useLanguage();

  if (!params?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
        <Header language={language} onLanguageToggle={toggleLanguage} />
        <main className="p-6">
          <div className="text-center text-muted-foreground">Agent ID required</div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <main>
        <AgentIntelligence agentId={params.id} language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}

