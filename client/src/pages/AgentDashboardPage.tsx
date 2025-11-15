import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreditWallet from "@/components/CreditWallet";
import CreditScoreCard from "@/components/CreditScoreCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  PhoneCall, 
  TrendingUp, 
  MessageSquare, 
  Target, 
  Clock,
  DollarSign,
  Award,
  Lightbulb,
  FileText
} from "lucide-react";
import type { Lead, Agent } from "@shared/schema";

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"]
  });
  
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"]
  });
  
  const currentAgent = agents.find(a => a.email === user?.email || a.phone === user?.phone);
  
  const highPriorityLeads = leads.filter(l => 
    Number(l.purchaseProbability) > 60 && l.funnelStage !== "won" && l.funnelStage !== "lost"
  );
  
  const myTodayLeads = leads.filter(l => {
    const createdToday = new Date(l.createdAt).toDateString() === new Date().toDateString();
    return createdToday;
  });

  const statsCards = [
    {
      title: "عملاء اليوم",
      value: myTodayLeads.length,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "عملاء محتملين",
      value: highPriorityLeads.length,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "مكالمات اليوم",
      value: currentAgent ? Number(currentAgent.dailyContacts) : 0,
      icon: PhoneCall,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "معدل الإغلاق",
      value: currentAgent ? `${Number(currentAgent.closingRate)}%` : "0%",
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  const aiScripts = [
    {
      title: "نص الاعتراض: السعر مرتفع",
      script: "أفهم تماماً قلقك من السعر. دعني أوضح لك القيمة الحقيقية... المنطقة شهدت ارتفاع 23% في آخر 6 شهور، والوحدة دي في أفضل موقع بالمشروع.",
      effectiveness: 78,
      category: "price_objection"
    },
    {
      title: "نص الافتتاح: عميل جديد",
      script: "صباح الخير! أنا [الاسم] من [الشركة]. لاحظت اهتمامك بالعقارات في [المنطقة]، وعندي فرصة ممتازة ممكن تكون مناسبة ليك تماماً.",
      effectiveness: 85,
      category: "opening"
    },
    {
      title: "نص الإغلاق: عميل مهتم",
      script: "ممتاز! بناءً على اللي اتكلمنا فيه، الوحدة دي هي الاختيار الأمثل ليك. عشان نحجزها، هنحتاج تأمين 10% بس، والباقي على أقساط مريحة.",
      effectiveness: 92,
      category: "closing"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم الوكيل العقاري</h1>
            <p className="text-muted-foreground mt-1">
              مرحباً {user?.fullName || user?.username} - إدارة عملائك وزيادة مبيعاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat) => (
              <Card key={stat.title} data-testid={`card-stat-${stat.title}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreditWallet 
              credits={user?.credits ? Number(user.credits) : 0} 
              language={language}
            />
            <CreditScoreCard
              score={user?.accuracyScore ? Number(user.accuracyScore) : 82}
              role={user?.role || 'agent'}
              language={language}
            />
          </div>

          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full lg:w-auto lg:inline-grid">
              <TabsTrigger value="leads" data-testid="tab-leads">
                <Users className="h-4 w-4 ml-2" />
                العملاء المحتملين
              </TabsTrigger>
              <TabsTrigger value="scripts" data-testid="tab-scripts">
                <MessageSquare className="h-4 w-4 ml-2" />
                نصوص الذكاء الاصطناعي
              </TabsTrigger>
              <TabsTrigger value="performance" data-testid="tab-performance">
                <TrendingUp className="h-4 w-4 ml-2" />
                الأداء
              </TabsTrigger>
              <TabsTrigger value="crm" data-testid="tab-crm">
                <FileText className="h-4 w-4 ml-2" />
                إدارة العملاء
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    ذكاء العملاء المحتملين
                  </CardTitle>
                  <CardDescription>
                    عملاء ذوي أولوية عالية بناءً على تحليل الذكاء الاصطناعي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {highPriorityLeads.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد عملاء محتملين حالياً
                      </p>
                    ) : (
                      highPriorityLeads.slice(0, 10).map((lead) => (
                        <div 
                          key={lead.id}
                          className="flex items-center justify-between gap-4 p-4 rounded-md border hover-elevate active-elevate-2"
                          data-testid={`lead-item-${lead.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{lead.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {lead.funnelStage}
                              </Badge>
                              {Number(lead.purchaseProbability) > 70 && (
                                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                                  احتمالية عالية {lead.purchaseProbability}%
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4 flex-wrap">
                              <span>{lead.phone}</span>
                              {lead.city && <span>• {lead.city}</span>}
                              {lead.budget && <span>• {lead.budget}</span>}
                            </div>
                          </div>
                          <Button size="sm" data-testid={`button-call-${lead.id}`}>
                            <PhoneCall className="h-4 w-4 ml-2" />
                            اتصل الآن
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scripts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    مركز نصوص الذكاء الاصطناعي
                  </CardTitle>
                  <CardDescription>
                    نصوص مجربة ومثبتة الفعالية لكل موقف
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiScripts.map((script, index) => (
                      <Card key={index} className="border" data-testid={`script-card-${index}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="font-semibold">{script.title}</h4>
                            <Badge variant="secondary">
                              فعالية {script.effectiveness}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            "{script.script}"
                          </p>
                          <Button variant="outline" size="sm" data-testid={`button-copy-script-${index}`}>
                            نسخ النص
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات الأداء</CardTitle>
                    <CardDescription>أداءك هذا الشهر</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">إجمالي المكالمات</span>
                      <span className="font-semibold">{currentAgent ? Number(currentAgent.dailyContacts) * 30 : 0}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">إجمالي الصفقات</span>
                      <span className="font-semibold">{currentAgent ? Number(currentAgent.totalDeals) : 0}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-muted-foreground">إجمالي الإيرادات</span>
                      <span className="font-semibold">{currentAgent ? `${Number(currentAgent.totalRevenue).toLocaleString()} EGP` : "0 EGP"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">سرعة الرد (دقائق)</span>
                      <span className="font-semibold">{currentAgent ? Number(currentAgent.responseSpeed) : 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>المشاريع النشطة</CardTitle>
                    <CardDescription>المشاريع التي تعمل عليها</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentAgent && currentAgent.activeProjects && currentAgent.activeProjects.length > 0 ? (
                      <div className="space-y-2">
                        {currentAgent.activeProjects.map((project, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm">{project}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد مشاريع نشطة حالياً
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="crm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة علاقات العملاء</CardTitle>
                  <CardDescription>جميع عملائك في مكان واحد</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leads.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد عملاء مسجلين بعد
                      </p>
                    ) : (
                      leads.slice(0, 15).map((lead) => (
                        <div 
                          key={lead.id}
                          className="flex items-center justify-between gap-4 p-3 rounded-md border"
                          data-testid={`crm-lead-${lead.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{lead.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {lead.funnelStage}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {lead.phone} • آخر تفاعل: {new Date(lead.lastInteractionAt || lead.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" data-testid={`button-view-${lead.id}`}>
                              عرض
                            </Button>
                            <Button variant="ghost" size="sm" data-testid={`button-notes-${lead.id}`}>
                              ملاحظات
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
}
