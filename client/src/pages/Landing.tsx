import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Search, TrendingUp, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import heroImage from '@assets/generated_images/Arabic_luxury_real_estate_hero_5f33b549.png';

export default function Landing() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">ع</span>
            </div>
            <span className="font-bold text-xl">عقاري</span>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button asChild variant="ghost" data-testid="button-properties">
              <Link href="/properties">{t('properties')}</Link>
            </Button>
            <Button asChild data-testid="button-login">
              <a href="/api/login">{t('login')}</a>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground" data-testid="text-hero-title">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            {t('heroSubtitle')}
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-background/90 backdrop-blur-md p-2 rounded-lg shadow-lg">
              <Input
                placeholder={t('searchPlaceholder')}
                className="flex-1 border-0 bg-transparent text-lg"
                data-testid="input-hero-search"
              />
              <Button size="lg" className="px-8" data-testid="button-hero-search">
                <Search className="w-5 h-5 me-2" />
                {t('exploreProperties')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {language === 'ar' ? 'لماذا عقاري؟' : 'Why Choose Us?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ar' ? 'مطابقة ذكية' : 'Smart Matching'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'نستخدم الذكاء الاصطناعي لمطابقتك مع العقارات المثالية بناءً على تفضيلاتك وسلوكك'
                    : 'AI-powered matching finds your perfect property based on preferences and behavior'
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ar' ? 'درجات الثقة' : 'Trust Scores'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar'
                    ? 'تقييمات شفافة للمطورين بناءً على الأداء التاريخي والموثوقية'
                    : 'Transparent developer ratings based on historical performance and reliability'
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar'
                    ? 'رؤى عميقة حول السوق واتجاهات الأسعار لمساعدتك في اتخاذ قرارات مستنيرة'
                    : 'Deep insights into market trends and pricing to help you make informed decisions'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {language === 'ar' ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'انضم إلى آلاف المستثمرين الذين يثقون بمنصتنا لإيجاد عقاراتهم المثالية'
              : 'Join thousands of investors who trust our platform to find their perfect properties'
            }
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8" data-testid="button-cta-start">
              <a href="/api/login">
                {t('getStarted')}
                <ArrowLeft className="w-5 h-5 ms-2" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8" data-testid="button-cta-explore">
              <Link href="/properties">{t('exploreProperties')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 عقاري. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
        </div>
      </footer>
    </div>
  );
}
