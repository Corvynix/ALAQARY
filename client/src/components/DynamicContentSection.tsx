import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UserType } from "./UserTypeSelector";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Brain, 
  Zap, 
  Shield,
  Users,
  LineChart,
  CheckCircle2,
  DollarSign,
  Lock,
  Database
} from "lucide-react";

interface DynamicContentSectionProps {
  language: "ar" | "en";
  userType: UserType;
  onCTAClick: () => void;
}

export default function DynamicContentSection({ 
  language, 
  userType,
  onCTAClick 
}: DynamicContentSectionProps) {
  if (!userType) return null;

  const content = {
    ar: {
      agent: {
        headline: "احصل على Leads حقيقية بدون سمسرة",
        subheadline: "استخدم AI Scripts تقفل مبيعات أسرع",
        description: "تقرير ذكي يحلل أداءك ويضاعف دخلك",
        cta: "ابدأ تفعيل حساب مستشار مجاني",
        features: [
          {
            icon: Users,
            title: "عملاء حقيقيين",
            description: "احصل على عملاء مهتمين فعلاً بالشراء بدون إهدار وقت"
          },
          {
            icon: Brain,
            title: "سكريبتات AI ذكية",
            description: "أدوات مدعومة بالذكاء الاصطناعي لإقفال الصفقات أسرع"
          },
          {
            icon: BarChart3,
            title: "تقارير أداء شاملة",
            description: "تحليل دقيق لأدائك مع توصيات لمضاعفة دخلك"
          }
        ]
      },
      developer: {
        headline: "حلّل احتياجات المستثمرين قبل إطلاق المشروع",
        subheadline: "احصل على بيانات طلب حقيقية بالمنطقة",
        description: "أطلق مشاريعك بدقة أعلى و Cost أقل",
        cta: "انضم كشركة أو مطور الآن",
        features: [
          {
            icon: LineChart,
            title: "تحليل الطلب الحقيقي",
            description: "بيانات دقيقة عن احتياجات المستثمرين في كل منطقة"
          },
          {
            icon: Target,
            title: "دقة أعلى في التخطيط",
            description: "قرارات مبنية على بيانات حقيقية وليس توقعات"
          },
          {
            icon: TrendingUp,
            title: "تقليل المخاطر",
            description: "أطلق مشاريع ناجحة بتكلفة أقل ونتائج مضمونة"
          }
        ]
      },
      client: {
        headline: "اعرف أفضل اختيار يناسب ميزانيتك",
        subheadline: "قارن بين المشاريع بدون تزييف تسويق",
        description: "استشارة ذكاء اصطناعي بدون عمولة",
        cta: "ابدأ فحص العقار المناسب لك",
        features: [
          {
            icon: CheckCircle2,
            title: "اختيار دقيق ومناسب",
            description: "اعثر على العقار المثالي الذي يناسب ميزانيتك واحتياجاتك"
          },
          {
            icon: Shield,
            title: "مقارنة شفافة",
            description: "قارن المشاريع بدون تضليل تسويقي أو بيانات مزيفة"
          },
          {
            icon: Brain,
            title: "استشارة AI مجانية",
            description: "احصل على توصيات ذكية بدون دفع عمولات للوسطاء"
          }
        ]
      },
      contributor: {
        headline: "اربح دخل شهري من مشاركتك للبيانات",
        subheadline: "كن جزء من أكبر عقل عقاري عربي",
        description: "بدون الكشف عن الهوية أو بيانات شخصية",
        cta: "سجّل كمساهم بيانات",
        features: [
          {
            icon: DollarSign,
            title: "دخل شهري مستمر",
            description: "احصل على مكافآت مالية مقابل مشاركة البيانات العقارية"
          },
          {
            icon: Database,
            title: "ساهم في النظام",
            description: "كن جزءاً من أكبر منصة ذكاء عقاري في الوطن العربي"
          },
          {
            icon: Lock,
            title: "خصوصية كاملة",
            description: "شارك بياناتك بدون الكشف عن هويتك أو معلوماتك الشخصية"
          }
        ]
      }
    },
    en: {
      agent: {
        headline: "Get Real Leads Without Brokerage",
        subheadline: "Use AI Scripts to Close Sales Faster",
        description: "Smart reports analyze your performance and double your income",
        cta: "Start Free Agent Account",
        features: [
          {
            icon: Users,
            title: "Real Clients",
            description: "Get genuinely interested buyers without wasting time"
          },
          {
            icon: Brain,
            title: "Smart AI Scripts",
            description: "AI-powered tools to close deals faster"
          },
          {
            icon: BarChart3,
            title: "Comprehensive Performance",
            description: "Detailed analysis with recommendations to double your income"
          }
        ]
      },
      developer: {
        headline: "Analyze Investor Needs Before Project Launch",
        subheadline: "Get Real Demand Data by Area",
        description: "Launch projects with higher accuracy and lower cost",
        cta: "Join as Company or Developer",
        features: [
          {
            icon: LineChart,
            title: "Real Demand Analysis",
            description: "Accurate data on investor needs in each area"
          },
          {
            icon: Target,
            title: "Higher Planning Accuracy",
            description: "Decisions based on real data, not predictions"
          },
          {
            icon: TrendingUp,
            title: "Risk Reduction",
            description: "Launch successful projects with lower cost and guaranteed results"
          }
        ]
      },
      client: {
        headline: "Find the Best Choice for Your Budget",
        subheadline: "Compare Projects Without Marketing Deception",
        description: "AI consultation with no commission",
        cta: "Start Property Assessment",
        features: [
          {
            icon: CheckCircle2,
            title: "Accurate Match",
            description: "Find the ideal property that fits your budget and needs"
          },
          {
            icon: Shield,
            title: "Transparent Comparison",
            description: "Compare projects without marketing deception or fake data"
          },
          {
            icon: Brain,
            title: "Free AI Consultation",
            description: "Get smart recommendations without paying broker commissions"
          }
        ]
      },
      contributor: {
        headline: "Earn Monthly Income from Sharing Data",
        subheadline: "Be Part of the Largest Arab Real Estate Intelligence",
        description: "Without revealing identity or personal information",
        cta: "Register as Data Contributor",
        features: [
          {
            icon: DollarSign,
            title: "Continuous Monthly Income",
            description: "Get financial rewards for sharing property data"
          },
          {
            icon: Database,
            title: "Contribute to the System",
            description: "Be part of the largest real estate intelligence platform in the Arab world"
          },
          {
            icon: Lock,
            title: "Complete Privacy",
            description: "Share your data without revealing your identity or personal information"
          }
        ]
      }
    }
  };

  const typeContent = content[language][userType];

  return (
    <section 
      className="py-24 px-6 bg-gradient-to-b from-[#0d0d0d] via-black to-[#0d0d0d] relative overflow-hidden"
      data-testid={`section-dynamic-content-${userType}`}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className={`text-sm font-medium text-primary ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'خاص بك' : 'For You'}
            </span>
          </div>
          
          <h2 
            className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${
              language === 'ar' ? 'font-arabic' : 'font-serif'
            }`}
            data-testid="text-dynamic-headline"
          >
            {typeContent.headline}
          </h2>
          
          <p 
            className={`text-2xl md:text-3xl text-white/90 mb-4 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
            data-testid="text-dynamic-subheadline"
          >
            {typeContent.subheadline}
          </p>
          
          <p 
            className={`text-xl text-muted-foreground max-w-3xl mx-auto ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
            data-testid="text-dynamic-description"
          >
            {typeContent.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {typeContent.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-card/50 border-border/50 hover-elevate transition-all duration-300"
                data-testid={`card-feature-${index}`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 
                      className={`text-xl font-bold mb-2 ${
                        language === 'ar' ? 'font-arabic' : ''
                      }`}
                      data-testid={`text-feature-title-${index}`}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className={`text-muted-foreground ${
                        language === 'ar' ? 'font-arabic' : ''
                      }`}
                      data-testid={`text-feature-description-${index}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="text-lg px-12 py-7 h-auto font-bold bg-gradient-to-r from-primary via-[#d9a543] to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 shadow-xl shadow-primary/30 border-2 border-primary/20"
            onClick={onCTAClick}
            data-testid={`button-cta-${userType}`}
            style={{
              backgroundSize: '200% 100%',
              backgroundPosition: '0% center'
            }}
          >
            {typeContent.cta}
          </Button>
          
          <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'تفعيل فوري' : 'Instant Activation'}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'آمن ومضمون' : 'Safe & Secure'}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'بدون رسوم مخفية' : 'No Hidden Fees'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
