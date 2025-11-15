import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, UserCircle2, Briefcase, Users, Database } from "lucide-react";

const roleOptions = [
  {
    value: "client",
    label: "عميل / مستثمر",
    labelEn: "Client / Investor",
    icon: UserCircle2,
    description: "أبحث عن عقار لشرائه أو الاستثمار فيه"
  },
  {
    value: "agent",
    label: "وكيل عقاري",
    labelEn: "Real Estate Agent",
    icon: Briefcase,
    description: "أعمل في مجال الوساطة العقارية"
  },
  {
    value: "developer",
    label: "مطور / شركة",
    labelEn: "Developer / Company",
    icon: Building2,
    description: "أمتلك مشاريع عقارية أو شركة تطوير عقاري"
  },
  {
    value: "data_contributor",
    label: "مساهم في البيانات",
    labelEn: "Data Contributor",
    icon: Database,
    description: "أريد المساهمة بالبيانات والحصول على نقاط"
  },
];

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (!role) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار نوع الحساب",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(username, password, {
        email,
        phone,
        fullName,
        role,
        companyName: (role === "developer" || role === "agent") ? companyName : undefined
      });
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في منصة الذكاء العقاري"
      });
      
      const dashboardRoutes: Record<string, string> = {
        client: "/client-dashboard",
        agent: "/agent-dashboard",
        developer: "/developer-dashboard",
        data_contributor: "/contributor-dashboard",
      };
      
      setLocation(dashboardRoutes[role] || "/");
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? "اختر نوع حسابك" : "إنشاء حساب جديد"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "اختر نوع الحساب المناسب لك للحصول على تجربة مخصصة"
              : "أدخل بياناتك لإنشاء حسابك"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                        role === option.value ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setRole(option.value)}
                      data-testid={`card-role-${option.value}`}
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-md flex items-center justify-center ${
                            role === option.value ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{option.label}</h3>
                            <p className="text-xs text-muted-foreground">{option.labelEn}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setLocation("/login")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-back-to-login"
                >
                  العودة لتسجيل الدخول
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1"
                  data-testid="button-next-step"
                >
                  التالي
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" data-testid="label-fullname">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    data-testid="input-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {(role === "developer" || role === "agent") && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName" data-testid="label-company">
                      {role === "developer" ? "اسم الشركة" : "اسم المكتب"}
                    </Label>
                    <Input
                      id="companyName"
                      data-testid="input-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" data-testid="label-email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" data-testid="label-phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" data-testid="label-username">اسم المستخدم</Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" data-testid="label-password">كلمة المرور</Label>
                  <Input
                    id="password"
                    data-testid="input-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" data-testid="label-confirm-password">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirmPassword"
                    data-testid="input-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="button-back"
                >
                  رجوع
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/login")}
                  className="text-primary hover:underline"
                  data-testid="link-login"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
