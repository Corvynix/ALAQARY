import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, MessageSquare, AlertCircle, Target, Zap, Activity } from "lucide-react";
import { useBehaviorTriggers, useBehaviorPatterns } from "@/hooks/useIntelligence";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BehaviorInsightsProps {
  language: "ar" | "en";
}

export default function BehaviorInsights({ language }: BehaviorInsightsProps) {
  const { data: triggersData, isLoading: triggersLoading } = useBehaviorTriggers();
  const { data: patternsData, isLoading: patternsLoading } = useBehaviorPatterns();

  const content = {
    ar: {
      title: "ذكاء السلوك",
      subtitle: "طبقة السلوك - أخطر طبقة وأكتر واحدة سريّة",
      triggers: "محفزات السلوك",
      patterns: "أنماط السلوك",
      conversionRate: "معدل التحويل",
      frequency: "التكرار",
      avgTimeSpent: "متوسط الوقت",
      occurrences: "التكرارات",
      successRate: "معدل النجاح",
      insight: "رؤية",
      recommendation: "التوصية",
      insights: "الرؤى",
      noData: "لا توجد بيانات",
      loading: "جاري التحميل...",
      trigger: "المحفز",
      pattern: "النمط",
      detailedView: "عرض تفصيلي",
    },
    en: {
      title: "Behavior Intelligence",
      subtitle: "Behavior Layer - The Most Critical Secret Layer",
      triggers: "Behavior Triggers",
      patterns: "Behavior Patterns",
      conversionRate: "Conversion Rate",
      frequency: "Frequency",
      avgTimeSpent: "Avg Time",
      occurrences: "Occurrences",
      successRate: "Success Rate",
      insight: "Insight",
      recommendation: "Recommendation",
      insights: "Insights",
      noData: "No data available",
      loading: "Loading...",
      trigger: "Trigger",
      pattern: "Pattern",
      detailedView: "Detailed View",
    },
  };

  if (triggersLoading || patternsLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].loading}</div>
      </div>
    );
  }

  if (!triggersData && !patternsData) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].noData}</div>
      </div>
    );
  }

  const COLORS = ['hsl(var(--primary))', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const triggersChartData = triggersData?.triggers.slice(0, 6).map(t => ({
    name: t.trigger.length > 25 ? t.trigger.substring(0, 25) + '...' : t.trigger,
    conversion: parseFloat((t.conversionRate * 100).toFixed(1)),
    frequency: t.count,
  })) || [];

  const patternsChartData = patternsData?.patterns.slice(0, 6).map(p => ({
    name: p.pattern.length > 30 ? p.pattern.substring(0, 30) + '...' : p.pattern,
    occurrences: p.occurrences,
    success: parseFloat((p.conversionRate * 100).toFixed(1)),
  })) || [];

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

      {/* Behavior Triggers */}
      {triggersData && triggersData.triggers && triggersData.triggers.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Activity className="h-5 w-5 text-primary" />
                {content[language].triggers}
              </CardTitle>
              <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
                What actions lead to conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={triggersChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="frequency" fill="hsl(var(--primary))" name={content[language].frequency} />
                  <Bar yAxisId="right" dataKey="conversion" fill="#82ca9d" name={content[language].conversionRate + ' %'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Triggers List */}
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                {content[language].triggers} - {content[language].detailedView}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {triggersData.triggers.slice(0, 10).map((trigger, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {trigger.trigger}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {trigger.count}x
                        </Badge>
                        <Badge className={trigger.conversionRate > 0.5 ? 'bg-green-500' : trigger.conversionRate > 0.3 ? 'bg-yellow-500' : 'bg-gray-500'}>
                          {(trigger.conversionRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {content[language].avgTimeSpent}: {trigger.averageTimeTo}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Behavior Patterns */}
      {patternsData && patternsData.patterns && patternsData.patterns.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <TrendingUp className="h-5 w-5 text-primary" />
                {content[language].patterns}
              </CardTitle>
              <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
                Common user behavior sequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patternsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="occurrences" fill="hsl(var(--primary))" name={content[language].occurrences} />
                  <Bar yAxisId="right" dataKey="success" fill="#82ca9d" name={content[language].successRate + ' %'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Patterns List */}
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                {content[language].patterns} - {content[language].detailedView}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patternsData.patterns.slice(0, 10).map((pattern, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {pattern.pattern}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {pattern.occurrences}x
                        </Badge>
                        <Badge className={pattern.conversionRate > 0.5 ? 'bg-green-500' : pattern.conversionRate > 0.3 ? 'bg-yellow-500' : 'bg-gray-500'}>
                          {(pattern.conversionRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className={`text-sm text-muted-foreground mt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {pattern.insight}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
