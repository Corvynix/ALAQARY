import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Content } from "@shared/schema";

export default function BlogPage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  const { data: blogPosts = [], isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      <Header 
        language={language} 
        onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
      />

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 
            className={`text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : 'font-serif'}`}
          >
            {language === "ar" ? "مدونة الوعي العقاري" : "Real Estate Insights Blog"}
          </h1>
          
          <p className={`text-center text-white/70 mb-12 max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === "ar" 
              ? "مقالات ونصائح لتحويل قراراتك العقارية إلى قرارات ثروة" 
              : "Articles and tips to transform your real estate decisions into wealth"}
          </p>

          {isLoading ? (
            <div className="text-center py-20">
              <p className={`text-white/60 text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-white/60 text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === "ar" ? "لا توجد مقالات حالياً" : "No articles available"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="bg-black/40 border-primary/20 hover:border-primary/40 transition-all duration-300 hover-elevate cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className={`text-xl bg-gradient-to-r from-[#d9a543] via-[#f4e4b5] to-[#d9a543] text-transparent bg-clip-text ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === "ar" ? post.title : post.titleEn || post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-white/70 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === "ar" ? post.body : post.bodyEn || post.body}
                    </p>
                    {post.category && (
                      <div className="mt-4">
                        <span className="inline-block px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
