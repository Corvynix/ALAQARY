import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Plus, Eye, MapPin } from "lucide-react";
import type { Property } from "@shared/schema";

export default function DeveloperProperties() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/developer/properties"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">عقاراتي</h1>
          <p className="text-muted-foreground text-lg">إدارة قوائم العقارات الخاصة بك</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" data-testid="button-add-property">
          <Plus className="w-4 h-4 me-2" />
          إضافة عقار
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لم تضف أي عقارات بعد</h3>
            <p className="text-muted-foreground mb-6">ابدأ بإضافة عقارك الأول</p>
            <Button className="bg-accent hover:bg-accent/90" data-testid="button-first-property">
              <Plus className="w-4 h-4 me-2" />
              أضف عقار جديد
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <Card key={property.id} className="hover-elevate overflow-hidden" data-testid={`card-property-${index}`}>
              <div className="h-40 bg-muted" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate" data-testid={`text-title-${index}`}>
                    {property.titleAr || property.title}
                  </span>
                  <Badge variant={property.status === 'available' ? 'default' : 'secondary'} data-testid={`badge-status-${index}`}>
                    {property.status === 'available' ? 'متاح' : 
                     property.status === 'reserved' ? 'محجوز' : 
                     property.status === 'sold' ? 'مباع' : 'معطل'}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-1" data-testid={`text-location-${index}`}>
                  <MapPin className="w-4 h-4" />
                  {property.locationAr || property.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent" data-testid={`text-price-${index}`}>
                    {Number(property.price).toLocaleString()} جنيه
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span data-testid={`text-views-${index}`}>{property.viewCount}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${index}`}>
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${index}`}>
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
