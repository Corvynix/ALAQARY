import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, MapPin, DollarSign, Users, Building2, Zap } from "lucide-react";

interface MarketIntelligenceProps {
  city?: string;
  language: "ar" | "en";
}

export default function MarketIntelligence({ city, language }: MarketIntelligenceProps) {
  const endpoint = city
    ? `/api/market/intelligence/${city}`
    : "/api/market/intelligence";

  const { data: intelligence, isLoading } = useQuery<any[] | any>({
    queryKey: [endpoint],
  });

  const content = {
    ar: {
      title: "ذكاء السوق",
      subtitle: "نَبض البلد - نظرة شاملة على السوق",
      avgPrice: "متوسط السعر",
      dailyDemand: "الطلب اليومي",
      weeklyDemand: "الطلب الأسبوعي",
      monthlyDemand: "الطلب الشهري",
      supply: "العرض المتاح",
      demandSupplyRatio: "نسبة الطلب إلى العرض",
      salesVelocity: "سرعة البيع",
      priceTrend: "اتجاه السعر",
      newProjects: "مشاريع جديدة",
      topBrokers: "أفضل السماسرة",
      hotAreas: "المناطق الساخنة",
      predictions: "التوقعات",
      nextMonthPrice: "السعر المتوقع الشهر القادم",
      nextMonthDemand: "الطلب المتوقع",
      trendingAreas: "المناطق المتوقع ازدهارها",
      up: "صاعد",
      down: "هابط",
      stable: "مستقر",
      noData: "لا توجد بيانات",
    },
    en: {
      title: "Market Intelligence",
      subtitle: "Market Pulse - Comprehensive Market Overview",
      avgPrice: "Average Price",
      dailyDemand: "Daily Demand",
      weeklyDemand: "Weekly Demand",
      monthlyDemand: "Monthly Demand",
      supply: "Available Supply",
      demandSupplyRatio: "Demand/Supply Ratio",
      salesVelocity: "Sales Velocity",
      priceTrend: "Price Trend",
      newProjects: "New Projects",
      topBrokers: "Top Brokers",
      hotAreas: "Hot Areas",
      predictions: "Predictions",
      nextMonthPrice: "Expected Price Next Month",
      nextMonthDemand: "Expected Demand",
      trendingAreas: "Trending Areas",
      up: "Up",
      down: "Down",
      stable: "Stable",
      noData: "No data available",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Loading market intelligence...</div>
      </div>
    );
  }

  const intelligenceData = city ? (intelligence as any) : (intelligence as any[])?.[0];
  
  if (!intelligenceData) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].noData}</div>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (intelligenceData.priceTrend === "up") return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (intelligenceData.priceTrend === "down") return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendLabel = () => {
    if (intelligenceData.priceTrend === "up") return content[language].up;
    if (intelligenceData.priceTrend === "down") return content[language].down;
    return content[language].stable;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].subtitle} - {intelligenceData.city}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].avgPrice}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {(intelligenceData.avgPrice / 1000000).toFixed(1)}M EGP
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">{getTrendLabel()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].monthlyDemand}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {Math.round(intelligenceData.monthlyDemand || 0)}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-2">
              <span>Daily: {intelligenceData.dailyDemand || 0}</span>
              <span>•</span>
              <span>Weekly: {intelligenceData.weeklyDemand || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].supply}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {intelligenceData.supply || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Ratio: {(intelligenceData.demandSupplyRatio || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].salesVelocity}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {intelligenceData.salesVelocity || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-2">deals/month</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Brokers */}
      {intelligenceData.topBrokers && intelligenceData.topBrokers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].topBrokers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligenceData.topBrokers.slice(0, 5).map((broker: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {broker.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{broker.area}</div>
                  </div>
                  <Badge variant="outline">{broker.deals} deals</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hot Areas */}
      {intelligenceData.hotAreas && intelligenceData.hotAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].hotAreas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligenceData.hotAreas.slice(0, 5).map((area: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {area.area}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Demand: {area.demand}
                    </span>
                    {area.growth > 0 && (
                      <Badge variant="secondary">+{area.growth}%</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions */}
      {intelligenceData.predictions && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].predictions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].nextMonthPrice}
                </div>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {(intelligenceData.predictions.nextMonthPrice / 1000000).toFixed(1)}M EGP
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].nextMonthDemand}
                </div>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {Math.round(intelligenceData.predictions.nextMonthDemand || 0)}
                </div>
              </div>
            </div>
            {intelligenceData.predictions.trendingAreas && intelligenceData.predictions.trendingAreas.length > 0 && (
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].trendingAreas}
                </div>
                <div className="flex flex-wrap gap-2">
                  {intelligenceData.predictions.trendingAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="outline">{area}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

