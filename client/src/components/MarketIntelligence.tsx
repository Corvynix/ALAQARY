import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, MapPin, DollarSign, Users, Building2, Zap, Flame } from "lucide-react";
import { useMarketHeatmap } from "@/hooks/useIntelligence";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MarketIntelligenceProps {
  city?: string;
  language: "ar" | "en";
}

export default function MarketIntelligence({ city, language }: MarketIntelligenceProps) {
  const { data: heatmapData, isLoading } = useMarketHeatmap();

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
        <div className="text-muted-foreground">Loading market heatmap...</div>
      </div>
    );
  }

  const areas = heatmapData?.areas || [];
  const filteredAreas = city ? areas.filter(a => a.city.toLowerCase() === city.toLowerCase()) : areas;
  
  if (filteredAreas.length === 0) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].noData}</div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = filteredAreas.slice(0, 10).map(area => ({
    city: area.city,
    heatScore: area.heatScore * 100,
    tier: area.tier,
  }));

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Hot': return '#d9a543'; // Gold
      case 'Warm': return '#f4e4b5'; // Light gold
      case 'Cool': return '#666666'; // Gray
      default: return '#444444';
    }
  };

  const primaryArea = filteredAreas[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].subtitle} {city ? `- ${city}` : ''}
        </p>
      </div>

      {/* Market Heatmap Chart */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Flame className="h-5 w-5 text-[#d9a543]" />
            Market Heatmap - Top Markets by Heat Score
          </CardTitle>
          <CardDescription>
            Heat score combines demand, supply, price trends, and velocity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="city" 
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#888"
              />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="heatScore" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTierColor(entry.tier)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAreas.map((area, index) => (
          <Card key={index} data-testid={`card-market-${area.city}`}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  <MapPin className="h-5 w-5" />
                  {area.city}
                </CardTitle>
                <Badge variant={
                  area.tier === 'Hot' ? 'default' :
                  area.tier === 'Warm' ? 'secondary' : 'outline'
                }>
                  {area.tier}
                </Badge>
              </div>
              <CardDescription>
                Heat Score: {(area.heatScore * 100).toFixed(0)}/100
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Heat Score Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                    Market Heat
                  </span>
                  <span className="text-sm font-bold" style={{ color: getTierColor(area.tier) }}>
                    {(area.heatScore * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={area.heatScore * 100} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Price Change</div>
                  <div className={`font-semibold ${area.priceChange > 0 ? 'text-green-500' : area.priceChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {area.priceChange > 0 ? '+' : ''}{area.priceChange.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Velocity</div>
                  <div className="font-semibold">{area.velocity.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Demand</div>
                  <Badge variant="outline">{area.demandLevel}</Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Supply</div>
                  <Badge variant="outline">{area.supplyLevel}</Badge>
                </div>
              </div>

              {/* Insights */}
              {area.insights && (
                <div className="text-sm text-muted-foreground">
                  {area.insights}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

