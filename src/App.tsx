
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <AuthGuard>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              } />
              <Route path="/orders" element={
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              } />
              <Route path="/orders/:orderId" element={
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              } />
              <Route path="/settings" element={
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              } />
              <Route path="/pricing" element={
                <AdminLayout>
                  <Pricing />
                </AdminLayout>
              } />
              
              <Route path="/" element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
