# Restore Part 3: Frontend Core Files

## src/App.tsx
```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CookieBanner from "@/components/CookieBanner";
import SchemaOrg from "@/components/seo/SchemaOrg";
import Index from "./pages/Index";
import Anamnesebogen from "./pages/Anamnesebogen";
import AnamneseDemo from "./pages/AnamneseDemo";
import Datenschutz from "./pages/Datenschutz";
import Heilpraktiker from "./pages/Heilpraktiker";
import Gebueh from "./pages/Gebueh";
import Ernaehrung from "./pages/Ernaehrung";
import Frequenztherapie from "./pages/Frequenztherapie";
import FAQ from "./pages/FAQ";
import PraxisInfo from "./pages/PraxisInfo";
import Impressum from "./pages/Impressum";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";
import Patientenaufklaerung from "./pages/Patientenaufklaerung";
import Erstanmeldung from "./pages/Erstanmeldung";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SchemaOrg />
          <BrowserRouter>
            <CookieBanner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/anamnesebogen" element={<ProtectedRoute><Anamnesebogen /></ProtectedRoute>} />
              <Route path="/erstanmeldung" element={<ProtectedRoute><Erstanmeldung /></ProtectedRoute>} />
              <Route path="/anamnesebogen-demo" element={<AnamneseDemo />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/heilpraktiker" element={<Heilpraktiker />} />
              <Route path="/gebueh" element={<Gebueh />} />
              <Route path="/ernaehrung" element={<Ernaehrung />} />
              <Route path="/frequenztherapie" element={<Frequenztherapie />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/praxis-info" element={<PraxisInfo />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/patientenaufklaerung" element={<Patientenaufklaerung />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
```

## src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## src/components/ProtectedRoute.tsx
```typescript
import React from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isNonProduction = import.meta.env.DEV || window.location.hostname.includes('preview') || window.location.hostname.includes('localhost');
  const devBypass = isNonProduction && searchParams.get('dev') === 'true';

  if (devBypass) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
```

## src/contexts/LanguageContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (de: string, en: string) => string;
}

const defaultContext: LanguageContextType = {
  language: 'de',
  setLanguage: () => {},
  t: (de: string) => de,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved === 'en' ? 'en' : 'de') as Language;
    }
    return 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') localStorage.setItem('language', lang);
  };

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  const t = (de: string, en: string) => language === 'de' ? de : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() { return useContext(LanguageContext); }
```

## src/hooks/useAdminCheck.ts
```typescript
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) { setIsAdmin(false); setIsLoading(false); return; }
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id, _role: 'admin'
        });
        if (error) { console.error('Error checking admin role:', error); setIsAdmin(false); }
        else { setIsAdmin(data === true); }
      } catch (error) { console.error('Error checking admin role:', error); setIsAdmin(false); }
      finally { setIsLoading(false); }
    };
    checkAdminRole();
  }, [user]);

  return { isAdmin, isLoading };
};
```

## Complete File Structure
```
src/
├── App.tsx
├── App.css
├── main.tsx
├── index.css
├── vite-env.d.ts
├── assets/
│   ├── hero-nature.jpg
│   ├── practice-icon.png
│   └── practice-logo.png
├── components/
│   ├── CookieBanner.tsx
│   ├── LanguageSwitcher.tsx
│   ├── NavLink.tsx
│   ├── ProtectedRoute.tsx
│   ├── admin/ (FAQManager, PracticeInfoManager, PricingManager)
│   ├── anamnese/ (25+ section components + shared/)
│   ├── home/ (FeaturesSection, HeroSection, InfoSection)
│   ├── iaa/ (IAAForm)
│   ├── layout/ (Footer, Header, InfothekDropdown, Layout)
│   ├── seo/ (SEOHead, SchemaOrg)
│   └── ui/ (shadcn components)
├── contexts/ (AuthContext, LanguageContext)
├── hooks/ (use-mobile, use-toast, useAdminCheck)
├── integrations/supabase/ (client.ts, types.ts – auto-generated)
├── lib/ (anamneseFormData, iaaQuestions, pdfExport*, translations, utils, medicalOptions, datenschutzPdfExport)
├── pages/ (Index, Auth, Anamnesebogen, AnamneseDemo, Erstanmeldung, PatientDashboard, AdminDashboard, Datenschutz, FAQ, Gebueh, Heilpraktiker, Ernaehrung, Frequenztherapie, PraxisInfo, Impressum, Patientenaufklaerung, NotFound)
└── test/ (example.test.ts, setup.ts)
```
