import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Copy, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ClientReferrals() {
  const { toast } = useToast();
  const [referralCode] = useState("REF" + Math.random().toString(36).substr(2, 9).toUpperCase());

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "تم النسخ",
      description: "تم نسخ كود الإحالة",
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">برنامج الإحالة</h1>
        <p className="text-muted-foreground text-lg">احصل على مكافآت عند إحالة أصدقائك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-accent" />
              كود الإحالة الخاص بك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="text-lg font-mono"
                data-testid="input-referral-code"
              />
              <Button onClick={copyCode} data-testid="button-copy-code">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              شارك هذا الكود مع أصدقائك واحصل على مكافآت عندما يسجلون
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الإحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground" data-testid="text-total-referrals">0</p>
                    <p className="text-sm text-muted-foreground">إجمالي الإحالات</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-accent" />
                  <div>
                    <p className="font-medium text-foreground" data-testid="text-rewards">0 جنيه</p>
                    <p className="text-sm text-muted-foreground">المكافآت المكتسبة</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
