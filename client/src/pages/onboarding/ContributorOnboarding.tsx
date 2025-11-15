import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Database, MapPin, Lock, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DATA_TYPES = [
  { value: "property_info", ar: "معلومات عقارية", en: "Property Information" },
  { value: "pricing", ar: "أسعار", en: "Pricing Data" },
  { value: "market_trends", ar: "اتجاهات السوق", en: "Market Trends" },
  { value: "sales_data", ar: "بيانات المبيعات", en: "Sales Data" },
];

const PRIVACY_OPTIONS = [
  { value: "anonymous", ar: "مجهول تماماً", en: "Fully Anonymous" },
  { value: "pseudonym", ar: "اسم مستعار", en: "Pseudonym" },
  { value: "verified", ar: "حساب موثق", en: "Verified Account" },
];

export default function ContributorOnboarding() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    dataType: "",
    region: "",
    privacy: "anonymous",
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
          ? "تم تفعيل حسابك. ابدأ في كسب النقاط الآن!" 
          : "Account activated. Start earning credits now!",
      });
      setTimeout(() => {
        setLocation("/contributor/dashboard");
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
    if (!formData.dataType || !formData.region) {
      toast({
        title: language === "ar" ? "مطلوب" : "Required",
        description: language === "ar" ? "يرجى إكمال جميع الحقول" : "Please complete all fields",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({
      role: "contributor",
      preferences: JSON.stringify({
        dataType: formData.dataType,
        region: formData.region,
        privacy: formData.privacy,
      }),
      profileComplete: "true",
    });
  };

  const content = {
    ar: {
      title: "تفعيل حساب مساهم بيانات",
      subtitle: "15 ثانية - 3 خطوات بسيطة",
      dataType: "نوع البيانات",
      dataTypeDesc: "ما نوع البيانات التي تريد مشاركتها؟",
      region: "المنطقة",
      regionDesc: "ما هي المنطقة التي تركز عليها؟",
      privacy: "إعدادات الخصوصية",
      privacyDesc: "كيف تريد أن تظهر معلوماتك؟",
      creditInfo: "ستكسب نقاط مقابل كل معلومة تشاركها",
      complete: "ابدأ المساهمة",
    },
    en: {
      title: "Activate Data Contributor Account",
      subtitle: "15 seconds - 3 simple steps",
      dataType: "Data Type",
      dataTypeDesc: "What type of data do you want to share?",
      region: "Region",
      regionDesc: "What region do you focus on?",
      privacy: "Privacy Settings",
      privacyDesc: "How do you want your information to appear?",
      creditInfo: "You'll earn credits for every piece of information you share",
      complete: "Start Contributing",
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
          {/* Data Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.dataType}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.dataTypeDesc}
                </p>
              </div>
            </div>
            <Select value={formData.dataType} onValueChange={(value) => setFormData(prev => ({ ...prev, dataType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر نوع البيانات' : 'Select data type'} />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.region}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.regionDesc}
                </p>
              </div>
            </div>
            <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر المنطقة' : 'Select region'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cairo">القاهرة / Cairo</SelectItem>
                <SelectItem value="alexandria">الإسكندرية / Alexandria</SelectItem>
                <SelectItem value="giza">الجيزة / Giza</SelectItem>
                <SelectItem value="north-coast">الساحل الشمالي / North Coast</SelectItem>
                <SelectItem value="red-sea">البحر الأحمر / Red Sea</SelectItem>
                <SelectItem value="other">أخرى / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <div>
                <Label className={`text-base font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.privacy}
                </Label>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.privacyDesc}
                </p>
              </div>
            </div>
            <Select value={formData.privacy} onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIVACY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Credit Info */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-primary mt-0.5" />
            <p className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.creditInfo}
            </p>
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

