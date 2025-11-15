import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initial: string;
}

interface TestimonialCarouselProps {
  language: "ar" | "en";
  testimonials: Testimonial[];
  onView?: () => void;
}

export default function TestimonialCarousel({ language, testimonials, onView }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Track when testimonials section is viewed
    if (onView) {
      onView();
    }
  }, [onView]);

  const content = {
    ar: {
      title: "ماذا يقول عملائنا"
    },
    en: {
      title: "What Our Clients Say"
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black" data-testid="section-testimonials">
      <div className="max-w-4xl mx-auto">
        <h2 
          className={`text-5xl md:text-6xl font-bold text-center mb-16 heading-gold ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          data-testid="text-testimonials-title"
        >
          {content[language].title}
        </h2>

        <Card className="relative">
          <CardContent className="pt-12 pb-8 px-8">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/20" />
            
            <div className="space-y-6">
              <p 
                className={`text-lg leading-relaxed ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                data-testid="text-testimonial-content"
              >
                {current.content}
              </p>

              <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Avatar data-testid="avatar-testimonial">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {current.initial}
                  </AvatarFallback>
                </Avatar>
                <div className={language === 'ar' ? 'text-right' : ''}>
                  <div className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`} data-testid="text-testimonial-name">
                    {current.name}
                  </div>
                  <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {current.role}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={previous}
            data-testid="button-testimonial-previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border'
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`button-testimonial-dot-${index}`}
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon"
            onClick={next}
            data-testid="button-testimonial-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
