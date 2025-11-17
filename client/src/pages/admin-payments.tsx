import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Payment } from "@shared/schema";

export default function AdminPayments() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">المدفوعات</h1>
        <p className="text-muted-foreground text-lg">إدارة ومراقبة المعاملات المالية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الإيرادات
            </CardTitle>
            <DollarSign className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-revenue">
              {totalRevenue.toLocaleString()} جنيه
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مدفوعات مكتملة
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-completed-count">
              {payments.filter(p => p.paymentStatus === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مدفوعات معلقة
            </CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-pending-count">
              {payments.filter(p => p.paymentStatus === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل المدفوعات</CardTitle>
          <CardDescription>جميع المعاملات المالية</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">لا توجد مدفوعات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate" data-testid={`row-payment-${index}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      payment.paymentStatus === 'completed' 
                        ? 'bg-chart-3/10' 
                        : payment.paymentStatus === 'pending'
                        ? 'bg-accent/10'
                        : 'bg-destructive/10'
                    }`}>
                      {payment.paymentStatus === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-chart-3" />
                      ) : payment.paymentStatus === 'pending' ? (
                        <Clock className="w-6 h-6 text-accent" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-foreground" data-testid={`text-amount-${index}`}>
                        {Number(payment.amount).toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-method-${index}`}>
                        {payment.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : payment.paymentMethod === 'cash' ? 'نقدي' : 'تحويل بنكي'}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-date-${index}`}>
                        {new Date(payment.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    payment.paymentStatus === 'completed' ? 'default' : 
                    payment.paymentStatus === 'pending' ? 'secondary' : 
                    'destructive'
                  } data-testid={`badge-status-${index}`}>
                    {payment.paymentStatus === 'completed' ? 'مكتمل' : 
                     payment.paymentStatus === 'pending' ? 'معلق' : 
                     'فشل'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
