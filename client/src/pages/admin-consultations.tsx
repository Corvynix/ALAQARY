import { useState, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  MapPin,
  Home,
  Target,
  DollarSign,
  Timer,
  Brain,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Wallet,
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

const getContactMethodLabel = (method: string | null | undefined): string => {
  if (!method) return 'غير محدد';
  
  const contactMethods: Record<string, string> = {
    'in_person': 'مقابلة شخصية',
    'phone_call': 'مكالمة',
    'video': 'فيديو',
    'whatsapp': 'واتساب',
    'email': 'ايميل'
  };
  
  return contactMethods[method] || method;
};

export default function AdminConsultations() {
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [notes, setNotes] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [filterBookingStatus, setFilterBookingStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  const [filterPropertyType, setFilterPropertyType] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
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
      const res = await apiRequest("PUT", `/api/admin/consultations/bookings/${id}/payment`, { status, phone });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث حالة الدفع بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
      setPaymentPhone("");
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/consultations/bookings/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث حالة الحجز بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const res = await apiRequest("PUT", `/api/admin/consultations/bookings/${id}/notes`, { notes });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الملاحظات بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations/bookings"] });
      setNotes("");
    },
  });

  const allBookings = data?.data || [];

  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      if (filterBookingStatus !== "all" && booking.bookingStatus !== filterBookingStatus) return false;
      if (filterPaymentStatus !== "all" && booking.paymentStatus !== filterPaymentStatus) return false;
      if (filterPropertyType !== "all" && booking.propertyType !== filterPropertyType) return false;
      if (filterArea !== "all" && booking.areaPreference !== filterArea) return false;
      return true;
    });
  }, [allBookings, filterBookingStatus, filterPaymentStatus, filterPropertyType, filterArea]);

  const analytics = useMemo(() => {
    const totalBookings = allBookings.length;
    
    const propertyTypeDistribution = allBookings.reduce((acc, booking) => {
      const type = booking.propertyType || "غير محدد";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const areaDistribution = allBookings.reduce((acc, booking) => {
      const area = booking.areaPreference || "غير محدد";
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const paymentMethodDistribution = allBookings.reduce((acc, booking) => {
      const method = booking.paymentPreference || "غير محدد";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskToleranceDistribution = allBookings.reduce((acc, booking) => {
      const risk = booking.riskTolerance || "غير محدد";
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const paymentStatusDistribution = allBookings.reduce((acc, booking) => {
      const status = booking.paymentStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const budgets = allBookings
      .filter(b => b.maxBudget)
      .map(b => parseFloat(b.maxBudget as string));
    const averageBudget = budgets.length > 0
      ? budgets.reduce((a, b) => a + b, 0) / budgets.length
      : 0;

    return {
      totalBookings,
      propertyTypeDistribution,
      areaDistribution,
      paymentMethodDistribution,
      riskToleranceDistribution,
      paymentStatusDistribution,
      averageBudget,
    };
  }, [allBookings]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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

  const bookings = filteredBookings;
  const pagination = data?.pagination;

  const uniquePropertyTypes = Array.from(new Set(allBookings.map(b => b.propertyType).filter(Boolean)));
  const uniqueAreas = Array.from(new Set(allBookings.map(b => b.areaPreference).filter(Boolean)));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            إدارة حجوزات الاستشارات
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع حجوزات الاستشارات مع تحليلات شاملة
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2" data-testid="badge-total-bookings">
          {analytics.totalBookings} حجز
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-analytics-total">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>

        <Card data-testid="card-analytics-avg-budget">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الميزانية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageBudget.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} EGP
            </div>
            <p className="text-xs text-muted-foreground">Average Budget</p>
          </CardContent>
        </Card>

        <Card data-testid="card-analytics-payment-completed">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مدفوعات مكتملة</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.paymentStatusDistribution.completed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              من {analytics.totalBookings} حجز
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-analytics-confirmed">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مؤكدة</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allBookings.filter(b => b.bookingStatus === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed Bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-analytics-distributions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            التوزيعات الإحصائية / Statistical Distributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Home className="h-4 w-4" />
                توزيع نوع العقار
              </h3>
              <div className="space-y-1">
                {Object.entries(analytics.propertyTypeDistribution).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm" data-testid={`stat-property-${type}`}>
                    <span className="text-muted-foreground">{type}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                توزيع المنطقة المفضلة
              </h3>
              <div className="space-y-1">
                {Object.entries(analytics.areaDistribution).slice(0, 5).map(([area, count]) => (
                  <div key={area} className="flex justify-between text-sm" data-testid={`stat-area-${area}`}>
                    <span className="text-muted-foreground">{area}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                توزيع طريقة الدفع
              </h3>
              <div className="space-y-1">
                {Object.entries(analytics.paymentMethodDistribution).map(([method, count]) => (
                  <div key={method} className="flex justify-between text-sm" data-testid={`stat-payment-method-${method}`}>
                    <span className="text-muted-foreground">{method}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                توزيع مستوى المخاطر
              </h3>
              <div className="space-y-1">
                {Object.entries(analytics.riskToleranceDistribution).map(([risk, count]) => (
                  <div key={risk} className="flex justify-between text-sm" data-testid={`stat-risk-${risk}`}>
                    <span className="text-muted-foreground">{risk}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                توزيع حالة الدفع
              </h3>
              <div className="space-y-1">
                {Object.entries(analytics.paymentStatusDistribution).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm" data-testid={`stat-payment-status-${status}`}>
                    <span className="text-muted-foreground">{status}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جميع الحجوزات / All Bookings</CardTitle>
          <CardDescription>
            قائمة بجميع حجوزات الاستشارات مع إمكانية التحديث والفلترة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">الفلاتر:</span>
            </div>
            
            <Select value={filterBookingStatus} onValueChange={setFilterBookingStatus}>
              <SelectTrigger className="w-[180px]" data-testid="filter-booking-status">
                <SelectValue placeholder="حالة الحجز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
              <SelectTrigger className="w-[180px]" data-testid="filter-payment-status">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
              <SelectTrigger className="w-[180px]" data-testid="filter-property-type">
                <SelectValue placeholder="نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {uniquePropertyTypes.map(type => (
                  <SelectItem key={type} value={type as string}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-[180px]" data-testid="filter-area">
                <SelectValue placeholder="المنطقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المناطق</SelectItem>
                {uniqueAreas.map(area => (
                  <SelectItem key={area} value={area as string}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterBookingStatus !== "all" || filterPaymentStatus !== "all" || filterPropertyType !== "all" || filterArea !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterBookingStatus("all");
                  setFilterPaymentStatus("all");
                  setFilterPropertyType("all");
                  setFilterArea("all");
                }}
                data-testid="button-clear-filters"
              >
                مسح الفلاتر
              </Button>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {allBookings.length === 0 ? "لا توجد حجوزات بعد" : "لا توجد نتائج للفلاتر المحددة"}
              </p>
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
                            <DialogContent className="max-w-4xl max-h-[90vh]">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الحجز / Booking Details</DialogTitle>
                                <DialogDescription>
                                  معلومات شاملة عن الحجز والعميل
                                </DialogDescription>
                              </DialogHeader>
                              {selectedBooking && (
                                <ScrollArea className="h-[calc(90vh-120px)] pr-4">
                                  <div className="space-y-6">
                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        بيانات العميل الأساسية
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            الاسم:
                                          </div>
                                          <div className="font-medium" data-testid="detail-customer-name">{selectedBooking.customerName}</div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            البريد:
                                          </div>
                                          <div className="font-medium" data-testid="detail-customer-email">{selectedBooking.customerEmail}</div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            الهاتف:
                                          </div>
                                          <div className="font-medium" data-testid="detail-customer-phone">{selectedBooking.customerPhone}</div>
                                        </div>
                                        {selectedBooking.country && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                              <MapPin className="w-4 h-4" />
                                              الدولة:
                                            </div>
                                            <div className="font-medium" data-testid="detail-country">{selectedBooking.country}</div>
                                          </div>
                                        )}
                                        {selectedBooking.city && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">المدينة:</div>
                                            <div className="font-medium" data-testid="detail-city">{selectedBooking.city}</div>
                                          </div>
                                        )}
                                        {selectedBooking.area && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">المنطقة:</div>
                                            <div className="font-medium" data-testid="detail-area">{selectedBooking.area}</div>
                                          </div>
                                        )}
                                        {selectedBooking.age && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">العمر:</div>
                                            <div className="font-medium" data-testid="detail-age">{selectedBooking.age} سنة</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        هدف العميل
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedBooking.propertyType && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                              <Home className="w-4 h-4" />
                                              نوع العقار:
                                            </div>
                                            <Badge variant="secondary" data-testid="detail-property-type">{selectedBooking.propertyType}</Badge>
                                          </div>
                                        )}
                                        {selectedBooking.investmentGoal && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">الهدف من الاستثمار:</div>
                                            <div className="font-medium" data-testid="detail-investment-goal">{selectedBooking.investmentGoal}</div>
                                          </div>
                                        )}
                                        {selectedBooking.isFirstTime !== null && selectedBooking.isFirstTime !== undefined && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">نوع المستثمر:</div>
                                            <Badge variant={selectedBooking.isFirstTime ? "secondary" : "default"} data-testid="detail-is-first-time">
                                              {selectedBooking.isFirstTime ? "أول مرة" : "متكرر"}
                                            </Badge>
                                          </div>
                                        )}
                                        {selectedBooking.cityPreference && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">المدينة المفضلة:</div>
                                            <div className="font-medium" data-testid="detail-city-preference">{selectedBooking.cityPreference}</div>
                                          </div>
                                        )}
                                        {selectedBooking.areaPreference && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">المنطقة المفضلة:</div>
                                            <div className="font-medium" data-testid="detail-area-preference">{selectedBooking.areaPreference}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        ميزانية العميل
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedBooking.maxBudget && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">الحد الأقصى للميزانية:</div>
                                            <div className="font-medium text-lg" data-testid="detail-max-budget">
                                              {parseFloat(selectedBooking.maxBudget as string).toLocaleString('ar-EG')} EGP
                                            </div>
                                          </div>
                                        )}
                                        {selectedBooking.minBudget && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">الحد الأدنى للميزانية:</div>
                                            <div className="font-medium text-lg" data-testid="detail-min-budget">
                                              {parseFloat(selectedBooking.minBudget as string).toLocaleString('ar-EG')} EGP
                                            </div>
                                          </div>
                                        )}
                                        {selectedBooking.paymentPreference && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">طريقة الدفع المفضلة:</div>
                                            <Badge variant="secondary" data-testid="detail-payment-preference">{selectedBooking.paymentPreference}</Badge>
                                          </div>
                                        )}
                                        {selectedBooking.installmentDuration && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">مدة الأقساط:</div>
                                            <div className="font-medium" data-testid="detail-installment-duration">{selectedBooking.installmentDuration}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Timer className="h-5 w-5" />
                                        التوقيت والمرونة
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedBooking.availablePeriod && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">الفترة المتاحة:</div>
                                            <div className="font-medium" data-testid="detail-available-period">{selectedBooking.availablePeriod}</div>
                                          </div>
                                        )}
                                        {selectedBooking.flexibility && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">المرونة:</div>
                                            <div className="font-medium" data-testid="detail-flexibility">{selectedBooking.flexibility}</div>
                                          </div>
                                        )}
                                        {selectedBooking.decisionReadiness && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">جاهزية اتخاذ القرار:</div>
                                            <Badge variant="secondary" data-testid="detail-decision-readiness">{selectedBooking.decisionReadiness}</Badge>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Brain className="h-5 w-5" />
                                        الملف النفسي
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedBooking.riskTolerance && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                              <AlertCircle className="w-4 h-4" />
                                              مستوى المخاطر:
                                            </div>
                                            <Badge variant="secondary" data-testid="detail-risk-tolerance">{selectedBooking.riskTolerance}</Badge>
                                          </div>
                                        )}
                                        {selectedBooking.priorities && selectedBooking.priorities.length > 0 && (
                                          <div className="space-y-1 col-span-2">
                                            <div className="text-sm text-muted-foreground">الأولويات:</div>
                                            <div className="flex flex-wrap gap-2">
                                              {selectedBooking.priorities.map((priority, idx) => (
                                                <Badge key={idx} variant="outline" data-testid={`detail-priority-${idx}`}>{priority}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {selectedBooking.constraints && (
                                          <div className="space-y-1 col-span-2">
                                            <div className="text-sm text-muted-foreground">القيود:</div>
                                            <div className="p-3 bg-muted rounded-lg" data-testid="detail-constraints">
                                              {selectedBooking.constraints}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        تفاصيل الاستشارة
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            التاريخ المفضل:
                                          </div>
                                          <div className="font-medium" data-testid="detail-preferred-date">
                                            {format(new Date(selectedBooking.preferredDate), "PPP")}
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            الوقت المفضل:
                                          </div>
                                          <div className="font-medium" data-testid="detail-preferred-time">{selectedBooking.preferredTime}</div>
                                        </div>
                                        {selectedBooking.preferredContactMethod && (
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">وسيلة التواصل المفضلة:</div>
                                            <Badge variant="secondary" data-testid="detail-contact-method">{getContactMethodLabel(selectedBooking.preferredContactMethod)}</Badge>
                                          </div>
                                        )}
                                        <div className="space-y-1">
                                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            رسوم الاستشارة:
                                          </div>
                                          <div className="font-medium text-lg" data-testid="detail-consultation-fee">
                                            {parseFloat(selectedBooking.consultationFee as string).toLocaleString('ar-EG')} EGP
                                          </div>
                                        </div>
                                        {selectedBooking.message && (
                                          <div className="space-y-1 col-span-2">
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                              <MessageSquare className="w-4 h-4" />
                                              الرسالة / الأسئلة:
                                            </div>
                                            <div className="p-3 bg-muted rounded-lg" data-testid="detail-message">
                                              {selectedBooking.message}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <Separator />

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
                                </ScrollArea>
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
