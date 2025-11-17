import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, TrendingUp, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Developer } from "@shared/schema";

export default function DeveloperTrustScore() {
  const { data: developer, isLoading } = useQuery<Developer>({
    queryKey: ["/api/developer/profile"],
  });

  const trustScore = Number(developer?.trustScore || 0);
  const trustPercentage = (trustScore / 5) * 100;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">نقاط الثقة</h1>
        <p className="text-muted-foreground text-lg">تقييمك وسمعتك في المنصة</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card style={{background: 'linear-gradient(to bottom right, rgba(255,215,0,0.15), rgba(255,215,0,0.05))'}}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>نقاط الثقة</span>
                  <Award className="w-8 h-8" style={{color: '#ffd700'}} />
                </CardTitle>
                <CardDescription>تقييمك الحالي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold metallic-gold mb-2" data-testid="text-trust-score">
                    {trustScore.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">من 5.0</p>
                </div>
                <Progress value={trustPercentage} className="h-3" />
                <div className="flex justify-center">
                  <Badge variant={developer?.verified ? 'default' : 'secondary'} className="text-sm" data-testid="badge-verified">
                    {developer?.verified ? (
                      <><CheckCircle2 className="w-4 h-4 me-1" /> حساب موثق</>
                    ) : (
                      <><AlertCircle className="w-4 h-4 me-1" /> غير موثق</>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">إجمالي الصفقات</span>
                  <span className="text-2xl font-bold text-foreground" data-testid="text-total-deals">
                    {developer?.totalDeals || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الصفقات الناجحة</span>
                  <span className="text-2xl font-bold text-chart-3" data-testid="text-successful-deals">
                    {developer?.successfulDeals || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الشكاوى</span>
                  <span className="text-2xl font-bold text-destructive" data-testid="text-complaints">
                    {developer?.complaints || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">نسبة النجاح</span>
                  <span className="text-2xl font-bold metallic-gold" data-testid="text-success-rate">
                    {developer?.totalDeals ? 
                      Math.round((developer.successfulDeals / developer.totalDeals) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>كيف تحسن نقاط الثقة؟</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">أكمل الصفقات بنجاح</p>
                    <p className="text-sm text-muted-foreground">كل صفقة ناجحة تزيد من نقاط ثقتك</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">حافظ على سمعة جيدة</p>
                    <p className="text-sm text-muted-foreground">تجنب الشكاوى وقدم خدمة ممتازة</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">وثق حسابك</p>
                    <p className="text-sm text-muted-foreground">الحسابات الموثقة تحصل على ثقة أكبر</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">كن نشطاً</p>
                    <p className="text-sm text-muted-foreground">حدث عقاراتك وتفاعل مع العملاء</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
