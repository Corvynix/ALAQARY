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
      {/* HERO SECTION - Ultra Minimal */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img 
          src={heroImage}
          alt="استشارات عقارية"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-medium text-foreground mb-8 leading-tight" data-testid="text-hero-title">
            احمِ نفسك من خسارة<br />
            <span className="text-accent">100,000 - 500,000 جنيه</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 leading-loose max-w-2xl mx-auto">
            استشارة عقارية وقانونية شاملة تحميك من الأخطاء المكلفة في أول عملية شراء عقاري
          </p>

          <Button 
            size="lg"
            className="bg-accent text-accent-foreground px-10 mb-16"
            data-testid="button-book-now-hero"
            onClick={() => setLocation('/booking')}
          >
            احجز استشارتك (200 جنيه قابلة للاسترداد)
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-foreground">
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-clients">
              <span className="text-base text-muted-foreground">+500 عميل راضي</span>
            </div>
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-secure">
              <span className="text-base text-muted-foreground">معاملات آمنة 100%</span>
            </div>
            <div className="flex flex-col items-center gap-2" data-testid="trust-stat-refund">
              <span className="text-base text-muted-foreground">استرداد كامل عند الشراء</span>
            </div>
          </div>
        </div>
      </section>

      {/* RISKS SECTION - Minimal */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary" data-testid="badge-risks">
              مخاطر حقيقية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-relaxed">
              أخطر الأخطاء التي نحميك منها
            </h2>
          </div>

          <div className="space-y-12">
            {risks.map((risk, index) => (
              <div key={index} className="max-w-2xl mx-auto" data-testid={`card-risk-${index}`}>
                <h3 className="text-lg font-medium text-foreground mb-3 leading-relaxed">
                  {risk.title}
                </h3>
                <p className="text-base text-muted-foreground leading-loose">
                  {risk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION - Minimal */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary" data-testid="badge-solutions">
              كيف نحميك
            </Badge>
            <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-relaxed">
              ما تحصل عليه بـ <span className="text-accent">200 جنيه</span>
            </h2>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {solutions.map((item, index) => (
              <div key={index} data-testid={`card-solution-${index}`}>
                <p className="text-base text-foreground leading-loose">
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION - Minimal */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary" data-testid="badge-process">
              العملية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-relaxed">
              ثلاث خطوات بسيطة
            </h2>
          </div>

          <div className="space-y-12 max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} data-testid={`card-step-${index}`}>
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">{step.number}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-3 leading-relaxed">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-loose">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Minimal */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary" data-testid="badge-faq">
              أسئلة شائعة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-relaxed">
              لديك أسئلة؟
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.slice(0, 5).map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-border"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-base font-medium text-left hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-loose pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA - Minimal */}
      <section className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-8 leading-relaxed">
            ابدأ بقرار صحيح
          </h2>
          
          <p className="text-base text-muted-foreground mb-12 leading-loose">
            استشارة احترافية تحميك من الأخطاء المكلفة وتوفر لك آلاف الجنيهات
          </p>

          <Button 
            size="lg"
            className="bg-accent text-accent-foreground px-10 mb-12"
            data-testid="button-final-cta"
            onClick={() => setLocation('/booking')}
          >
            احجز الآن (200 جنيه قابلة للاسترداد)
          </Button>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
            <span>+500 عميل راضي</span>
            <span>معاملات آمنة 100%</span>
            <span>استرداد كامل عند الشراء</span>
          </div>
        </div>
      </section>
    </div>
  );
}
