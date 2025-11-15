import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Clock, DollarSign, Trophy, Award, Target, Star } from "lucide-react";
import { useAgentPerformance } from "@/hooks/useIntelligence";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface AgentIntelligenceProps {
  agentId: string;
  language: "ar" | "en";
}

export default function AgentIntelligence({ agentId, language }: AgentIntelligenceProps) {
  const { data, isLoading } = useAgentPerformance(agentId);

  const content = {
    ar: {
      title: "ذكاء المستشار",
      subtitle: "تحليل أداء المستشار العقاري",
      rank: "الترتيب",
      overallScore: "النتيجة الإجمالية",
      tier: "المستوى",
      percentile: "النسبة المئوية",
      closingRate: "معدل الإغلاق",
      responseSpeed: "سرعة الرد",
      totalDeals: "إجمالي الصفقات",
      totalRevenue: "إجمالي الإيرادات",
      avgDealPrice: "متوسط سعر الصفقة",
      strengths: "نقاط القوة",
      areasForImprovement: "مجالات التحسين",
      performanceMetrics: "مقاييس الأداء",
      closingScore: "درجة الإغلاق",
      volumeScore: "درجة الحجم",
      revenueScore: "درجة الإيرادات",
      speedScore: "درجة السرعة",
      noData: "لا توجد بيانات",
      outOf: "من",
      agents: "مستشارين",
      minutes: "دقيقة",
      egp: "جنيه",
    },
    en: {
      title: "Agent Intelligence",
      subtitle: "Real Estate Consultant Performance Analysis",
      rank: "Rank",
      overallScore: "Overall Score",
      tier: "Tier",
      percentile: "Percentile",
      closingRate: "Closing Rate",
      responseSpeed: "Response Speed",
      totalDeals: "Total Deals",
      totalRevenue: "Total Revenue",
      avgDealPrice: "Avg Deal Price",
      strengths: "Strengths",
      areasForImprovement: "Areas for Improvement",
      performanceMetrics: "Performance Metrics",
      closingScore: "Closing Score",
      volumeScore: "Volume Score",
      revenueScore: "Revenue Score",
      speedScore: "Speed Score",
      noData: "No data available",
      outOf: "out of",
      agents: "agents",
      minutes: "min",
      egp: "EGP",
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

  if (!data) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].noData}</div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'elite': return 'bg-purple-500';
      case 'top': return 'bg-blue-500';
      case 'rising': return 'bg-green-500';
      case 'developing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const metricsData = [
    { name: content[language].closingScore, value: (data.metrics.closingScore * 100).toFixed(0) },
    { name: content[language].volumeScore, value: (data.metrics.volumeScore * 100).toFixed(0) },
    { name: content[language].revenueScore, value: (data.metrics.revenueScore * 100).toFixed(0) },
    { name: content[language].speedScore, value: (data.metrics.speedScore * 100).toFixed(0) },
  ];

  const radarData = [
    { metric: language === 'ar' ? 'الإغلاق' : 'Closing', value: data.metrics.closingScore * 100 },
    { metric: language === 'ar' ? 'الحجم' : 'Volume', value: data.metrics.volumeScore * 100 },
    { metric: language === 'ar' ? 'الإيرادات' : 'Revenue', value: data.metrics.revenueScore * 100 },
    { metric: language === 'ar' ? 'السرعة' : 'Speed', value: data.metrics.speedScore * 100 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].subtitle} - {data.agentName}
        </p>
      </div>

      {/* Agent Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-agent-rank">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].rank}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-agent-rank">
              #{data.rank} <span className="text-sm text-muted-foreground">
                {content[language].outOf} {data.totalAgents} {content[language].agents}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getTierColor(data.tier)} data-testid="badge-agent-tier">{data.tier}</Badge>
              <span className="text-xs text-muted-foreground" data-testid="text-agent-percentile">
                Top {data.percentile}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-overall-score">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].overallScore}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-overall-score">
              {(data.overallScore * 100).toFixed(0)}
            </div>
            <Progress value={data.overallScore * 100} className="h-2 mt-2" data-testid="progress-overall-score" />
          </CardContent>
        </Card>

        <Card data-testid="card-closing-rate">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].closingRate}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-closing-rate">
              {data.closingRate}%
            </div>
            <Progress value={data.closingRate} className="h-2 mt-2" data-testid="progress-closing-rate" />
          </CardContent>
        </Card>

        <Card data-testid="card-response-speed">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].responseSpeed}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-response-speed">
              {data.responseSpeed} {content[language].minutes}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals and Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-deals">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].totalDeals}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-total-deals">
              {data.totalDeals}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].totalRevenue}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-total-revenue">
              {(data.totalRevenue / 1000000).toFixed(1)}M {content[language].egp}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-deal-price">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].avgDealPrice}
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-avg-deal-price">
              {(data.averageDealPrice / 1000000).toFixed(1)}M {content[language].egp}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card data-testid="card-metrics-bar-chart">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].performanceMetrics}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              مقاييس الأداء في الفئات المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div data-testid="chart-performance-bar">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card data-testid="card-metrics-radar-chart">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].performanceMetrics}
            </CardTitle>
            <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
              تحليل شامل للأداء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div data-testid="chart-performance-radar">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-testid="card-strengths">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].strengths}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2" data-testid={`item-strength-${index}`}>
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-improvements">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].areasForImprovement}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.areasForImprovement.map((area, index) => (
                <div key={index} className="flex items-start gap-2" data-testid={`item-improvement-${index}`}>
                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
