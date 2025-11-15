import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  TrendingUp, 
  Map,
  CheckCircle2,
  DollarSign,
  Users,
  BarChart3,
  Rocket
} from "lucide-react";
import type { MarketTrend, Property, Lead } from "@shared/schema";

export default function DeveloperDashboardPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  const { data: marketTrends = [] } = useQuery<MarketTrend[]>({
    queryKey: ["/api/market-trends"]
  });
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });
  
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"]
  });
  
  const myProjects = properties.filter(p => 
    p.developer === user?.companyName || p.developer === user?.fullName
  );
  
  const totalValue = myProjects.reduce((sum, p) => sum + Number(p.price), 0);
  const availableUnits = myProjects.filter(p => p.status === "available").length;
  const soldUnits = myProjects.filter(p => p.status === "sold").length;

  const statsCards = [
    {
      title: "إجمالي المشاريع",
      value: myProjects.length,
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "وحدات متاحة",
      value: availableUnits,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "وحدات مباعة",
      value: soldUnits,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "القيمة الإجمالية",
      value: `${(totalValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  const hotZones = marketTrends
    .filter(t => t.demandLevel === "high")
    .sort((a, b) => Number(b.changePercent) - Number(a.changePercent))
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم المطور العقاري</h1>
            <p className="text-muted-foreground mt-1">
              مرحباً {user?.companyName || user?.fullName} - إدارة مشاريعك وتحليل السوق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat) => (
              <Card key={stat.title} data-testid={`card-stat-${stat.title}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="heatmap" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full lg:w-auto lg:inline-grid">
              <TabsTrigger value="heatmap" data-testid="tab-heatmap">
                <Map className="h-4 w-4 ml-2" />
                خريطة الطلب
              </TabsTrigger>
              <TabsTrigger value="launch" data-testid="tab-launch">
                <Rocket className="h-4 w-4 ml-2" />
                فحص الإطلاق
              </TabsTrigger>
              <TabsTrigger value="pricing" data-testid="tab-pricing">
                <DollarSign className="h-4 w-4 ml-2" />
                توصيات التسعير
              </TabsTrigger>
              <TabsTrigger value="approval" data-testid="tab-approval">
                <BarChart3 className="h-4 w-4 ml-2" />
                نظام التقييم
              </TabsTrigger>
            </TabsList>

            <TabsContent value="heatmap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-blue-500" />
                    خريطة الطلب الحرارية
                  </CardTitle>
                  <CardDescription>
                    المناطق الأكثر طلباً ونمواً في السوق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hotZones.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد بيانات كافية حالياً
                      </p>
                    ) : (
                      hotZones.map((zone) => (
                        <div 
                          key={zone.id}
                          className="flex items-center justify-between gap-4 p-4 rounded-md border hover-elevate active-elevate-2"
                          data-testid={`zone-item-${zone.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{zone.city}</h4>
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                طلب مرتفع
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4 flex-wrap">
                              <span>متوسط السعر: {Number(zone.avgPrice).toLocaleString()} EGP</span>
                              <span>• نمو: +{zone.changePercent}%</span>
                              <span>• العرض: {zone.supply}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              +{zone.changePercent}%
                            </p>
                            <p className="text-xs text-muted-foreground">التغيير</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="launch" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-500" />
                    فحص جاهزية إطلاق المشروع
                  </CardTitle>
                  <CardDescription>
                    تحليل شامل لتحديد أفضل توقيت وإستراتيجية للإطلاق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">تقييم السوق</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">مستوى الطلب</span>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                              مرتفع
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">المنافسة</span>
                            <Badge variant="secondary">متوسطة</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">اتجاه السوق</span>
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                              صاعد
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">التوصيات</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>أفضل توقيت للإطلاق: خلال الـ 30 يوم القادمة</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>ركز التسويق على فئة العملاء من 30-45 سنة</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>قدم خطط سداد مرنة لزيادة معدل التحويل</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                    توصيات التسعير الذكية
                  </CardTitle>
                  <CardDescription>
                    تسعير مبني على بيانات السوق الفعلية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProjects.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد مشاريع لتحليل أسعارها
                      </p>
                    ) : (
                      myProjects.slice(0, 5).map((project) => {
                        const marketData = marketTrends.find(t => t.city === project.city);
                        const recommendedPrice = marketData 
                          ? Number(marketData.avgPrice) * 1.1 
                          : Number(project.price);
                        const currentPrice = Number(project.price);
                        const priceDiff = ((recommendedPrice - currentPrice) / currentPrice * 100).toFixed(1);
                        
                        return (
                          <Card key={project.id} className="border" data-testid={`price-card-${project.id}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{project.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {project.city} • {project.propertyType}
                                  </p>
                                  <div className="mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">السعر الحالي:</span>
                                      <span className="font-medium">{currentPrice.toLocaleString()} EGP</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">السعر الموصى به:</span>
                                      <span className="font-medium text-green-600">
                                        {recommendedPrice.toLocaleString()} EGP
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Badge variant={Number(priceDiff) > 0 ? "default" : "secondary"}>
                                  {Number(priceDiff) > 0 ? "+" : ""}{priceDiff}%
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approval" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    نظام درجة الموافقة
                  </CardTitle>
                  <CardDescription>
                    تقييم شامل لمشاريعك بناءً على معايير السوق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProjects.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد مشاريع للتقييم
                      </p>
                    ) : (
                      myProjects.slice(0, 5).map((project) => {
                        const hasImages = project.images && project.images.length > 0;
                        const hasDescription = project.description && project.description.length > 50;
                        const hasServices = project.services && project.services.length > 0;
                        const hasPricing = project.paymentPlan && project.cashPercentage;
                        
                        const score = 
                          (hasImages ? 25 : 0) +
                          (hasDescription ? 25 : 0) +
                          (hasServices ? 25 : 0) +
                          (hasPricing ? 25 : 0);
                        
                        return (
                          <Card key={project.id} className="border" data-testid={`approval-card-${project.id}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                  <h4 className="font-semibold">{project.title}</h4>
                                  <p className="text-sm text-muted-foreground">{project.city}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">{score}</p>
                                  <p className="text-xs text-muted-foreground">من 100</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {hasImages ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                                  )}
                                  <span className="text-sm">صور عالية الجودة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasDescription ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                                  )}
                                  <span className="text-sm">وصف تفصيلي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasServices ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                                  )}
                                  <span className="text-sm">الخدمات والمرافق</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasPricing ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                                  )}
                                  <span className="text-sm">خطة سداد واضحة</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
}
