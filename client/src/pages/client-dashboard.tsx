import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { 
  MessageSquare, 
  Building2, 
  TrendingUp, 
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  XCircle
} from "lucide-react";
import type { BuyerProfile, Consultation, Payment } from "@shared/schema";

export default function ClientDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useQuery<BuyerProfile>({
    queryKey: ["/api/client/profile"],
  });

  const { data: consultations = [], isLoading: consultationsLoading, isError: consultationsError, refetch: refetchConsultations } = useQuery<Consultation[]>({
    queryKey: ["/api/client/consultations"],
  });

  const { data: payments = [], isLoading: paymentsLoading, isError: paymentsError, refetch: refetchPayments } = useQuery<Payment[]>({
    queryKey: ["/api/client/payments"],
  });

  const { data: savedProperties = [], isLoading: propertiesLoading, isError: propertiesError, refetch: refetchProperties } = useQuery<any[]>({
    queryKey: ["/api/client/saved-properties"],
  });

  const profileCompletion = profile?.profileCompletion || 0;
  const totalConsultations = consultations.length;
  const totalSaved = savedProperties.length;
  const completedPayments = payments.filter(p => p.paymentStatus === 'completed').length;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t("dashboard.welcome")}، {user?.firstName || user?.email}
        </h1>
        <p className="text-muted-foreground text-lg">
          إليك ملخص نشاطك على المنصة
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.consultations")}
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalConsultations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedPayments} مدفوعة
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.properties")}
            </CardTitle>
            <Building2 className="h-5 w-5" style={{color: '#ffd700'}} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalSaved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              عقار محفوظ
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.completion")}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المدفوعات
            </CardTitle>
            <DollarSign className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {payments.reduce((sum, p) => sum + Number(p.amount), 0)} جنيه
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedPayments} معاملة مكتملة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <Card className="border-2" style={{borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.05)'}}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-1" style={{color: '#ffd700'}} />
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">أكمل ملفك الشخصي</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  لنتمكن من تقديم توصيات دقيقة لك، يرجى إكمال ملفك الشخصي ({profileCompletion}% مكتمل)
                </p>
                <Button className="metallic-gold-bg text-black border-0" data-testid="button-complete-profile">
                  أكمل الآن
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("dashboard.recommendations")}</span>
              <Badge variant="secondary">جديد</Badge>
            </CardTitle>
            <CardDescription>عقارات مختارة بناءً على تفضيلاتك</CardDescription>
          </CardHeader>
          <CardContent>
            {propertiesError ? (
              <Alert variant="destructive" data-testid="alert-properties-error">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error / خطأ</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Failed to load saved properties / فشل تحميل العقارات المحفوظة</p>
                  <Button 
                    onClick={() => refetchProperties()} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    data-testid="button-retry-properties"
                  >
                    <RefreshCw className="h-3 w-3 me-2" />
                    Retry / أعد المحاولة
                  </Button>
                </AlertDescription>
              </Alert>
            ) : propertiesLoading ? (
              <div className="space-y-4" data-testid="skeleton-properties-loading">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : savedProperties.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">لا توجد عقارات محفوظة بعد</p>
                <Button variant="outline" data-testid="button-browse-properties">
                  تصفح العقارات
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedProperties.slice(0, 3).map((property: any, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover-elevate border border-border">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">فيلا فاخرة</p>
                      <p className="text-sm text-muted-foreground">القاهرة الجديدة</p>
                    </div>
                    <Badge variant="outline">جديد</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recent")}</CardTitle>
            <CardDescription>آخر التحديثات والإشعارات</CardDescription>
          </CardHeader>
          <CardContent>
            {consultationsError ? (
              <Alert variant="destructive" data-testid="alert-consultations-error">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error / خطأ</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Failed to load consultations / فشل تحميل الاستشارات</p>
                  <Button 
                    onClick={() => refetchConsultations()} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    data-testid="button-retry-consultations"
                  >
                    <RefreshCw className="h-3 w-3 me-2" />
                    Retry / أعد المحاولة
                  </Button>
                </AlertDescription>
              </Alert>
            ) : consultationsLoading ? (
              <div className="space-y-4" data-testid="skeleton-consultations-loading">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">لم تبدأ أي استشارة بعد</p>
                <Button className="metallic-gold-bg text-black border-0" data-testid="button-new-consultation">
                  <Plus className="w-4 h-4 me-2" />
                  ابدأ استشارة جديدة
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.slice(0, 3).map((consultation, index) => (
                  <div key={consultation.id} className="flex items-start gap-3 p-3 rounded-lg hover-elevate border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {consultation.status === 'active' ? (
                        <Clock className="h-5 w-5 text-primary" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-chart-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">استشارة #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(consultation.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <Badge variant={consultation.status === 'active' ? 'default' : 'secondary'}>
                      {consultation.status === 'active' ? 'نشط' : 'مكتمل'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-6" data-testid="button-quick-consultation">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span>استشارة جديدة</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6" data-testid="button-quick-browse">
              <Building2 className="h-6 w-6" style={{color: '#ffd700'}} />
              <span>تصفح العقارات</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6" data-testid="button-quick-market">
              <TrendingUp className="h-6 w-6 text-chart-3" />
              <span>تحليل السوق</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6" data-testid="button-quick-payment">
              <DollarSign className="h-6 w-6 text-chart-2" />
              <span>سجل المدفوعات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
