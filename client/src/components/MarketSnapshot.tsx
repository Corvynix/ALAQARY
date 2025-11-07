import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Home } from "lucide-react";

interface MarketData {
  city: string;
  avgPrice: string;
  changePercent: number;
  demandLevel: "high" | "medium" | "low";
}

interface MarketSnapshotProps {
  language: "ar" | "en";
  data: MarketData[];
}

export default function MarketSnapshot({ language, data }: MarketSnapshotProps) {
  const content = {
    ar: {
      title: "نظرة سريعة على السوق",
      avgPrice: "متوسط السعر",
      demand: "الطلب"
    },
    en: {
      title: "Market Snapshot",
      avgPrice: "Avg Price",
      demand: "Demand"
    }
  };

  const demandLabels = {
    ar: { high: "مرتفع", medium: "متوسط", low: "منخفض" },
    en: { high: "High", medium: "Medium", low: "Low" }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black" data-testid="section-market-snapshot">
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          data-testid="text-market-title"
        >
          {content[language].title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <Card 
              key={index} 
              className="hover-elevate active-elevate-2 transition-all bg-gradient-to-br from-black/80 to-[#0d0d0d]/80 border-primary/20"
              data-testid={`card-market-${index}`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className={`text-lg font-semibold text-primary ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {item.city}
                </CardTitle>
                <Home className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/50">{content[language].avgPrice}</p>
                    <p className="text-2xl font-bold text-white" data-testid={`text-price-${index}`}>{item.avgPrice}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.changePercent > 0 ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span 
                        className={`text-sm font-semibold ${item.changePercent > 0 ? 'text-primary' : 'text-destructive'}`}
                        data-testid={`text-change-${index}`}
                      >
                        {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                      </span>
                    </div>
                    
                    <span className="text-sm text-white/60">
                      {demandLabels[language][item.demandLevel]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
