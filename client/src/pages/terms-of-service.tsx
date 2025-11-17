import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export default function TermsOfService() {
  const { language } = useI18n();
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">
          {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isRTL ? 'آخر تحديث: 17 نوفمبر 2025' : 'Last Updated: November 17, 2025'}
        </p>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '1. قبول الشروط' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'باستخدام منصتنا للاستشارات العقارية، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام منصتنا.'
                : 'By using our real estate consultancy platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '2. الخدمات المقدمة' : '2. Services Provided'}
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              {isRTL
                ? 'نحن نقدم منصة تربط العملاء بمستشاري العقارات والمطورين المعتمدين. خدماتنا تشمل:'
                : 'We provide a platform connecting clients with real estate consultants and verified developers. Our services include:'
              }
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>{isRTL ? 'حجز استشارات عقارية (رسوم 200 جنيه مصري)' : 'Booking real estate consultations (200 EGP fee)'}</li>
              <li>{isRTL ? 'الوصول إلى قوائم العقارات المعتمدة' : 'Access to verified property listings'}</li>
              <li>{isRTL ? 'رؤى السوق المدعومة بالذكاء الاصطناعي' : 'AI-powered market insights'}</li>
              <li>{isRTL ? 'التوفيق مع المطورين والعقارات المناسبة' : 'Matching with suitable developers and properties'}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '3. رسوم الاستشارة والعمولة' : '3. Consultation Fees & Commission'}
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p className="leading-relaxed">
                {isRTL
                  ? 'رسوم الاستشارة الأولية: 200 جنيه مصري لكل استشارة'
                  : 'Initial consultation fee: 200 EGP per consultation'
                }
              </p>
              <p className="leading-relaxed">
                {isRTL
                  ? 'عمولة المنصة: نكسب عمولة بنسبة 2٪ على الصفقات المكتملة من خلال منصتنا'
                  : 'Platform commission: We earn a 2% commission on deals completed through our platform'
                }
              </p>
              <p className="leading-relaxed">
                {isRTL
                  ? 'جميع الرسوم غير قابلة للاسترداد ما لم يتم تحديد خلاف ذلك في سياسة الاسترداد الخاصة بنا'
                  : 'All fees are non-refundable unless otherwise specified in our refund policy'
                }
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '4. مسؤوليات المستخدم' : '4. User Responsibilities'}
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              {isRTL ? 'أنت توافق على:' : 'You agree to:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>{isRTL ? 'تقديم معلومات دقيقة وصحيحة' : 'Provide accurate and truthful information'}</li>
              <li>{isRTL ? 'الحفاظ على سرية حسابك' : 'Maintain the confidentiality of your account'}</li>
              <li>{isRTL ? 'استخدام المنصة للأغراض المشروعة فقط' : 'Use the platform for lawful purposes only'}</li>
              <li>{isRTL ? 'عدم محاولة تجاوز نظام المنصة' : 'Not attempt to bypass the platform system'}</li>
              <li>{isRTL ? 'احترام جميع القوانين واللوائح المعمول بها' : 'Respect all applicable laws and regulations'}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '5. منع التجاوز' : '5. Bypass Prevention'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'يحظر الاتصال المباشر بالمطورين أو المستشارين خارج المنصة بهدف تجنب عمولتنا. قد يؤدي انتهاك هذه السياسة إلى إنهاء الحساب وإجراءات قانونية.'
                : 'Direct contact with developers or consultants outside the platform to avoid our commission is prohibited. Violation of this policy may result in account termination and legal action.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '6. سياسة الاسترداد' : '6. Refund Policy'}
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p className="leading-relaxed">
                {isRTL
                  ? 'رسوم الاستشارة غير قابلة للاسترداد بمجرد تأكيد الحجز'
                  : 'Consultation fees are non-refundable once booking is confirmed'
                }
              </p>
              <p className="leading-relaxed">
                {isRTL
                  ? 'في حالة إلغاء المستشار للاستشارة، سيتم استرداد المبلغ بالكامل'
                  : 'In case of consultant cancellation, full refund will be provided'
                }
              </p>
              <p className="leading-relaxed">
                {isRTL
                  ? 'يتم معالجة المبالغ المستردة خلال 7-14 يوم عمل'
                  : 'Refunds are processed within 7-14 business days'
                }
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '7. إخلاء المسؤولية' : '7. Disclaimer'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'نحن نوفر منصة للربط بين العملاء والمطورين. لسنا مسؤولين عن جودة الخدمات المقدمة من المطورين أو نتائج المعاملات العقارية. نحن لا نضمن دقة قوائم العقارات أو بيانات السوق.'
                : 'We provide a platform connecting clients and developers. We are not responsible for the quality of services provided by developers or the outcome of real estate transactions. We do not guarantee the accuracy of property listings or market data.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '8. حدود المسؤولية' : '8. Limitation of Liability'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناتجة عن استخدامك للمنصة. مسؤوليتنا القصوى محدودة بمبلغ رسوم الاستشارة المدفوعة.'
                : 'We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our maximum liability is limited to the consultation fee paid.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '9. إنهاء الحساب' : '9. Account Termination'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت بسبب انتهاك هذه الشروط أو سوء السلوك أو نشاط احتيالي.'
                : 'We reserve the right to suspend or terminate your account at any time for violation of these terms, misconduct, or fraudulent activity.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '10. التغييرات على الشروط' : '10. Changes to Terms'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'قد نقوم بتحديث شروط الخدمة هذه من وقت لآخر. استمرارك في استخدام المنصة بعد التغييرات يشكل قبولك للشروط الجديدة.'
                : 'We may update these Terms of Service from time to time. Your continued use of the platform after changes constitutes acceptance of the new terms.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '11. القانون الحاكم' : '11. Governing Law'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'تخضع هذه الشروط وتفسر وفقًا لقوانين جمهورية مصر العربية. تخضع أي نزاعات للاختصاص القضائي الحصري لمحاكم القاهرة.'
                : 'These terms are governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes are subject to the exclusive jurisdiction of the courts of Cairo.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '12. اتصل بنا' : '12. Contact Us'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا على:'
                : 'If you have any questions about these Terms of Service, please contact us at:'
              }
            </p>
            <p className="mt-4 text-foreground/90">
              Email: legal@realestate-consultancy.com
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
