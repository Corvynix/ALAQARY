import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, MessageSquare, AlertCircle, Target, Zap } from "lucide-react";

interface BehaviorInsightsProps {
  language: "ar" | "en";
}

export default function BehaviorInsights({ language }: BehaviorInsightsProps) {
  const { data: triggers } = useQuery<any>({
    queryKey: ["/api/behavior/triggers"],
  });

  const { data: peakTimes } = useQuery<any>({
    queryKey: ["/api/behavior/peak-times"],
  });

  const { data: bestScripts } = useQuery<any>({
    queryKey: ["/api/behavior/best-scripts"],
  });

  const { data: objections } = useQuery<any>({
    queryKey: ["/api/behavior/common-objections"],
  });

  const content = {
    ar: {
      title: "ذكاء السلوك",
      subtitle: "طبقة السلوك - أخطر طبقة وأكتر واحدة سريّة",
      whatTriggers: "إيه اللي بيخلي عميل يرد؟",
      whenPeopleBuy: "إمتى معظم الناس بتشتري؟",
      peakTimes: "أوقات الذروة",
      bestScripts: "أفضل Scriptات",
      commonObjections: "أنهي اعتراض بيتكرر؟",
      averageTimeToTrust: "متوسط الوقت للوصول للثقة",
      averageTimeToPurchase: "متوسط الوقت للشراء",
      formSubmissions: "إرسال النماذج",
      whatsappClicks: "نقرات واتساب",
      propertyViews: "عرض العقارات",
      peakEngagementHours: "ساعات الذروة للتفاعل",
      script: "Script",
      agent: "المستشار",
      successRate: "معدل النجاح",
      useCase: "حالة الاستخدام",
      objection: "الاعتراض",
      frequency: "التكرار",
      minutes: "دقيقة",
      hours: "ساعة",
      days: "يوم",
      noData: "لا توجد بيانات",
    },
    en: {
      title: "Behavior Intelligence",
      subtitle: "Behavior Layer - The Most Critical Secret Layer",
      whatTriggers: "What Makes Clients Respond?",
      whenPeopleBuy: "When Do Most People Buy?",
      peakTimes: "Peak Times",
      bestScripts: "Best Scripts",
      commonObjections: "What Objections Recur?",
      averageTimeToTrust: "Average Time to Trust",
      averageTimeToPurchase: "Average Time to Purchase",
      formSubmissions: "Form Submissions",
      whatsappClicks: "WhatsApp Clicks",
      propertyViews: "Property Views",
      peakEngagementHours: "Peak Engagement Hours",
      script: "Script",
      agent: "Agent",
      successRate: "Success Rate",
      useCase: "Use Case",
      objection: "Objection",
      frequency: "Frequency",
      minutes: "minutes",
      hours: "hours",
      days: "days",
      noData: "No data available",
    },
  };

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

      {/* What Triggers Responses */}
      {triggers && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].whatTriggers}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              ايه اللي بيخلي عميل يرد؟ - انهي كلمة في المكالمة بتطمن العميل؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].formSubmissions}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {triggers.formSubmissions || 0}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].whatsappClicks}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {triggers.whatsappClicks || 0}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].propertyViews}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {triggers.propertyViews || 0}
                </div>
              </div>
            </div>

            {triggers.peakEngagementHours && triggers.peakEngagementHours.length > 0 && (
              <div className="mt-6">
                <div className={`text-sm font-medium mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].peakEngagementHours}
                </div>
                <div className="space-y-2">
                  {triggers.peakEngagementHours.slice(0, 5).map((hour: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {hour.hour}:00
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={(hour.count / triggers.peakEngagementHours[0].count) * 100} className="w-32 h-2" />
                        <span className="text-sm font-medium">{hour.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* When People Buy */}
      {peakTimes && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].whenPeopleBuy}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              إمتى معظم الناس بتشتري؟ - متوسط الوقت للوصول للثقة والشراء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].averageTimeToTrust}
                </div>
                <div className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {peakTimes.averageTimeToTrust || 0} {content[language].minutes}
                </div>
                <Progress value={Math.min(100, (peakTimes.averageTimeToTrust || 0) / 60 * 100)} className="h-2" />
              </div>

              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].averageTimeToPurchase}
                </div>
                <div className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {peakTimes.averageTimeToPurchase || 0} {content[language].days}
                </div>
                <Progress value={Math.min(100, (peakTimes.averageTimeToPurchase || 0) / 30 * 100)} className="h-2" />
              </div>
            </div>

            {peakTimes.peakEngagementTimes && peakTimes.peakEngagementTimes.length > 0 && (
              <div className="mt-6">
                <div className={`text-sm font-medium mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].peakTimes}
                </div>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {peakTimes.peakEngagementTimes.slice(0, 12).map((time: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className={`text-xs mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {time.hour}:00
                      </div>
                      <div className="h-20 bg-muted rounded flex items-end justify-center p-1">
                        <div
                          className="bg-primary w-full rounded"
                          style={{
                            height: `${(time.engagement / peakTimes.peakEngagementTimes[0].engagement) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Best Scripts */}
      {bestScripts && bestScripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].bestScripts}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              انهي أسلوب Pitch بيقفل أسرع؟ - تكتب أفضل Scriptات في مصر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestScripts.slice(0, 5).map((script: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Badge className="bg-primary">
                        {script.successRate}% {content[language].successRate}
                      </Badge>
                    </div>
                    <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {content[language].agent}: {script.agent}
                    </div>
                  </div>
                  <div className={`mb-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {script.script}
                  </div>
                  {script.useCase && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{content[language].useCase}: {script.useCase}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Objections */}
      {objections && objections.commonObjections && objections.commonObjections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].commonObjections}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              انهي اعتراض بيتكرر؟ - انهي سعر بيخوف؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objections.commonObjections.slice(0, 10).map((obj: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {obj.objection}
                    </div>
                    <Badge variant="destructive">
                      {obj.count} {content[language].frequency}
                    </Badge>
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

