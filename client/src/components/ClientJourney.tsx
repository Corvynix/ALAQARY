import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, MapPin, Phone, Mail } from "lucide-react";
import { format } from "date-fns";

interface ClientJourneyProps {
  leadId: string;
  language: "ar" | "en";
}

export default function ClientJourney({ leadId, language }: ClientJourneyProps) {
  const { data: journey, isLoading } = useQuery<any>({
    queryKey: [`/api/funnel/client/${leadId}`],
  });

  const content = {
    ar: {
      title: "رحلة العميل",
      subtitle: "نظرة تفصيلية على تفاعلات العميل",
      leadInfo: "معلومات العميل",
      behaviors: "التفاعلات",
      transactions: "الصفقات",
      stage: "المرحلة",
      probability: "احتمالية الشراء",
      decisionType: "نوع القرار",
      highIntent: "نية عالية",
      notHighIntent: "نية عادية",
      fast: "سريع",
      hesitant: "متردد",
      researcher: "باحث",
      timeline: "الجدول الزمني",
      behaviorType: "نوع التفاعل",
      action: "الإجراء",
      target: "الهدف",
      time: "الوقت",
      noTransactions: "لا توجد صفقات",
      noBehaviors: "لا توجد تفاعلات",
    },
    en: {
      title: "Client Journey",
      subtitle: "Detailed view of client interactions",
      leadInfo: "Lead Information",
      behaviors: "Behaviors",
      transactions: "Transactions",
      stage: "Stage",
      probability: "Purchase Probability",
      decisionType: "Decision Type",
      highIntent: "High Intent",
      notHighIntent: "Normal Intent",
      fast: "Fast",
      hesitant: "Hesitant",
      researcher: "Researcher",
      timeline: "Timeline",
      behaviorType: "Behavior Type",
      action: "Action",
      target: "Target",
      time: "Time",
      noTransactions: "No transactions",
      noBehaviors: "No behaviors recorded",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Loading client journey...</div>
      </div>
    );
  }

  if (!journey?.lead) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">Client not found</div>
      </div>
    );
  }

  const lead = journey.lead;
  const behaviors = journey.behaviors || [];
  const transactions = journey.transactions || [];
  const probability = Number(lead.purchaseProbability) || 0;

  const stageLabels = {
    curiosity: language === "ar" ? "فضول" : "Curiosity",
    understanding: language === "ar" ? "فهم" : "Understanding",
    trust: language === "ar" ? "ثقة" : "Trust",
    desire: language === "ar" ? "رغبة" : "Desire",
    purchase: language === "ar" ? "شراء" : "Purchase",
  };

  const decisionTypeLabels = {
    fast: content[language].fast,
    hesitant: content[language].hesitant,
    researcher: content[language].researcher,
  };

  // Sort behaviors by date
  const sortedBehaviors = [...behaviors].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

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

      {/* Lead Information */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].leadInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {lead.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].stage}
                </span>
                <Badge variant="secondary">
                  {stageLabels[lead.funnelStage as keyof typeof stageLabels] || lead.funnelStage}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].probability}
                  </span>
                  <span className="text-sm font-medium">{probability}%</span>
                </div>
                <Progress value={probability} className="h-2" />
              </div>

              {lead.decisionType && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].decisionType}
                  </span>
                  <Badge variant="outline">
                    {decisionTypeLabels[lead.decisionType as keyof typeof decisionTypeLabels] || lead.decisionType}
                  </Badge>
                </div>
              )}

              {journey.isHighIntent && (
                <Badge className="bg-primary">
                  {content[language].highIntent}
                </Badge>
              )}
            </div>
          </div>

          {lead.behavioralTriggers && (
            <div className="pt-4 border-t">
              <div className={`text-sm font-medium mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Behavioral Triggers
              </div>
              <div className="flex flex-wrap gap-2">
                {lead.behavioralTriggers.split(", ").map((trigger: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Clock className="h-5 w-5" />
            {content[language].timeline}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedBehaviors.length > 0 ? (
            <div className="space-y-4">
              {sortedBehaviors.map((behavior: any, index: number) => (
                <div
                  key={behavior.id}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{behavior.behaviorType}</Badge>
                        <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {behavior.action}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(behavior.createdAt), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                    {behavior.target && (
                      <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {content[language].target}: {behavior.target}
                        {behavior.targetId && ` (${behavior.targetId})`}
                      </div>
                    )}
                    {behavior.timeSpent && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {behavior.timeSpent}s
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center text-muted-foreground py-8 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].noBehaviors}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].transactions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{transaction.status}</Badge>
                    <span className="text-lg font-bold">
                      {Number(transaction.dealValue).toLocaleString()} EGP
                    </span>
                  </div>
                  {transaction.purchaseDate && (
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transaction.purchaseDate), "MMM dd, yyyy")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

