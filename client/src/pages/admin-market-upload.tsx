import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, Clock, CheckCircle2 } from "lucide-react";

export default function AdminMarketUpload() {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async (data: string) => {
      await apiRequest("POST", "/api/admin/market-data/upload", { jsonData: data });
    },
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحميل بيانات السوق بنجاح",
      });
      setJsonData("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/market-data"] });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحميل البيانات",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">تحميل بيانات السوق</h1>
        <p className="text-muted-foreground text-lg">قم بتحميل بيانات السوق بصيغة JSON</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              تحميل JSON
            </CardTitle>
            <CardDescription>
              قم بلصق بيانات السوق بصيغة JSON لتحديث قاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='{"region": "القاهرة الجديدة", "propertyType": "apartment", "averagePrice": 1500000, ...}'
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              data-testid="textarea-json-data"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => uploadMutation.mutate(jsonData)}
                disabled={!jsonData.trim() || uploadMutation.isPending}
                className="bg-accent hover:bg-accent/90"
                data-testid="button-upload"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 me-2 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 me-2" />
                    تحميل البيانات
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setJsonData("")}
                disabled={!jsonData}
                data-testid="button-clear"
              >
                مسح
              </Button>
            </div>
            {uploadMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-spin" />
                <span>جاري معالجة البيانات...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نموذج البيانات</CardTitle>
            <CardDescription>مثال على تنسيق JSON المطلوب</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto" data-testid="text-json-example">
{`{
  "region": "القاهرة الجديدة",
  "propertyType": "apartment",
  "averagePrice": 1500000,
  "priceChange": 5.2,
  "demandLevel": "high",
  "supplyLevel": "medium",
  "validFrom": "2024-01-01"
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
