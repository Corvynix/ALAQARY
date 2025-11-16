import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Building2, Home, FileText, BarChart3, Edit, Trash2, Plus,
  Eye, TrendingUp, MessageSquare, ShieldCheck
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalDevelopers: number;
  totalProperties: number;
  totalSessions: number;
  avgPurchaseProbability: number;
  highRiskProperties: number;
}

export default function AdminPanel() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  const { data: properties } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
  });

  const { data: blogPosts } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog/posts');
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      return res.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/blog/categories'],
    queryFn: async () => {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });

  const deleteBlogPost = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: language === 'ar' ? 'تم الحذف' : 'Deleted',
        description: language === 'ar' ? 'تم حذف المقال بنجاح' : 'Post deleted successfully',
      });
    },
  });

  const toggleBlogPublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">ع</span>
                </div>
                <span className="font-bold text-xl">عقاري</span>
                <Badge variant="secondary" className="ml-2">Admin</Badge>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <LanguageToggle />
            <Button asChild variant="ghost">
              <a href="/api/logout">{t('logout')}</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {language === 'ar' ? 'لوحة التحكم الإدارية' : 'Admin Control Panel'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {language === 'ar' ? 'إدارة شاملة لجميع جوانب المنصة' : 'Comprehensive management for all platform aspects'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Home className="w-4 h-4" />
              {language === 'ar' ? 'العقارات' : 'Properties'}
            </TabsTrigger>
            <TabsTrigger value="developers" className="gap-2">
              <Building2 className="w-4 h-4" />
              {language === 'ar' ? 'المطورين' : 'Developers'}
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="w-4 h-4" />
              {language === 'ar' ? 'المدونة' : 'Blog'}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              {language === 'ar' ? 'المستخدمين' : 'Users'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover-elevate transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('users')}</CardTitle>
                  <Users className="h-5 w-5 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' ? 'إجمالي المستخدمين' : 'Total users'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('properties')}</CardTitle>
                  <Home className="h-5 w-5 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalProperties || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' ? 'عقار مدرج' : 'Listed properties'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'ar' ? 'جلسات AI' : 'AI Sessions'}</CardTitle>
                  <MessageSquare className="h-5 w-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalSessions || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' ? 'جلسة نشطة' : 'Active sessions'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'ar' ? 'معدل التحويل' : 'Conversion'}</CardTitle>
                  <TrendingUp className="h-5 w-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats?.avgPurchaseProbability ? `${Math.round(stats.avgPurchaseProbability)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' ? 'احتمالية الشراء' : 'Purchase probability'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{language === 'ar' ? 'عقار جديد' : 'New Property'}</p>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'منذ ساعة' : '1 hour ago'}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{language === 'ar' ? 'جديد' : 'New'}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-chart-2/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-chart-2" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{language === 'ar' ? 'مستخدم جديد' : 'New User'}</p>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'منذ ساعتين' : '2 hours ago'}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{language === 'ar' ? 'مشتري' : 'Buyer'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{language === 'ar' ? 'معدل التفاعل' : 'Engagement Rate'}</span>
                        <span className="text-sm font-bold text-primary">78%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{language === 'ar' ? 'رضا المستخدمين' : 'User Satisfaction'}</span>
                        <span className="text-sm font-bold text-chart-2">92%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-chart-2 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{language === 'ar' ? 'جودة البيانات' : 'Data Quality'}</span>
                        <span className="text-sm font-bold text-chart-3">95%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-chart-3 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{language === 'ar' ? 'إدارة العقارات' : 'Properties Management'}</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة عقار' : 'Add Property'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المدينة' : 'City'}</TableHead>
                      <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties?.slice(0, 10).map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {language === 'ar' ? property.titleAr : property.title}
                        </TableCell>
                        <TableCell>{property.city}</TableCell>
                        <TableCell>{property.price.toLocaleString()} EGP</TableCell>
                        <TableCell>
                          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{language === 'ar' ? 'إدارة المدونة' : 'Blog Management'}</CardTitle>
                  <Button asChild size="sm" className="gap-2">
                    <Link href="/admin/blog/new">
                      <Plus className="w-4 h-4" />
                      {language === 'ar' ? 'مقال جديد' : 'New Post'}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts?.map((post: any) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {post.featured && (
                              <ShieldCheck className="w-4 h-4 text-primary" />
                            )}
                            {language === 'ar' ? post.titleAr : post.titleEn || post.titleAr}
                          </div>
                        </TableCell>
                        <TableCell>
                          {post.category && (
                            <Badge variant="outline">
                              {language === 'ar' ? post.category.nameAr : post.category.nameEn || post.category.nameAr}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {post.views}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={post.published ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleBlogPublished.mutate({ id: post.id, published: post.published })}
                          >
                            {post.published ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" asChild>
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => {
                                if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this post?')) {
                                  deleteBlogPost.mutate(post.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'إدارة المطورين' : 'Developers Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'عرض وإدارة جميع المطورين العقاريين المسجلين' : 'View and manage all registered real estate developers'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'عرض وإدارة جميع المستخدمين' : 'View and manage all users'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
