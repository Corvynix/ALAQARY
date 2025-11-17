import { Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { SkipToContent } from "@/components/skip-to-content";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// Eager load critical pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AdminLogin from "@/pages/admin-login";

// Lazy load other pages for better performance
const ClientDashboard = lazy(() => import("@/pages/client-dashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const DeveloperDashboard = lazy(() => import("@/pages/developer-dashboard"));
const ClientConsultations = lazy(() => import("@/pages/client-consultations"));
const ClientBooking = lazy(() => import("@/pages/client-booking"));
const ClientProperties = lazy(() => import("@/pages/client-properties"));
const ClientMarket = lazy(() => import("@/pages/client-market"));
const ClientProfile = lazy(() => import("@/pages/client-profile"));
const ClientReferrals = lazy(() => import("@/pages/client-referrals"));
const AdminMarketUpload = lazy(() => import("@/pages/admin-market-upload"));
const AdminAnalytics = lazy(() => import("@/pages/admin-analytics"));
const AdminDevelopers = lazy(() => import("@/pages/admin-developers"));
const AdminPayments = lazy(() => import("@/pages/admin-payments"));
const AdminUsers = lazy(() => import("@/pages/admin-users"));
const AdminCMS = lazy(() => import("@/pages/admin-cms"));
const AdminConsultations = lazy(() => import("@/pages/admin-consultations"));
const DeveloperProperties = lazy(() => import("@/pages/developer-properties"));
const DeveloperLeads = lazy(() => import("@/pages/developer-leads"));
const DeveloperTrustScore = lazy(() => import("@/pages/developer-trust-score"));

// Loading fallback component for suspense boundaries
function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
      <div className="text-center space-y-4">
        <div 
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"
          aria-label="Loading page"
        />
        <p className="text-sm text-muted-foreground">Loading / جاري التحميل...</p>
      </div>
    </div>
  );
}

// Admin Routes Wrapper - checks admin session authentication
function AdminRoutes() {
  const [location, navigate] = useLocation();
  const { isAdminAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
        <div className="text-center space-y-4">
          <div 
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" 
            aria-label="Loading"
          />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <SkipToContent />
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background" role="banner">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main id="main-content" className="flex-1 overflow-auto" role="main">
            <Suspense fallback={<PageLoadingFallback />}>
              <Switch>
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/users" component={AdminUsers} />
                <Route path="/admin/cms" component={AdminCMS} />
                <Route path="/admin/consultations" component={AdminConsultations} />
                <Route path="/admin/market-upload" component={AdminMarketUpload} />
                <Route path="/admin/analytics" component={AdminAnalytics} />
                <Route path="/admin/developers" component={AdminDevelopers} />
                <Route path="/admin/payments" component={AdminPayments} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Admin routes use separate authentication
  if (location.startsWith('/admin')) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/:rest*">
          <AdminRoutes />
        </Route>
      </Switch>
    );
  }

  // Replit Auth for client/developer routes
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
        <div className="text-center space-y-4">
          <div 
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" 
            aria-label="Loading application"
          />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/booking">
          <Suspense fallback={<PageLoadingFallback />}>
            <ClientBooking />
          </Suspense>
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated users with role-based dashboards
  const dashboardRoute = user?.role === 'developer' ? '/developer' : '/client';

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <SkipToContent />
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background" role="banner">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main id="main-content" className="flex-1 overflow-auto" role="main">
            <Suspense fallback={<PageLoadingFallback />}>
              <Switch>
                {/* Client Routes */}
                <Route path="/client" component={ClientDashboard} />
                <Route path="/client/consultations" component={ClientConsultations} />
                <Route path="/client/book-consultation" component={ClientBooking} />
                <Route path="/client/properties" component={ClientProperties} />
                <Route path="/client/market" component={ClientMarket} />
                <Route path="/client/profile" component={ClientProfile} />
                <Route path="/client/referrals" component={ClientReferrals} />
                
                {/* Developer Routes */}
                <Route path="/developer" component={DeveloperDashboard} />
                <Route path="/developer/properties" component={DeveloperProperties} />
                <Route path="/developer/leads" component={DeveloperLeads} />
                <Route path="/developer/trust-score" component={DeveloperTrustScore} />
                
                {/* Default redirect based on role */}
                <Route path="/">
                  {() => {
                    window.location.href = dashboardRoute;
                    return null;
                  }}
                </Route>
                
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
