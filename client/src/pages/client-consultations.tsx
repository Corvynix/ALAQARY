import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, Plus, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";
import type { Consultation } from "@shared/schema";

export default function ClientConsultations() {
  const { toast } = useToast();

  const { data: consultations = [], isLoading, isError, refetch } = useQuery<Consultation[]>({
    queryKey: ["/api/client/consultations"],
  });

  const createConsultationMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/client/consultations", {
        status: 'active',
        questionsAsked: [],
        sessionData: {},
      });
    },
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إنشاء الاستشارة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/consultations"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الاستشارة",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">استشاراتي</h1>
          <p className="text-muted-foreground text-lg">إدارة جلسات الاستشارات الخاصة بك</p>
        </div>
        <Button
          className="metallic-gold-bg text-black border-0"
          onClick={() => createConsultationMutation.mutate()}
          disabled={createConsultationMutation.isPending}
          data-testid="button-new-consultation"
        >
          <Plus className="w-4 h-4 me-2" />
          استشارة جديدة
        </Button>
      </div>

      {isError ? (
        <Alert variant="destructive" data-testid="alert-consultations-error">
          <XCircle className="h-4 w-4" />
          <AlertTitle>خطأ / Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>فشل تحميل الاستشارات / Failed to load consultations</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm" 
              className="mt-2"
              data-testid="button-retry-consultations"
            >
              <RefreshCw className="h-3 w-3 me-2" />
              أعد المحاولة / Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="skeleton-consultations-loading">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد استشارات بعد</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              ابدأ أول استشارة لك للحصول على توصيات مخصصة
            </p>
            <Button
              className="metallic-gold-bg text-black border-0"
              onClick={() => createConsultationMutation.mutate()}
              disabled={createConsultationMutation.isPending}
              data-testid="button-first-consultation"
            >
              <Plus className="w-4 h-4 me-2" />
              ابدأ الآن
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultations.map((consultation, index) => (
            <Card key={consultation.id} className="hover-elevate" data-testid={`card-consultation-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>استشارة #{index + 1}</span>
                  <Badge variant={consultation.status === 'active' ? 'default' : 'secondary'} data-testid={`badge-status-${index}`}>
                    {consultation.status === 'active' ? (
                      <><Clock className="w-3 h-3 me-1" /> نشط</>
                    ) : (
                      <><CheckCircle2 className="w-3 h-3 me-1" /> مكتمل</>
                    )}
                  </Badge>
                </CardTitle>
                <CardDescription data-testid={`text-date-${index}`}>
                  {new Date(consultation.createdAt).toLocaleDateString('ar-EG', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {consultation.notes || 'لا توجد ملاحظات'}
                </p>
                <Button variant="outline" className="w-full" data-testid={`button-view-${index}`}>
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
