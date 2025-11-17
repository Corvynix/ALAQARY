import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Check, 
  X, 
  TrendingUp, 
  Shield, 
  Target, 
  Users, 
  Award, 
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  DollarSign,
  RefreshCcw,
  Star,
  MessageCircle,
  ArrowRight,
  Zap,
  Lock,
  Timer
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@assets/generated_images/Dubai_luxury_building_hero_f0dfcf3b.png";
import consultantImage from "@assets/generated_images/Professional_consultant_headshot_6a05d1b5.png";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUrgency(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const risks = [
    {
      title: "دفع سعر أعلى من القيمة الحقيقية بـ 15-30%",
      desc: "معظم المطورين يضخمون الأسعار للمشترين الجدد الذين لا يعرفون السوق",
      impact: "خسارة 100,000 - 500,000 جنيه"
    },
    {
      title: "التعاقد مع مطور غير موثوق أو وهمي",
      desc: "مطورون بدون تراخيص أو سجل حافل، مشاريع تتأخر سنوات أو لا تكتمل أبدًا",
      impact: "خسارة رأس المال بالكامل"
    },
    {
      title: "عقود تحتوي على بنود خفية تصب في مصلحة المطور",
      desc: "غرامات تأخير، رسوم صيانة مبالغ فيها، شروط استحواذ على الوحدة",
      impact: "التزامات مالية مفاجئة"
    },
    {
      title: "اختيار موقع ضعيف بدون نمو مستقبلي",
      desc: "مناطق لا تشهد تطويرًا أو طلبًا، صعوبة في إعادة البيع أو التأجير",
      impact: "عقار بلا قيمة تسويقية"
    },
    {
      title: "خطة سداد غير مناسبة لوضعك المالي",
      desc: "أقساط عالية تسبب ضغوطًا مالية، شروط تمويل مجحفة",
      impact: "عدم القدرة على السداد"
    },
    {
      title: "عدم التحقق من الأوراق القانونية والتراخيص",
      desc: "مشاريع بدون تصاريح، أراضي متنازع عليها، مشاكل في نقل الملكية",
      impact: "فقدان الحق القانوني"
    },
    {
      title: "الوقوع في فخ التسويق العاطفي والضغط النفسي",
      desc: "شراء متسرع بدون دراسة، الانبهار بالديكورات وتجاهل الأساسيات",
      impact: "قرار غير مدروس"
    },
    {
      title: "تجاهل التكاليف الخفية والرسوم الإضافية",
      desc: "رسوم التسجيل، الصيانة، المرافق، التأمين، التشطيب",
      impact: "زيادة 20-40% في التكلفة"
    },
    {
      title: "عدم معرفة العائد الاستثماري الحقيقي",
      desc: "توقعات غير واقعية للإيجار أو إعادة البيع، سوء تقدير التكاليف",
      impact: "استثمار خاسر"
    },
    {
      title: "الشراء في توقيت خاطئ من دورة السوق",
      desc: "شراء في قمة السوق قبل الانهيار، أو البيع في القاع",
      impact: "خسائر رأسمالية كبيرة"
    }
  ];

  const solutions = [
    {
      risk: "السعر المبالغ فيه",
      solution: "تحليل مقارن لأسعار السوق + كشف هامش الربح الحقيقي"
    },
    {
      risk: "المطور غير الموثوق",
      solution: "فحص شامل: تراخيص، سجل تجاري، مشاريع سابقة، شكاوى"
    },
    {
      risk: "العقود المخادعة",
      solution: "مراجعة قانونية دقيقة + تفسير البنود الخطيرة بلغة واضحة"
    },
    {
      risk: "الموقع الضعيف",
      solution: "تقييم النمو المستقبلي + خريطة التطوير + تحليل الطلب"
    },
    {
      risk: "خطة السداد غير المناسبة",
      solution: "هيكلة مخصصة تناسب دخلك + مقارنة 3-5 بدائل"
    }
  ];

  const steps = [
    {
      number: "١",
      title: "احجز استشارتك (200 جنيه فقط)",
      desc: "املأ النموذج بتفاصيل احتياجك وميزانيتك، ادفع رسوم الاستشارة القابلة للاسترداد"
    },
    {
      number: "٢",
      title: "احصل على تحليل شامل خلال 48 ساعة",
      desc: "تقرير مفصل عن السوق، المخاطر، الفرص، التوصيات المخصصة لحالتك"
    },
    {
      number: "٣",
      title: "اتخذ قرارك بثقة كاملة",
      desc: "استخدم التحليل في التفاوض، اختر الوحدة الأنسب، وفر آلاف الجنيهات"
    },
    {
      number: "٤",
      title: "استرد المبلغ عند إتمام الصفقة",
      desc: "إذا اشتريت من خلالنا، نسترد لك كامل الـ 200 جنيه من عمولتنا"
    }
  ];

  const faqs = [
    {
      q: "لماذا 200 جنيه وليس مجانيًا؟",
      a: "الاستشارات المجانية سطحية وغير مخصصة. نحن نقضي ساعات في تحليل حالتك، مراجعة العقود، دراسة السوق. الـ 200 جنيه تضمن جديتك وتعيد لك بالكامل عند الشراء."
    },
    {
      q: "هل المبلغ فعلاً يسترد بالكامل؟",
      a: "نعم 100%. إذا أتممت الصفقة من خلالنا (اشتريت وحدة نرشحها أو نساعدك فيها)، نسترد لك كامل الـ 200 جنيه من عمولة المطور."
    },
    {
      q: "ماذا لو لم أشترِ من خلالكم؟",
      a: "ستحتفظ بالتقرير والتحليل والتوصيات. يمكنك استخدامها للشراء من أي مطور. لن تسترد المبلغ لكنك ستكون حصلت على استشارة احترافية بـ 200 جنيه فقط."
    },
    {
      q: "كم مدة التحليل؟",
      a: "24-48 ساعة من لحظة ملء النموذج ودفع الرسوم. في الحالات العاجلة، نقدم خدمة مستعجلة خلال 12 ساعة."
    },
    {
      q: "هل الخدمة مناسبة للمشتري لأول مرة؟",
      a: "بالضبط! 90% من عملائنا مشترون لأول مرة. نشرح كل شيء بلغة بسيطة، نوجهك خطوة بخطوة، نحميك من الأخطاء المكلفة."
    },
    {
      q: "هل تعملون مع المطورين؟",
      a: "نعمل مع مطورين موثوقين فقط بعد فحص دقيق. ولكن ولاؤنا الأول لك كمشتري. نوضح لك المخاطر حتى لو كان المطور شريكنا."
    },
    {
      q: "ماذا لو كانت ميزانيتي محدودة؟",
      a: "نعمل مع جميع الميزانيات. نجد لك أفضل خيار ضمن إمكانياتك، ونساعدك في التفاوض وهيكلة السداد."
    },
    {
      q: "هل يمكنني إلغاء الاستشارة واسترداد المبلغ؟",
      a: "إذا ألغيت خلال 6 ساعات من الحجز قبل بدء العمل، نسترد 100%. بعد بدء التحليل، لا يمكن الاسترداد لكن يمكنك استكمال الخدمة."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Urgency Bar */}
      {showUrgency && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-white py-3 px-4 text-center z-50 animate-pulse" data-testid="banner-urgency">
          <div className="flex items-center justify-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="font-bold">تحذير: متبقي {spotsLeft} أماكن فقط هذا الشهر - مكانك غير مضمون بعد مغادرة الصفحة</span>
          </div>
        </div>
      )}

      {/* 1️⃣ HERO + SHOCK STATEMENT */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden pt-20">
        <img 
          src={heroImage}
          alt="استشارات عقارية"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-blue-800/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="mb-6 bg-yellow-500/20 border-yellow-500 text-white backdrop-blur-sm px-6 py-2 text-lg" data-testid="badge-limited-spots">
            <Award className="w-5 h-5 inline-block me-2" />
            متبقي {spotsLeft} أماكن فقط هذا الشهر
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-tight" data-testid="text-hero-title">
            احمِ نفسك من خسارة<br />
            <span className="text-yellow-400">100,000 - 500,000 جنيه</span><br />
            في أول عملية شراء عقاري
          </h1>
          
          <div className="bg-red-600/90 backdrop-blur-md border-2 border-red-400 rounded-lg p-6 mb-8 max-w-4xl mx-auto" data-testid="card-shock-statement">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-10 h-10 text-yellow-300 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  هل تعلم أن 73% من المشترين لأول مرة يدفعون سعرًا أعلى من القيمة الحقيقية؟
                </h2>
                <p className="text-lg text-white/95 leading-relaxed">
                  وأن 41% منهم يقعون في فخ عقود تحتوي على بنود خفية تكلفهم آلاف الجنيهات إضافية؟
                  <span className="block mt-2 font-bold text-yellow-300">
                    لا تكن واحدًا منهم. 200 جنيه فقط تفصلك عن حماية استثمارك.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black px-12 py-7 text-xl rounded-lg shadow-2xl border-4 border-yellow-600"
              data-testid="button-book-now-hero"
              onClick={() => setLocation('/booking')}
            >
              <CheckCircle className="w-6 h-6 me-2" />
              احجز استشارتك الآن (200 جنيه قابلة للاسترداد)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-white">
            <div className="flex items-center gap-3 justify-center" data-testid="trust-stat-clients">
              <Check className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-lg">+500 عميل راضي</span>
            </div>
            <div className="flex items-center gap-3 justify-center" data-testid="trust-stat-secure">
              <Check className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-lg">معاملات آمنة 100%</span>
            </div>
            <div className="flex items-center gap-3 justify-center" data-testid="trust-stat-refund">
              <Check className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-lg">استرداد كامل عند الشراء</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ SERVICE DESCRIPTION */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100" data-testid="badge-service">
              ما نقدمه لك
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              استشارة عقارية + قانونية شاملة بـ 200 جنيه فقط
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              نحن لسنا مجرد وسطاء عقاريين. نحن مستشارون مستقلون نعمل لصالحك فقط.
              نكشف الحقائق، نحلل الأرقام، نراجع العقود، ونوفر لك آلاف الجنيهات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">ما تحصل عليه:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">تحليل مقارن للأسعار: هل السعر عادل أم مبالغ فيه؟</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">فحص شامل للمطور: تراخيص، سجل، شكاوى، مشاريع سابقة</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">مراجعة قانونية للعقد: كشف البنود الخطيرة والخفية</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">تقييم الموقع والنمو المستقبلي: هل استثمار ناجح؟</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">خطة سداد مخصصة: أقساط تناسب دخلك</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">حساب التكاليف الخفية: كل جنيه ستدفعه</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-2 border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30">
              <X className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">ما لا نفعله (على عكس الآخرين):</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">لا نضغط عليك للشراء السريع</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">لا نخفي عيوب الوحدات أو المشاريع</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">لا نأخذ عمولات من المطور دون علمك</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">لا نعطيك توصيات عامة غير مخصصة</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">لا نتجاهل وضعك المالي الحقيقي</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 3️⃣ TOP 10 RISKS */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-600 text-white" data-testid="badge-risks">
              <AlertCircle className="w-4 h-4 inline-block me-2" />
              مخاطر حقيقية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              أخطر 10 أخطاء يقع فيها المشترون لأول مرة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              كل خطأ من هذه قد يكلفك عشرات أو مئات الآلاف من الجنيهات. نحميك من جميعها.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, index) => (
              <Card key={index} className="p-6 border-l-4 border-red-500 hover-elevate bg-card" data-testid={`card-risk-${index}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{risk.title}</h3>
                    <p className="text-muted-foreground mb-3 leading-relaxed">{risk.desc}</p>
                    <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-md text-sm font-semibold">
                      💰 {risk.impact}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black px-10 py-6 text-lg rounded-lg shadow-xl"
              data-testid="button-protect-investment"
              onClick={() => setLocation('/booking')}
            >
              <Shield className="w-6 h-6 me-2" />
              احمِ استثمارك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* 4️⃣ SOLUTION SECTION */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-600 text-white" data-testid="badge-solutions">
              <CheckCircle className="w-4 h-4 inline-block me-2" />
              الحلول العملية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              كيف نحل هذه المشاكل عمليًا؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              لكل مشكلة حل واضح ومباشر. هذا ما تدفع مقابله 200 جنيه.
            </p>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {solutions.map((item, index) => (
              <Card key={index} className="p-6 border-l-4 border-green-500 bg-card" data-testid={`card-solution-${index}`}>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant="outline" className="text-red-600 border-red-600 dark:text-red-400 dark:border-red-400">
                        المشكلة: {item.risk}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      <span className="text-green-600 dark:text-green-400 me-2">✓</span>
                      {item.solution}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ STEP-BY-STEP GUIDE */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white" data-testid="badge-process">
              العملية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              كيف نعمل: من الحجز إلى القرار النهائي
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              عملية بسيطة وشفافة خلال 48 ساعة فقط
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 hover-elevate border-border/50 bg-card relative" data-testid={`card-step-${index}`}>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
                )}
                <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-blue-200 dark:border-blue-800 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4 text-center leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ PRICING JUSTIFICATION */}
      <section className="py-20 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950/20 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-600 text-white" data-testid="badge-pricing">
              <DollarSign className="w-4 h-4 inline-block me-2" />
              لماذا 200 جنيه؟
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لماذا نفرض 200 جنيه بدلاً من الاستشارة المجانية؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-2 border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30">
              <X className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">الاستشارات "المجانية":</h3>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>مجرد حديث عام مدته 15-30 دقيقة</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>الهدف الحقيقي: بيع أي وحدة سريعًا</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>لا تحليل حقيقي للسوق</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>لا مراجعة قانونية للعقود</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>الوسيط يأخذ عمولة من المطور دون علمك</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="font-bold">النتيجة: تدفع آلاف الجنيهات زيادة</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-2 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">استشارتنا بـ 200 جنيه:</h3>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>تقرير مفصل 20-30 صفحة مخصص لك</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>3-5 ساعات عمل تحليلي ومقارنات</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>مراجعة قانونية دقيقة للعقود</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>استقلالية كاملة: نعمل لصالحك فقط</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>توفير آلاف الجنيهات في التفاوض</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-green-700 dark:text-green-300">+ استرداد كامل المبلغ عند الشراء</span>
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
            <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4">
              200 جنيه = استثمار في حماية مئات الآلاف
            </h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              عملاؤنا وفروا في المتوسط 75,000 - 200,000 جنيه من خلال استشارتنا.
              الـ 200 جنيه تضمن جديتك وتعود إليك بالكامل عند الشراء.
              <span className="block mt-4 font-bold text-yellow-300 text-2xl">
                هل هناك صفقة أفضل من هذه؟
              </span>
            </p>
          </Card>
        </div>
      </section>

      {/* 7️⃣ REFUND GUARANTEE */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600 text-white" data-testid="badge-refund">
              <RefreshCcw className="w-4 h-4 inline-block me-2" />
              ضمان الاسترداد
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              كيف ومتى يتم استرداد الـ 200 جنيه؟
            </h2>
          </div>

          <Card className="p-10 border-4 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                ضمان استرداد 100% - واضح وشفاف
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    الشرط الوحيد للاسترداد:
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    أن تشتري وحدة عقارية من خلالنا (سواء رشحناها نحن أو ساعدناك في التفاوض عليها).
                    نسترد لك كامل الـ 200 جنيه من عمولتنا من المطور.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    متى يتم الاسترداد؟
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    فور توقيع العقد ودفع المقدم. نخصم الـ 200 جنيه من إجمالي العمولة أو نعيدها لك مباشرة حسب اتفاقك مع المطور.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    ماذا لو لم أشترِ من خلالكم؟
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    ستحتفظ بالتقرير والتحليل الكامل. يمكنك استخدامه للشراء من أي مطور آخر.
                    لن تسترد الـ 200 جنيه لكنك ستكون حصلت على استشارة احترافية بهذا السعر البسيط.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    هل هناك التزام بالشراء؟
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    مطلقًا. قرار الشراء بيدك 100%. نحن نعطيك التحليل والتوصيات. أنت تقرر.
                    لا ضغوط، لا التزامات، لا حيل بيع.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-400 dark:border-blue-600">
              <h4 className="text-xl font-bold text-center text-foreground mb-3">
                باختصار:
              </h4>
              <p className="text-lg text-center text-muted-foreground leading-relaxed">
                ادفع 200 جنيه الآن → احصل على استشارة احترافية → اشترِ من خلالنا → <span className="font-bold text-green-600 dark:text-green-400">استرد الـ 200 جنيه</span>
                <br />
                <span className="block mt-2 text-base text-muted-foreground/80">
                  (أو احتفظ بالتحليل واستخدمه مع أي مطور آخر)
                </span>
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 8️⃣ CONSULTANT VALUE */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm" data-testid="badge-consultant">
                <Award className="w-4 h-4 inline-block me-2" />
                المستشار
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                من يقدم لك الاستشارة؟
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-yellow-400">م. أحمد الشافعي</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-4">
                    مستشار عقاري معتمد مع +12 سنة خبرة في السوق المصري.
                    ساعدت أكثر من 500 عميل على اتخاذ قرارات استثمارية ناجحة ووفرت لهم ملايين الجنيهات.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-lg">شهادة CRS (مستشار عقاري معتمد)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-lg">ماجستير في التمويل العقاري</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-lg">محلل معتمد لأسواق العقارات</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-lg">عضو جمعية المستشارين العقاريين المصريين</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <h4 className="text-xl font-bold mb-3 text-yellow-400">منهج العمل:</h4>
                  <p className="text-white/90 leading-relaxed">
                    أستخدم نموذج تحليلي متعدد المستويات: تحليل السوق، فحص المطور، مراجعة قانونية، تقييم مالي، تحليل المخاطر.
                    كل استشارة مبنية على بيانات حقيقية وليس توقعات أو آراء شخصية.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4 text-yellow-400">أمثلة واقعية:</h4>
                  <div className="space-y-4">
                    <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
                      <p className="text-white/90 leading-relaxed">
                        <Star className="w-5 h-5 inline-block text-yellow-400 me-2" />
                        <span className="font-bold">حالة 1:</span> عميل كان سيشتري وحدة بـ 1,200,000 جنيه.
                        بعد التحليل، اكتشفنا أن السعر العادل 950,000 جنيه. تفاوضنا ووفرنا له 250,000 جنيه.
                      </p>
                    </Card>
                    <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
                      <p className="text-white/90 leading-relaxed">
                        <Star className="w-5 h-5 inline-block text-yellow-400 me-2" />
                        <span className="font-bold">حالة 2:</span> عميلة كانت ستوقع عقدًا مع مطور لديه 9 شكاوى قضائية.
                        أنقذناها من خسارة محتملة لكامل رأس المال.
                      </p>
                    </Card>
                    <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
                      <p className="text-white/90 leading-relaxed">
                        <Star className="w-5 h-5 inline-block text-yellow-400 me-2" />
                        <span className="font-bold">حالة 3:</span> عائلة كانت تخطط للشراء في منطقة بدون نمو مستقبلي.
                        رشحنا لهم منطقة بديلة، زادت قيمة وحدتهم بـ 30% في سنتين.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-yellow-400/20 rounded-full blur-3xl" />
                <img 
                  src={consultantImage}
                  alt="المستشار العقاري"
                  className="relative w-full max-w-md rounded-2xl border-4 border-yellow-400/50 shadow-2xl"
                  data-testid="img-consultant-profile"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9️⃣ & 🔟 CTA + SCARCITY */}
      <section className="py-20 bg-gradient-to-b from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="mb-12">
            <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl mb-6 animate-pulse">
              <Timer className="w-6 h-6 inline-block me-2" />
              متبقي {spotsLeft} أماكن فقط هذا الشهر
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              لا تترك هذه الصفحة قبل حجز استشارتك
            </h2>
            
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-2xl mb-8 shadow-2xl">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-3xl font-bold mb-4">
                تحذير: مكانك غير مضمون بعد مغادرة هذه الصفحة
              </h3>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                نستقبل 30 استشارة فقط شهريًا للحفاظ على الجودة.
                بمجرد إغلاق هذه الصفحة، قد يأخذ شخص آخر مكانك.
                <span className="block mt-3 font-bold text-2xl text-yellow-300">
                  القرار الآن أو قد تنتظر شهرًا كاملاً
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Button 
              size="lg"
              className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-black px-16 py-8 text-2xl rounded-lg shadow-2xl border-4 border-green-700 animate-pulse"
              data-testid="button-book-consultation-main"
              onClick={() => setLocation('/booking')}
            >
              <CheckCircle className="w-8 h-8 me-3" />
              نعم، أريد حماية استثماري الآن (200 جنيه فقط)
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCcw className="w-5 h-5" />
                <span className="font-semibold">استرداد كامل عند الشراء</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">سرية تامة</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              بمجرد الحجز، ستصلك رسالة تأكيد خلال دقائق مع رابط ملء النموذج التفصيلي.
              سنبدأ التحليل فورًا ونرسل لك التقرير خلال 24-48 ساعة.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card className="p-6 bg-card border-2 border-border">
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-lg font-bold text-foreground mb-2">+500 عميل راضي</p>
              <p className="text-muted-foreground">حصلوا على استشارات احترافية</p>
            </Card>
            <Card className="p-6 bg-card border-2 border-border">
              <DollarSign className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-lg font-bold text-foreground mb-2">وفروا ملايين الجنيهات</p>
              <p className="text-muted-foreground">في التفاوض وكشف الأسعار المبالغ فيها</p>
            </Card>
            <Card className="p-6 bg-card border-2 border-border">
              <Shield className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mb-3" />
              <p className="text-lg font-bold text-foreground mb-2">معاملات آمنة 100%</p>
              <p className="text-muted-foreground">لا نصب، لا احتيال، لا مفاجآت</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 1️⃣1️⃣ FAQ SECTION */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white" data-testid="badge-faq">
              <MessageCircle className="w-4 h-4 inline-block me-2" />
              أسئلة شائعة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              لديك أسئلة؟ إليك الإجابات
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-border rounded-lg px-6 bg-card"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-lg font-bold text-left hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              لا تزال لديك أسئلة؟ لا مشكلة.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-6 text-lg"
              data-testid="button-contact-us"
              onClick={() => setLocation('/booking')}
            >
              <MessageCircle className="w-5 h-5 me-2" />
              احجز الآن واسأل أي شيء قبل الدفع
            </Button>
          </div>
        </div>
      </section>

      {/* 1️⃣2️⃣ GOLDEN WARNING */}
      <section className="py-20 bg-gradient-to-b from-red-600 via-orange-600 to-yellow-600 text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <Card className="p-10 md:p-16 bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-md border-4 border-yellow-400 shadow-2xl">
            <div className="text-center">
              <AlertTriangle className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 text-yellow-300 animate-pulse" />
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-yellow-300">
                التكلفة الحقيقية لعدم الحجز الآن
              </h2>
              
              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-white/95 max-w-3xl mx-auto">
                <p>
                  إذا خرجت من هذه الصفحة الآن وقررت "التفكير" أو "البحث أكثر"،
                  فأنت على الأرجح ستقع في أحد هذه السيناريوهات:
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left space-y-4">
                  <div className="flex items-start gap-3">
                    <X className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
                    <p>ستتحدث مع وسيط عقاري "مجاني" يدفعك لشراء أي وحدة بأعلى سعر</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
                    <p>ستدفع 50,000 - 300,000 جنيه زيادة عن السعر العادل</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
                    <p>ستوقع عقدًا تكتشف بنوده الخطيرة بعد فوات الأوان</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
                    <p>ستندم بعد 6 أشهر وتتمنى لو استشرت خبيرًا مستقلاً</p>
                  </div>
                </div>

                <p className="text-2xl md:text-3xl font-black text-yellow-300 mt-8">
                  200 جنيه الآن أو 200,000 جنيه ندم لاحقًا؟
                </p>

                <p className="text-xl">
                  الاختيار بسيط: استثمر 200 جنيه في استشارة احترافية
                  (قابلة للاسترداد بالكامل)، أو خاطر بخسارة مئات الآلاف
                  من خلال قرار غير مدروس.
                </p>
              </div>

              <div className="mt-12">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-12 py-8 text-2xl rounded-lg shadow-2xl border-4 border-yellow-500"
                  data-testid="button-last-chance"
                  onClick={() => setLocation('/booking')}
                >
                  <Shield className="w-8 h-8 me-3" />
                  احمي نفسك الآن - احجز استشارتك
                </Button>
                <p className="mt-4 text-sm text-yellow-200">
                  آخر فرصة قبل امتلاء الأماكن هذا الشهر
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 1️⃣3️⃣ CLOSING PERSUASION */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              القرار الأذكى لحماية استثمارك
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              في النهاية، شراء عقار ليس قرارًا بسيطًا. إنه التزام مالي لسنوات قادمة.
              الفرق بين قرار مدروس وقرار متسرع قد يكلفك مئات الآلاف من الجنيهات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-md border-2 border-red-400">
              <h3 className="text-3xl font-bold mb-6 text-red-300">بدون الاستشارة:</h3>
              <ul className="space-y-4 text-lg text-white/90">
                <li className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <span>تعتمد على كلام الوسيط أو المطور فقط</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <span>لا تعرف السعر الحقيقي للسوق</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <span>تخاطر بالتعاقد مع مطور مشبوه</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <span>لا تفهم البنود القانونية الخطيرة</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <span>قد تخسر 100,000+ جنيه في قرار واحد خاطئ</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-md border-2 border-green-400">
              <h3 className="text-3xl font-bold mb-6 text-green-300">مع الاستشارة:</h3>
              <ul className="space-y-4 text-lg text-white/90">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>تحليل مستقل ومحايد لصالحك فقط</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>تعرف السعر العادل وهامش التفاوض</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>فحص شامل للمطور وسمعته القانونية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>مراجعة قانونية دقيقة لكل بند في العقد</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>توفر 50,000 - 300,000 جنيه + استرداد الـ 200 جنيه</span>
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-10 md:p-16 bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900 text-center">
            <Zap className="w-20 h-20 mx-auto mb-8 text-yellow-900" />
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8">
              آخر كلمة: هل تثق في حكمك أكثر من خبير؟
            </h3>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-8">
              إذا كنت مشتريًا لأول مرة، فأنت ببساطة لا تعرف ما لا تعرفه.
              المطورون والوسطاء يعرفون ذلك ويستغلونه.
              <span className="block mt-4 font-black text-3xl text-gray-900">
                لا تكن الضحية التالية.
              </span>
            </p>
            
            <Button 
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-yellow-400 font-black px-16 py-8 text-2xl rounded-lg shadow-2xl border-4 border-gray-800"
              data-testid="button-final-cta"
              onClick={() => setLocation('/booking')}
            >
              <CheckCircle className="w-8 h-8 me-3" />
              احجز الآن وابدأ بقرار صحيح (200 جنيه فقط)
            </Button>

            <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-800">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5" />
                <span className="font-bold">استرداد كامل عند الشراء</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-bold">+500 عميل راضي</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <span className="font-bold">{spotsLeft} أماكن متبقية فقط</span>
              </div>
            </div>

            <p className="mt-8 text-base text-gray-700 max-w-3xl mx-auto">
              تذكر: الوسطاء الآخرون يريدونك أن تشتري بسرعة.
              نحن نريدك أن تشتري بذكاء. هذا هو الفرق.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
