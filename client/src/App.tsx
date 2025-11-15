import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PropertiesPage from "@/pages/PropertiesPage";
import MarketIntelligencePage from "@/pages/MarketIntelligencePage";
import AgentIntelligencePage from "@/pages/AgentIntelligencePage";
import ClientQualificationPage from "@/pages/ClientQualificationPage";
import BehaviorInsightsPage from "@/pages/BehaviorInsightsPage";
import SuperIntelligenceDashboard from "@/pages/SuperIntelligenceDashboard";
import AgentDashboardPage from "@/pages/AgentDashboardPage";
import DeveloperDashboardPage from "@/pages/DeveloperDashboardPage";
import ClientDashboardPage from "@/pages/ClientDashboardPage";
import ContributorDashboardPage from "@/pages/ContributorDashboardPage";
import AIBrainPage from "@/pages/AIBrainPage";
import EnhancedMarketIntelligencePage from "@/pages/EnhancedMarketIntelligencePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      <Route path="/properties">
        {() => (
          <ProtectedRoute>
            <PropertiesPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/ai-brain">
        {() => (
          <ProtectedRoute>
            <AIBrainPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/market-data">
        {() => (
          <ProtectedRoute>
            <EnhancedMarketIntelligencePage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/market-intelligence">
        {() => (
          <ProtectedRoute requireAdmin>
            <MarketIntelligencePage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/market-intelligence/:city">
        {() => (
          <ProtectedRoute requireAdmin>
            <MarketIntelligencePage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/agents/:id/intelligence">
        {() => (
          <ProtectedRoute requireAdmin>
            <AgentIntelligencePage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/clients/:leadId/qualification">
        {() => (
          <ProtectedRoute requireAdmin>
            <ClientQualificationPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/behavior-insights">
        {() => (
          <ProtectedRoute requireAdmin>
            <BehaviorInsightsPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute requireAdmin>
            <SuperIntelligenceDashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/agent-dashboard">
        {() => (
          <ProtectedRoute requireRole="agent">
            <AgentDashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/developer-dashboard">
        {() => (
          <ProtectedRoute requireRole="developer">
            <DeveloperDashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/client-dashboard">
        {() => (
          <ProtectedRoute requireRole="client">
            <ClientDashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/contributor-dashboard">
        {() => (
          <ProtectedRoute requireRole="data_contributor">
            <ContributorDashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
