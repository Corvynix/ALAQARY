import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';
import { LanguageToggle } from '@/components/LanguageToggle';
import { TrustScoreIndicator } from '@/components/TrustScoreIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, FileText, Star } from 'lucide-react';
import type { Developer, PropertyMatch } from '@shared/schema';

export default function DeveloperDashboard() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: developer, isLoading: devLoading, error: devError } = useQuery<Developer>({
    queryKey: ['/api/developers/me'],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (devError && isUnauthorizedError(devError as Error)) {
      toast({
        title: language === 'ar' ? 'غير مصرح' : 'Unauthorized',
        description: language === 'ar' ? 'تسجيل الدخول مرة أخرى...' : 'Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
    }
  }, [devError, toast, language]);

  const { data: leads } = useQuery<PropertyMatch[]>({
    queryKey: ['/api/developers/leads'],
    enabled: isAuthenticated && !!developer,
  });

  if (authLoading || devLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-16 w-full" />
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <Skeleton className="h-32 w-full mb-8" />
        </div>
      </div>
    );
  }

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
            {language === 'ar' ? 'لوحة المطور' : 'Developer Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {developer?.companyName || (language === 'ar' ? 'إدارة عقاراتك وعملائك المحتملين' : 'Manage your properties and leads')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('leads')}</CardTitle>
                <Users className="h-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-leads-count">{leads?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'عملاء محتملون' : 'potential buyers'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('contracts')}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-contracts-count">
                  {developer?.totalContracts || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'عقد إجمالي' : 'total contracts'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-completed-count">
                  {developer?.completedContracts || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'عقد منجز' : 'completed contracts'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('rating')}</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-avg-rating">
                  {developer?.averageRating?.toFixed(1) || '0.0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'من 5.0' : 'out of 5.0'}
                </p>
              </CardContent>
            </Card>
          </div>

          {developer && (
            <div className="lg:col-span-1">
              <TrustScoreIndicator developer={developer} showBreakdown />
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'العملاء المحتملون الأخيرون' : 'Recent Leads'}</CardTitle>
          </CardHeader>
          <CardContent>
            {leads && leads.length > 0 ? (
              <div className="space-y-4">
                {leads.slice(0, 10).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{language === 'ar' ? 'عميل محتمل' : 'Potential Buyer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'نسبة التطابق:' : 'Match Score:'} {Math.round(lead.matchScore)}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-contact-${lead.id}`}>
                      {language === 'ar' ? 'تواصل' : 'Contact'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">{t('noData')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
