import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  XCircle
} from "lucide-react";
import type { Developer, Property } from "@shared/schema";

export default function DeveloperDashboard() {
  const { user } = useAuth();

  const { data: developer, isLoading: developerLoading, isError: developerError } = useQuery<Developer>({
    queryKey: ["/api/developer/profile"],
  });

  const { data: properties = [], isLoading: propertiesLoading, isError: propertiesError, refetch: refetchProperties } = useQuery<Property[]>({
    queryKey: ["/api/developer/properties"],
  });

  const { data: leads = [], isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useQuery<any[]>({
    queryKey: ["/api/developer/leads"],
  });

  const trustScore = Number(developer?.trustScore || 0);
  const trustScorePercentage = (trustScore / 5) * 100;
  const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          مرحباً، {developer?.companyName || user?.firstName}
        </h1>
        <p className="text-muted-foreground text-lg">
          إدارة عقاراتك والعملاء المحتملين
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              العقارات
            </CardTitle>
            <Building2 className="h-5 w-5" style={{color: '#ffd700'}} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{properties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {properties.filter(p => p.status === 'available').length} متاح
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              العملاء المحتملون
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{leads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              عميل محتمل جديد
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              نقاط الثقة
            </CardTitle>
            <Award className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{trustScore.toFixed(1)}</div>
            <Progress value={trustScorePercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المشاهدات
            </CardTitle>
            <Eye className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              إجمالي مشاهدات العقارات
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status */}
      {!developer?.verified && (
        <Card className="border-2" style={{borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.05)'}}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-1" style={{color: '#ffd700'}} />
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">حساب غير موثق</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  قم بتوثيق حسابك للحصول على المزيد من الثقة من العملاء وزيادة فرص البيع
                </p>
                <Button className="metallic-gold-bg text-black border-0" data-testid="button-verify-account">
                  طلب التوثيق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>عقاراتي</span>
              <Button size="sm" className="metallic-gold-bg text-black border-0" data-testid="button-add-property">
                <Plus className="h-4 w-4 me-2" />
                إضافة عقار
              </Button>
            </CardTitle>
            <CardDescription>إدارة قوائم العقارات الخاصة بك</CardDescription>
          </CardHeader>
          <CardContent>
            {propertiesError ? (
              <Alert variant="destructive" data-testid="alert-properties-error">
                <XCircle className="h-4 w-4" />
                <AlertTitle>خطأ / Error</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>فشل تحميل العقارات / Failed to load properties</p>
                  <Button 
                    onClick={() => refetchProperties()} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    data-testid="button-retry-properties"
                  >
                    <RefreshCw className="h-3 w-3 me-2" />
                    أعد المحاولة / Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : propertiesLoading ? (
              <div className="space-y-4" data-testid="skeleton-properties-loading">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">لم تضف أي عقارات بعد</p>
                <Button variant="outline" data-testid="button-first-property">
                  أضف أول عقار
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center gap-3 p-3 rounded-lg hover-elevate border border-border">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {property.price.toLocaleString()} جنيه
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {property.viewCount}
                        </span>
                      </div>
                    </div>
                    <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                      {property.status === 'available' ? 'متاح' : 
                       property.status === 'reserved' ? 'محجوز' : 
                       property.status === 'sold' ? 'مباع' : 'معطل'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads */}
        <Card>
          <CardHeader>
            <CardTitle>العملاء المحتملون</CardTitle>
            <CardDescription>العملاء المهتمون بعقاراتك</CardDescription>
          </CardHeader>
          <CardContent>
            {leadsError ? (
              <Alert variant="destructive" data-testid="alert-leads-error">
                <XCircle className="h-4 w-4" />
                <AlertTitle>خطأ / Error</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>فشل تحميل العملاء المحتملين / Failed to load leads</p>
                  <Button 
                    onClick={() => refetchLeads()} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    data-testid="button-retry-leads"
                  >
                    <RefreshCw className="h-3 w-3 me-2" />
                    أعد المحاولة / Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : leadsLoading ? (
              <div className="space-y-4" data-testid="skeleton-leads-loading">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا يوجد عملاء محتملون بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover-elevate border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">عميل #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">مهتم بعقار في {lead.region || 'القاهرة'}</p>
                    </div>
                    <Button size="sm" variant="outline" data-testid={`button-contact-lead-${index}`}>
                      تواصل
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            مقاييس الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{developer?.totalDeals || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">إجمالي الصفقات</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-chart-3">{developer?.successfulDeals || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">صفقات ناجحة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">{developer?.complaints || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">شكاوى</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {developer?.verified ? (
                  <CheckCircle2 className="h-8 w-8 text-chart-3" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {developer?.verified ? 'موثق' : 'غير موثق'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
