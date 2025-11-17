import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

export default function DeveloperLeads() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">العملاء المحتملون</h1>
        <p className="text-muted-foreground text-lg">العملاء المهتمون بعقاراتك</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">لا يوجد عملاء محتملون بعد</h3>
          <p className="text-muted-foreground text-center max-w-md">
            عندما يبدي العملاء اهتماماً بعقاراتك، ستظهر معلوماتهم هنا
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
