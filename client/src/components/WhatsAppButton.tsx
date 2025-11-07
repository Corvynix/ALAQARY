import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  language: "ar" | "en";
}

export default function WhatsAppButton({ phoneNumber, message, language }: WhatsAppButtonProps) {
  const defaultMessage = language === "ar"
    ? "مرحباً، أود الاستفسار عن الاستشارات العقارية"
    : "Hello, I'd like to inquire about real estate consultation";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || defaultMessage)}`;

  return (
    <Button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 p-0"
      onClick={() => window.open(whatsappUrl, '_blank')}
      data-testid="button-whatsapp"
      title="WhatsApp"
    >
      <SiWhatsapp className="h-7 w-7" />
    </Button>
  );
}
