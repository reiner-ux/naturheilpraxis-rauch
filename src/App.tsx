import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Anamnesebogen from "./pages/Anamnesebogen";
import AnamneseDemo from "./pages/AnamneseDemo";
import Datenschutz from "./pages/Datenschutz";
import Heilpraktiker from "./pages/Heilpraktiker";
import Gebueh from "./pages/Gebueh";
import Ernaehrung from "./pages/Ernaehrung";
import FAQ from "./pages/FAQ";
import PraxisInfo from "./pages/PraxisInfo";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/anamnesebogen" element={<ProtectedRoute><Anamnesebogen /></ProtectedRoute>} />
              <Route path="/anamnesebogen-demo" element={<AnamneseDemo />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/heilpraktiker" element={<Heilpraktiker />} />
              <Route path="/gebueh" element={<Gebueh />} />
              <Route path="/ernaehrung" element={<Ernaehrung />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/praxis-info" element={<PraxisInfo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
