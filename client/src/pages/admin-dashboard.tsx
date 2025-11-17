import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Upload,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import type { User, Developer, Payment, MarketData } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState("");

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: developers = [], isLoading: developersLoading } = useQuery<Developer[]>({
    queryKey: ["/api/admin/developers"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: marketData = [], isLoading: marketDataLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/admin/market-data"],
  });

  const uploadMarketDataMutation = useMutation({
    mutationFn: async (data: string) => {
      await apiRequest("POST", "/api/admin/market-data/upload", { jsonData: data });
    },
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحميل بيانات السوق بنجاح",
      });
      setJsonData("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/market-data"] });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحميل البيانات",
        variant: "destructive",
      });
    },
  });

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const clientCount = users.filter(u => u.role === 'client').length;
  const developerCount = developers.length;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          لوحة تحكم المدير
        </h1>
        <p className="text-muted-foreground text-lg">
          إدارة المنصة ومراقبة الأداء
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الإيرادات
            </CardTitle>
            <DollarSign className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRevenue.toLocaleString()} جنيه</div>
            <p className="text-xs text-muted-foreground mt-1">
              {payments.filter(p => p.paymentStatus === 'completed').length} معاملة
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              العملاء
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{clientCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              إجمالي العملاء المسجلين
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المطورين
            </CardTitle>
            <Building2 className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{developerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {developers.filter(d => d.verified).length} موثق
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              بيانات السوق
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{marketData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              سجل محدث
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Data Upload */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              تحميل بيانات السوق (JSON)
            </CardTitle>
            <CardDescription>
              قم بلصق بيانات السوق بصيغة JSON لتحديث قاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='{"region": "القاهرة الجديدة", "propertyType": "apartment", "averagePrice": 1500000, ...}'
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              data-testid="textarea-json-upload"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => uploadMarketDataMutation.mutate(jsonData)}
                disabled={!jsonData.trim() || uploadMarketDataMutation.isPending}
                className="bg-accent hover:bg-accent/90"
                data-testid="button-upload-json"
              >
                {uploadMarketDataMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 me-2 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 me-2" />
                    تحميل البيانات
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setJsonData("")}
                disabled={!jsonData}
                data-testid="button-clear-json"
              >
                مسح
              </Button>
            </div>
            {uploadMarketDataMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-spin" />
                <span>جاري معالجة البيانات...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>المدفوعات الأخيرة</CardTitle>
            <CardDescription>آخر المعاملات المالية</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا توجد مدفوعات بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.paymentStatus === 'completed' 
                          ? 'bg-chart-3/10' 
                          : payment.paymentStatus === 'pending'
                          ? 'bg-chart-2/10'
                          : 'bg-destructive/10'
                      }`}>
                        {payment.paymentStatus === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-chart-3" />
                        ) : payment.paymentStatus === 'pending' ? (
                          <Clock className="h-5 w-5 text-chart-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payment.amount} جنيه</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'نقدي'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      payment.paymentStatus === 'completed' ? 'default' : 
                      payment.paymentStatus === 'pending' ? 'secondary' : 
                      'destructive'
                    }>
                      {payment.paymentStatus === 'completed' ? 'مكتمل' : 
                       payment.paymentStatus === 'pending' ? 'معلق' : 
                       'فشل'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Developers */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المطورين</CardTitle>
            <CardDescription>حسب نقاط الثقة</CardDescription>
          </CardHeader>
          <CardContent>
            {developersLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : developers.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا يوجد مطورين بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {developers
                  .sort((a, b) => Number(b.trustScore) - Number(a.trustScore))
                  .slice(0, 5)
                  .map((developer) => (
                    <div key={developer.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate">
                      <div>
                        <p className="font-medium text-foreground">{developer.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {developer.successfulDeals} صفقة ناجحة
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="flex items-center gap-2">
                          <Badge variant={developer.verified ? 'default' : 'secondary'}>
                            {developer.verified ? 'موثق' : 'غير موثق'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          نقاط الثقة: {Number(developer.trustScore).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            إحصائيات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{payments.filter(p => p.paymentStatus === 'pending').length}</p>
              <p className="text-sm text-muted-foreground mt-1">مدفوعات معلقة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-chart-3">{developers.filter(d => d.verified).length}</p>
              <p className="text-sm text-muted-foreground mt-1">مطورين موثقين</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{users.length}</p>
              <p className="text-sm text-muted-foreground mt-1">إجمالي المستخدمين</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-chart-2">{marketData.length}</p>
              <p className="text-sm text-muted-foreground mt-1">سجلات السوق</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
