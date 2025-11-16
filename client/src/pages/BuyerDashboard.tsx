import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Target, Heart } from 'lucide-react';
import type { Property, Developer, PropertyMatch, BuyerProfile } from '@shared/schema';

export default function BuyerDashboard() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: language === 'ar' ? 'غير مصرح' : 'Unauthorized',
        description: language === 'ar' ? 'تسجيل الدخول مرة أخرى...' : 'Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, language]);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<BuyerProfile>({
    queryKey: ['/api/buyer-profiles/me'],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (profileError && isUnauthorizedError(profileError as Error)) {
      toast({
        title: language === 'ar' ? 'غير مصرح' : 'Unauthorized',
        description: language === 'ar' ? 'تسجيل الدخول مرة أخرى...' : 'Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
    }
  }, [profileError, toast, language]);

  const { data: matches, isLoading: matchesLoading } = useQuery<(PropertyMatch & { property?: Property & { developer?: Developer } })[]>({
    queryKey: ['/api/matches/my-matches'],
    enabled: isAuthenticated && !!profile,
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-16 w-full" />
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ع</span>
              </div>
              <span className="font-bold text-xl">عقاري</span>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button asChild variant="ghost" data-testid="button-logout">
                <a href="/api/logout">{t('logout')}</a>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
          <Target className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">{language === 'ar' ? 'أنشئ ملفك الشخصي' : 'Create Your Profile'}</h1>
          <p className="text-muted-foreground">
            {language === 'ar'
              ? 'ابدأ بإنشاء ملفك الشخصي للحصول على توصيات عقارية مخصصة'
              : 'Get started by creating your profile to receive personalized property recommendations'
            }
          </p>
          <Button asChild size="lg" data-testid="button-create-profile">
            <Link href="/profile/builder">{t('buildProfile')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const topMatches = matches?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">ع</span>
                </div>
                <span className="font-bold text-xl">عقاري</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" data-testid="button-nav-properties">
                <Link href="/properties">{t('properties')}</Link>
              </Button>
              <Button asChild variant="ghost" data-testid="button-nav-dashboard">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button asChild variant="ghost" data-testid="button-logout">
              <a href="/api/logout">{t('logout')}</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'عقاراتك المطابقة والتوصيات الشخصية' : 'Your matched properties and personalized recommendations'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'التطابقات' : 'Matches'}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-matches">{matches?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'عقار متطابق' : 'matched properties'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'أفضل نسبة' : 'Top Match'}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-top-match">
                {topMatches[0] ? `${Math.round(topMatches[0].matchScore)}%` : '-'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'نسبة التطابق' : 'match score'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'تم العرض' : 'Viewed'}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-viewed-count">
                {matches?.filter(m => m.viewed).length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'عقار تم عرضه' : 'properties viewed'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{language === 'ar' ? 'أفضل التطابقات' : 'Top Matches'}</h2>
          <Button asChild variant="outline" data-testid="button-view-all">
            <Link href="/properties">{language === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </Button>
        </div>

        {matchesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        ) : topMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-top-matches">
            {topMatches.map((match) => match.property && (
              <PropertyCard
                key={match.id}
                property={match.property}
                matchScore={match.matchScore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'ar' ? 'لا توجد تطابقات حتى الآن' : 'No matches yet'}
          </div>
        )}
      </div>
    </div>
  );
}
