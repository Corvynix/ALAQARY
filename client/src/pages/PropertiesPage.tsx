import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyCompare from "@/components/PropertyCompare";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare } from "lucide-react";
import type { Property } from "@shared/schema";

export default function PropertiesPage() {
  const { language, toggleLanguage } = useLanguage();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  const togglePropertyForCompare = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : prev.length < 3 
          ? [...prev, id]
          : prev
    );
  };

  const compareProperties = properties.filter(p => selectedForCompare.includes(p.id));

  const transformedProperties = properties.map(property => ({
    id: property.id,
    title: language === "ar" ? property.title : (property.titleEn || property.title),
    city: property.city,
    propertyType: property.propertyType,
    price: `${(Number(property.price) / 1000000).toFixed(1)}M EGP`,
    sizeSqm: Number(property.sizeSqm),
    description: language === "ar" ? (property.description || "") : (property.descriptionEn || property.description || ""),
    image: property.images[0] || "/placeholder.png",
    status: property.status
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 
            className={`text-5xl font-bold text-center mb-8 heading-gold ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          >
            {language === "ar" ? "العقارات المتاحة" : "Available Properties"}
          </h1>
          
          <p className={`text-center text-white/70 mb-12 max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === "ar" 
              ? "اكتشف مجموعة مختارة من أفخم العقارات في أرقى المواقع" 
              : "Discover our curated selection of premium properties in the finest locations"}
          </p>

          <PropertyFilters 
            language={language}
            onFilterChange={(filters) => {}}
          />

          {selectedForCompare.length > 0 && (
            <div className="sticky top-20 z-40 bg-card border rounded-md p-4 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-primary" />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {selectedForCompare.length} {language === 'ar' ? 'عقار محدد' : 'selected'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedForCompare([])}
                  data-testid="button-clear-compare"
                >
                  {language === 'ar' ? 'إلغاء' : 'Clear'}
                </Button>
                <Button
                  onClick={() => setShowCompare(true)}
                  disabled={selectedForCompare.length < 2}
                  data-testid="button-show-compare"
                >
                  {language === 'ar' ? 'مقارنة' : 'Compare'}
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-primary py-12">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {transformedProperties.map((property) => {
                const originalProperty = properties.find(p => p.id === property.id);
                const isSelected = selectedForCompare.includes(property.id);
                return (
                  <div key={property.id} className="relative">
                    {isSelected && (
                      <Badge className="absolute top-2 right-2 z-10 bg-primary">
                        {language === 'ar' ? 'محدد' : 'Selected'}
                      </Badge>
                    )}
                    <div onClick={() => togglePropertyForCompare(property.id)} className="cursor-pointer">
                      <PropertyCard 
                        id={property.id}
                        title={property.title}
                        city={property.city}
                        propertyType={property.propertyType}
                        price={property.price}
                        sizeSqm={property.sizeSqm}
                        description={property.description}
                        image={property.image}
                        status={property.status as "available" | "sold" | "reserved"}
                        language={language}
                        onLearnMore={(id) => {}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showCompare && compareProperties.length >= 2 && (
            <PropertyCompare
              properties={compareProperties}
              language={language}
              onClose={() => setShowCompare(false)}
            />
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
