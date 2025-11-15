import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@shared/schema";

interface PropertyCompareProps {
  properties: Property[];
  language: "ar" | "en";
  onClose: () => void;
}

export default function PropertyCompare({ properties, language, onClose }: PropertyCompareProps) {
  if (properties.length === 0) {
    return null;
  }

  const content = {
    ar: {
      title: "مقارنة العقارات",
      price: "السعر",
      size: "المساحة",
      city: "المدينة",
      type: "النوع",
      status: "الحالة",
      payment: "نظام السداد",
      delivery: "موعد التسليم",
      developer: "المطور",
      services: "الخدمات",
      close: "إغلاق"
    },
    en: {
      title: "Property Comparison",
      price: "Price",
      size: "Size",
      city: "City",
      type: "Type",
      status: "Status",
      payment: "Payment Plan",
      delivery: "Delivery",
      developer: "Developer",
      services: "Services",
      close: "Close"
    }
  };

  const features = [
    { key: "price", label: content[language].price, format: (p: Property) => `${(Number(p.price) / 1000000).toFixed(1)}M EGP` },
    { key: "sizeSqm", label: content[language].size, format: (p: Property) => `${p.sizeSqm} m²` },
    { key: "city", label: content[language].city, format: (p: Property) => p.city },
    { key: "propertyType", label: content[language].type, format: (p: Property) => p.propertyType },
    { key: "status", label: content[language].status, format: (p: Property) => p.status },
    { key: "paymentPlan", label: content[language].payment, format: (p: Property) => p.paymentPlan || "-" },
    { key: "deliveryTime", label: content[language].delivery, format: (p: Property) => p.deliveryTime || "-" },
    { key: "developer", label: content[language].developer, format: (p: Property) => p.developer || "-" },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].title}
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-compare"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className={`p-4 text-left ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].title}
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="p-4 min-w-[200px]">
                      <div className="space-y-2">
                        <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? property.title : property.titleEn || property.title}
                        </div>
                        {property.images[0] && (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-b">
                    <td className={`p-4 font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {feature.label}
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="p-4">
                        {feature.format(property)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className={`p-4 font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {content[language].services}
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {property.services && property.services.length > 0 ? (
                          property.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
