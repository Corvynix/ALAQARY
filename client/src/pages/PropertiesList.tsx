import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PropertyCard } from '@/components/PropertyCard';
import { AICloserWidget } from '@/components/AICloserWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import type { Property, Developer } from '@shared/schema';

export default function PropertiesList() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: properties, isLoading } = useQuery<(Property & { developer?: Developer })[]>({
    queryKey: ['/api/properties', { city: cityFilter, type: typeFilter, search: searchQuery }],
  });

  const { data: matches } = useQuery<{ propertyId: string; matchScore: number }[]>({
    queryKey: ['/api/matches/my-matches'],
    enabled: isAuthenticated,
  });

  const matchesMap = new Map(matches?.map(m => [m.propertyId, m.matchScore]) || []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">ع</span>
                </div>
                <span className="font-bold text-xl">عقاري</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" data-testid="button-nav-properties">
                <Link href="/properties">{t('properties')}</Link>
              </Button>
              {isAuthenticated && (
                <Button asChild variant="ghost" data-testid="button-nav-dashboard">
                  <Link href="/dashboard">{t('dashboard')}</Link>
                </Button>
              )}
            </nav>
          </div>
          
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

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 start-3 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="ps-10"
                  data-testid="input-search-properties"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-city-filter">
                  <SelectValue placeholder={language === 'ar' ? 'المدينة' : 'City'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع المدن' : 'All Cities'}</SelectItem>
                  <SelectItem value="riyadh">{language === 'ar' ? 'الرياض' : 'Riyadh'}</SelectItem>
                  <SelectItem value="jeddah">{language === 'ar' ? 'جدة' : 'Jeddah'}</SelectItem>
                  <SelectItem value="dubai">{language === 'ar' ? 'دبي' : 'Dubai'}</SelectItem>
                  <SelectItem value="abu-dhabi">{language === 'ar' ? 'أبو ظبي' : 'Abu Dhabi'}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
                  <SelectValue placeholder={language === 'ar' ? 'النوع' : 'Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  <SelectItem value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</SelectItem>
                  <SelectItem value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</SelectItem>
                  <SelectItem value="office">{language === 'ar' ? 'مكتب' : 'Office'}</SelectItem>
                  <SelectItem value="commercial">{language === 'ar' ? 'تجاري' : 'Commercial'}</SelectItem>
                  <SelectItem value="land">{language === 'ar' ? 'أرض' : 'Land'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-properties">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                matchScore={matchesMap.get(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">{t('noData')}</p>
          </div>
        )}
      </div>

      <AICloserWidget />
    </div>
  );
}
