import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";

interface ContactFormProps {
  language: "ar" | "en";
  onSubmit: (data: any) => void;
}

export default function ContactForm({ language, onSubmit }: ContactFormProps) {
  const { trackFormInteraction, trackFormSubmit } = useFunnelTracking();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    purpose: "",
    city: "",
    budget: "",
    message: ""
  });

  useEffect(() => {
    trackFormInteraction("contact_form");
  }, [trackFormInteraction]);

  const content = {
    ar: {
      title: "ابدأ استشارتك المجانية",
      subtitle: "كل استشارة بتبدأ بفهم هدفك مش ميزانيتك",
      name: "الاسم",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني (اختياري)",
      purpose: "الغرض",
      purposeBuy: "شراء",
      purposeSell: "بيع",
      purposeInvest: "استثمار",
      city: "المدينة المفضلة",
      budget: "الميزانية التقريبية",
      message: "رسالتك",
      submit: "أرسل طلبك",
      trustMessage: "معلوماتك في أمان تام"
    },
    en: {
      title: "Start Your Free Consultation",
      subtitle: "Every consultation starts with understanding your goal, not your budget",
      name: "Name",
      phone: "Phone Number",
      email: "Email (Optional)",
      purpose: "Purpose",
      purposeBuy: "Buy",
      purposeSell: "Sell",
      purposeInvest: "Invest",
      city: "Preferred City",
      budget: "Approximate Budget",
      message: "Your Message",
      submit: "Submit Request",
      trustMessage: "Your information is completely secure"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Track form submission before submitting
      trackFormSubmit("contact_form");
      
      // Submit form (which will create lead and return leadId)
      onSubmit(formData);
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    trackFormInteraction("contact_form", fieldName);
  };

  return (
    <section id="contact-form" className="py-20 px-6 bg-gradient-to-b from-[#0d0d0d] to-black" data-testid="section-contact">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-black/90 to-[#0d0d0d]/90 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className={`text-3xl font-bold bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
              {content[language].title}
            </CardTitle>
            <CardDescription className={`text-lg text-white/70 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{content[language].name}</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => handleFieldFocus("name")}
                  data-testid="input-name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {content[language].phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => handleFieldFocus("phone")}
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    {content[language].email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{content[language].purpose}</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                    <SelectTrigger data-testid="select-purpose">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">{content[language].purposeBuy}</SelectItem>
                      <SelectItem value="sell">{content[language].purposeSell}</SelectItem>
                      <SelectItem value="invest">{content[language].purposeInvest}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{content[language].city}</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    data-testid="input-city"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">{content[language].budget}</Label>
                <Input
                  id="budget"
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  data-testid="input-budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  {content[language].message}
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  data-testid="textarea-message"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg h-12"
                data-testid="button-submit"
              >
                {content[language].submit}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                🔒 {content[language].trustMessage}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
