import { Award, TrendingUp, Shield, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CreditScoreCardProps {
  score: number;
  role: string;
  language: "ar" | "en";
}

export default function CreditScoreCard({ score, role, language }: CreditScoreCardProps) {
  const content = {
    ar: {
      title: "درجة الائتمان العقاري",
      yourScore: "درجتك",
      excellent: "ممتاز",
      good: "جيد",
      fair: "متوسط",
      poor: "ضعيف",
      description: "تقييمك في سوق العقارات",
      trustLevel: "مستوى الثقة",
      performance: "الأداء",
      reliability: "الموثوقية"
    },
    en: {
      title: "Real Estate Credit Score",
      yourScore: "Your Score",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      description: "Your rating in the real estate market",
      trustLevel: "Trust Level",
      performance: "Performance",
      reliability: "Reliability"
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: content[language].excellent, color: "text-green-500", bgColor: "bg-green-500" };
    if (score >= 60) return { label: content[language].good, color: "text-blue-500", bgColor: "bg-blue-500" };
    if (score >= 40) return { label: content[language].fair, color: "text-yellow-500", bgColor: "bg-yellow-500" };
    return { label: content[language].poor, color: "text-red-500", bgColor: "bg-red-500" };
  };

  const level = getScoreLevel(score);

  const metrics = [
    { 
      label: content[language].trustLevel, 
      value: Math.min(100, score + 5), 
      icon: Shield,
      color: "text-blue-500"
    },
    { 
      label: content[language].performance, 
      value: Math.min(100, score - 3), 
      icon: TrendingUp,
      color: "text-green-500"
    },
    { 
      label: content[language].reliability, 
      value: Math.min(100, score + 2), 
      icon: Star,
      color: "text-amber-500"
    }
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Award className="h-5 w-5 text-primary" />
            {content[language].title}
          </CardTitle>
          <Badge variant="outline" className={`${level.color} border-current`}>
            {level.label}
          </Badge>
        </div>
        <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
          {content[language].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            {content[language].yourScore}
          </div>
          <div className="relative inline-flex items-center justify-center">
            <div className={`text-6xl font-bold ${level.color}`} data-testid="text-credit-score">
              {score}
            </div>
            <div className="text-2xl text-muted-foreground ml-1">/100</div>
          </div>
          <Progress value={score} className="mt-4 h-3" />
        </div>

        <div className="space-y-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-sm">{metric.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
