import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ProjectWorkspace } from "./components/workspace/ProjectWorkspace";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Roadmap from "./pages/Roadmap";
import CompanyInfo from "./pages/CompanyInfo";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import Integrations from "./pages/Integrations";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Index />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/project/:projectId" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProjectWorkspace />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute>
                <MainLayout>
                  <Roadmap />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company-info" element={
              <ProtectedRoute>
                <MainLayout>
                  <CompanyInfo />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <MainLayout>
                  <Templates />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/integrations" element={
              <ProtectedRoute>
                <MainLayout>
                  <Integrations />
                </MainLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
