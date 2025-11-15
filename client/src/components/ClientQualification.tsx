import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, Zap } from "lucide-react";

interface ClientQualificationProps {
  leadId: string;
  language: "ar" | "en";
}

export default function ClientQualification({ leadId, language }: ClientQualificationProps) {
  const { data: qualification, isLoading } = useQuery<any>({
    queryKey: [`/api/clients/${leadId}/qualification`],
  });

  const content = {
    ar: {
      title: "تأهيل العميل",
      subtitle: "نظام تأهيل العملاء الذكي",
      qualificationScore: "نقاط التأهيل",
      purchaseProbability: "احتمالية الشراء",
      decisionType: "نوع القرار",
      recommendedProperties: "العقارات الموصى بها",
      recommendedAgent: "المستشار الموصى به",
      objectionPatterns: "أنماط الاعتراضات",
      bestPitch: "أفضل Pitch",
      urgency: "الأولوية",
      fast: "سريع",
      hesitant: "متردد",
      researcher: "باحث",
      high: "عالية",
      medium: "متوسطة",
      low: "منخفضة",
      matchScore: "نقاط المطابقة",
      estimatedInterest: "الاهتمام المتوقع",
      reasons: "الأسباب",
      successRate: "معدل النجاح",
      bestScript: "أفضل Script",
      bestPrice: "أفضل سعر",
    },
    en: {
      title: "Client Qualification",
      subtitle: "AI Qualification System",
      qualificationScore: "Qualification Score",
      purchaseProbability: "Purchase Probability",
      decisionType: "Decision Type",
      recommendedProperties: "Recommended Properties",
      recommendedAgent: "Recommended Agent",
      objectionPatterns: "Objection Patterns",
      bestPitch: "Best Pitch",
      urgency: "Urgency",
      fast: "Fast",
      hesitant: "Hesitant",
      researcher: "Researcher",
      high: "High",
      medium: "Medium",
      low: "Low",
      matchScore: "Match Score",
      estimatedInterest: "Estimated Interest",
      reasons: "Reasons",
      successRate: "Success Rate",
      bestScript: "Best Script",
      bestPrice: "Best Price",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Analyzing client...</div>
      </div>
    );
  }

  if (!qualification) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Client not found</div>
      </div>
    );
  }

  const getUrgencyColor = () => {
    if (qualification.urgency === "high") return "text-red-500";
    if (qualification.urgency === "medium") return "text-yellow-500";
    return "text-green-500";
  };

  const getDecisionTypeIcon = () => {
    if (qualification.decisionType === "fast") return <Zap className="h-5 w-5 text-green-500" />;
    if (qualification.decisionType === "researcher") return <Clock className="h-5 w-5 text-blue-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
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

      {/* Qualification Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].qualificationScore}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {qualification.qualificationScore}
            </div>
            <Progress value={qualification.qualificationScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].purchaseProbability}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {qualification.purchaseProbability}%
            </div>
            <Progress value={qualification.purchaseProbability} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].decisionType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              {getDecisionTypeIcon()}
              <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                {qualification.decisionType === "fast" ? content[language].fast :
                 qualification.decisionType === "researcher" ? content[language].researcher :
                 content[language].hesitant}
              </div>
            </div>
            <Badge className={getUrgencyColor()}>
              {qualification.urgency === "high" ? content[language].high :
               qualification.urgency === "medium" ? content[language].medium :
               content[language].low} {content[language].urgency}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Properties - Top 5 */}
      {qualification.recommendedProperties && qualification.recommendedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].recommendedProperties} (Top 5)
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].subtitle} - أفضل 5 مشاريع مناسبة لميزانية عميلك تلقائيًا
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualification.recommendedProperties.slice(0, 5).map((rec: any, index: number) => (
                <Card key={rec.property.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Badge className="bg-primary">
                        {rec.matchScore}% {content[language].matchScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === "ar" ? rec.property.title : (rec.property.titleEn || rec.property.title)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {rec.property.city} • {rec.property.propertyType}
                    </div>
                    <div className={`text-xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {(Number(rec.property.price) / 1000000).toFixed(1)}M EGP
                    </div>
                    <Progress value={rec.estimatedInterest} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground mb-3">
                      {content[language].estimatedInterest}: {rec.estimatedInterest}%
                    </div>
                    {rec.reasons && rec.reasons.length > 0 && (
                      <div className="space-y-1">
                        <div className={`text-xs font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {content[language].reasons}:
                        </div>
                        {rec.reasons.slice(0, 2).map((reason: string, idx: number) => (
                          <div key={idx} className="text-xs text-muted-foreground">
                            • {reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Agent */}
      {qualification.recommendedAgent && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].recommendedAgent}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xl font-bold mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {qualification.recommendedAgent.agent.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {qualification.recommendedAgent.agent.email} • {qualification.recommendedAgent.agent.phone}
                </div>
              </div>
              <Badge variant="outline">
                {qualification.recommendedAgent.matchScore}% {content[language].matchScore}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].successRate}
                </div>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {qualification.recommendedAgent.successRate}%
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].bestPrice}
                </div>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {(qualification.recommendedAgent.bestPrice / 1000000).toFixed(1)}M EGP
                </div>
              </div>
            </div>

            {qualification.recommendedAgent.reasons && qualification.recommendedAgent.reasons.length > 0 && (
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].reasons}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {qualification.recommendedAgent.reasons.map((reason: string, index: number) => (
                    <Badge key={index} variant="secondary">{reason}</Badge>
                  ))}
                </div>
              </div>
            )}

            {qualification.recommendedAgent.bestScript && (
              <div>
                <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].bestScript}:
                </div>
                <div className={`p-3 bg-muted rounded-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {qualification.recommendedAgent.bestScript}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Best Pitch */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].bestPitch}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 bg-primary/10 rounded-lg border border-primary/20 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {qualification.bestPitch}
          </div>
        </CardContent>
      </Card>

      {/* Objection Patterns */}
      {qualification.objectionPatterns && qualification.objectionPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].objectionPatterns}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {qualification.objectionPatterns.map((pattern: string, index: number) => (
                <Badge key={index} variant="destructive">{pattern}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

