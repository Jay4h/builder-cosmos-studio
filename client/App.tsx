import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/app/Layout";
import { AuthProvider } from "@/context/AuthContext";
import Placeholder from "@/pages/Placeholder";
import Personnel from "@/pages/Personnel";
import Training from "@/pages/Training";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="personnel" element={<Personnel />} />
              <Route path="allocation" element={<Placeholder title="Workforce Allocation" />} />
              <Route path="training" element={<Training />} />
              <Route path="health" element={<Placeholder title="Health & Readiness" />} />
              <Route path="analytics" element={<Placeholder title="AI Insights" />} />
              <Route path="decisions" element={<Placeholder title="Decision Support" />} />
              <Route path="security" element={<Placeholder title="Security & Access" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
