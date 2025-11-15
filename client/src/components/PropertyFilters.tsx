import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface PropertyFiltersProps {
  language: "ar" | "en";
  onFilterChange: (filters: { city?: string; type?: string; minPrice?: string; maxPrice?: string }) => void;
}

export default function PropertyFilters({ language, onFilterChange }: PropertyFiltersProps) {
  const content = {
    ar: {
      filterTitle: "تصفية العقارات",
      city: "المدينة",
      allCities: "جميع المدن",
      propertyType: "نوع العقار",
      allTypes: "جميع الأنواع",
      priceRange: "نطاق السعر",
      minPrice: "من",
      maxPrice: "إلى",
      search: "بحث",
      clear: "مسح"
    },
    en: {
      filterTitle: "Filter Properties",
      city: "City",
      allCities: "All Cities",
      propertyType: "Property Type",
      allTypes: "All Types",
      priceRange: "Price Range",
      minPrice: "Min",
      maxPrice: "Max",
      search: "Search",
      clear: "Clear"
    }
  };

  const cities = language === "ar" 
    ? ["القاهرة", "الإسكندرية", "الجيزة", "أسيوط", "القاهرة الجديدة"]
    : ["Cairo", "Alexandria", "Giza", "Assiut", "New Cairo"];

  const types = language === "ar"
    ? ["شقة", "فيلا", "دوبلكس", "بنتهاوس", "أرض"]
    : ["Apartment", "Villa", "Duplex", "Penthouse", "Land"];

  return (
    <Card className="mb-8" data-testid="card-filters">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className={`text-lg font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
            {content[language].filterTitle}
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {content[language].city}
            </label>
            <Select onValueChange={(value) => onFilterChange({ city: value })}>
              <SelectTrigger data-testid="select-city">
                <SelectValue placeholder={content[language].allCities} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{content[language].allCities}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {content[language].propertyType}
            </label>
            <Select onValueChange={(value) => onFilterChange({ type: value })}>
              <SelectTrigger data-testid="select-type">
                <SelectValue placeholder={content[language].allTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{content[language].allTypes}</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {content[language].minPrice}
            </label>
            <Input 
              type="number" 
              placeholder="0"
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              data-testid="input-min-price"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {content[language].maxPrice}
            </label>
            <Input 
              type="number" 
              placeholder="∞"
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              data-testid="input-max-price"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button 
            onClick={() => {}}
            data-testid="button-search"
          >
            <Search className="mr-2 h-4 w-4" />
            {content[language].search}
          </Button>
          <Button 
            variant="outline"
            onClick={() => onFilterChange({})}
            data-testid="button-clear"
          >
            {content[language].clear}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
