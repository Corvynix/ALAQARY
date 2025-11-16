import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { TrustScoreIndicator } from '@/components/TrustScoreIndicator';
import { AICloserWidget } from '@/components/AICloserWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import type { Property, Developer } from '@shared/schema';

export default function PropertyDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const { data: property, isLoading } = useQuery<Property & { developer?: Developer }>({
    queryKey: ['/api/properties', id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-[60vh] w-full" />
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('error')}</h1>
          <Button asChild>
            <Link href="/properties">{t('properties')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/properties">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowRight className="w-4 h-4 me-2" />
              {t('properties')}
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {isAuthenticated ? (
              <Button asChild variant="ghost" data-testid="button-logout">
                <a href="/api/logout">{t('logout')}</a>
              </Button>
            ) : (
              <Button asChild data-testid="button-login">
                <a href="/api/login">{t('login')}</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="relative h-[60vh] overflow-hidden">
        {mainImage && (
          <img
            src={mainImage}
            alt={language === 'ar' ? property.titleAr || property.title : property.title}
            className="w-full h-full object-cover"
            data-testid="img-property-hero"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-property-title">
                {language === 'ar' ? property.titleAr || property.title : property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{property.city}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {property.type}
              </Badge>
              {property.bedrooms && (
                <div className="flex items-center gap-2 text-lg">
                  <Bed className="w-5 h-5 text-muted-foreground" />
                  <span>{property.bedrooms} {t('bedrooms')}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 text-lg">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  <span>{property.bathrooms} {t('bathrooms')}</span>
                </div>
              )}
              {property.size && (
                <div className="flex items-center gap-2 text-lg">
                  <Maximize className="w-5 h-5 text-muted-foreground" />
                  <span>{property.size} {t('sqm')}</span>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الوصف' : 'Description'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-property-description">
                  {language === 'ar' ? property.descriptionAr || property.description : property.description}
                </p>
              </CardContent>
            </Card>

            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'المميزات' : 'Amenities'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('price')}</p>
                  <p className="text-3xl font-bold" data-testid="text-property-price">
                    {formatPrice(property.price, language)}
                  </p>
                </div>

                <Button className="w-full" size="lg" data-testid="button-contact-developer">
                  {t('contactDeveloper')}
                </Button>

                <Button variant="outline" className="w-full" size="lg" asChild data-testid="button-start-ai-chat">
                  <a href="#ai-chat">{t('startChat')}</a>
                </Button>
              </CardContent>
            </Card>

            {property.developer && (
              <TrustScoreIndicator developer={property.developer} showBreakdown />
            )}
          </div>
        </div>
      </div>

      <AICloserWidget propertyId={id} />
    </div>
  );
}
