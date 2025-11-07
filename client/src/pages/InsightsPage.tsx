import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketSnapshot from "@/components/MarketSnapshot";
import type { MarketTrend } from "@shared/schema";

export default function InsightsPage() {
  const { language, toggleLanguage } = useLanguage();

  const { data: marketTrendsData = [], isLoading } = useQuery<MarketTrend[]>({
    queryKey: ["/api/market-trends"]
  });

  const marketData = marketTrendsData.map(trend => ({
    id: trend.id,
    city: trend.city,
    avgPrice: `${(Number(trend.avgPrice) / 1000000).toFixed(1)}M EGP`,
    changePercent: Number(trend.changePercent),
    demandLevel: trend.demandLevel as "high" | "medium" | "low",
    views: Number(trend.views || 0)
  }));

  const handleTrendClick = async (trendId: string) => {
    try {
      await fetch(`/api/views/market-trend/${trendId}`, { method: "POST" });
    } catch (error) {
      console.error("Error tracking market trend view:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 
            className={`text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          >
            {language === "ar" ? "رؤى السوق" : "Market Insights"}
          </h1>
          
          <p className={`text-center text-white/70 mb-12 max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === "ar" 
              ? "بيانات السوق الحية واتجاهات الأسعار لاتخاذ قرارات استثمارية ذكية" 
              : "Live market data and price trends for smart investment decisions"}
          </p>

          {isLoading ? (
            <div className="text-center text-primary py-12">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <MarketSnapshot language={language} data={marketData} onTrendClick={handleTrendClick} />
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
