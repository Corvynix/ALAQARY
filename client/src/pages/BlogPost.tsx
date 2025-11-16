import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function BlogPost() {
  const { t, language } = useLanguage();
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug,
  });

  const getCTAComponent = (relatedFeature: string, ctaLink: string, ctaText: string) => {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
              <h3 className="font-bold text-lg mb-2">
                {ctaText || (language === 'ar' ? 'جرب هذه الميزة الآن' : 'Try this feature now')}
              </h3>
              <p className="text-muted-foreground">
                {relatedFeature === 'ai_closer' && (language === 'ar' 
                  ? 'تحدث مع مساعدنا الذكي للحصول على توصيات مخصصة'
                  : 'Talk to our AI assistant for personalized recommendations')}
                {relatedFeature === 'matching_engine' && (language === 'ar'
                  ? 'اكتشف العقارات المطابقة لتفضيلاتك'
                  : 'Discover properties that match your preferences')}
                {relatedFeature === 'trust_score' && (language === 'ar'
                  ? 'تحقق من درجة ثقة المطورين قبل الشراء'
                  : 'Check developer trust scores before buying')}
                {relatedFeature === 'profile_builder' && (language === 'ar'
                  ? 'ابدأ ببناء ملفك الشخصي للحصول على أفضل التطابقات'
                  : 'Start building your profile for better matches')}
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href={ctaLink || '/dashboard'}>
                {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ع</span>
              </div>
              <span className="font-bold text-xl">عقاري</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button asChild variant="ghost">
              <Link href="/">{t('home')}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/blog">{t('blog')}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/properties">{t('properties')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : post ? (
          <>
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/blog">
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4 ml-2" />
                    {t('backToBlog')}
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('backToBlog')}
                  </>
                )}
              </Link>
            </Button>

            <article>
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.category && (
                    <Badge variant="secondary">
                      {language === 'ar' ? post.category.nameAr : post.category.nameEn || post.category.nameAr}
                    </Badge>
                  )}
                  {post.tags?.map((tag: any) => (
                    <Badge key={tag.id} variant="outline">
                      {language === 'ar' ? tag.nameAr : tag.nameEn || tag.nameAr}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views} {t('views')}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                </h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('publishedOn')} {format(new Date(post.publishedAt), 'dd MMMM yyyy', {
                      locale: language === 'ar' ? ar : undefined,
                    })}
                  </span>
                </div>
              </div>

              {post.coverImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div 
                className="prose prose-lg dark:prose-invert max-w-none mb-8"
                style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                dangerouslySetInnerHTML={{ 
                  __html: (language === 'ar' ? post.contentAr : post.contentEn || post.contentAr)
                    .replace(/\n/g, '<br />')
                }} 
              />

              {post.relatedFeature && post.ctaText && (
                <div className="mt-12">
                  {getCTAComponent(post.relatedFeature, post.ctaLink, post.ctaText)}
                </div>
              )}
            </article>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">{t('noData')}</p>
            <Button asChild>
              <Link href="/blog">{t('backToBlog')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
