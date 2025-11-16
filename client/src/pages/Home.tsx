import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, MessageSquare } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

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
            <Button asChild variant="ghost">
              <Link href="/blog">{t('blog')}</Link>
            </Button>
            <Button asChild variant="ghost" data-testid="button-properties">
              <Link href="/properties">{t('properties')}</Link>
            </Button>
            <Button asChild variant="ghost" data-testid="button-dashboard">
              <Link href="/dashboard">{t('dashboard')}</Link>
            </Button>
            <Button asChild variant="ghost" data-testid="button-logout">
              <a href="/api/logout">{t('logout')}</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-welcome">
            {language === 'ar' ? 'مرحباً بك' : 'Welcome Back'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {language === 'ar' 
              ? 'ابدأ باستكشاف العقارات المطابقة لك'
              : 'Start exploring properties matched to your preferences'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard">
            <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{t('dashboard')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'شاهد تطابقاتك وتوصياتك' : 'View your matches and recommendations'}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/properties">
            <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="font-semibold">{t('properties')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'تصفح جميع العقارات المتاحة' : 'Browse all available properties'}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile/builder">
            <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="font-semibold">{t('buildProfile')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'حدّث تفضيلاتك الشخصية' : 'Update your personal preferences'}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
