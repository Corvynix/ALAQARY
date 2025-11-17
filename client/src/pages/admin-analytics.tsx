import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Users, Eye, Clock } from "lucide-react";

export default function AdminAnalytics() {
  const { data: tracking = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/behavioral-tracking"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">التحليلات السلوكية</h1>
        <p className="text-muted-foreground text-lg">تتبع تفاعلات المستخدمين</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الأحداث
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-events">{tracking.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مستخدمين نشطين
            </CardTitle>
            <Users className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-active-users">
              {new Set(tracking.map((t: any) => t.userId).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط عمق التمرير
            </CardTitle>
            <Eye className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-avg-scroll">
              {Math.round(tracking.reduce((sum: number, t: any) => sum + (t.scrollDepth || 0), 0) / tracking.length) || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط الوقت
            </CardTitle>
            <Clock className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-avg-time">
              {Math.round(tracking.reduce((sum: number, t: any) => sum + (t.timeOnPage || 0), 0) / tracking.length) || 0}ث
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل الأحداث</CardTitle>
          <CardDescription>آخر التفاعلات المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tracking.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">لا توجد بيانات سلوكية بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tracking.slice(0, 10).map((event: any, index: number) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate" data-testid={`row-event-${index}`}>
                  <div>
                    <p className="font-medium text-foreground" data-testid={`text-action-${index}`}>{event.action || 'نشاط'}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-page-${index}`}>{event.page || 'غير محدد'}</p>
                  </div>
                  <div className="text-end">
                    {event.scrollDepth && (
                      <p className="text-sm text-muted-foreground" data-testid={`text-scroll-${index}`}>عمق: {event.scrollDepth}%</p>
                    )}
                    {event.timeOnPage && (
                      <p className="text-sm text-muted-foreground" data-testid={`text-time-${index}`}>وقت: {event.timeOnPage}ث</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
