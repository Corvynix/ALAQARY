import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import PropertiesList from "@/pages/PropertiesList";
import PropertyDetail from "@/pages/PropertyDetail";
import ProfileBuilder from "@/pages/ProfileBuilder";
import BuyerDashboard from "@/pages/BuyerDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AdminPanel from "@/pages/AdminPanel";
import AdminBlogEditor from "@/pages/AdminBlogEditor";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/profile/builder" component={ProfileBuilder} />
          <Route path="/dashboard">
            {() => {
              if (user?.role === 'developer') {
                return <DeveloperDashboard />;
              } else if (user?.role === 'admin') {
                return <AdminDashboard />;
              }
              return <BuyerDashboard />;
            }}
          </Route>
          <Route path="/dashboard/developer" component={DeveloperDashboard} />
          <Route path="/dashboard/admin" component={AdminDashboard} />
          <Route path="/admin" component={AdminPanel} />
        </>
      )}
      <Route path="/properties" component={PropertiesList} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/admin/blog/new" component={AdminBlogEditor} />
      <Route path="/admin/blog/edit/:id" component={AdminBlogEditor} />
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
