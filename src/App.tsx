
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Resources from "./pages/Resources";
import Directory from "./pages/Directory";
import Profile from "./pages/Profile";
import Developer from "./pages/Developer";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <MainLayout>
                      <Resources />
                    </MainLayout>
                  }
                />
                <Route
                  path="/directory"
                  element={
                    <MainLayout>
                      <Directory />
                    </MainLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />
                <Route
                  path="/developer"
                  element={
                    <MainLayout>
                      <Developer />
                    </MainLayout>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <MainLayout>
                      <Help />
                    </MainLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  }
                />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
