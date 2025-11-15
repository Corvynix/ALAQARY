import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Briefcase, Building2, ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const EGYPTIAN_REGIONS = [
  "القاهرة الجديدة", "التجمع الخامس", "الشروق", "مدينة نصر", "المعادي",
  "6 أكتوبر", "الشيخ زايد", "الإسكندرية", "الساحل الشمالي", "الغردقة",
  "شرم الشيخ", "مرسى مطروح", "أسيوط", "المنصورة", "طنطا"
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", ar: "مبتدئ (أقل من سنة)", en: "Beginner (< 1 year)" },
  { value: "intermediate", ar: "متوسط (1-3 سنوات)", en: "Intermediate (1-3 years)" },
  { value: "experienced", ar: "خبير (3-5 سنوات)", en: "Experienced (3-5 years)" },
  { value: "expert", ar: "خبير جداً (أكثر من 5 سنوات)", en: "Expert (> 5 years)" }
];

export default function AgentOnboarding() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    region: "",
    experience: "",
    activeProjects: [] as string[],
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
        setLocation("/agent/dashboard");
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

  const handleNext = () => {
    if (step === 1 && !formData.region) {
      toast({
        title: language === "ar" ? "مطلوب" : "Required",
        description: language === "ar" ? "يرجى اختيار المنطقة" : "Please select a region",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !formData.experience) {
      toast({
        title: language === "ar" ? "مطلوب" : "Required",
        description: language === "ar" ? "يرجى اختيار مستوى الخبرة" : "Please select experience level",
        variant: "destructive",
      });
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updateMutation.mutate({
      role: "agent",
      preferences: JSON.stringify({
        region: formData.region,
        experience: formData.experience,
        activeProjects: formData.activeProjects,
      }),
      profileComplete: "true",
    });
  };

  const toggleProject = (project: string) => {
    setFormData(prev => ({
      ...prev,
      activeProjects: prev.activeProjects.includes(project)
        ? prev.activeProjects.filter(p => p !== project)
        : [...prev.activeProjects, project]
    }));
  };

  const content = {
    ar: {
      title: "تفعيل حساب مستشار عقاري",
      subtitle: "3 خطوات بسيطة - 35 ثانية فقط",
      step1: { title: "المنطقة", description: "اختر المنطقة التي تعمل بها" },
      step2: { title: "الخبرة", description: "ما هو مستوى خبرتك؟" },
      step3: { title: "المشاريع النشطة", description: "اختر المشاريع التي تعمل عليها حالياً" },
      next: "التالي",
      complete: "إكمال التفعيل",
      skip: "تخطي",
      selectRegion: "اختر المنطقة",
      selectExperience: "اختر مستوى الخبرة",
      noProjects: "لا أعمل على مشاريع حالياً",
    },
    en: {
      title: "Activate Agent Account",
      subtitle: "3 simple steps - only 35 seconds",
      step1: { title: "Region", description: "Select the region you work in" },
      step2: { title: "Experience", description: "What's your experience level?" },
      step3: { title: "Active Projects", description: "Select projects you're currently working on" },
      next: "Next",
      complete: "Complete Activation",
      skip: "Skip",
      selectRegion: "Select Region",
      selectExperience: "Select Experience Level",
      noProjects: "Not working on any projects currently",
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
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 transition-all ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Region */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h3 className={`text-xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step1.title}
                  </h3>
                  <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step1.description}
                  </p>
                </div>
              </div>
              <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectRegion} />
                </SelectTrigger>
                <SelectContent>
                  {EGYPTIAN_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
                <div>
                  <h3 className={`text-xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step2.title}
                  </h3>
                  <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step2.description}
                  </p>
                </div>
              </div>
              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectExperience} />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3: Active Projects */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <div>
                  <h3 className={`text-xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step3.title}
                  </h3>
                  <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.step3.description}
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {EGYPTIAN_REGIONS.slice(0, 10).map((region) => (
                  <div key={region} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                    <Checkbox
                      id={region}
                      checked={formData.activeProjects.includes(region)}
                      onCheckedChange={() => toggleProject(region)}
                    />
                    <Label htmlFor={region} className="flex-1 cursor-pointer">
                      {region}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <Checkbox
                    id="none"
                    checked={formData.activeProjects.length === 0}
                    onCheckedChange={() => setFormData(prev => ({ ...prev, activeProjects: [] }))}
                  />
                  <Label htmlFor="none" className="flex-1 cursor-pointer text-muted-foreground">
                    {t.noProjects}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                {language === 'ar' ? 'السابق' : 'Previous'}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  {step === 3 ? t.complete : t.next}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

