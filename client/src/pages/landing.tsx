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
  Lock
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@assets/generated_images/Dubai_luxury_building_hero_f0dfcf3b.png";
import consultantImage from "@assets/generated_images/Professional_consultant_headshot_6a05d1b5.png";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const risks = [
    {
      title: "دفع سعر أعلى من القيمة الحقيقية بـ 15-30%",
      desc: "معظم المطورين يضخمون الأسعار للمشترين الجدد الذين لا يعرفون السوق"
    },
    {
      title: "التعاقد مع مطور غير موثوق أو وهمي",
      desc: "مطورون بدون تراخيص أو سجل حافل، مشاريع تتأخر سنوات أو لا تكتمل أبدًا"
    },
    {
      title: "عقود تحتوي على بنود خفية تصب في مصلحة المطور",
      desc: "غرامات تأخير، رسوم صيانة مبالغ فيها، شروط استحواذ على الوحدة"
    },
    {
      title: "اختيار موقع ضعيف بدون نمو مستقبلي",
      desc: "مناطق لا تشهد تطويرًا أو طلبًا، صعوبة في إعادة البيع أو التأجير"
    }
  ];

  const solutions = [
    {
      solution: "تحليل مقارن لأسعار السوق وكشف هامش الربح الحقيقي"
    },
    {
      solution: "فحص شامل للمطور: تراخيص، سجل تجاري، مشاريع سابقة"
    },
    {
      solution: "مراجعة قانونية دقيقة وتفسير البنود الخطيرة بلغة واضحة"
    },
    {
      solution: "تقييم النمو المستقبلي للموقع وتحليل الطلب"
    }
  ];

  const steps = [
    {
      number: "١",
      title: "احجز استشارتك",
      desc: "املأ النموذج بتفاصيل احتياجك وميزانيتك"
    },
    {
      number: "٢",
      title: "احصل على تحليل شامل",
      desc: "تقرير مفصل عن السوق والمخاطر والفرص خلال 48 ساعة"
    },
    {
      number: "٣",
      title: "اتخذ قرارك بثقة",
      desc: "استخدم التحليل في التفاوض ووفر آلاف الجنيهات"
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
      {/* HERO SECTION - Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img 
          src={heroImage}
          alt="استشارات عقارية"
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight" data-testid="text-hero-title">
            احمِ نفسك من خسارة<br />
            <span className="metallic-gold font-extrabold">100,000 - 500,000 جنيه</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-loose max-w-2xl mx-auto">
            استشارة عقارية وقانونية شاملة تحميك من الأخطاء المكلفة في أول عملية شراء عقاري
          </p>

          <Button 
            size="lg"
            className="metallic-gold-bg text-black px-12 py-7 text-lg font-bold mb-16 border-0 animate-neon-pulse"
            style={{boxShadow: '0 0 30px rgba(0,89,255,0.4), 0 0 60px rgba(0,89,255,0.2)'}}
            data-testid="button-book-now-hero"
            onClick={() => setLocation('/booking')}
          >
            احجز استشارتك (200 جنيه قابلة للاسترداد)
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-clients">
              <div className="text-4xl font-extrabold metallic-gold">+500</div>
              <span className="text-base text-muted-foreground">عميل راضي</span>
            </div>
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-secure">
              <div className="text-4xl font-extrabold metallic-gold">100%</div>
              <span className="text-base text-muted-foreground">معاملات آمنة</span>
            </div>
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-refund">
              <div className="text-4xl font-extrabold metallic-gold">200</div>
              <span className="text-base text-muted-foreground">جنيه استرداد كامل</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTANT BIO SECTION - Premium */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 metallic-gold-bg text-black text-sm px-4 py-2 border-0" data-testid="badge-consultant">
              خبير معتمد
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              من خلف الاستشارة؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استشاري عقاري معتمد مع خبرة عميقة في السوق المصري
            </p>
          </div>

          <Card className="overflow-hidden border-border shadow-2xl">
            <div className="grid md:grid-cols-5 gap-8 p-8 md:p-12">
              {/* Consultant Photo */}
              <div className="md:col-span-2 flex justify-center items-start">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full blur-2xl" style={{background: 'radial-gradient(circle, rgba(255,215,0,0.3), rgba(0,89,255,0.3))'}} />
                  <img 
                    src={consultantImage}
                    alt="المستشار العقاري"
                    className="relative w-64 h-64 rounded-full object-cover border-4 shadow-xl"
                    style={{borderColor: 'rgba(255,215,0,0.4)'}}
                    data-testid="img-consultant"
                  />
                  <div className="absolute -bottom-2 -right-2 metallic-gold-bg text-black rounded-full p-4 shadow-xl">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Consultant Info */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    أحمد محمد الخبير
                  </h3>
                  <p className="text-lg metallic-gold font-bold mb-4">
                    استشاري عقاري معتمد - خبرة 12+ سنة
                  </p>
                  <p className="text-base text-muted-foreground leading-loose">
                    متخصص في حماية المشترين من الأخطاء المكلفة. ساعدت أكثر من 500 عميل في اتخاذ قرارات استثمارية صحيحة ووفرت لهم ملايين الجنيهات من خلال التحليل الدقيق والمفاوضات الاحترافية.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3" data-testid="credential-1">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#ffd700'}} />
                    <span className="text-foreground">
                      <span className="font-semibold">شهادة CRE</span> - مستشار عقاري معتمد من المعهد الدولي
                    </span>
                  </div>
                  <div className="flex items-start gap-3" data-testid="credential-2">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#ffd700'}} />
                    <span className="text-foreground">
                      <span className="font-semibold">+500 صفقة ناجحة</span> - بقيمة تتجاوز 2 مليار جنيه
                    </span>
                  </div>
                  <div className="flex items-start gap-3" data-testid="credential-3">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#ffd700'}} />
                    <span className="text-foreground">
                      <span className="font-semibold">خبرة قانونية</span> - متخصص في مراجعة العقود العقارية
                    </span>
                  </div>
                  <div className="flex items-start gap-3" data-testid="credential-4">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#ffd700'}} />
                    <span className="text-foreground">
                      <span className="font-semibold">تحليل سوق متقدم</span> - باستخدام أحدث أدوات البيانات والذكاء الاصطناعي
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Badge variant="secondary" className="text-sm">
                    <Shield className="w-3 h-3 mr-1" />
                    معتمد CRE
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Award className="w-3 h-3 mr-1" />
                    12+ سنة خبرة
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Users className="w-3 h-3 mr-1" />
                    +500 عميل
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    2+ مليار معاملات
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Social Proof */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary text-sm px-4 py-2 neon-glow" data-testid="badge-testimonials">
              آراء العملاء
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              ماذا يقول عملاؤنا؟
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover-elevate" data-testid="testimonial-1">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5" style={{fill: '#ffd700', color: '#ffd700'}} />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-loose">
                "وفرت علي أكثر من 150,000 جنيه من خلال كشف الأسعار المبالغ فيها والتفاوض مع المطور. الاستشارة كانت أفضل استثمار!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{backgroundColor: 'rgba(255,215,0,0.1)', color: '#ffd700'}}>
                  م.س
                </div>
                <div>
                  <div className="font-semibold text-foreground">محمد سامي</div>
                  <div className="text-sm text-muted-foreground">مشتري أول، القاهرة الجديدة</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover-elevate" data-testid="testimonial-2">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5" style={{fill: '#ffd700', color: '#ffd700'}} />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-loose">
                "اكتشفت بنود خطيرة في العقد كانت ستكلفني ثروة لاحقاً. المراجعة القانونية أنقذتني من كارثة حقيقية."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{backgroundColor: 'rgba(255,215,0,0.1)', color: '#ffd700'}}>
                  ف.ع
                </div>
                <div>
                  <div className="font-semibold text-foreground">فاطمة عبدالله</div>
                  <div className="text-sm text-muted-foreground">مستثمرة، الساحل الشمالي</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover-elevate" data-testid="testimonial-3">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5" style={{fill: '#ffd700', color: '#ffd700'}} />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-loose">
                "الخدمة احترافية جداً. التقرير كان شامل ومفصل، والمتابعة ممتازة. استردت المبلغ كاملاً بعد الشراء كما وعدوا."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{backgroundColor: 'rgba(255,215,0,0.1)', color: '#ffd700'}}>
                  أ.م
                </div>
                <div>
                  <div className="font-semibold text-foreground">أحمد مصطفى</div>
                  <div className="text-sm text-muted-foreground">مهندس، العاصمة الإدارية</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* RISKS SECTION - Premium */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-2" data-testid="badge-risks">
              <AlertTriangle className="w-3 h-3 mr-1" />
              تحذير: مخاطر حقيقية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              أخطر الأخطاء التي نحميك منها
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              هذه الأخطاء تكلف المشترين ملايين الجنيهات سنوياً
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {risks.map((risk, index) => (
              <Card key={index} className="p-8 border-2 border-destructive/20 hover-elevate" data-testid={`card-risk-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-relaxed">
                      {risk.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-loose">
                      {risk.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION - Premium */}
      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 metallic-gold-bg text-black text-sm px-4 py-2 border-0" data-testid="badge-solutions">
              <Shield className="w-3 h-3 mr-1" />
              الحل الشامل
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              ما تحصل عليه بـ <span className="metallic-gold">200 جنيه فقط</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استشارة شاملة تحميك من خسارة مئات الآلاف
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {solutions.map((item, index) => (
              <Card key={index} className="p-8 border-2 hover-elevate" style={{borderColor: 'rgba(255,215,0,0.3)'}} data-testid={`card-solution-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                    <Check className="w-6 h-6" style={{color: '#ffd700'}} />
                  </div>
                  <p className="text-lg text-foreground leading-loose flex-1">
                    {item.solution}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 rounded-full px-6 py-3" style={{backgroundColor: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.3)'}}>
              <RefreshCcw className="w-5 h-5" style={{color: '#ffd700'}} />
              <span className="text-foreground font-semibold">
                استرداد كامل للـ 200 جنيه عند إتمام الصفقة من خلالنا
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION - Premium */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary text-sm px-4 py-2 neon-glow" data-testid="badge-process">
              <Zap className="w-3 h-3 mr-1" />
              العملية السريعة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              ثلاث خطوات بسيطة للحماية الكاملة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              من الحجز إلى التحليل الشامل في 48 ساعة فقط
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 hover-elevate" data-testid={`card-step-${index}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                  {index === 0 && <Target className="w-6 h-6" style={{color: '#ffd700'}} />}
                  {index === 1 && <FileText className="w-6 h-6" style={{color: '#ffd700'}} />}
                  {index === 2 && <CheckCircle className="w-6 h-6" style={{color: '#ffd700'}} />}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-loose">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 metallic-gold">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">تحليل سريع: 24-48 ساعة فقط</span>
            </div>
            <Button 
              size="lg"
              className="metallic-gold-bg text-black px-12 py-6 text-lg font-bold shadow-xl border-0"
              style={{boxShadow: '0 0 25px rgba(0,89,255,0.3), 0 0 50px rgba(0,89,255,0.15)'}}
              data-testid="button-cta-process"
              onClick={() => setLocation('/booking')}
            >
              ابدأ الآن - احجز استشارتك
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Premium */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary text-sm px-4 py-2" data-testid="badge-faq">
              <MessageCircle className="w-3 h-3 mr-1" />
              أسئلة شائعة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لديك أسئلة؟ لدينا الإجابات
            </h2>
            <p className="text-lg text-muted-foreground">
              كل ما تحتاج معرفته قبل البدء
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-md overflow-hidden"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline px-6 py-6" style={{'--hover-bg': 'rgba(255,215,0,0.05)'} as React.CSSProperties}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-loose px-6 pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* TRUST BADGES - Premium */}
      <section className="py-16 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                <Lock className="w-8 h-8" style={{color: '#ffd700'}} />
              </div>
              <div className="text-sm font-semibold text-foreground">معاملات آمنة 100%</div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                <Shield className="w-8 h-8" style={{color: '#ffd700'}} />
              </div>
              <div className="text-sm font-semibold text-foreground">شهادات معتمدة دولياً</div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                <Clock className="w-8 h-8" style={{color: '#ffd700'}} />
              </div>
              <div className="text-sm font-semibold text-foreground">استجابة خلال 24 ساعة</div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                <DollarSign className="w-8 h-8" style={{color: '#ffd700'}} />
              </div>
              <div className="text-sm font-semibold text-foreground">استرداد كامل مضمون</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Premium */}
      <section className="py-24" style={{background: 'linear-gradient(to bottom, hsl(var(--background)), rgba(255,215,0,0.05))'}}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-8 metallic-gold-bg text-black text-sm px-4 py-2 border-0">
            <ArrowRight className="w-3 h-3 mr-1" />
            جاهز للبدء؟
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            احمِ استثمارك الآن
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-loose max-w-2xl mx-auto">
            لا تخاطر بمستقبلك المالي. استشارة واحدة تحميك من خسارة مئات الآلاف
          </p>

          <div className="flex flex-col items-center gap-6 mb-12">
            <Button 
              size="lg"
              className="metallic-gold-bg text-black px-16 py-8 text-xl font-bold shadow-2xl border-0 animate-neon-pulse"
              style={{boxShadow: '0 0 40px rgba(0,89,255,0.5), 0 0 80px rgba(0,89,255,0.25)'}}
              data-testid="button-final-cta"
              onClick={() => setLocation('/booking')}
            >
              احجز استشارتك الآن - 200 جنيه فقط
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5" style={{color: '#ffd700'}} />
              <span className="font-semibold">استرداد كامل عند إتمام الصفقة</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4" style={{fill: '#ffd700', color: '#ffd700'}} />
                ))}
              </div>
              <div className="text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">تقييم العملاء</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 mb-2" style={{color: '#ffd700'}} />
              <div className="text-2xl font-bold text-foreground">+500</div>
              <div className="text-sm text-muted-foreground">عميل راضي</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-8 h-8 mb-2" style={{color: '#ffd700'}} />
              <div className="text-2xl font-bold text-foreground">2+ مليار</div>
              <div className="text-sm text-muted-foreground">جنيه معاملات</div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              خدمة عملاء متاحة على مدار الساعة | خصوصية مضمونة 100% | دفع آمن ومشفر
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
