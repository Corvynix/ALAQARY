import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, Home, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalDevelopers: number;
  totalProperties: number;
  totalSessions: number;
  avgPurchaseProbability: number;
  highRiskProperties: number;
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
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

  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: language === 'ar' ? 'غير مصرح' : 'Unauthorized',
        description: language === 'ar' ? 'تسجيل الدخول مرة أخرى...' : 'Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
    }
  }, [error, toast, language]);

  if (authLoading || isLoading) {
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
            {language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إحصائيات وتحليلات المنصة' : 'Platform statistics and analytics'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-users">
                {stats?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'إجمالي المستخدمين' : 'total users'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('developers')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-developers">
                {stats?.totalDevelopers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'مطور نشط' : 'active developers'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('properties')}</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-properties">
                {stats?.totalProperties || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'عقار مدرج' : 'listed properties'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'جلسات الذكاء الاصطناعي' : 'AI Sessions'}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-ai-sessions">
                {stats?.totalSessions || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'جلسة إجمالية' : 'total sessions'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'احتمالية الشراء' : 'Purchase Probability'}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-purchase-prob">
                {stats?.avgPurchaseProbability ? `${Math.round(stats.avgPurchaseProbability)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'متوسط' : 'average'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{language === 'ar' ? 'عقارات عالية المخاطر' : 'High Risk Properties'}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive" data-testid="text-high-risk">
                {stats?.highRiskProperties || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'تتطلب مراجعة' : 'requires review'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'مسار السلوك' : 'Behavioral Funnel'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'الزيارات' : 'Visits'}</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'عرض العقارات' : 'Property Views'}</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'تفاعل الذكاء الاصطناعي' : 'AI Engagement'}</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'تواصل مع المطور' : 'Developer Contact'}</span>
                  <span className="font-semibold">12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'أداء الذكاء الاصطناعي' : 'AI Performance'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'متوسط مدة الجلسة' : 'Avg Session Duration'}</span>
                  <span className="font-semibold">8.5 {language === 'ar' ? 'دقيقة' : 'min'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}</span>
                  <span className="font-semibold">24%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'ar' ? 'رضا المستخدم' : 'User Satisfaction'}</span>
                  <span className="font-semibold">4.6/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
