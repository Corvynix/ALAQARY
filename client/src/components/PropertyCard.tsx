import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, ArrowRight } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  city: string;
  propertyType: string;
  price: string;
  sizeSqm: number;
  description: string;
  image: string;
  status: "available" | "sold" | "reserved";
  language: "ar" | "en";
  onLearnMore: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  city,
  propertyType,
  price,
  sizeSqm,
  description,
  image,
  status,
  language,
  onLearnMore
}: PropertyCardProps) {
  const handleClick = () => {
    onLearnMore(id);
  };

  const content = {
    ar: {
      learnMore: "اعرف القصة",
      available: "متاح",
      sold: "تم البيع",
      reserved: "محجوز",
      sqm: "م²"
    },
    en: {
      learnMore: "Learn the Story",
      available: "Available",
      sold: "Sold",
      reserved: "Reserved",
      sqm: "sqm"
    }
  };

  const statusColors = {
    available: "bg-primary text-primary-foreground",
    sold: "bg-muted text-muted-foreground",
    reserved: "bg-accent text-accent-foreground"
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 transition-all group"
      data-testid={`card-property-${id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-testid={`img-property-${id}`}
        />
        <div className="absolute top-4 right-4">
          <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
            {content[language][status]}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1">
            <h3 
              className={`text-xl font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}
              data-testid={`text-title-${id}`}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span data-testid={`text-city-${id}`}>{city}</span>
              <span>•</span>
              <Home className="h-4 w-4" />
              <span data-testid={`text-type-${id}`}>{propertyType}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p 
          className={`text-sm text-muted-foreground mb-4 line-clamp-2 ${language === 'ar' ? 'font-arabic' : ''}`}
          data-testid={`text-description-${id}`}
        >
          {description}
        </p>
        
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid={`text-price-${id}`}>
              {price}
            </span>
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`text-size-${id}`}>
            {sizeSqm} {content[language].sqm}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full group"
          onClick={handleClick}
          data-testid={`button-learn-more-${id}`}
        >
          {content[language].learnMore}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
