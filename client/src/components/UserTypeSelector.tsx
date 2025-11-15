import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  Home, 
  Database 
} from "lucide-react";

export type UserType = "agent" | "developer" | "client" | "contributor" | null;

interface UserTypeSelectorProps {
  language: "ar" | "en";
  onSelectUserType: (type: UserType) => void;
  selectedType: UserType;
}

export default function UserTypeSelector({ 
  language, 
  onSelectUserType, 
  selectedType 
}: UserTypeSelectorProps) {
  const [, setLocation] = useLocation();
  
  const handleCardClick = (type: UserType) => {
    onSelectUserType(type);
    if (type) {
      setLocation(`/register?role=${type}`);
    }
  };
  
  const content = {
    ar: {
      title: "من أنت؟",
      subtitle: "اختر نوع الحساب المناسب لك لتحصل على تجربة مخصصة",
      types: [
        {
          id: "agent" as UserType,
          title: "مستشار عقاري",
          subtitle: "Agent",
          description: "أحصل على عملاء حقيقيين وأدوات ذكية",
          icon: Users
        },
        {
          id: "developer" as UserType,
          title: "شركة - مطور عقاري",
          subtitle: "Developer / Broker",
          description: "بيانات السوق لإطلاق مشاريع ناجحة",
          icon: Building2
        },
        {
          id: "client" as UserType,
          title: "مشتري / مستثمر",
          subtitle: "Client",
          description: "اعثر على العقار المثالي بذكاء اصطناعي",
          icon: Home
        },
        {
          id: "contributor" as UserType,
          title: "مالك عقار أو معلومة",
          subtitle: "Data Contributor",
          description: "اربح من مشاركة البيانات العقارية",
          icon: Database
        }
      ]
    },
    en: {
      title: "Who are you?",
      subtitle: "Choose your account type for a personalized experience",
      types: [
        {
          id: "agent" as UserType,
          title: "Real Estate Agent",
          subtitle: "Agent",
          description: "Get real leads and smart tools",
          icon: Users
        },
        {
          id: "developer" as UserType,
          title: "Developer / Broker",
          subtitle: "Developer",
          description: "Market data for successful projects",
          icon: Building2
        },
        {
          id: "client" as UserType,
          title: "Buyer / Investor",
          subtitle: "Client",
          description: "Find your ideal property with AI",
          icon: Home
        },
        {
          id: "contributor" as UserType,
          title: "Property Owner / Data Provider",
          subtitle: "Contributor",
          description: "Earn from sharing property data",
          icon: Database
        }
      ]
    }
  };

  const types = content[language].types;

  return (
    <section 
      className="py-24 px-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black relative overflow-hidden"
      data-testid="section-user-type-selector"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 
            className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text no-underline decoration-none ${
              language === 'ar' ? 'font-arabic' : 'font-serif'
            }`}
            style={{ textDecoration: 'none' }}
            data-testid="text-selector-title"
          >
            {content[language].title}
          </h2>
          <p 
            className={`text-xl text-muted-foreground max-w-2xl mx-auto ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
            data-testid="text-selector-subtitle"
          >
            {content[language].subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card
                key={type.id}
                className={`relative p-8 cursor-pointer transition-all duration-300 border-2 hover-elevate ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/20' 
                    : 'border-border/50 bg-card/50'
                }`}
                onClick={() => handleCardClick(type.id)}
                data-testid={`card-user-type-${type.id}`}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div 
                    className={`p-4 rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-primary/10 text-primary/60'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 
                      className={`text-xl font-bold mb-1 ${
                        language === 'ar' ? 'font-arabic' : ''
                      } ${isSelected ? 'text-primary' : 'text-foreground'}`}
                      data-testid={`text-type-title-${type.id}`}
                    >
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {type.subtitle}
                    </p>
                    <p 
                      className={`text-sm ${
                        language === 'ar' ? 'font-arabic' : ''
                      } ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {type.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary-foreground"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
