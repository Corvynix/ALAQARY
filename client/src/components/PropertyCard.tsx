import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Bed, Bath, Maximize } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/lib/i18n';
import type { Property, Developer } from '@shared/schema';

interface PropertyCardProps {
  property: Property & { developer?: Developer };
  matchScore?: number;
}

export function PropertyCard({ property, matchScore }: PropertyCardProps) {
  const { t, language } = useLanguage();
  
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : '/placeholder-property.jpg';
  
  const trustScore = property.developer?.trustScore || 0;
  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-chart-2';
    if (score >= 60) return 'text-chart-4';
    return 'text-muted-foreground';
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={mainImage}
            alt={language === 'ar' ? property.titleAr || property.title : property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-property-${property.id}`}
          />
          
          {property.developer && (
            <div className="absolute top-3 start-3">
              <Badge className="bg-background/90 backdrop-blur-md border-0" data-testid={`badge-trust-${property.id}`}>
                <span className={`font-semibold ${getTrustColor(trustScore)}`}>
                  {Math.round(trustScore)}%
                </span>
                <span className="text-muted-foreground text-xs ms-1">{t('trustScore')}</span>
              </Badge>
            </div>
          )}
          
          {matchScore !== undefined && (
            <div className="absolute top-3 end-3">
              <Badge variant="default" className="bg-primary/90 backdrop-blur-md border-0" data-testid={`badge-match-${property.id}`}>
                <span className="font-bold">{Math.round(matchScore)}%</span>
                <span className="text-xs ms-1 opacity-90">{t('matchScore')}</span>
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-title-${property.id}`}>
              {language === 'ar' ? property.titleAr || property.title : property.title}
            </h3>
            <p className="text-sm text-muted-foreground">{property.city}</p>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className="text-2xl font-bold text-foreground" data-testid={`text-price-${property.id}`}>
              {formatPrice(property.price, language)}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.size && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{property.size} {t('sqm')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
