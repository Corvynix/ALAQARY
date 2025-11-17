import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Bed, Bath, Maximize2 } from "lucide-react";
import type { Property } from "@shared/schema";

export default function ClientProperties() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">العقارات المتاحة</h1>
        <p className="text-muted-foreground text-lg">تصفح العقارات واحفظ المفضلة لديك</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد عقارات متاحة</h3>
            <p className="text-muted-foreground">تحقق لاحقاً للحصول على عقارات جديدة</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <Card key={property.id} className="hover-elevate overflow-hidden" data-testid={`card-property-${index}`}>
              <div className="h-48 bg-muted relative">
                {property.featured && (
                  <Badge className="absolute top-3 left-3 bg-accent" data-testid={`badge-featured-${index}`}>
                    مميز
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl" data-testid={`text-title-${index}`}>
                  {property.titleAr || property.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1" data-testid={`text-location-${index}`}>
                  <MapPin className="w-4 h-4" />
                  {property.locationAr || property.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {property.bedrooms && (
                    <span className="flex items-center gap-1" data-testid={`text-bedrooms-${index}`}>
                      <Bed className="w-4 h-4" />
                      {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="flex items-center gap-1" data-testid={`text-bathrooms-${index}`}>
                      <Bath className="w-4 h-4" />
                      {property.bathrooms}
                    </span>
                  )}
                  <span className="flex items-center gap-1" data-testid={`text-area-${index}`}>
                    <Maximize2 className="w-4 h-4" />
                    {Number(property.area)} م²
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent" data-testid={`text-price-${index}`}>
                    {Number(property.price).toLocaleString()} جنيه
                  </span>
                  <Badge variant="outline" data-testid={`badge-type-${index}`}>
                    {property.propertyType}
                  </Badge>
                </div>
                <Button className="w-full" variant="outline" data-testid={`button-details-${index}`}>
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
