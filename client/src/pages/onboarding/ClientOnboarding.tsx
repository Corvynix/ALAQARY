import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Home, DollarSign, Target, ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PROPERTY_TYPES = [
  { value: "apartment", ar: "شقة", en: "Apartment" },
  { value: "villa", ar: "فيلا", en: "Villa" },
  { value: "townhouse", ar: "تاون هاوس", en: "Townhouse" },
  { value: "duplex", ar: "دوبلكس", en: "Duplex" },
  { value: "penthouse", ar: "بنتهاوس", en: "Penthouse" },
  { value: "land", ar: "أرض", en: "Land" },
];

const PURCHASE_PURPOSES = [
  { value: "living", ar: "سكن", en: "Living" },
  { value: "investment", ar: "استثمار", en: "Investment" },
  { value: "both", ar: "سكن واستثمار", en: "Both" },
];

const BUDGET_RANGES = [
  { value: "under-1m", ar: "أقل من مليون", en: "Under 1M EGP" },
  { value: "1-2m", ar: "1-2 مليون", en: "1-2M EGP" },
  { value: "2-5m", ar: "2-5 مليون", en: "2-5M EGP" },
  { value: "5-10m", ar: "5-10 مليون", en: "5-10M EGP" },
  { value: "over-10m", ar: "أكثر من 10 مليون", en: "Over 10M EGP" },
];

export default function ClientOnboarding() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    budget: "",
    propertyType: "",
    purpose: "",
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
          ? "تم تفعيل حسابك. جاري البحث عن العقارات المناسبة..." 
          : "Account activated. Searching for suitable properties...",
      });
      setTimeout(() => {
        setLocation("/client/dashboard");
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
    if (!formData.budget || !formData.propertyType || !formData.purpose) {
      toast({
        title: language === "ar" ? "مطلوب" : "Required",
        description: language === "ar" ? "يرجى إكمال جميع الحقول" : "Please complete all fields",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({
      role: "client",
      preferences: JSON.stringify({
        budget: formData.budget,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
      }),
      profileComplete: "true",
    });
  };

  const content = {
    ar: {
      title: "تفعيل حساب عميل",
      subtitle: "25 ثانية - 3 أسئلة بسيطة",
      budget: "الميزانية",
      budgetDesc: "ما هو نطاق ميزانيتك؟",
      propertyType: "نوع العقار",
      propertyTypeDesc: "ما نوع العقار الذي تبحث عنه؟",
      purpose: "الغرض من الشراء",
      purposeDesc: "لماذا تريد شراء هذا العقار؟",
      complete: "ابدأ البحث",
    },
    en: {
      title: "Activate Client Account",
      subtitle: "25 seconds - 3 simple questions",
      budget: "Budget",
      budgetDesc: "What's your budget range?",
      propertyType: "Property Type",
      propertyTypeDesc: "What type of property are you looking for?",
      purpose: "Purchase Purpose",
      purposeDesc: "Why do you want to buy this property?",
      complete: "Start Searching",
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
          {/* Budget */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.budget}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.budgetDesc}
                </p>
              </div>
            </div>
            <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر الميزانية' : 'Select budget'} />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.propertyType}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.propertyTypeDesc}
                </p>
              </div>
            </div>
            <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر نوع العقار' : 'Select property type'} />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.purpose}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.purposeDesc}
                </p>
              </div>
            </div>
            <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر الغرض' : 'Select purpose'} />
              </SelectTrigger>
              <SelectContent>
                {PURCHASE_PURPOSES.map((purpose) => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose[language]}
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

