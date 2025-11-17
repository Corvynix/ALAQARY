import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { X } from 'lucide-react';

export function clearNonEssentialCookies() {
  const cookies = document.cookie.split(';');
  const essentialCookies = ['connect.sid', 'session'];
  
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    
    if (!essentialCookies.includes(cookieName)) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }
  });
  
  const storageKeys = Object.keys(localStorage);
  storageKeys.forEach(key => {
    if (!['cookieConsent', 'theme', 'language'].includes(key)) {
      localStorage.removeItem(key);
    }
  });
}

export function hasUserConsent(): boolean {
  return localStorage.getItem('cookieConsent') === 'accepted';
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useI18n();
  const isRTL = language === 'ar';

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
      clearNonEssentialCookies();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    clearNonEssentialCookies();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg border-2">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'نستخدم ملفات تعريف الارتباط' : 'We Use Cookies'}
            </h3>
            <p className="text-sm text-foreground/80 mb-4">
              {isRTL
                ? 'نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك على منصتنا، لتذكر تفضيلاتك، ولتحليل كيفية استخدام موقعنا. باستخدام منصتنا، فإنك توافق على استخدامنا لملفات تعريف الارتباط وفقًا لسياسة الخصوصية الخاصة بنا.'
                : 'We use cookies to enhance your experience on our platform, remember your preferences, and analyze how you use our site. By using our platform, you consent to our use of cookies in accordance with our Privacy Policy.'
              }
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleAccept}
                size="sm"
                data-testid="button-accept-cookies"
              >
                {isRTL ? 'موافق' : 'Accept'}
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                data-testid="button-decline-cookies"
              >
                {isRTL ? 'رفض' : 'Decline'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href="/privacy-policy" data-testid="link-privacy-policy">
                  {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </a>
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecline}
            className="shrink-0"
            data-testid="button-close-cookies"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
