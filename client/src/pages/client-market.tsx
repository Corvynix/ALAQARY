import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { MarketData } from "@shared/schema";

export default function ClientMarket() {
  const { data: marketData = [], isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/admin/market-data"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">تحليل السوق</h1>
        <p className="text-muted-foreground text-lg">بيانات ورؤى السوق العقاري</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : marketData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد بيانات سوق متاحة</h3>
            <p className="text-muted-foreground">تحقق لاحقاً للحصول على تحديثات السوق</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketData.map((data, index) => (
            <Card key={data.id} className="hover-elevate" data-testid={`card-market-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid={`text-region-${index}`}>{data.region}</span>
                  {data.priceChange && Number(data.priceChange) > 0 ? (
                    <TrendingUp className="w-5 h-5 text-chart-3" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </CardTitle>
                <CardDescription data-testid={`text-property-type-${index}`}>
                  {data.propertyType || 'جميع الأنواع'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.averagePrice && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">متوسط السعر</p>
                    <p className="text-2xl font-bold text-foreground" data-testid={`text-avg-price-${index}`}>
                      {Number(data.averagePrice).toLocaleString()} جنيه
                    </p>
                  </div>
                )}
                {data.priceChange && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">التغير في السعر</p>
                    <Badge variant={Number(data.priceChange) > 0 ? 'default' : 'destructive'} data-testid={`badge-change-${index}`}>
                      {Number(data.priceChange) > 0 ? '+' : ''}{Number(data.priceChange)}%
                    </Badge>
                  </div>
                )}
                <div className="flex gap-2">
                  {data.demandLevel && (
                    <Badge variant="outline" data-testid={`badge-demand-${index}`}>
                      الطلب: {data.demandLevel}
                    </Badge>
                  )}
                  {data.supplyLevel && (
                    <Badge variant="outline" data-testid={`badge-supply-${index}`}>
                      العرض: {data.supplyLevel}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
