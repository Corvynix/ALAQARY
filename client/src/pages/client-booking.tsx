import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  MapPin,
  Target,
  DollarSign,
  Timer,
  Brain,
  FileText,
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

const PRIORITY_OPTIONS = [
  { value: "price", label: "سعر" },
  { value: "location", label: "موقع" },
  { value: "trusted_developer", label: "مطور موثوق" },
  { value: "investment_return", label: "عائد استثماري" },
  { value: "property_design", label: "تصميم العقار" },
  { value: "additional_services", label: "خدمات إضافية" },
];

const bookingSchema = z.object({
  customerName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  customerEmail: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
  customerPhone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  country: z.string().min(2, "الدولة مطلوبة"),
  city: z.string().min(2, "المدينة مطلوبة"),
  area: z.string().min(2, "المنطقة مطلوبة"),
  age: z.string().optional(),
  
  propertyType: z.string().min(1, "نوع العقار مطلوب"),
  investmentGoal: z.string().min(1, "الهدف من الاستثمار مطلوب"),
  isFirstTime: z.boolean(),
  cityPreference: z.string().min(1, "المدينة المفضلة مطلوبة"),
  areaPreference: z.string().min(1, "المنطقة المفضلة مطلوبة"),
  
  maxBudget: z.string().min(1, "الحد الأقصى للميزانية مطلوب"),
  minBudget: z.string().optional(),
  paymentPreference: z.string().min(1, "تفضيل طريقة الدفع مطلوب"),
  installmentDuration: z.string().min(1, "مدة الأقساط مطلوبة"),
  
  availablePeriod: z.string().min(1, "الفترة المتاحة مطلوبة"),
  flexibility: z.string().min(1, "مدى المرونة مطلوب"),
  decisionReadiness: z.string().min(1, "جاهزية اتخاذ القرار مطلوبة"),
  
  riskTolerance: z.string().min(1, "تحمل المخاطر مطلوب"),
  priorities: z.array(z.string()).min(1, "يجب اختيار أولوية واحدة على الأقل"),
  constraints: z.string().min(1, "القيود الخاصة مطلوبة"),
  
  preferredContactMethod: z.string().min(1, "وسيلة التواصل المفضلة مطلوبة"),
  message: z.string().min(1, "الرسالة مطلوبة"),
  
  preferredDate: z.date(),
  preferredTime: z.string(),
  
  consultationFee: z.number().default(200),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ClientBooking() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingReference, setBookingReference] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      country: '',
      city: '',
      area: '',
      age: '',
      propertyType: '',
      investmentGoal: '',
      isFirstTime: true,
      cityPreference: 'أسيوط',
      areaPreference: '',
      maxBudget: '',
      minBudget: '',
      paymentPreference: '',
      installmentDuration: '',
      availablePeriod: '',
      flexibility: '',
      decisionReadiness: '',
      riskTolerance: '',
      priorities: [],
      constraints: '',
      preferredContactMethod: '',
      message: '',
      consultationFee: 200,
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const formattedData = {
        ...data,
        age: data.age ? parseInt(data.age) : undefined,
        maxBudget: parseFloat(data.maxBudget),
        minBudget: data.minBudget ? parseFloat(data.minBudget) : undefined,
      };
      const res = await apiRequest("POST", "/api/consultations/bookings/public", formattedData);
      return await res.json();
    },
    onSuccess: (data: any) => {
      setBookingReference(data.id);
      setStep(9);
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

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    switch(step) {
      case 1:
        fieldsToValidate = ["customerName", "customerEmail", "customerPhone", "country", "city", "area"];
        break;
      case 2:
        fieldsToValidate = ["propertyType", "investmentGoal", "isFirstTime", "cityPreference", "areaPreference"];
        break;
      case 3:
        fieldsToValidate = ["maxBudget", "paymentPreference", "installmentDuration"];
        break;
      case 4:
        fieldsToValidate = ["availablePeriod", "flexibility", "decisionReadiness"];
        break;
      case 5:
        fieldsToValidate = ["riskTolerance", "priorities", "constraints"];
        break;
      case 6:
        fieldsToValidate = ["preferredContactMethod", "message"];
        break;
      case 7:
        if (selectedDate && selectedTime) {
          form.setValue("preferredDate", selectedDate);
          form.setValue("preferredTime", selectedTime);
          setStep(8);
        }
        return;
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
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

  if (step === 9) {
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
                    <Badge variant="secondary" className="font-mono text-sm" data-testid="text-booking-reference">
                      {bookingReference.slice(0, 8)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">التاريخ:</span>
                    <span className="font-medium text-foreground" data-testid="text-booking-date">
                      {selectedDate && format(selectedDate, "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">الوقت:</span>
                    <span className="font-medium text-foreground" data-testid="text-booking-time">
                      {TIME_SLOTS.find(t => t.value === selectedTime)?.label}
                    </span>
                  </div>
                </div>

                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Smartphone className="w-6 h-6 text-primary" />
                      تعليمات الدفع / Payment Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground text-lg font-medium" data-testid="text-payment-message">
                      شكرا لك سيتم التواصل معك بمجرد ارسال صورة تحويل المبلغ علي الواتساب
                    </p>
                    <div className="bg-background rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-accent" />
                        <div>
                          <div className="text-sm text-muted-foreground">رقم واتساب:</div>
                          <div className="text-2xl font-bold text-foreground" data-testid="text-whatsapp-number">01030535955</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                  data-testid="button-back-to-home"
                >
                  العودة إلى الصفحة الرئيسية
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

        <div className="flex items-center justify-between mb-6 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step >= i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-indicator-${i}`}
              >
                {i}
              </div>
              {i < 8 && (
                <div
                  className={`flex-1 h-1 mx-1 ${
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
                    الخطوة 1: بيانات العميل الأساسية
                  </CardTitle>
                  <CardDescription>
                    Basic Customer Data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل / Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-customer-name" placeholder="أدخل الاسم الكامل" />
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
                        <FormLabel>البريد الإلكتروني / Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-customer-email" placeholder="example@email.com" />
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
                        <FormLabel>رقم الهاتف / Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-customer-phone" placeholder="01xxxxxxxxx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الدولة / Country *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-country" placeholder="مصر" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة / City *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-city" placeholder="القاهرة" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المنطقة / Area *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-area" placeholder="المنطقة" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العمر / Age (اختياري)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-age" placeholder="30" />
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
                    <Target className="w-5 h-5" />
                    الخطوة 2: هدف العميل
                  </CardTitle>
                  <CardDescription>
                    Client Goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع العقار المهتم به / Property Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-property-type">
                              <SelectValue placeholder="اختر نوع العقار" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential" data-testid="option-residential">سكني</SelectItem>
                            <SelectItem value="commercial" data-testid="option-commercial">تجاري</SelectItem>
                            <SelectItem value="land" data-testid="option-land">أرض</SelectItem>
                            <SelectItem value="chalet" data-testid="option-chalet">شاليه</SelectItem>
                            <SelectItem value="villa" data-testid="option-villa">فيلا</SelectItem>
                            <SelectItem value="apartment" data-testid="option-apartment">شقة</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investmentGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الهدف من الاستثمار / Investment Goal *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-investment-goal">
                              <SelectValue placeholder="اختر الهدف من الاستثمار" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal_residence" data-testid="option-personal">سكن شخصي</SelectItem>
                            <SelectItem value="rental" data-testid="option-rental">تأجير</SelectItem>
                            <SelectItem value="development" data-testid="option-development">تطوير</SelectItem>
                            <SelectItem value="quick_sale" data-testid="option-quick-sale">بيع سريع</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFirstTime"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>أول مرة شراء أم استثمار متكرر / First Time or Repeat *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "true")}
                            value={field.value ? "true" : "false"}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" data-testid="radio-first-time-yes" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                أول مرة شراء / First Time
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" data-testid="radio-first-time-no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                استثمار متكرر / Repeat Investment
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cityPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة المفضلة / Preferred City *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-city-preference" placeholder="أسيوط" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areaPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المنطقة المفضلة / Preferred Area *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-area-preference">
                              <SelectValue placeholder="اختر المنطقة المفضلة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new_assiut" data-testid="option-new-assiut">أسيوط الجديدة</SelectItem>
                            <SelectItem value="plateau_assiut" data-testid="option-plateau">الهضبة أسيوط</SelectItem>
                            <SelectItem value="other" data-testid="option-other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    الخطوة 3: ميزانية العميل
                  </CardTitle>
                  <CardDescription>
                    Client Budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maxBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الحد الأقصى للميزانية / Maximum Budget *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-max-budget" placeholder="5000000" />
                        </FormControl>
                        <FormDescription>بالجنيه المصري</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الحد الأدنى للميزانية / Minimum Budget (اختياري)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-min-budget" placeholder="3000000" />
                        </FormControl>
                        <FormDescription>بالجنيه المصري</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تفضيل طريقة الدفع / Payment Preference *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-payment-preference">
                              <SelectValue placeholder="اختر طريقة الدفع" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash" data-testid="option-cash">نقدي</SelectItem>
                            <SelectItem value="installments" data-testid="option-installments">أقساط</SelectItem>
                            <SelectItem value="bank_financing" data-testid="option-bank">تمويل بنكي</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="installmentDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدة الأقساط المطلوبة / Installment Duration *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-installment-duration">
                              <SelectValue placeholder="اختر مدة الأقساط" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1_year" data-testid="option-1-year">1 سنة</SelectItem>
                            <SelectItem value="2_years" data-testid="option-2-years">2 سنة</SelectItem>
                            <SelectItem value="3_years" data-testid="option-3-years">3 سنوات</SelectItem>
                            <SelectItem value="5_years" data-testid="option-5-years">5 سنوات</SelectItem>
                            <SelectItem value="10_years" data-testid="option-10-years">10 سنوات</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    الخطوة 4: التوقيت والمرونة
                  </CardTitle>
                  <CardDescription>
                    Timing & Flexibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="availablePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفترة المتاحة للشراء/الاستثمار / Available Period *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-available-period">
                              <SelectValue placeholder="اختر الفترة المتاحة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate" data-testid="option-immediate">فوري</SelectItem>
                            <SelectItem value="within_month" data-testid="option-month">خلال شهر</SelectItem>
                            <SelectItem value="within_3months" data-testid="option-3months">خلال 3 أشهر</SelectItem>
                            <SelectItem value="within_6months" data-testid="option-6months">خلال 6 أشهر</SelectItem>
                            <SelectItem value="within_year" data-testid="option-year">خلال سنة</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flexibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدى المرونة في المنطقة أو السعر / Flexibility *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            data-testid="input-flexibility"
                            placeholder="هل لديك مرونة في اختيار المنطقة أو تعديل السعر؟"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decisionReadiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>جاهزية العميل لاتخاذ القرار / Decision Readiness *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-decision-readiness">
                              <SelectValue placeholder="اختر جاهزية اتخاذ القرار" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate" data-testid="option-decision-immediate">فوري</SelectItem>
                            <SelectItem value="within_week" data-testid="option-decision-week">خلال أسبوع</SelectItem>
                            <SelectItem value="within_month" data-testid="option-decision-month">خلال شهر</SelectItem>
                            <SelectItem value="undefined" data-testid="option-decision-undefined">غير محدد</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    الخطوة 5: ملف نفسي واحتياجات إضافية
                  </CardTitle>
                  <CardDescription>
                    Psychological Profile & Additional Needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المخاطر اللي يقبلها / Risk Tolerance *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-risk-tolerance">
                              <SelectValue placeholder="اختر مستوى تحمل المخاطر" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low" data-testid="option-low-risk">Low Risk / محافظ</SelectItem>
                            <SelectItem value="medium" data-testid="option-medium-risk">Medium Risk / متوسط</SelectItem>
                            <SelectItem value="high" data-testid="option-high-risk">High Risk / مغامر</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priorities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>أولويات العميل / Client Priorities *</FormLabel>
                          <FormDescription>
                            اختر واحدة أو أكثر
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {PRIORITY_OPTIONS.map((item) => (
                            <FormField
                              key={item.value}
                              control={form.control}
                              name="priorities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.value
                                                )
                                              );
                                        }}
                                        data-testid={`checkbox-priority-${item.value}`}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أي قيود خاصة / Special Constraints *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            data-testid="input-constraints"
                            placeholder="مثل: مساحة محددة، عدد غرف، طابق معين، مطور محدد، خدمات إضافية..."
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    الخطوة 6: تفاصيل الاستشارة
                  </CardTitle>
                  <CardDescription>
                    Consultation Details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="preferredContactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تفضيل وسيلة التواصل / Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-method">
                              <SelectValue placeholder="اختر وسيلة التواصل المفضلة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in_person" data-testid="option-in-person">مقابلة شخصية</SelectItem>
                            <SelectItem value="phone_call" data-testid="option-phone">مكالمة</SelectItem>
                            <SelectItem value="video" data-testid="option-video">فيديو</SelectItem>
                            <SelectItem value="whatsapp" data-testid="option-whatsapp">واتساب</SelectItem>
                            <SelectItem value="email" data-testid="option-email">ايميل</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أي أسئلة أو مخاوف / Questions or Concerns *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            data-testid="input-consultation-message"
                            placeholder="أخبرنا عن أي أسئلة أو مخاوف لديك..."
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 7 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      الخطوة 7: اختيار التاريخ والوقت
                    </CardTitle>
                    <CardDescription>
                      Date & Time Selection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">اختر التاريخ المفضل / Preferred Date</h3>
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
                    </div>

                    {selectedDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">اختر الوقت المفضل / Preferred Time</h3>
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      الخطوة 8: مراجعة وتأكيد الحجز
                    </CardTitle>
                    <CardDescription>
                      Review & Confirm Booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg mb-3">بيانات العميل الأساسية</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">الاسم:</span>
                            <p className="font-medium" data-testid="summary-customer-name">{form.getValues("customerName")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">البريد الإلكتروني:</span>
                            <p className="font-medium" data-testid="summary-email">{form.getValues("customerEmail")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الهاتف:</span>
                            <p className="font-medium" data-testid="summary-phone">{form.getValues("customerPhone")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الدولة:</span>
                            <p className="font-medium" data-testid="summary-country">{form.getValues("country")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">المدينة:</span>
                            <p className="font-medium" data-testid="summary-city">{form.getValues("city")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">المنطقة:</span>
                            <p className="font-medium" data-testid="summary-area">{form.getValues("area")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg mb-3">هدف العميل</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">نوع العقار:</span>
                            <p className="font-medium" data-testid="summary-property-type">{form.getValues("propertyType")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الهدف:</span>
                            <p className="font-medium" data-testid="summary-investment-goal">{form.getValues("investmentGoal")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">المدينة المفضلة:</span>
                            <p className="font-medium" data-testid="summary-city-preference">{form.getValues("cityPreference")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">المنطقة المفضلة:</span>
                            <p className="font-medium" data-testid="summary-area-preference">{form.getValues("areaPreference")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg mb-3">الميزانية</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">الحد الأقصى:</span>
                            <p className="font-medium" data-testid="summary-max-budget">{form.getValues("maxBudget")} جنيه</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">طريقة الدفع:</span>
                            <p className="font-medium" data-testid="summary-payment-preference">{form.getValues("paymentPreference")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg mb-3">التوقيت والمرونة</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">الفترة المتاحة:</span>
                            <p className="font-medium" data-testid="summary-available-period">{form.getValues("availablePeriod")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">جاهزية القرار:</span>
                            <p className="font-medium" data-testid="summary-decision-readiness">{form.getValues("decisionReadiness")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg mb-3">معلومات الاستشارة</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">التاريخ:</span>
                            <p className="font-medium" data-testid="summary-date">
                              {selectedDate && format(selectedDate, "PPP")}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الوقت:</span>
                            <p className="font-medium" data-testid="summary-time">
                              {TIME_SLOTS.find(t => t.value === selectedTime)?.label}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">وسيلة التواصل:</span>
                            <p className="font-medium" data-testid="summary-contact-method">{form.getValues("preferredContactMethod")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">رسوم الاستشارة:</span>
                            <p className="font-medium text-primary" data-testid="summary-fee">200 جنيه</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      معلومات الدفع / Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-2">
                      رسوم الاستشارة: <span className="font-bold text-xl">200 جنيه مصري</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      سيتم إرسال تعليمات الدفع بعد تأكيد الحجز
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && step < 9 && (
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
              {step < 7 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 flex items-center gap-2"
                  data-testid="button-next"
                >
                  التالي
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {step === 7 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 flex items-center gap-2"
                  disabled={!selectedDate || !selectedTime}
                  data-testid="button-next"
                >
                  التالي
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {step === 8 && (
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
