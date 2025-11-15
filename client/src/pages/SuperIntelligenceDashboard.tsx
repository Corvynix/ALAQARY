import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, MapPin, Users, Building2, Brain, TrendingUp } from "lucide-react";
import MarketIntelligence from "@/components/MarketIntelligence";
import BehaviorInsights from "@/components/BehaviorInsights";
import FunnelAnalytics from "@/components/FunnelAnalytics";

export default function SuperIntelligenceDashboard() {
  const { language, toggleLanguage } = useLanguage();

  const { data: marketIntelligence } = useQuery<any[]>({
    queryKey: ["/api/market/intelligence"],
  });

  const { data: agents } = useQuery<any[]>({
    queryKey: ["/api/agents"],
  });

  const { data: funnelAnalytics } = useQuery<any>({
    queryKey: ["/api/funnel/analytics"],
  });

  const content = {
    ar: {
      title: "الموديل اللي هيخليك تمتلك السوق",
      subtitle: "Real Estate Super-Intelligence Data Model",
      marketLayer: "طبقة السوق",
      agentLayer: "طبقة المستشارين",
      clientLayer: "طبقة العملاء",
      propertyLayer: "طبقة العقارات",
      behaviorLayer: "طبقة السلوك",
      overview: "نظرة عامة",
      totalCities: "إجمالي المدن",
      totalAgents: "إجمالي المستشارين",
      totalLeads: "إجمالي العملاء",
      totalProperties: "إجمالي العقارات",
      activeLeads: "العملاء النشطون",
      viewDetails: "عرض التفاصيل",
    },
    en: {
      title: "The Model That Makes You Own The Market",
      subtitle: "Real Estate Super-Intelligence Data Model",
      marketLayer: "Market Layer",
      agentLayer: "Agent Layer",
      clientLayer: "Client Layer",
      propertyLayer: "Property Layer",
      behaviorLayer: "Behavior Layer",
      overview: "Overview",
      totalCities: "Total Cities",
      totalAgents: "Total Agents",
      totalLeads: "Total Leads",
      totalProperties: "Total Properties",
      activeLeads: "Active Leads",
      viewDetails: "View Details",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
              {content[language].title}
            </h1>
            <p className={`text-muted-foreground text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].subtitle}
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].marketLayer}
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {marketIntelligence?.length || 0}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].totalCities}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].agentLayer}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {agents?.length || 0}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].totalAgents}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].clientLayer}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {funnelAnalytics?.totalLeads || 0}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].totalLeads}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {funnelAnalytics?.highIntentCount || 0} {content[language].activeLeads}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].propertyLayer}
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {funnelAnalytics?.totalProperties || 0}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].totalProperties}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].behaviorLayer}
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {funnelAnalytics?.purchase || 0}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  Completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 5-Layer Tabs */}
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="market" className={language === 'ar' ? 'font-arabic' : ''}>
                <Layers className="h-4 w-4 mr-2" />
                {content[language].marketLayer}
              </TabsTrigger>
              <TabsTrigger value="agent" className={language === 'ar' ? 'font-arabic' : ''}>
                <Users className="h-4 w-4 mr-2" />
                {content[language].agentLayer}
              </TabsTrigger>
              <TabsTrigger value="client" className={language === 'ar' ? 'font-arabic' : ''}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {content[language].clientLayer}
              </TabsTrigger>
              <TabsTrigger value="property" className={language === 'ar' ? 'font-arabic' : ''}>
                <Building2 className="h-4 w-4 mr-2" />
                {content[language].propertyLayer}
              </TabsTrigger>
              <TabsTrigger value="behavior" className={language === 'ar' ? 'font-arabic' : ''}>
                <Brain className="h-4 w-4 mr-2" />
                {content[language].behaviorLayer}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="market" className="mt-6">
              <MarketIntelligence language={language} />
            </TabsContent>

            <TabsContent value="agent" className="mt-6">
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].agentLayer}
                </h2>
                {agents && agents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.slice(0, 10).map((agent: any) => (
                      <Card key={agent.id}>
                        <CardHeader>
                          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                            {agent.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                                Closing Rate
                              </span>
                              <Badge>{Number(agent.closingRate || 0)}%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                                Total Deals
                              </span>
                              <span className="font-semibold">{Number(agent.totalDeals || 0)}</span>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full mt-4"
                              onClick={() => window.location.href = `/agents/${agent.id}/intelligence`}
                            >
                              {content[language].viewDetails}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    No agents found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="client" className="mt-6">
              <FunnelAnalytics language={language} />
            </TabsContent>

            <TabsContent value="property" className="mt-6">
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].propertyLayer}
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                      Property Recommendation Engine
                    </CardTitle>
                    <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
                      أفضل 5 مشاريع مناسبة لميزانية عميلك تلقائيًا
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      Use the Client Qualification API to get personalized property recommendations.
                      Access via: GET /api/clients/:leadId/recommendations/properties
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="mt-6">
              <BehaviorInsights language={language} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
}

