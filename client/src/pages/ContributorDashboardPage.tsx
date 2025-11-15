import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Database, 
  TrendingUp, 
  Award,
  ShieldCheck,
  Coins,
  PlusCircle,
  BarChart3,
  Eye,
  EyeOff
} from "lucide-react";

export default function ContributorDashboardPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [dataTitle, setDataTitle] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [confidential, setConfidential] = useState(false);
  
  const userCredits = user?.credits ? Number(user.credits) : 0;
  const accuracyScore = user?.accuracyScore ? Number(user.accuracyScore) : 0;

  const statsCards = [
    {
      title: "رصيد النقاط",
      value: userCredits,
      icon: Coins,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "درجة الدقة",
      value: `${accuracyScore}%`,
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "بيانات مساهمة",
      value: 12,
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "النقاط المكتسبة اليوم",
      value: 45,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  const rewardTiers = [
    { range: "1-50", points: 5, description: "بيانات أساسية", icon: "bronze" },
    { range: "51-200", points: 15, description: "بيانات موثقة", icon: "silver" },
    { range: "201-500", points: 35, description: "بيانات حصرية", icon: "gold" },
    { range: "500+", points: 100, description: "بيانات استراتيجية", icon: "diamond" }
  ];

  const handleSubmitData = async () => {
    if (!dataTitle || !dataType || !dataValue) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال البيانات",
      description: "سيتم مراجعة بياناتك وإضافة النقاط إلى حسابك"
    });
    
    setDataTitle("");
    setDataType("");
    setDataValue("");
    setConfidential(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم المساهم في البيانات</h1>
            <p className="text-muted-foreground mt-1">
              مرحباً {user?.fullName || user?.username} - اكسب نقاط من خلال مشاركة البيانات القيمة
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
              credits={userCredits} 
              language={language}
            />
            <CreditScoreCard
              score={accuracyScore}
              role={user?.role || 'data_contributor'}
              language={language}
            />
          </div>

          <Tabs defaultValue="wizard" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full lg:w-auto lg:inline-grid">
              <TabsTrigger value="wizard" data-testid="tab-wizard">
                <PlusCircle className="h-4 w-4 ml-2" />
                إضافة بيانات
              </TabsTrigger>
              <TabsTrigger value="credits" data-testid="tab-credits">
                <Coins className="h-4 w-4 ml-2" />
                نظام النقاط
              </TabsTrigger>
              <TabsTrigger value="accuracy" data-testid="tab-accuracy">
                <BarChart3 className="h-4 w-4 ml-2" />
                درجة الدقة
              </TabsTrigger>
              <TabsTrigger value="privacy" data-testid="tab-privacy">
                <ShieldCheck className="h-4 w-4 ml-2" />
                الخصوصية
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-blue-500" />
                    معالج إضافة البيانات
                  </CardTitle>
                  <CardDescription>
                    شارك معلومات قيمة واكسب نقاط
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataTitle">عنوان البيانات</Label>
                      <Input
                        id="dataTitle"
                        placeholder="مثال: أسعار الشقق في التجمع الخامس"
                        value={dataTitle}
                        onChange={(e) => setDataTitle(e.target.value)}
                        data-testid="input-data-title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataType">نوع البيانات</Label>
                      <Select value={dataType} onValueChange={setDataType}>
                        <SelectTrigger id="dataType" data-testid="select-data-type">
                          <SelectValue placeholder="اختر نوع البيانات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property_price">سعر عقار</SelectItem>
                          <SelectItem value="market_trend">اتجاه السوق</SelectItem>
                          <SelectItem value="developer_info">معلومات مطور</SelectItem>
                          <SelectItem value="client_feedback">تعليقات عملاء</SelectItem>
                          <SelectItem value="transaction_details">تفاصيل صفقة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataValue">تفاصيل البيانات</Label>
                      <Textarea
                        id="dataValue"
                        placeholder="أدخل البيانات بالتفصيل..."
                        value={dataValue}
                        onChange={(e) => setDataValue(e.target.value)}
                        rows={6}
                        data-testid="textarea-data-value"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-md border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold">الوضع السري</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          البيانات السرية تحصل على نقاط مضاعفة ولن يتم الكشف عن هويتك
                        </p>
                      </div>
                      <Button
                        variant={confidential ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConfidential(!confidential)}
                        data-testid="button-toggle-confidential"
                      >
                        {confidential ? (
                          <>
                            <EyeOff className="h-4 w-4 ml-2" />
                            سري
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 ml-2" />
                            عام
                          </>
                        )}
                      </Button>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleSubmitData}
                      data-testid="button-submit-data"
                    >
                      <PlusCircle className="h-4 w-4 ml-2" />
                      إرسال البيانات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-500" />
                    نظام كسب النقاط
                  </CardTitle>
                  <CardDescription>
                    اكسب نقاط بناءً على جودة وقيمة البيانات المقدمة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rewardTiers.map((tier, index) => (
                      <Card key={index} className="border" data-testid={`tier-card-${index}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Coins className="h-5 w-5 text-amber-500" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{tier.description}</h4>
                                <p className="text-sm text-muted-foreground">
                                  نقاط الدقة: {tier.range}
                                </p>
                              </div>
                            </div>
                            <Badge className="text-lg font-bold">
                              +{tier.points}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-md bg-muted">
                    <h4 className="font-semibold mb-2">مضاعفات النقاط</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• البيانات السرية: x2 نقاط</li>
                      <li>• بيانات موثقة (صور/مستندات): x1.5 نقاط</li>
                      <li>• بيانات فريدة (غير متاحة في السوق): x3 نقاط</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accuracy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    مستوى درجة الدقة
                  </CardTitle>
                  <CardDescription>
                    درجة دقتك: {accuracyScore}% - {accuracyScore > 90 ? "خبير" : accuracyScore > 70 ? "متقدم" : accuracyScore > 50 ? "متوسط" : "مبتدئ"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">التقدم إلى المستوى التالي</span>
                        <span className="font-medium">{accuracyScore}/100</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                          style={{ width: `${accuracyScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-md border">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-green-500 mb-2">
                            {Math.round(accuracyScore * 1.2)}
                          </p>
                          <p className="text-sm text-muted-foreground">بيانات تم التحقق منها</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-md border">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-amber-500 mb-2">
                            {Math.round(accuracyScore / 10)}
                          </p>
                          <p className="text-sm text-muted-foreground">بيانات قيد المراجعة</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-md bg-blue-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                        نصيحة لزيادة درجة الدقة
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        قدم بيانات موثقة مع صور أو مستندات داعمة. البيانات الدقيقة والقابلة للتحقق تحصل على تقييم أعلى.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    الوضع السري والخصوصية
                  </CardTitle>
                  <CardDescription>
                    حماية كاملة لهويتك وبياناتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-md border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        ما هو الوضع السري؟
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        عندما تفعل الوضع السري، يتم إخفاء هويتك بالكامل. لن يتم ربط البيانات بحسابك أو معلوماتك الشخصية. ستحصل على ضعف النقاط مقابل البيانات السرية.
                      </p>
                    </div>

                    <div className="p-4 rounded-md border">
                      <h4 className="font-semibold mb-2">الضمانات</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>تشفير كامل للبيانات المرسلة</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>عدم الكشف عن الهوية في أي حال</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>حذف المعلومات التعريفية تلقائياً</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>النقاط تُضاف إلى حسابك بشكل آمن</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        نحن ملتزمون بحماية خصوصيتك وأمن بياناتك. جميع البيانات محمية بأعلى معايير الأمان.
                      </p>
                    </div>
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
