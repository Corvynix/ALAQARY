import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, AlertCircle } from "lucide-react";

interface FunnelAnalyticsProps {
  language: "ar" | "en";
}

export default function FunnelAnalytics({ language }: FunnelAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery<any>({
    queryKey: ["/api/funnel/analytics"],
  });

  const { data: insights } = useQuery<any>({
    queryKey: ["/api/insights/behavioral"],
  });

  const content = {
    ar: {
      title: "تحليلات القمع",
      subtitle: "نظرة شاملة على أداء القمع",
      stageCounts: "عدد العملاء في كل مرحلة",
      conversionRates: "معدلات التحويل",
      totalLeads: "إجمالي العملاء المحتملين",
      highIntent: "عملاء عاليو النية",
      curiosity: "فضول",
      understanding: "فهم",
      trust: "ثقة",
      desire: "رغبة",
      purchase: "شراء",
      dropOff: "انخفاض",
      bestContent: "أكثر المحتوى فعالية",
      bestProperties: "أكثر العقارات تحويلاً",
      commonObjections: "الاعتراضات الشائعة",
      peakTimes: "أوقات الذروة",
    },
    en: {
      title: "Funnel Analytics",
      subtitle: "Comprehensive overview of funnel performance",
      stageCounts: "Client count by stage",
      conversionRates: "Conversion rates",
      totalLeads: "Total Leads",
      highIntent: "High Intent Clients",
      curiosity: "Curiosity",
      understanding: "Understanding",
      trust: "Trust",
      desire: "Desire",
      purchase: "Purchase",
      dropOff: "Drop-off",
      bestContent: "Most Effective Content",
      bestProperties: "Best Converting Properties",
      commonObjections: "Common Objections",
      peakTimes: "Peak Engagement Times",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  const stages = [
    { key: "curiosity", label: content[language].curiosity },
    { key: "understanding", label: content[language].understanding },
    { key: "trust", label: content[language].trust },
    { key: "desire", label: content[language].desire },
    { key: "purchase", label: content[language].purchase },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].subtitle}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].totalLeads}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {analytics?.totalLeads || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].highIntent}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {analytics?.highIntentCount || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].purchase}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {analytics?.stageCounts?.purchase || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].stageCounts}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stages.map((stage, index) => {
            const count = analytics?.stageCounts?.[stage.key] || 0;
            const rate = analytics?.conversionRates?.[stage.key] || 0;
            const prevCount = index > 0 ? analytics?.stageCounts?.[stages[index - 1].key] || 0 : analytics?.totalLeads || 0;
            const dropOff = prevCount > 0 ? ((prevCount - count) / prevCount) * 100 : 0;

            return (
              <div key={stage.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {stage.label}
                    </Badge>
                    <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {count}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {rate.toFixed(1)}%
                    </span>
                    {index > 0 && dropOff > 0 && (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {dropOff.toFixed(1)}% {content[language].dropOff}
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={rate} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Behavioral Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Content */}
          <Card>
            <CardHeader>
              <CardTitle className={`text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                {content[language].bestContent}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.mostEffectiveContent?.slice(0, 5).map((content: any, index: number) => (
                  <div key={content.id} className="flex items-center justify-between">
                    <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {index + 1}. {content.title}
                    </span>
                    <Badge variant="outline">{content.conversionRate.toFixed(1)}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Properties */}
          <Card>
            <CardHeader>
              <CardTitle className={`text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                {content[language].bestProperties}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.bestConvertingProperties?.slice(0, 5).map((property: any, index: number) => (
                  <div key={property.id} className="flex items-center justify-between">
                    <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {index + 1}. {property.title}
                    </span>
                    <Badge variant="outline">{property.conversionRate.toFixed(1)}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

