import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  TrendingUp,
  Users,
  FileText,
  Settings,
  LogOut,
  Upload,
  BarChart3,
  Wallet,
  Gift,
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();

  const adminMenuItems = [
    {
      title: t("nav.dashboard"),
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "تحميل بيانات السوق",
      url: "/admin/market-upload",
      icon: Upload,
    },
    {
      title: "تحليلات سلوكية",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: t("nav.developers"),
      url: "/admin/developers",
      icon: Building2,
    },
    {
      title: "المدفوعات",
      url: "/admin/payments",
      icon: Wallet,
    },
  ];

  const clientMenuItems = [
    {
      title: t("nav.dashboard"),
      url: "/client",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.consultations"),
      url: "/client/consultations",
      icon: MessageSquare,
    },
    {
      title: t("nav.properties"),
      url: "/client/properties",
      icon: Building2,
    },
    {
      title: t("nav.market"),
      url: "/client/market",
      icon: TrendingUp,
    },
    {
      title: "الملف الشخصي",
      url: "/client/profile",
      icon: Users,
    },
    {
      title: "الإحالات",
      url: "/client/referrals",
      icon: Gift,
    },
  ];

  const developerMenuItems = [
    {
      title: t("nav.dashboard"),
      url: "/developer",
      icon: LayoutDashboard,
    },
    {
      title: "عقاراتي",
      url: "/developer/properties",
      icon: Building2,
    },
    {
      title: "العملاء المحتملون",
      url: "/developer/leads",
      icon: Users,
    },
    {
      title: "نقاط الثقة",
      url: "/developer/trust-score",
      icon: BarChart3,
    },
  ];

  const menuItems = user?.role === 'admin' 
    ? adminMenuItems 
    : user?.role === 'developer' 
    ? developerMenuItems 
    : clientMenuItems;

  const getRoleLabel = () => {
    if (user?.role === 'admin') return 'مدير';
    if (user?.role === 'developer') return 'مطور';
    return 'عميل';
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-sidebar-foreground">منصة الاستشارات</h2>
            <p className="text-xs text-muted-foreground">Real Estate Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.url.replace(/\//g, '-')}`}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-sidebar-foreground truncate">
              {user?.firstName || user?.email}
            </p>
            <Badge variant="secondary" className="text-xs">
              {getRoleLabel()}
            </Badge>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => window.location.href = '/api/logout'}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          {t("nav.logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
