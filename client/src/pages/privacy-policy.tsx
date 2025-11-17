import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPolicy() {
  const { language } = useI18n();
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">
          {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isRTL ? 'آخر تحديث: 17 نوفمبر 2025' : 'Last Updated: November 17, 2025'}
        </p>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '1. مقدمة' : '1. Introduction'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL 
                ? 'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا للاستشارات العقارية.'
                : 'We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our real estate consultancy platform.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '2. البيانات التي نجمعها' : '2. Information We Collect'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li>{isRTL ? 'الاسم الكامل' : 'Full name'}</li>
                  <li>{isRTL ? 'عنوان البريد الإلكتروني' : 'Email address'}</li>
                  <li>{isRTL ? 'رقم الهاتف' : 'Phone number'}</li>
                  <li>{isRTL ? 'المدينة والمنطقة المفضلة' : 'City and preferred region'}</li>
                  <li>{isRTL ? 'الميزانية وتفضيلات الاستثمار' : 'Budget and investment preferences'}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'البيانات التقنية' : 'Technical Data'}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li>{isRTL ? 'عنوان IP' : 'IP address'}</li>
                  <li>{isRTL ? 'نوع المتصفح والإصدار' : 'Browser type and version'}</li>
                  <li>{isRTL ? 'نظام التشغيل' : 'Operating system'}</li>
                  <li>{isRTL ? 'ملفات تعريف الارتباط (Cookies)' : 'Cookies and session data'}</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '3. كيفية استخدام بياناتك' : '3. How We Use Your Data'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>{isRTL ? 'لتوفير خدمات الاستشارات العقارية' : 'To provide real estate consultancy services'}</li>
              <li>{isRTL ? 'لمعالجة الحجوزات والمدفوعات' : 'To process bookings and payments'}</li>
              <li>{isRTL ? 'لمطابقتك مع العقارات والمطورين المناسبين' : 'To match you with suitable properties and developers'}</li>
              <li>{isRTL ? 'للتواصل معك بخصوص استشاراتك' : 'To communicate with you about your consultations'}</li>
              <li>{isRTL ? 'لتحسين منصتنا وخدماتنا' : 'To improve our platform and services'}</li>
              <li>{isRTL ? 'للامتثال للمتطلبات القانونية' : 'To comply with legal requirements'}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '4. مشاركة البيانات' : '4. Data Sharing'}
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              {isRTL
                ? 'لن نبيع بياناتك الشخصية مطلقًا. قد نشارك معلوماتك مع:'
                : 'We will never sell your personal data. We may share your information with:'
              }
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>{isRTL ? 'المطورين العقاريين المعتمدين على منصتنا' : 'Verified property developers on our platform'}</li>
              <li>{isRTL ? 'مقدمي خدمات الدفع (Vodafone Cash)' : 'Payment processors (Vodafone Cash)'}</li>
              <li>{isRTL ? 'مقدمي الخدمات التقنية لتشغيل المنصة' : 'Technical service providers who operate our platform'}</li>
              <li>{isRTL ? 'السلطات القانونية عند الحاجة' : 'Legal authorities when required by law'}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '5. حقوقك' : '5. Your Rights'}
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              {isRTL ? 'لديك الحق في:' : 'You have the right to:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>{isRTL ? 'الوصول إلى بياناتك الشخصية' : 'Access your personal data'}</li>
              <li>{isRTL ? 'تصحيح البيانات غير الدقيقة' : 'Correct inaccurate data'}</li>
              <li>{isRTL ? 'طلب حذف بياناتك' : 'Request deletion of your data'}</li>
              <li>{isRTL ? 'الاعتراض على معالجة بياناتك' : 'Object to data processing'}</li>
              <li>{isRTL ? 'سحب الموافقة في أي وقت' : 'Withdraw consent at any time'}</li>
              <li>{isRTL ? 'طلب نقل بياناتك' : 'Request data portability'}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '6. الأمان' : '6. Security'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'نستخدم تدابير أمنية تقنية وتنظيمية مناسبة لحماية بياناتك، بما في ذلك التشفير وضوابط الوصول الآمنة وعمليات التدقيق المنتظمة.'
                : 'We use appropriate technical and organizational security measures to protect your data, including encryption, secure access controls, and regular security audits.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '7. الاحتفاظ بالبيانات' : '7. Data Retention'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'نحتفظ ببياناتك الشخصية طالما كان حسابك نشطًا أو حسب الحاجة لتقديم خدماتنا. يمكنك طلب حذف حسابك في أي وقت.'
                : 'We retain your personal data for as long as your account is active or as needed to provide our services. You may request account deletion at any time.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '8. ملفات تعريف الارتباط' : '8. Cookies'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. يمكنك التحكم في تفضيلات ملفات تعريف الارتباط في إعدادات متصفحك.'
                : 'We use cookies to enhance your platform experience. You can control cookie preferences through your browser settings.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '9. التحديثات على هذه السياسة' : '9. Updates to This Policy'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.'
                : 'We may update this privacy policy from time to time. We will notify you of any material changes via email or through a notice on our platform.'
              }
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isRTL ? '10. اتصل بنا' : '10. Contact Us'}
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              {isRTL
                ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو بياناتك الشخصية، يرجى الاتصال بنا على:'
                : 'If you have any questions about this privacy policy or your personal data, please contact us at:'
              }
            </p>
            <p className="mt-4 text-foreground/90">
              Email: privacy@realestate-consultancy.com
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
