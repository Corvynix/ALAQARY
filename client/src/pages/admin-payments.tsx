import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Payment } from "@shared/schema";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading } = useQuery<PaginatedResponse<Payment>>({
    queryKey: ["/api/admin/payments", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });
      
      const response = await fetch(`/api/admin/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
  });

  const payments = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setPage(1);
  };

  const startItem = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endItem = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const completedCount = payments.filter(p => p.paymentStatus === 'completed').length;
  const pendingCount = payments.filter(p => p.paymentStatus === 'pending').length;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">المدفوعات</h1>
        <p className="text-muted-foreground text-lg">إدارة ومراقبة المعاملات المالية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الإيرادات (الصفحة الحالية)
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مدفوعات مكتملة (الصفحة الحالية)
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-completed-count">
              {completedCount}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مدفوعات معلقة (الصفحة الحالية)
            </CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-pending-count">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center justify-between">
        {pagination && pagination.total > 0 && (
          <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
            Showing {startItem}-{endItem} of {pagination.total} payments
          </p>
        )}
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[150px]" data-testid="select-page-size">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
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
            <>
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

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          data-testid="button-prev-page"
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNumber;
                        if (pagination.totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNumber = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNumber = pagination.totalPages - 4 + i;
                        } else {
                          pageNumber = pagination.page - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={pagination.page === pageNumber}
                              className="cursor-pointer"
                              data-testid={`button-page-${pageNumber}`}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                          className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          data-testid="button-next-page"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
