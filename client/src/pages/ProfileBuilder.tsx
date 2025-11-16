import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const profileSchema = z.object({
  riskTolerance: z.enum(['low', 'medium', 'high']),
  decisionType: z.enum(['analytical', 'emotional', 'balanced']),
  urgency: z.enum(['low', 'medium', 'high']),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  preferredCities: z.array(z.string()),
  preferredTypes: z.array(z.string()),
  psychologicalTags: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileBuilder() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      riskTolerance: 'medium',
      decisionType: 'balanced',
      urgency: 'medium',
      budgetMin: 500000,
      budgetMax: 2000000,
      preferredCities: [],
      preferredTypes: [],
      psychologicalTags: [],
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest('POST', '/api/buyer-profiles', data);
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'ar' ? 'تم إنشاء ملفك الشخصي بنجاح' : 'Profile created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/buyer-profiles/me'] });
      setLocation('/dashboard/matches');
    },
    onError: () => {
      toast({
        title: t('error'),
        description: language === 'ar' ? 'فشل إنشاء الملف الشخصي' : 'Failed to create profile',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  const cities = ['riyadh', 'jeddah', 'dubai', 'abu-dhabi', 'doha'];
  const propertyTypes = ['villa', 'apartment', 'office', 'commercial', 'land'];
  const psychTags = ['value-seeker', 'luxury-oriented', 'investment-focused', 'family-first', 'location-priority'];

  const toggleArrayValue = (field: any, value: string) => {
    const currentValues = field.value || [];
    if (currentValues.includes(value)) {
      field.onChange(currentValues.filter((v: string) => v !== value));
    } else {
      field.onChange([...currentValues, value]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowRight className="w-4 h-4 me-2" />
              {t('dashboard')}
            </Button>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">{t('buildProfile')}</h1>
          <Progress value={(step / totalSteps) * 100} className="h-2" data-testid="progress-profile-builder" />
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? `الخطوة ${step} من ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'تفضيلات الاستثمار' : 'Investment Preferences'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'أخبرنا عن نهجك في الاستثمار' : 'Tell us about your investment approach'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('riskTolerance')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-risk-tolerance">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                            <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                            <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decisionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('decisionType')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-decision-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="analytical">{language === 'ar' ? 'تحليلي' : 'Analytical'}</SelectItem>
                            <SelectItem value="emotional">{language === 'ar' ? 'عاطفي' : 'Emotional'}</SelectItem>
                            <SelectItem value="balanced">{language === 'ar' ? 'متوازن' : 'Balanced'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'ar' ? 'الاستعجال' : 'Urgency'}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-urgency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                            <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                            <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <CardTitle>{language === 'ar' ? 'الميزانية والموقع' : 'Budget & Location'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'حدد ميزانيتك والمواقع المفضلة' : 'Define your budget and preferred locations'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'ar' ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-budget-min"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'ar' ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-budget-max"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredCities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('preferredCities')}</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {cities.map((city) => (
                            <Badge
                              key={city}
                              variant={(field.value || []).includes(city) ? 'default' : 'outline'}
                              className="cursor-pointer hover-elevate"
                              onClick={() => toggleArrayValue(field, city)}
                              data-testid={`badge-city-${city}`}
                            >
                              {(field.value || []).includes(city) && <CheckCircle2 className="w-3 h-3 me-1" />}
                              {city}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('propertyTypes')}</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {propertyTypes.map((type) => (
                            <Badge
                              key={type}
                              variant={(field.value || []).includes(type) ? 'default' : 'outline'}
                              className="cursor-pointer hover-elevate"
                              onClick={() => toggleArrayValue(field, type)}
                              data-testid={`badge-type-${type}`}
                            >
                              {(field.value || []).includes(type) && <CheckCircle2 className="w-3 h-3 me-1" />}
                              {type}
                            </Badge>
                          ))}
                        </div>
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
                  <CardTitle>{language === 'ar' ? 'السمات النفسية' : 'Psychological Profile'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'اختر ما يصف تفضيلاتك' : 'Select what describes your preferences'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="psychologicalTags"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-wrap gap-3">
                          {psychTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={(field.value || []).includes(tag) ? 'default' : 'outline'}
                              className="cursor-pointer hover-elevate px-4 py-2 text-sm"
                              onClick={() => toggleArrayValue(field, tag)}
                              data-testid={`badge-psych-${tag}`}
                            >
                              {(field.value || []).includes(tag) && <CheckCircle2 className="w-4 h-4 me-2" />}
                              {tag.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between gap-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  data-testid="button-prev-step"
                >
                  <ArrowRight className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  data-testid="button-next-step"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                  <ArrowLeft className="w-4 h-4 ms-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createProfileMutation.isPending}
                  data-testid="button-submit-profile"
                >
                  {createProfileMutation.isPending ? t('loading') : t('save')}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
