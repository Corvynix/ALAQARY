import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminBlogEditor() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/admin/blog/edit/:id');
  const isEditMode = Boolean(match && params?.id);
  const postId = params?.id;

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    excerptAr: '',
    excerptEn: '',
    contentAr: '',
    contentEn: '',
    categoryId: '',
    coverImage: '',
    tags: '',
    published: false,
    featured: false,
    readingTime: 5,
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/blog/categories'],
    queryFn: async () => {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });

  const { data: existingPost } = useQuery({
    queryKey: [`/api/blog/posts/${postId}`],
    enabled: isEditMode,
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
  });

  useEffect(() => {
    if (existingPost) {
      setFormData({
        titleAr: existingPost.titleAr || '',
        titleEn: existingPost.titleEn || '',
        excerptAr: existingPost.excerptAr || '',
        excerptEn: existingPost.excerptEn || '',
        contentAr: existingPost.contentAr || '',
        contentEn: existingPost.contentEn || '',
        categoryId: existingPost.categoryId || '',
        coverImage: existingPost.coverImage || '',
        tags: existingPost.tags?.join(', ') || '',
        published: existingPost.published || false,
        featured: existingPost.featured || false,
        readingTime: existingPost.readingTime || 5,
      });
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = isEditMode ? `/api/blog/posts/${postId}` : '/api/blog/posts';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: language === 'ar' ? 'تم الحفظ' : 'Saved',
        description: language === 'ar' ? 'تم حفظ المقال بنجاح' : 'Post saved successfully',
      });
      setLocation('/admin');
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to save post',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-lg">
                {isEditMode 
                  ? (language === 'ar' ? 'تعديل المقال' : 'Edit Post')
                  : (language === 'ar' ? 'مقال جديد' : 'New Post')}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button asChild variant="ghost">
              <a href="/api/logout">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'المحتوى العربي' : 'Arabic Content'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="titleAr">{language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      required
                      placeholder="اكتب العنوان هنا..."
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerptAr">{language === 'ar' ? 'المقتطف بالعربية' : 'Excerpt (Arabic)'}</Label>
                    <Textarea
                      id="excerptAr"
                      value={formData.excerptAr}
                      onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                      required
                      placeholder="نبذة مختصرة..."
                      rows={3}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contentAr">{language === 'ar' ? 'المحتوى بالعربية' : 'Content (Arabic)'}</Label>
                    <Textarea
                      id="contentAr"
                      value={formData.contentAr}
                      onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                      required
                      placeholder="المحتوى الكامل للمقال..."
                      rows={15}
                      className="text-right font-sans"
                      dir="rtl"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'المحتوى الإنجليزي (اختياري)' : 'English Content (Optional)'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Enter title here..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                    <Textarea
                      id="excerptEn"
                      value={formData.excerptEn}
                      onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                      placeholder="Short summary..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contentEn">Content (English)</Label>
                    <Textarea
                      id="contentEn"
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      placeholder="Full content..."
                      rows={15}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'الإعدادات' : 'Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">{language === 'ar' ? 'الفئة' : 'Category'}</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select category'} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {language === 'ar' ? cat.nameAr : cat.nameEn || cat.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="coverImage">{language === 'ar' ? 'صورة الغلاف (URL)' : 'Cover Image (URL)'}</Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">{language === 'ar' ? 'الوسوم' : 'Tags'}</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder={language === 'ar' ? 'عقارات، استثمار، نصائح' : 'real estate, investment, tips'}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'افصل بين الوسوم بفواصل' : 'Separate tags with commas'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="readingTime">{language === 'ar' ? 'وقت القراءة (دقائق)' : 'Reading Time (minutes)'}</Label>
                    <Input
                      id="readingTime"
                      type="number"
                      value={formData.readingTime}
                      onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 5 })}
                      min="1"
                      max="60"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">{language === 'ar' ? 'منشور' : 'Published'}</Label>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">{language === 'ar' ? 'مميز' : 'Featured'}</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'الإجراءات' : 'Actions'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={saveMutation.isPending}
                  >
                    <Save className="w-4 h-4" />
                    {saveMutation.isPending 
                      ? (language === 'ar' ? 'جارٍ الحفظ...' : 'Saving...')
                      : (language === 'ar' ? 'حفظ المقال' : 'Save Post')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    asChild
                  >
                    <Link href="/admin">
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Link>
                  </Button>

                  {isEditMode && existingPost && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full gap-2"
                      asChild
                    >
                      <Link href={`/blog/${existingPost.slug}`}>
                        <Eye className="w-4 h-4" />
                        {language === 'ar' ? 'معاينة' : 'Preview'}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
