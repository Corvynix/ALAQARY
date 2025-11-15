import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Clock, DollarSign, MessageSquare, Target } from "lucide-react";

interface AgentIntelligenceProps {
  agentId: string;
  language: "ar" | "en";
}

export default function AgentIntelligence({ agentId, language }: AgentIntelligenceProps) {
  const { data: intelligence, isLoading } = useQuery<any>({
    queryKey: [`/api/agents/${agentId}/intelligence`],
  });

  const content = {
    ar: {
      title: "ذكاء المستشار",
      subtitle: "تحليل أداء المستشار العقاري",
      bestScripts: "أفضل Scriptات",
      commonObjections: "الاعتراضات الشائعة",
      bestPrices: "أفضل الأسعار",
      clientTypes: "أنواع العملاء",
      peakTimes: "أوقات الذروة",
      successRate: "معدل النجاح",
      frequency: "التكرار",
      bestResponse: "أفضل رد",
      deals: "صفقات",
      contacts: "اتصالات",
      useCase: "حالة الاستخدام",
      context: "السياق",
      priceRange: "نطاق السعر",
      count: "العدد",
      hour: "الساعة",
      dailyContacts: "الاتصالات اليومية",
      closingRate: "معدل الإغلاق",
      responseSpeed: "سرعة الرد",
      totalDeals: "إجمالي الصفقات",
      totalRevenue: "إجمالي الإيرادات",
      noData: "لا توجد بيانات",
    },
    en: {
      title: "Agent Intelligence",
      subtitle: "Real Estate Consultant Performance Analysis",
      bestScripts: "Best Scripts",
      commonObjections: "Common Objections",
      bestPrices: "Best Prices",
      clientTypes: "Client Types",
      peakTimes: "Peak Times",
      successRate: "Success Rate",
      frequency: "Frequency",
      bestResponse: "Best Response",
      deals: "deals",
      contacts: "contacts",
      useCase: "Use Case",
      context: "Context",
      priceRange: "Price Range",
      count: "Count",
      hour: "Hour",
      dailyContacts: "Daily Contacts",
      closingRate: "Closing Rate",
      responseSpeed: "Response Speed",
      totalDeals: "Total Deals",
      totalRevenue: "Total Revenue",
      noData: "No data available",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Loading agent intelligence...</div>
      </div>
    );
  }

  if (!intelligence || !intelligence.agent) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].noData}</div>
      </div>
    );
  }

  const agent = intelligence.agent;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].subtitle} - {agent.name}
        </p>
      </div>

      {/* Agent Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].dailyContacts}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {Number(agent.dailyContacts || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].closingRate}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {Number(agent.closingRate || 0)}%
            </div>
            <Progress value={Number(agent.closingRate || 0)} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].responseSpeed}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {Number(agent.responseSpeed || 0)} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].totalDeals}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {Number(agent.totalDeals || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Revenue: {(Number(agent.totalRevenue || 0) / 1000000).toFixed(1)}M EGP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Scripts */}
      {intelligence.bestScripts && intelligence.bestScripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].bestScripts}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              أفضل Scriptات جاهزة - أفضل رد على العميل - أفضل سعر يتقال - أفضل مشروع يترشح
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intelligence.bestScripts.slice(0, 5).map((script: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge className="bg-primary">
                      {script.successRate}% {content[language].successRate}
                    </Badge>
                  </div>
                  <div className={`mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {script.script}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{content[language].useCase}: {script.useCase}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Objections */}
      {intelligence.commonObjections && intelligence.commonObjections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].commonObjections}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              الاعتراضات اللي بيسمعها - أفضل رد على العميل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intelligence.commonObjections.slice(0, 10).map((obj: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {obj.objection}
                    </div>
                    <Badge variant="outline">
                      {obj.frequency} {content[language].frequency}
                    </Badge>
                  </div>
                  <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <strong>{content[language].bestResponse}:</strong> {obj.bestResponse}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Prices */}
      {intelligence.bestPrices && intelligence.bestPrices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].bestPrices}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              الأسعار اللي بيقفل بيها - أفضل سعر يتقال
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligence.bestPrices.slice(0, 5).map((price: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {(price.price / 1000000).toFixed(1)}M EGP
                    </div>
                    <div className="text-sm text-muted-foreground">{price.context}</div>
                  </div>
                  <Badge variant="outline">{price.successRate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Types */}
      {intelligence.clientTypes && intelligence.clientTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].clientTypes}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              انهي مستشار بيقفل النوع الفلاني أحسن من غيره
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligence.clientTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {type.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {type.count} {content[language].count}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={type.successRate} className="w-24 h-2" />
                    <span className="text-sm font-medium">{type.successRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

