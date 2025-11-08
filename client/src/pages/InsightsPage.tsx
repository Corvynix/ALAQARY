import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketSnapshot from "@/components/MarketSnapshot";
import { mockMarketTrends } from "@/data/mockData";

export default function InsightsPage() {
  const { language, toggleLanguage } = useLanguage();

  const marketTrendsData = mockMarketTrends;

  const marketData = marketTrendsData.map(trend => ({
    id: trend.id,
    city: trend.city,
    avgPrice: `${(Number(trend.avgPrice) / 1000000).toFixed(1)}M EGP`,
    changePercent: Number(trend.changePercent),
    demandLevel: trend.demandLevel as "high" | "medium" | "low",
    views: 0
  }));

  const handleTrendClick = (trendId: string) => {
    console.log('Trend clicked:', trendId);
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

          <MarketSnapshot language={language} data={marketData} onTrendClick={handleTrendClick} />
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
