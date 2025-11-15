import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  Send
} from "lucide-react";

export default function AIBrainPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    ar: {
      title: "العقل العقاري الذكي",
      subtitle: "مدعوم بالذكاء الاصطناعي لمساعدتك في اتخاذ القرارات الصحيحة",
      askQuestion: "اسأل أي سؤال عقاري",
      placeholder: "مثال: ما هي أفضل المناطق للاستثمار العقاري في القاهرة؟",
      send: "إرسال",
      recommendations: "توصيات ذكية",
      objections: "معالجة الاعتراضات",
      insights: "رؤى السوق",
      suggestions: "اقتراحات شائعة",
      processing: "جاري المعالجة...",
      features: [
        {
          title: "توصيات مخصصة",
          description: "احصل على توصيات عقارية بناءً على احتياجاتك",
          icon: Target
        },
        {
          title: "معالجة الاعتراضات",
          description: "حلول ذكية للتعامل مع اعتراضات العملاء",
          icon: Shield
        },
        {
          title: "تحليل السوق",
          description: "رؤى عميقة حول اتجاهات السوق العقاري",
          icon: TrendingUp
        },
        {
          title: "إجابات شخصية",
          description: "إجابات مصممة خصيصاً حسب دورك وأهدافك",
          icon: Sparkles
        }
      ],
      commonQuestions: [
        "ما هي أفضل المناطق للاستثمار حالياً؟",
        "كيف أتعامل مع اعتراض 'السعر مرتفع'؟",
        "ما هو التوقيت المثالي لشراء عقار؟",
        "كيف أقيم جودة مشروع عقاري؟"
      ]
    },
    en: {
      title: "AI Real Estate Brain",
      subtitle: "Powered by AI to help you make the right decisions",
      askQuestion: "Ask any real estate question",
      placeholder: "Example: What are the best areas for real estate investment in Cairo?",
      send: "Send",
      recommendations: "Smart Recommendations",
      objections: "Objection Handling",
      insights: "Market Insights",
      suggestions: "Common Questions",
      processing: "Processing...",
      features: [
        {
          title: "Personalized Recommendations",
          description: "Get property recommendations based on your needs",
          icon: Target
        },
        {
          title: "Objection Handling",
          description: "Smart solutions for handling client objections",
          icon: Shield
        },
        {
          title: "Market Analysis",
          description: "Deep insights into real estate market trends",
          icon: TrendingUp
        },
        {
          title: "Personalized Answers",
          description: "Answers tailored to your role and goals",
          icon: Sparkles
        }
      ],
      commonQuestions: [
        "What are the best areas for investment right now?",
        "How do I handle the 'price is too high' objection?",
        "What is the ideal timing to buy property?",
        "How do I evaluate a real estate project quality?"
      ]
    }
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const response = await fetch("/api/ai/brain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      setResponse(data.response || (language === 'ar' 
        ? "عذراً، لم يتم الحصول على إجابة. يرجى المحاولة مرة أخرى."
        : "Sorry, no response received. Please try again."));
    } catch (error: any) {
      console.error("Error calling AI Brain API:", error);
      setResponse(language === 'ar' 
        ? `حدث خطأ: ${error.message || "فشل في الحصول على إجابة من الذكاء الاصطناعي"}`
        : `Error: ${error.message || "Failed to get AI response"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].title}
            </h1>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
              {content[language].subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content[language].features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} data-testid={`card-feature-${idx}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className={`text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {feature.title}
                      </CardTitle>
                    </div>
                    <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <MessageSquare className="h-5 w-5" />
                {content[language].askQuestion}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder={content[language].placeholder}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={`min-h-[100px] ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                  data-testid="textarea-question"
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading || !question.trim()}
                  className="w-full"
                  data-testid="button-submit-question"
                >
                  {isLoading ? content[language].processing : content[language].send}
                  {!isLoading && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </div>

              {response && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2 mb-2">
                      <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div className={`flex-1 whitespace-pre-wrap ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                        {response}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Lightbulb className="h-5 w-5" />
                {content[language].suggestions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {content[language].commonQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`justify-start text-left h-auto py-3 px-4 hover-elevate ${language === 'ar' ? 'font-arabic' : ''}`}
                    onClick={() => setQuestion(q)}
                    data-testid={`button-question-${idx}`}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
