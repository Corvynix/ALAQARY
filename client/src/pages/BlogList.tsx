import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function BlogList() {
  const { t, language } = useLanguage();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', { published: true }],
    queryFn: async () => {
      const res = await fetch('/api/blog/posts?published=true');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });

  const featuredPosts = posts?.filter((post: any) => post.featured);
  const regularPosts = posts?.filter((post: any) => !post.featured);

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
              <Link href="/properties">{t('properties')}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">{t('dashboard')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {t('blog')}
          </h1>
          <p className="text-lg text-muted-foreground" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {t('blogTitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : (
          <>
            {featuredPosts && featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {t('featuredPosts')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                        {post.coverImage && (
                          <div className="h-48 overflow-hidden rounded-t-lg">
                            <img 
                              src={post.coverImage} 
                              alt={language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge variant="secondary">
                                {language === 'ar' ? post.category.nameAr : post.category.nameEn || post.category.nameAr}
                              </Badge>
                            )}
                            <Badge variant="outline" className="gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold line-clamp-2" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                            {language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3 mb-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                            {language === 'ar' ? post.excerptAr : post.excerptEn || post.excerptAr}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(post.publishedAt), 'dd MMMM yyyy', {
                                  locale: language === 'ar' ? ar : undefined,
                                })}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              {t('readMore')}
                              <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {regularPosts && regularPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {t('allPosts')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {regularPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                        {post.coverImage && (
                          <div className="h-40 overflow-hidden rounded-t-lg">
                            <img 
                              src={post.coverImage} 
                              alt={language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge variant="secondary" className="text-xs">
                                {language === 'ar' ? post.category.nameAr : post.category.nameEn || post.category.nameAr}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-bold line-clamp-2" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                            {language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                            {language === 'ar' ? post.excerptAr : post.excerptEn || post.excerptAr}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(!posts || posts.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">{t('noData')}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
