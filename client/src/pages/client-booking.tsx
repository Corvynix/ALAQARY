import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, queryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  User,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { format, isFriday, isBefore, startOfDay } from "date-fns";

const TIME_SLOTS = [
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "22:00", label: "10:00 PM" },
];

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email format"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
  preferredDate: z.date(),
  preferredTime: z.string(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ClientBooking() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingReference, setBookingReference] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      message: '',
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      return apiRequest("/api/consultations/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setBookingReference(data.id);
      setStep(5);
      toast({
        title: "تم الحجز بنجاح!",
        description: "لقد تم إنشاء حجزك. يرجى متابعة تعليمات الدفع.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الحجز",
        description: error.message || "حدث خطأ أثناء إنشاء الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const handleNextStep = () => {
    if (step === 1) {
      form.trigger(["customerName", "customerEmail", "customerPhone", "message"]).then((isValid) => {
        if (isValid) setStep(2);
      });
    } else if (step === 2 && selectedDate) {
      form.setValue("preferredDate", selectedDate);
      setStep(3);
    } else if (step === 3 && selectedTime) {
      form.setValue("preferredTime", selectedTime);
      setStep(4);
    }
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  const isDateDisabled = (date: Date) => {
    return isFriday(date) || isBefore(date, startOfDay(new Date()));
  };

  if (step === 5) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-accent bg-accent/5">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    تم الحجز بنجاح!
                  </h2>
                  <p className="text-muted-foreground">
                    Booking confirmed successfully
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">رقم المرجع:</span>
                    <Badge variant="secondary" className="font-mono text-sm">
                      {bookingReference.slice(0, 8)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">التاريخ:</span>
                    <span className="font-medium text-foreground">
                      {selectedDate && format(selectedDate, "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">الوقت:</span>
                    <span className="font-medium text-foreground">
                      {TIME_SLOTS.find(t => t.value === selectedTime)?.label}
                    </span>
                  </div>
                </div>

                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Smartphone className="w-6 h-6 text-primary" />
                      📱 تعليمات الدفع / Payment Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground">
                      لتأكيد حجزك، يرجى إرسال الدفع عبر فودافون كاش إلى:
                    </p>
                    <div className="bg-background rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-accent" />
                        <div>
                          <div className="text-sm text-muted-foreground">رقم فودافون كاش:</div>
                          <div className="text-2xl font-bold text-foreground">01030535955</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      سيتم تأكيد حجزك خلال 24 ساعة بعد استلام الدفع.
                      <br />
                      Your booking will be confirmed within 24 hours after payment is received.
                    </p>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = '/client'}
                  data-testid="button-back-to-dashboard"
                >
                  العودة إلى لوحة التحكم
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            حجز استشارة / Book Consultation
          </h1>
          <p className="text-muted-foreground text-lg">
            احجز موعداً لاستشارة عقارية مع خبرائنا
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i}
              </div>
              {i < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > i ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات الاتصال / Contact Information
                  </CardTitle>
                  <CardDescription>
                    يرجى تقديم تفاصيل الاتصال الخاصة بك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل / Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني / Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف / Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رسالة (اختياري) / Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="أخبرنا عن احتياجاتك الاستشارية..."
                            rows={4}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    اختر التاريخ / Select Date
                  </CardTitle>
                  <CardDescription>
                    حدد التاريخ المفضل لديك (الجمعة غير متاحة)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border mx-auto"
                    data-testid="calendar-date-picker"
                  />
                  {selectedDate && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">التاريخ المحدد:</p>
                      <p className="text-lg font-medium text-foreground">
                        {format(selectedDate, "PPP")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    اختر الوقت / Select Time
                  </CardTitle>
                  <CardDescription>
                    اختر الوقت المفضل (2 مساءً - 10 مساءً)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => (
                      <Button
                        key={slot.value}
                        type="button"
                        variant={selectedTime === slot.value ? "default" : "outline"}
                        className="h-14"
                        onClick={() => setSelectedTime(slot.value)}
                        data-testid={`button-time-${slot.value}`}
                      >
                        {slot.label}
                      </Button>
                    ))}
                  </div>
                  {selectedTime && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">الوقت المحدد:</p>
                      <p className="text-lg font-medium text-foreground">
                        {TIME_SLOTS.find(t => t.value === selectedTime)?.label}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ملخص الحجز / Booking Summary</CardTitle>
                    <CardDescription>
                      يرجى مراجعة تفاصيل حجزك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">الاسم:</div>
                          <div className="font-medium text-foreground">{form.getValues("customerName")}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">البريد الإلكتروني:</div>
                          <div className="font-medium text-foreground">{form.getValues("customerEmail")}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">الهاتف:</div>
                          <div className="font-medium text-foreground">{form.getValues("customerPhone")}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">التاريخ:</div>
                          <div className="font-medium text-foreground">
                            {selectedDate && format(selectedDate, "PPP")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">الوقت:</div>
                          <div className="font-medium text-foreground">
                            {TIME_SLOTS.find(t => t.value === selectedTime)?.label}
                          </div>
                        </div>
                      </div>
                      {form.getValues("message") && (
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground">الرسالة:</div>
                            <div className="font-medium text-foreground">{form.getValues("message")}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      📱 تعليمات الدفع / Payment Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground">
                      لتأكيد حجزك، يرجى إرسال الدفع عبر فودافون كاش إلى:
                    </p>
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-accent" />
                        <div>
                          <div className="text-sm text-muted-foreground">رقم فودافون كاش:</div>
                          <div className="text-2xl font-bold text-foreground">01030535955</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      سيتم تأكيد حجزك خلال 24 ساعة بعد استلام الدفع.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && step < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="flex items-center gap-2"
                  data-testid="button-previous"
                >
                  <ArrowLeft className="w-4 h-4" />
                  السابق
                </Button>
              )}
              {step < 4 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 flex items-center gap-2"
                  disabled={
                    (step === 2 && !selectedDate) ||
                    (step === 3 && !selectedTime)
                  }
                  data-testid="button-next"
                >
                  التالي
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {step === 4 && (
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1"
                  disabled={createBookingMutation.isPending}
                  data-testid="button-confirm-booking"
                >
                  {createBookingMutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
