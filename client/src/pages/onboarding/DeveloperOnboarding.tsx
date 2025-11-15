import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PROJECT_TYPES = [
  { value: "residential", ar: "سكني", en: "Residential" },
  { value: "commercial", ar: "تجاري", en: "Commercial" },
  { value: "mixed", ar: "مختلط", en: "Mixed Use" },
  { value: "luxury", ar: "فاخر", en: "Luxury" },
  { value: "affordable", ar: "اقتصادي", en: "Affordable" },
];

const PRICE_RANGES = [
  { value: "under-2m", ar: "أقل من 2 مليون", en: "Under 2M EGP" },
  { value: "2-5m", ar: "2-5 مليون", en: "2-5M EGP" },
  { value: "5-10m", ar: "5-10 مليون", en: "5-10M EGP" },
  { value: "10-20m", ar: "10-20 مليون", en: "10-20M EGP" },
  { value: "over-20m", ar: "أكثر من 20 مليون", en: "Over 20M EGP" },
];

export default function DeveloperOnboarding() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    projectTypes: [] as string[],
    targetRegions: [] as string[],
    priceRange: "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", "/api/auth/me", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "ar" ? "تم الحفظ بنجاح!" : "Saved Successfully!",
        description: language === "ar" 
          ? "تم تفعيل حسابك. جاري التوجيه إلى لوحة التحكم..." 
          : "Account activated. Redirecting to dashboard...",
      });
      setTimeout(() => {
        setLocation("/developer/dashboard");
      }, 1500);
    },
    onError: () => {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" 
          ? "حدث خطأ أثناء الحفظ. حاول مرة أخرى." 
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleComplete = () => {
    if (!formData.priceRange) {
      toast({
        title: language === "ar" ? "مطلوب" : "Required",
        description: language === "ar" ? "يرجى اختيار نطاق السعر" : "Please select price range",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({
      role: "developer",
      preferences: JSON.stringify({
        projectTypes: formData.projectTypes,
        targetRegions: formData.targetRegions,
        priceRange: formData.priceRange,
      }),
      profileComplete: "true",
    });
  };

  const content = {
    ar: {
      title: "تفعيل حساب مطور عقاري",
      subtitle: "دقيقة واحدة - 3 خطوات بسيطة",
      projectTypes: "نوع المشاريع",
      projectTypesDesc: "اختر أنواع المشاريع التي تعمل عليها",
      targetRegions: "المناطق المستهدفة",
      targetRegionsDesc: "اختر المناطق التي تستهدفها",
      priceRange: "نطاق السعر",
      priceRangeDesc: "ما هو نطاق السعر الذي تعمل عليه؟",
      complete: "إكمال التفعيل",
    },
    en: {
      title: "Activate Developer Account",
      subtitle: "1 minute - 3 simple steps",
      projectTypes: "Project Types",
      projectTypesDesc: "Select project types you work on",
      targetRegions: "Target Regions",
      targetRegionsDesc: "Select regions you target",
      priceRange: "Price Range",
      priceRangeDesc: "What price range do you work with?",
      complete: "Complete Activation",
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className={`text-3xl ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.title}
          </CardTitle>
          <CardDescription className={`text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Types */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.projectTypes}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.projectTypesDesc}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={formData.projectTypes.includes(type.value) ? "default" : "outline"}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      projectTypes: prev.projectTypes.includes(type.value)
                        ? prev.projectTypes.filter(t => t !== type.value)
                        : [...prev.projectTypes, type.value]
                    }));
                  }}
                  className="justify-start"
                >
                  {type[language]}
                </Button>
              ))}
            </div>
          </div>

          {/* Target Regions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.targetRegions}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.targetRegionsDesc}
                </p>
              </div>
            </div>
            <Input
              placeholder={language === 'ar' ? 'أدخل المناطق مفصولة بفواصل' : 'Enter regions separated by commas'}
              value={formData.targetRegions.join(", ")}
              onChange={(e) => {
                const regions = e.target.value.split(",").map(r => r.trim()).filter(r => r);
                setFormData(prev => ({ ...prev, targetRegions: regions }));
              }}
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.priceRange}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.priceRangeDesc}
                </p>
              </div>
            </div>
            <Select value={formData.priceRange} onValueChange={(value) => setFormData(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر نطاق السعر' : 'Select price range'} />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            disabled={updateMutation.isPending}
            className="w-full"
            size="lg"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                {t.complete}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

