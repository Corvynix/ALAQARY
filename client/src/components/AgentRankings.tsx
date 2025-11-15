import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, DollarSign, Target, Clock, Award, Medal, Crown } from "lucide-react";
import { useAgentRankings } from "@/hooks/useIntelligence";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface AgentRankingsProps {
  language: "ar" | "en";
}

export default function AgentRankings({ language }: AgentRankingsProps) {
  const { data, isLoading } = useAgentRankings();

  const content = {
    ar: {
      title: "ترتيب المستشارين",
      subtitle: "تصنيف المستشارين حسب الأداء",
      rank: "الترتيب",
      agent: "المستشار",
      overallScore: "النتيجة الإجمالية",
      tier: "المستوى",
      closingRate: "معدل الإغلاق",
      totalDeals: "إجمالي الصفقات",
      totalRevenue: "إجمالي الإيرادات",
      avgDealPrice: "متوسط سعر الصفقة",
      responseSpeed: "سرعة الرد",
      strengths: "نقاط القوة",
      areasForImprovement: "مجالات التحسين",
      performanceComparison: "مقارنة الأداء",
      topPerformers: "الأفضل أداءً",
      totalAgents: "إجمالي المستشارين",
      noData: "لا توجد بيانات",
      loading: "جاري التحميل...",
      minutes: "دقيقة",
      egp: "جنيه",
      closingScore: "درجة الإغلاق",
      volumeScore: "درجة الحجم",
      revenueScore: "درجة الإيرادات",
      speedScore: "درجة السرعة",
    },
    en: {
      title: "Agent Rankings",
      subtitle: "Agent Performance Rankings",
      rank: "Rank",
      agent: "Agent",
      overallScore: "Overall Score",
      tier: "Tier",
      closingRate: "Closing Rate",
      totalDeals: "Total Deals",
      totalRevenue: "Total Revenue",
      avgDealPrice: "Avg Deal Price",
      responseSpeed: "Response Speed",
      strengths: "Strengths",
      areasForImprovement: "Areas for Improvement",
      performanceComparison: "Performance Comparison",
      topPerformers: "Top Performers",
      totalAgents: "Total Agents",
      noData: "No data available",
      loading: "Loading...",
      minutes: "min",
      egp: "EGP",
      closingScore: "Closing Score",
      volumeScore: "Volume Score",
      revenueScore: "Revenue Score",
      speedScore: "Speed Score",
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {content[language].title}
        </div>
        <div className="text-muted-foreground">{content[language].loading}</div>
      </div>
    );
  }

  if (!data || !data.rankings || data.rankings.length === 0) {
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
    return <Trophy className="h-5 w-5 text-muted-foreground" />;
  };

  // Prepare data for charts
  const top10Rankings = data.rankings.slice(0, 10);
  const comparisonData = top10Rankings.map(agent => ({
    name: agent.agentName,
    closingRate: agent.closingRate,
    totalDeals: agent.totalDeals,
    revenue: agent.totalRevenue / 1000000, // Convert to millions
  }));

  const radarData = top10Rankings.slice(0, 5).map(agent => ({
    name: agent.agentName,
    closing: agent.metrics.closingScore * 100,
    volume: agent.metrics.volumeScore * 100,
    revenue: agent.metrics.revenueScore * 100,
    speed: agent.metrics.speedScore * 100,
  }));

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
            {content[language].totalAgents}
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
            {data.totalAgents}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Chart */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].performanceComparison}
          </CardTitle>
          <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
            مقارنة أداء أفضل 10 مستشارين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="closingRate" fill="hsl(var(--primary))" name={content[language].closingRate} />
              <Bar yAxisId="left" dataKey="totalDeals" fill="hsl(var(--chart-2))" name={content[language].totalDeals} />
              <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--chart-3))" name={`${content[language].totalRevenue} (M)`} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart for Top 5 */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].topPerformers}
          </CardTitle>
          <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
            تحليل متعدد الأبعاد لأفضل 5 مستشارين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData[0] ? Object.keys(radarData[0]).filter(key => key !== 'name').map(metric => ({
              metric: metric === 'closing' ? content[language].closingScore :
                      metric === 'volume' ? content[language].volumeScore :
                      metric === 'revenue' ? content[language].revenueScore :
                      content[language].speedScore,
              ...radarData.reduce((acc, agent, idx) => ({
                ...acc,
                [agent.name]: agent[metric as keyof typeof agent]
              }), {})
            })) : []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 100]} />
              {radarData.map((agent, idx) => (
                <Radar
                  key={agent.name}
                  name={agent.name}
                  dataKey={agent.name}
                  stroke={`hsl(var(--chart-${idx + 1}))`}
                  fill={`hsl(var(--chart-${idx + 1}))`}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Rankings List */}
      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].title}
          </CardTitle>
          <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
            ترتيب كامل لجميع المستشارين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.rankings.map((agent) => (
              <div 
                key={agent.agentId} 
                className="p-4 border rounded-lg hover-elevate" 
                data-testid={`agent-rank-${agent.rank}`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(agent.rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                          #{agent.rank} {agent.agentName}
                        </span>
                        <Badge className={getTierColor(agent.tier)}>{agent.tier}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {content[language].overallScore}: {(agent.overallScore * 100).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={agent.overallScore * 100} className="w-32 h-2" />
                    <span className="text-sm font-medium">{(agent.overallScore * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      {content[language].closingRate}
                    </div>
                    <div className="text-sm font-medium">{agent.closingRate}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Target className="h-3 w-3" />
                      {content[language].totalDeals}
                    </div>
                    <div className="text-sm font-medium">{agent.totalDeals}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      {content[language].totalRevenue}
                    </div>
                    <div className="text-sm font-medium">
                      {(agent.totalRevenue / 1000000).toFixed(1)}M {content[language].egp}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      {content[language].responseSpeed}
                    </div>
                    <div className="text-sm font-medium">
                      {agent.responseSpeed} {content[language].minutes}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agent.strengths.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        {content[language].strengths}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agent.strengths.slice(0, 3).map((strength, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {agent.areasForImprovement.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        {content[language].areasForImprovement}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agent.areasForImprovement.slice(0, 3).map((area, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
