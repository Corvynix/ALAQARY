import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreditWallet from "@/components/CreditWallet";
import CreditScoreCard from "@/components/CreditScoreCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Heart, 
  Search, 
  Calendar,
  GitCompare,
  MapPin,
  Home,
  DollarSign,
  Sparkles
} from "lucide-react";
import type { Property, UserFavorite } from "@shared/schema";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { toast } = useToast();
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });
  
  const { data: favorites = [] } = useQuery<UserFavorite[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user
  });

  const favoritePropertyIds = favorites.map(f => f.propertyId);
  const favoriteProperties = properties.filter(p => favoritePropertyIds.includes(p.id));
  
  const addFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await apiRequest("POST", "/api/favorites", { propertyId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة العقار إلى المفضلة"
      });
    }
  });

  const matchedProperties = properties.filter(p => {
    if (budget && Number(p.price) > Number(budget)) return false;
    if (location && !p.city.includes(location)) return false;
    if (propertyType && p.propertyType !== propertyType) return false;
    return true;
  }).slice(0, 6);

  const statsCards = [
    {
      title: "عقارات متاحة",
      value: properties.filter(p => p.status === "available").length,
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "في المفضلة",
      value: favorites.length,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      title: "تطابق مع البحث",
      value: matchedProperties.length,
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "متوسط السعر",
      value: `${(properties.reduce((sum, p) => sum + Number(p.price), 0) / properties.length / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم العميل</h1>
            <p className="text-muted-foreground mt-1">
              مرحباً {user?.fullName || user?.username} - اعثر على عقارك المثالي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat) => (
              <Card key={stat.title} data-testid={`card-stat-${stat.title}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreditWallet 
              credits={user?.credits ? Number(user.credits) : 0} 
              language={language}
            />
            <CreditScoreCard
              score={user?.accuracyScore ? Number(user.accuracyScore) : 75}
              role={user?.role || 'client'}
              language={language}
            />
          </div>

          <Tabs defaultValue="match" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full lg:w-auto lg:inline-grid">
              <TabsTrigger value="match" data-testid="tab-match">
                <Sparkles className="h-4 w-4 ml-2" />
                التطابق الذكي
              </TabsTrigger>
              <TabsTrigger value="compare" data-testid="tab-compare">
                <GitCompare className="h-4 w-4 ml-2" />
                المقارنة
              </TabsTrigger>
              <TabsTrigger value="favorites" data-testid="tab-favorites">
                <Heart className="h-4 w-4 ml-2" />
                المفضلة
              </TabsTrigger>
              <TabsTrigger value="sessions" data-testid="tab-sessions">
                <Calendar className="h-4 w-4 ml-2" />
                جلسات الخبراء
              </TabsTrigger>
            </TabsList>

            <TabsContent value="match" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    أسئلة التطابق الذكي
                  </CardTitle>
                  <CardDescription>
                    أجب على بعض الأسئلة لنجد لك العقار المثالي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">الميزانية القصوى</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="مثال: 2000000"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          data-testid="input-budget"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">الموقع المفضل</Label>
                        <Input
                          id="location"
                          placeholder="مثال: التجمع الخامس"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          data-testid="input-location"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">نوع العقار</Label>
                        <Input
                          id="type"
                          placeholder="مثال: شقة"
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          data-testid="input-type"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {matchedProperties.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-8">
                          لا توجد عقارات مطابقة. جرب تعديل معايير البحث
                        </div>
                      ) : (
                        matchedProperties.map((property) => (
                          <Card key={property.id} className="hover-elevate active-elevate-2" data-testid={`property-card-${property.id}`}>
                            <CardContent className="p-4">
                              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                                {property.images && property.images[0] ? (
                                  <img 
                                    src={property.images[0]} 
                                    alt={property.title}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <Home className="h-12 w-12 text-muted-foreground" />
                                )}
                              </div>
                              <h4 className="font-semibold mb-1">{property.title}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3" />
                                {property.city}
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-bold text-lg">{(Number(property.price) / 1000000).toFixed(1)}M</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => addFavoriteMutation.mutate(property.id)}
                                  disabled={favoritePropertyIds.includes(property.id)}
                                  data-testid={`button-favorite-${property.id}`}
                                >
                                  <Heart className={`h-4 w-4 ${favoritePropertyIds.includes(property.id) ? 'fill-current text-red-500' : ''}`} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-blue-500" />
                    مقارنة العقارات
                  </CardTitle>
                  <CardDescription>
                    قارن بين العقارات المختلفة جنباً إلى جنب
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    اختر عقارات من المفضلة للمقارنة بينها
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    قائمة المفضلة
                  </CardTitle>
                  <CardDescription>
                    العقارات التي أضفتها إلى المفضلة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteProperties.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      لم تضف أي عقارات إلى المفضلة بعد
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProperties.map((property) => (
                        <Card key={property.id} className="hover-elevate active-elevate-2" data-testid={`favorite-card-${property.id}`}>
                          <CardContent className="p-4">
                            <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                              {property.images && property.images[0] ? (
                                <img 
                                  src={property.images[0]} 
                                  alt={property.title}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Home className="h-12 w-12 text-muted-foreground" />
                              )}
                            </div>
                            <h4 className="font-semibold mb-1">{property.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3" />
                              {property.city}
                            </p>
                            <p className="font-bold text-lg">{(Number(property.price) / 1000000).toFixed(1)}M EGP</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    حجز جلسة مع خبير
                  </CardTitle>
                  <CardDescription>
                    احجز جلسة استشارية مع خبير عقاري
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      احجز جلسة استشارية مجانية لمناقشة احتياجاتك العقارية
                    </p>
                    <Button data-testid="button-book-session">
                      <Calendar className="h-4 w-4 ml-2" />
                      احجز جلسة الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
}
