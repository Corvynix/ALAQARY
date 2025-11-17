import { Switch, Route } from "wouter";
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
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import ClientDashboard from "@/pages/client-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import DeveloperDashboard from "@/pages/developer-dashboard";
import ClientConsultations from "@/pages/client-consultations";
import ClientProperties from "@/pages/client-properties";
import ClientMarket from "@/pages/client-market";
import ClientProfile from "@/pages/client-profile";
import ClientReferrals from "@/pages/client-referrals";
import AdminMarketUpload from "@/pages/admin-market-upload";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminDevelopers from "@/pages/admin-developers";
import AdminPayments from "@/pages/admin-payments";
import DeveloperProperties from "@/pages/developer-properties";
import DeveloperLeads from "@/pages/developer-leads";
import DeveloperTrustScore from "@/pages/developer-trust-score";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
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
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated users with role-based dashboards
  const dashboardRoute = user?.role === 'admin' 
    ? '/admin' 
    : user?.role === 'developer' 
    ? '/developer' 
    : '/client';

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              {/* Client Routes */}
              <Route path="/client" component={ClientDashboard} />
              <Route path="/client/consultations" component={ClientConsultations} />
              <Route path="/client/properties" component={ClientProperties} />
              <Route path="/client/market" component={ClientMarket} />
              <Route path="/client/profile" component={ClientProfile} />
              <Route path="/client/referrals" component={ClientReferrals} />
              
              {/* Admin Routes */}
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/market-upload" component={AdminMarketUpload} />
              <Route path="/admin/analytics" component={AdminAnalytics} />
              <Route path="/admin/developers" component={AdminDevelopers} />
              <Route path="/admin/payments" component={AdminPayments} />
              
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
