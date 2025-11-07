import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import type { Property } from "@shared/schema";

export default function PropertiesPage() {
  const { language, toggleLanguage } = useLanguage();

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

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
            className={`text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
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
            onFilterChange={(filters) => console.log('Filters:', filters)}
          />

          {isLoading ? (
            <div className="text-center text-primary py-12">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {transformedProperties.map((property) => (
                <PropertyCard 
                  key={property.id}
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
                  onLearnMore={(id) => console.log('View property:', id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
