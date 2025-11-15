import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MapPin, 
  AlertCircle,
  Building2,
  Star,
  ShieldCheck,
  Flame,
  BarChart3
} from "lucide-react";
import type { MarketTrend, Property } from "@shared/schema";

export default function EnhancedMarketIntelligencePage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  const { data: marketTrends = [] } = useQuery<MarketTrend[]>({
    queryKey: ["/api/market-trends"]
  });
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  const content = {
    ar: {
      title: "ذكاء بيانات السوق",
      subtitle: "رؤى عميقة ومعلومات استراتيجية للسوق العقاري",
      trends: "الاتجاهات",
      hotZones: "المناطق الساخنة",
      developerTrust: "مؤشر ثقة المطورين",
      predictions: "توقعات المستقبل",
      cityName: "المدينة",
      demand: "الطلب",
      growth: "النمو",
      avgPrice: "متوسط السعر",
      high: "مرتفع",
      medium: "متوسط",
      low: "منخفض",
      trustScore: "درجة الثقة",
      projects: "المشاريع",
      reliability: "الموثوقية"
    },
    en: {
      title: "Market Data Intelligence",
      subtitle: "Deep insights and strategic intelligence for real estate market",
      trends: "Trends",
      hotZones: "Hot Zones",
      developerTrust: "Developer Trust Index",
      predictions: "Future Predictions",
      cityName: "City",
      demand: "Demand",
      growth: "Growth",
      avgPrice: "Avg Price",
      high: "High",
      medium: "Medium",
      low: "Low",
      trustScore: "Trust Score",
      projects: "Projects",
      reliability: "Reliability"
    }
  };

  const hotZones = marketTrends
    .filter(t => t.demandLevel === "high")
    .sort((a, b) => Number(b.changePercent) - Number(a.changePercent))
    .slice(0, 5);

  const getDeveloperTrustScore = (developer: string) => {
    const developerProperties = properties.filter(p => p.developer === developer);
    const soldCount = developerProperties.filter(p => p.status === "sold").length;
    const totalCount = developerProperties.length;
    return totalCount > 0 ? Math.floor((soldCount / totalCount) * 100) : 0;
  };

  const developers = Array.from(new Set(properties.map(p => p.developer).filter(Boolean)))
    .map(dev => ({
      name: dev as string,
      trustScore: getDeveloperTrustScore(dev as string),
      projectCount: properties.filter(p => p.developer === dev).length,
      totalValue: properties
        .filter(p => p.developer === dev)
        .reduce((sum, p) => sum + Number(p.price), 0)
    }))
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 10);

  const getDemandBadge = (level: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      high: { variant: "default", label: content[language].high },
      medium: { variant: "secondary", label: content[language].medium },
      low: { variant: "destructive", label: content[language].low }
    };
    return variants[level] || variants.medium;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className={`text-4xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].title}
            </h1>
            <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].subtitle}
            </p>
          </div>

          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full lg:w-auto lg:inline-grid">
              <TabsTrigger value="trends" data-testid="tab-trends">
                <BarChart3 className="h-4 w-4 ml-2" />
                {content[language].trends}
              </TabsTrigger>
              <TabsTrigger value="hotzones" data-testid="tab-hotzones">
                <Flame className="h-4 w-4 ml-2" />
                {content[language].hotZones}
              </TabsTrigger>
              <TabsTrigger value="developers" data-testid="tab-developers">
                <ShieldCheck className="h-4 w-4 ml-2" />
                {content[language].developerTrust}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4">
                {marketTrends.map((trend) => {
                  const badge = getDemandBadge(trend.demandLevel || 'medium');
                  return (
                    <Card key={trend.id} data-testid={`card-trend-${trend.city}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                            <MapPin className="h-5 w-5" />
                            {trend.city}
                          </CardTitle>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className={`text-sm text-muted-foreground mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {content[language].avgPrice}
                            </div>
                            <div className="text-2xl font-bold">
                              {(Number(trend.avgPrice) / 1000000).toFixed(1)}M EGP
                            </div>
                          </div>
                          <div>
                            <div className={`text-sm text-muted-foreground mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {content[language].growth}
                            </div>
                            <div className={`text-2xl font-bold ${Number(trend.changePercent) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {Number(trend.changePercent) > 0 ? '+' : ''}{Number(trend.changePercent).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className={`text-sm text-muted-foreground mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {content[language].demand}
                            </div>
                            <Progress value={trend.demandLevel === 'high' ? 90 : trend.demandLevel === 'medium' ? 60 : 30} className="mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="hotzones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Flame className="h-5 w-5 text-orange-500" />
                    {content[language].hotZones}
                  </CardTitle>
                  <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'المناطق الأسرع نمواً في السوق' : 'Fastest growing areas in the market'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hotZones.map((zone, idx) => (
                      <div key={zone.id} className="flex items-center gap-4" data-testid={`hotzone-${idx}`}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{zone.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {(Number(zone.avgPrice) / 1000000).toFixed(1)}M EGP
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-bold">+{Number(zone.changePercent).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">{content[language].growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="developers" className="space-y-4">
              <div className="grid gap-4">
                {developers.map((dev, idx) => (
                  <Card key={idx} data-testid={`card-developer-${idx}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          <Building2 className="h-5 w-5" />
                          {dev.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="font-bold">{dev.trustScore}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className={`flex items-center justify-between gap-2 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                            <span className="text-sm">{content[language].trustScore}</span>
                            <span className="text-sm font-semibold">{dev.trustScore}%</span>
                          </div>
                          <Progress value={dev.trustScore} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {content[language].projects}
                            </div>
                            <div className="font-semibold">{dev.projectCount}</div>
                          </div>
                          <div>
                            <div className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                              {language === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}
                            </div>
                            <div className="font-semibold">{(dev.totalValue / 1000000).toFixed(1)}M</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
