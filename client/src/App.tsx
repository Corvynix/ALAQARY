import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from "@/pages/HomePage";
import PropertiesPage from "@/pages/PropertiesPage";
import InsightsPage from "@/pages/InsightsPage";
import BlogPage from "@/pages/BlogPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import RoiCalculatorPage from "@/pages/RoiCalculatorPage";
import MarketIntelligencePage from "@/pages/MarketIntelligencePage";
import AgentIntelligencePage from "@/pages/AgentIntelligencePage";
import ClientQualificationPage from "@/pages/ClientQualificationPage";
import BehaviorInsightsPage from "@/pages/BehaviorInsightsPage";
import SuperIntelligenceDashboard from "@/pages/SuperIntelligenceDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/properties" component={PropertiesPage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/roi-calculator" component={RoiCalculatorPage} />
      <Route path="/market-intelligence" component={MarketIntelligencePage} />
      <Route path="/market-intelligence/:city" component={MarketIntelligencePage} />
      <Route path="/agents/:id/intelligence" component={AgentIntelligencePage} />
      <Route path="/clients/:leadId/qualification" component={ClientQualificationPage} />
      <Route path="/behavior-insights" component={BehaviorInsightsPage} />
      <Route path="/dashboard" component={SuperIntelligenceDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
