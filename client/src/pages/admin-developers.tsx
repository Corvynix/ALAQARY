import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Award, CheckCircle2, AlertCircle } from "lucide-react";
import type { Developer } from "@shared/schema";

export default function AdminDevelopers() {
  const { data: developers = [], isLoading } = useQuery<Developer[]>({
    queryKey: ["/api/admin/developers"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">المطورين</h1>
        <p className="text-muted-foreground text-lg">إدارة ومراقبة المطورين</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : developers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا يوجد مطورين بعد</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developers.map((developer, index) => (
            <Card key={developer.id} className="hover-elevate" data-testid={`card-developer-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid={`text-company-${index}`}>{developer.companyName}</span>
                  <Badge variant={developer.verified ? 'default' : 'secondary'} data-testid={`badge-verified-${index}`}>
                    {developer.verified ? (
                      <><CheckCircle2 className="w-3 h-3 me-1" /> موثق</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 me-1" /> غير موثق</>
                    )}
                  </Badge>
                </CardTitle>
                <CardDescription data-testid={`text-license-${index}`}>
                  {developer.licenseNumber || 'لا يوجد رخصة'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">نقاط الثقة</p>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="text-xl font-bold text-foreground" data-testid={`text-trust-${index}`}>
                        {Number(developer.trustScore).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الصفقات الناجحة</p>
                    <span className="text-xl font-bold text-chart-3" data-testid={`text-deals-${index}`}>
                      {developer.successfulDeals}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الصفقات</p>
                    <span className="text-lg font-medium text-foreground" data-testid={`text-total-${index}`}>
                      {developer.totalDeals}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الشكاوى</p>
                    <span className="text-lg font-medium text-destructive" data-testid={`text-complaints-${index}`}>
                      {developer.complaints}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
