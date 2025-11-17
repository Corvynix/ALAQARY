import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { User, Save } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";

export default function ClientProfile() {
  const { toast } = useToast();
  const { data: profile } = useQuery<BuyerProfile>({
    queryKey: ["/api/client/profile"],
  });

  const [budget, setBudget] = useState(profile?.budget?.toString() || "");
  const [riskTolerance, setRiskTolerance] = useState(profile?.riskTolerance || "moderate");
  const [investmentGoal, setInvestmentGoal] = useState(profile?.investmentGoal || "");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/client/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث الملف الشخصي بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/profile"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملف الشخصي",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      budget: budget ? parseFloat(budget) : undefined,
      riskTolerance,
      investmentGoal,
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">الملف الشخصي</h1>
        <p className="text-muted-foreground text-lg">إدارة معلوماتك وتفضيلاتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              تفضيلات الاستثمار
            </CardTitle>
            <CardDescription>أخبرنا عن أهدافك الاستثمارية</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="budget" data-testid="label-budget">الميزانية (جنيه مصري)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="مثال: 1000000"
                  className="mt-2"
                  data-testid="input-budget"
                />
              </div>

              <div>
                <Label htmlFor="risk" data-testid="label-risk">تحمل المخاطر</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger className="mt-2" data-testid="select-risk-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative" data-testid="select-risk-conservative">محافظ</SelectItem>
                    <SelectItem value="moderate" data-testid="select-risk-moderate">متوسط</SelectItem>
                    <SelectItem value="aggressive" data-testid="select-risk-aggressive">مخاطر عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal" data-testid="label-goal">الهدف الاستثماري</Label>
                <Textarea
                  id="goal"
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value)}
                  placeholder="مثال: استثمار طويل الأجل للإيجار"
                  className="mt-2 min-h-24"
                  data-testid="textarea-goal"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90"
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                <Save className="w-4 h-4 me-2" />
                {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اكتمال الملف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-accent" data-testid="text-completion">
                {profile?.profileCompletion || 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                أكمل ملفك الشخصي للحصول على توصيات أفضل
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
