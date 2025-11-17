import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import type { ConsultationBooking } from "@shared/schema";

interface PaginatedResponse {
  data: ConsultationBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminConsultations() {
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [notes, setNotes] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const { toast } = useToast();

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["/api/admin/consultations/bookings", page],
    queryFn: async () => {
      const response = await fetch(`/api/admin/consultations/bookings?page=${page}&limit=20`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      phone,
    }: {
      id: string;
      status: string;
      phone?: string;
    }) => {
      return apiRequest(`/api/admin/consultations/bookings/${id}/payment`, {
        method: "PUT",
        body: JSON.stringify({ status, phone }),
      });
    },
    onSuccess: () => {
      toast({ title: "تم تحديث حالة الدفع بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
      setPaymentPhone("");
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest(`/api/admin/consultations/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast({ title: "تم تحديث حالة الحجز بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest(`/api/admin/consultations/bookings/${id}/notes`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      });
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الملاحظات بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
      setNotes("");
    },
  });

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "قيد الانتظار" },
      completed: { variant: "default", label: "مكتمل" },
      failed: { variant: "destructive", label: "فشل" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} data-testid={`badge-payment-${status}`}>
        {config.label}
      </Badge>
    );
  };

  const getBookingStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "قيد الانتظار" },
      confirmed: { variant: "default", label: "مؤكد" },
      cancelled: { variant: "destructive", label: "ملغي" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} data-testid={`badge-booking-${status}`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookings = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            إدارة حجوزات الاستشارات
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع حجوزات الاستشارات
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pagination?.total || 0} حجز
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الحجوزات / All Bookings</CardTitle>
          <CardDescription>
            قائمة بجميع حجوزات الاستشارات مع إمكانية التحديث
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">لا توجد حجوزات بعد</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>حالة الدفع</TableHead>
                      <TableHead>حالة الحجز</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} data-testid={`row-booking-${booking.id}`}>
                        <TableCell className="font-medium">
                          {booking.customerName}
                        </TableCell>
                        <TableCell>{booking.customerEmail}</TableCell>
                        <TableCell>{booking.customerPhone}</TableCell>
                        <TableCell>
                          {format(new Date(booking.preferredDate), "PPP")}
                        </TableCell>
                        <TableCell>{booking.preferredTime}</TableCell>
                        <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                        <TableCell>{getBookingStatusBadge(booking.bookingStatus)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setNotes(booking.notes || "");
                                  setPaymentPhone(booking.paymentPhone || "");
                                }}
                                data-testid={`button-view-${booking.id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                عرض
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الحجز / Booking Details</DialogTitle>
                                <DialogDescription>
                                  إدارة وتحديث تفاصيل الحجز
                                </DialogDescription>
                              </DialogHeader>
                              {selectedBooking && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        الاسم:
                                      </div>
                                      <div className="font-medium">{selectedBooking.customerName}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        البريد:
                                      </div>
                                      <div className="font-medium">{selectedBooking.customerEmail}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        الهاتف:
                                      </div>
                                      <div className="font-medium">{selectedBooking.customerPhone}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        التاريخ:
                                      </div>
                                      <div className="font-medium">
                                        {format(new Date(selectedBooking.preferredDate), "PPP")}
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        الوقت:
                                      </div>
                                      <div className="font-medium">{selectedBooking.preferredTime}</div>
                                    </div>
                                  </div>

                                  {selectedBooking.message && (
                                    <div className="space-y-2">
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        الرسالة:
                                      </div>
                                      <div className="p-3 bg-muted rounded-lg">
                                        {selectedBooking.message}
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold">تحديث حالة الدفع</h3>
                                    <div className="flex gap-3">
                                      <Input
                                        placeholder="رقم فودافون كاش (اختياري)"
                                        value={paymentPhone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                        data-testid="input-payment-phone"
                                      />
                                      <Select
                                        onValueChange={(status) =>
                                          updatePaymentStatusMutation.mutate({
                                            id: selectedBooking.id,
                                            status,
                                            phone: paymentPhone || undefined,
                                          })
                                        }
                                        data-testid="select-payment-status"
                                      >
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="تحديث الحالة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                                          <SelectItem value="completed">مكتمل</SelectItem>
                                          <SelectItem value="failed">فشل</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold">تحديث حالة الحجز</h3>
                                    <div className="flex gap-3">
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                          updateBookingStatusMutation.mutate({
                                            id: selectedBooking.id,
                                            status: "confirmed",
                                          })
                                        }
                                        data-testid="button-confirm-booking"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        تأكيد
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                          updateBookingStatusMutation.mutate({
                                            id: selectedBooking.id,
                                            status: "cancelled",
                                          })
                                        }
                                        data-testid="button-cancel-booking"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        إلغاء
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold">ملاحظات الإدارة</h3>
                                    <Textarea
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      placeholder="أضف ملاحظات..."
                                      rows={3}
                                      data-testid="input-notes"
                                    />
                                    <Button
                                      onClick={() =>
                                        updateNotesMutation.mutate({
                                          id: selectedBooking.id,
                                          notes,
                                        })
                                      }
                                      disabled={updateNotesMutation.isPending}
                                      data-testid="button-save-notes"
                                    >
                                      {updateNotesMutation.isPending ? "جاري الحفظ..." : "حفظ الملاحظات"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    صفحة {pagination.page} من {pagination.totalPages} ({pagination.total} حجز)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page === pagination.totalPages}
                      data-testid="button-next-page"
                    >
                      التالي
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
