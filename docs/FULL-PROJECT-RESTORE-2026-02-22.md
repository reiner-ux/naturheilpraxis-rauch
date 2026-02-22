# Naturheilpraxis Peter Rauch – Vollständiger Wiederherstellungspunkt

**Datum:** 2026-02-22  
**Projekt:** Patienten-App & Praxisverwaltungssystem  
**Version:** Produktiv  

---

## Inhaltsverzeichnis

1. [Projektübersicht & Setup](#1-projektübersicht--setup)
2. [Dateistruktur (vollständig)](#2-dateistruktur-vollständig)
3. [Konfigurationsdateien (vollständiger Quellcode)](#3-konfigurationsdateien-vollständiger-quellcode)
4. [Design System (vollständig mit komplettem CSS)](#4-design-system-vollständig-mit-komplettem-css)
5. [Routing & Navigation](#5-routing--navigation)
6. [Authentifizierung & Sicherheit (vollständiger Quellcode)](#6-authentifizierung--sicherheit-vollständiger-quellcode)
7. [Datenbank-Schema (SQL)](#7-datenbank-schema-sql)
8. [Edge Functions (vollständiger Quellcode)](#8-edge-functions-vollständiger-quellcode)
9. [PHP Mail-Relay (vollständiger Quellcode)](#9-php-mail-relay-vollständiger-quellcode)
10. [Internationalisierung (LanguageContext)](#10-internationalisierung)
11. [SEO & Schema.org (vollständiger Quellcode)](#11-seo--schemaorg)
12. [DSGVO & Cookie-Banner (vollständiger Quellcode)](#12-dsgvo--cookie-banner)
13. [Admin-Prüfung (vollständiger Quellcode)](#13-admin-prüfung)
14. [Utility-Funktionen](#14-utility-funktionen)
15. [Seiten-Übersicht](#15-seiten-übersicht)
16. [Komponenten-Architektur](#16-komponenten-architektur)
17. [Abhängigkeiten (vollständig)](#17-abhängigkeiten)
18. [Secrets & Umgebung](#18-secrets--umgebung)
19. [Wiederherstellungsanleitung](#19-wiederherstellungsanleitung)

---

## 1. Projektübersicht & Setup

### Technologie-Stack

| Kategorie | Technologie | Version |
|---|---|---|
| Framework | React + TypeScript | ^18.3.1 |
| Build Tool | Vite | – |
| Styling | Tailwind CSS + `tailwindcss-animate` | – |
| UI-Bibliothek | shadcn/ui (Radix UI Primitives) | – |
| Icons | Lucide React | ^0.462.0 |
| Routing | React Router DOM | ^6.30.1 |
| State | React Context + TanStack React Query | ^5.83.0 |
| PDF-Export | jsPDF | ^4.0.0 |
| Backend | Supabase (Lovable Cloud) | ^2.90.1 |
| Fonts | Google Fonts (CDN): Playfair Display + Source Sans 3 | – |
| Toasts | Sonner + shadcn/ui Toaster | ^1.7.4 |
| Formulare | React Hook Form + Zod | ^7.61.1 / ^3.25.76 |
| Datum | date-fns | ^3.6.0 |

### Umgebungsvariablen (.env – auto-generiert, NICHT manuell bearbeiten)

```bash
VITE_SUPABASE_PROJECT_ID="jmebqjadlpltnqawoipb"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZWJxamFkbHBsdG5xYXdvaXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NjkwNTcsImV4cCI6MjA4NDI0NTA1N30.l9fm-vpCmz2FUOCxTV7amUP-IE11InHgJHA9hDdRmzY"
VITE_SUPABASE_URL="https://jmebqjadlpltnqawoipb.supabase.co"
```

### Projekt-URLs

- **Preview:** `https://id-preview--2a361a45-233a-4659-a3f4-a2f1dda0e86d.lovable.app`
- **Produktion:** `https://naturheilpraxis-rauch.lovable.app`
- **Praxis-Website:** `https://www.rauch-heilpraktiker.de`

### Installation & Start

```bash
npm install
npm run dev    # Startet auf localhost:8080
npm run build  # Produktions-Build
```

---

## 2. Dateistruktur (vollständig)

```
├── docs/
│   ├── design-specification.md
│   ├── FULL-PROJECT-RESTORE-2026-02-22.md  (Diese Datei)
│   ├── PROJECT-DOCUMENTATION.md
│   ├── mail-relay-v2.php
│   ├── mail-relay-v2.php.old
│   └── send-email-relay.php
├── public/
│   ├── favicon.ico
│   ├── krankheit-ist-messbar.html
│   ├── placeholder.svg
│   ├── robots.txt
│   └── zapper-diamond-shield.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── assets/
│   │   ├── hero-nature.jpg
│   │   ├── practice-icon.png
│   │   └── practice-logo.png
│   ├── components/
│   │   ├── CookieBanner.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── NavLink.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── admin/
│   │   │   ├── FAQManager.tsx
│   │   │   ├── PracticeInfoManager.tsx
│   │   │   └── PricingManager.tsx
│   │   ├── anamnese/
│   │   │   ├── IntroSection.tsx
│   │   │   ├── PatientDataSection.tsx
│   │   │   ├── FamilyHistorySection.tsx
│   │   │   ├── NeurologySection.tsx
│   │   │   ├── HeartSection.tsx
│   │   │   ├── LungSection.tsx
│   │   │   ├── DigestiveSection.tsx
│   │   │   ├── LiverSection.tsx
│   │   │   ├── KidneySection.tsx
│   │   │   ├── HormoneSection.tsx
│   │   │   ├── MusculoskeletalSection.tsx
│   │   │   ├── WomenHealthSection.tsx
│   │   │   ├── MensHealthSection.tsx
│   │   │   ├── SurgeriesSection.tsx
│   │   │   ├── CancerSection.tsx
│   │   │   ├── AllergiesSection.tsx
│   │   │   ├── MedicationsSection.tsx
│   │   │   ├── LifestyleSection.tsx
│   │   │   ├── DentalSection.tsx
│   │   │   ├── EnvironmentSection.tsx
│   │   │   ├── InfectionsSection.tsx
│   │   │   ├── VaccinationsSection.tsx
│   │   │   ├── ComplaintsSection.tsx
│   │   │   ├── PreferencesSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   ├── SignatureSection.tsx
│   │   │   ├── FilteredSummaryView.tsx
│   │   │   ├── PrintView.tsx
│   │   │   ├── VerificationDialog.tsx
│   │   │   ├── MedicalHistorySection.tsx (Legacy)
│   │   │   └── shared/
│   │   │       ├── DentalChart.tsx
│   │   │       ├── MultiEntryField.tsx
│   │   │       ├── MultiSelectCheckbox.tsx
│   │   │       ├── NumericInput.tsx
│   │   │       ├── SubConditionList.tsx
│   │   │       ├── TemporalStatusSelect.tsx
│   │   │       ├── ToothDiagram.tsx
│   │   │       └── YearMonthSelect.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── InfoSection.tsx
│   │   ├── iaa/
│   │   │   └── IAAForm.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── InfothekDropdown.tsx
│   │   ├── seo/
│   │   │   ├── SEOHead.tsx
│   │   │   └── SchemaOrg.tsx
│   │   └── ui/ (50+ shadcn/ui Komponenten)
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useAdminCheck.ts
│   ├── integrations/supabase/
│   │   ├── client.ts    (auto-generiert, NICHT bearbeiten)
│   │   └── types.ts     (auto-generiert, NICHT bearbeiten)
│   ├── lib/
│   │   ├── anamneseFormData.ts
│   │   ├── iaaQuestions.ts
│   │   ├── pdfExport.ts
│   │   ├── pdfExportEnhanced.ts
│   │   ├── datenschutzPdfExport.ts
│   │   ├── medicalOptions.ts
│   │   ├── translations.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── Auth.tsx
│   │   ├── Anamnesebogen.tsx
│   │   ├── AnamneseDemo.tsx
│   │   ├── Erstanmeldung.tsx
│   │   ├── Datenschutz.tsx
│   │   ├── Patientenaufklaerung.tsx
│   │   ├── Heilpraktiker.tsx
│   │   ├── Gebueh.tsx
│   │   ├── Frequenztherapie.tsx
│   │   ├── Ernaehrung.tsx
│   │   ├── FAQ.tsx
│   │   ├── PraxisInfo.tsx
│   │   ├── Impressum.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── PatientDashboard.tsx
│   │   └── NotFound.tsx
│   └── test/
│       ├── example.test.ts
│       └── setup.ts
├── supabase/
│   ├── config.toml
│   └── functions/
│       ├── request-verification-code/index.ts
│       ├── verify-code/index.ts
│       ├── submit-anamnesis/index.ts
│       └── send-verification-email/index.ts (Legacy, nicht aktiv)
├── .env
├── components.json
├── eslint.config.js
├── index.html
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 3. Konfigurationsdateien (vollständiger Quellcode)

### 3.1 vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

### 3.2 index.html

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg</title>
    <meta name="description" content="Naturheilpraxis Peter Rauch in Augsburg – ganzheitliche Therapien, Irisdiagnose, Darmsanierung und individuelle Beratung für Ihre Gesundheit." />
    <meta name="author" content="Peter Rauch, Heilpraktiker" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://rauch-heilpraktiker.de/" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://rauch-heilpraktiker.de/" />
    <meta property="og:title" content="Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg" />
    <meta property="og:description" content="Naturheilpraxis Peter Rauch in Augsburg – ganzheitliche Therapien, Irisdiagnose, Darmsanierung und individuelle Beratung für Ihre Gesundheit." />
    <meta property="og:image" content="https://id-preview--2a361a45-233a-4659-a3f4-a2f1dda0e86d.lovable.app/og-image.png" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="Naturheilpraxis Peter Rauch" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://rauch-heilpraktiker.de/" />
    <meta name="twitter:title" content="Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg" />
    <meta name="twitter:description" content="Naturheilpraxis Peter Rauch in Augsburg – ganzheitliche Therapien, Irisdiagnose, Darmsanierung und individuelle Beratung für Ihre Gesundheit." />
    <meta name="twitter:image" content="https://id-preview--2a361a45-233a-4659-a3f4-a2f1dda0e86d.lovable.app/og-image.png" />

    <!-- Geo Tags for Local SEO -->
    <meta name="geo.region" content="DE-BY" />
    <meta name="geo.placename" content="Augsburg" />
    <meta name="geo.position" content="48.3561;10.9056" />
    <meta name="ICBM" content="48.3561, 10.9056" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3.3 components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 3.4 tailwind.config.ts (VOLLSTÄNDIG)

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3'", "system-ui", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sage: {
          50: "hsl(var(--sage-50))",
          100: "hsl(var(--sage-100))",
          200: "hsl(var(--sage-200))",
          300: "hsl(var(--sage-300))",
          400: "hsl(var(--sage-400))",
          500: "hsl(var(--sage-500))",
          600: "hsl(var(--sage-600))",
          700: "hsl(var(--sage-700))",
        },
        sand: {
          50: "hsl(var(--sand-50))",
          100: "hsl(var(--sand-100))",
          200: "hsl(var(--sand-200))",
          300: "hsl(var(--sand-300))",
        },
        terracotta: {
          DEFAULT: "hsl(var(--terracotta))",
          light: "hsl(var(--terracotta-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### 3.5 src/main.tsx

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

---

## 4. Design System (vollständig mit komplettem CSS)

### src/index.css (VOLLSTÄNDIG)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

@layer base {
  :root {
    /* Natural healing color palette */
    --background: 40 30% 97%;
    --foreground: 150 20% 15%;

    --card: 40 25% 95%;
    --card-foreground: 150 20% 15%;

    --popover: 40 30% 97%;
    --popover-foreground: 150 20% 15%;

    /* Sage green - primary brand color */
    --primary: 145 25% 36%;
    --primary-foreground: 40 30% 97%;

    /* Warm sand - secondary */
    --secondary: 35 35% 85%;
    --secondary-foreground: 150 20% 20%;

    /* Muted sage */
    --muted: 145 15% 90%;
    --muted-foreground: 150 10% 45%;

    /* Terracotta accent */
    --accent: 18 45% 55%;
    --accent-foreground: 40 30% 97%;

    --destructive: 0 65% 50%;
    --destructive-foreground: 40 30% 97%;

    --border: 145 15% 85%;
    --input: 145 15% 88%;
    --ring: 145 25% 36%;

    --radius: 0.75rem;

    /* Custom tokens */
    --sage-50: 145 25% 96%;
    --sage-100: 145 22% 90%;
    --sage-200: 145 20% 80%;
    --sage-300: 145 20% 65%;
    --sage-400: 145 22% 50%;
    --sage-500: 145 25% 36%;
    --sage-600: 145 28% 28%;
    --sage-700: 145 30% 22%;

    --sand-50: 35 40% 97%;
    --sand-100: 35 38% 92%;
    --sand-200: 35 35% 85%;
    --sand-300: 35 30% 75%;

    --terracotta: 18 45% 55%;
    --terracotta-light: 18 40% 70%;

    /* Gradients */
    --gradient-hero: linear-gradient(135deg, hsl(145 25% 36% / 0.9), hsl(145 30% 28% / 0.95));
    --gradient-card: linear-gradient(180deg, hsl(40 30% 97%), hsl(40 25% 94%));
    --gradient-accent: linear-gradient(135deg, hsl(18 45% 55%), hsl(18 50% 45%));

    /* Shadows */
    --shadow-soft: 0 4px 20px -4px hsl(145 20% 30% / 0.1);
    --shadow-card: 0 8px 30px -8px hsl(145 20% 30% / 0.12);
    --shadow-elevated: 0 20px 50px -15px hsl(145 20% 20% / 0.2);

    /* Sidebar */
    --sidebar-background: 145 20% 97%;
    --sidebar-foreground: 150 20% 20%;
    --sidebar-primary: 145 25% 36%;
    --sidebar-primary-foreground: 40 30% 97%;
    --sidebar-accent: 145 15% 92%;
    --sidebar-accent-foreground: 150 20% 20%;
    --sidebar-border: 145 15% 88%;
    --sidebar-ring: 145 25% 36%;
  }

  .dark {
    --background: 150 20% 8%;
    --foreground: 40 25% 95%;

    --card: 150 18% 12%;
    --card-foreground: 40 25% 95%;

    --popover: 150 18% 10%;
    --popover-foreground: 40 25% 95%;

    --primary: 145 30% 50%;
    --primary-foreground: 150 20% 8%;

    --secondary: 150 15% 18%;
    --secondary-foreground: 40 25% 95%;

    --muted: 150 15% 18%;
    --muted-foreground: 145 10% 60%;

    --accent: 18 40% 50%;
    --accent-foreground: 40 30% 97%;

    --destructive: 0 55% 45%;
    --destructive-foreground: 40 30% 97%;

    --border: 150 15% 20%;
    --input: 150 15% 20%;
    --ring: 145 30% 50%;

    --sidebar-background: 150 18% 10%;
    --sidebar-foreground: 40 25% 95%;
    --sidebar-primary: 145 30% 50%;
    --sidebar-primary-foreground: 150 20% 8%;
    --sidebar-accent: 150 15% 15%;
    --sidebar-accent-foreground: 40 25% 95%;
    --sidebar-border: 150 15% 18%;
    --sidebar-ring: 145 30% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Source Sans 3', system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', Georgia, serif;
    @apply font-medium tracking-tight;
  }
}

@layer components {
  .hero-gradient {
    background: var(--gradient-hero);
  }

  .card-gradient {
    background: var(--gradient-card);
  }

  .accent-gradient {
    background: var(--gradient-accent);
  }

  .shadow-soft {
    box-shadow: var(--shadow-soft);
  }

  .shadow-card {
    box-shadow: var(--shadow-card);
  }

  .shadow-elevated {
    box-shadow: var(--shadow-elevated);
  }

  .text-balance {
    text-wrap: balance;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.4s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
}

/* Print Styles */
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  header, footer, nav, .no-print, button, .print-hide {
    display: none !important;
  }

  .print-view {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white !important;
    color: black !important;
    font-size: 12pt;
    line-height: 1.4;
  }

  .print-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .print-view * {
    background: transparent !important;
    box-shadow: none !important;
  }

  .print-view h1, .print-view h2, .print-view h3 {
    color: black !important;
  }

  .print-view input, .print-view textarea, .print-view select {
    border: 1px solid #ccc !important;
    background: white !important;
  }

  .print-view input[type="checkbox"] {
    appearance: auto !important;
    -webkit-appearance: checkbox !important;
  }

  @page {
    margin: 1.5cm;
    size: A4;
  }

  .print-view .bg-gray-100 {
    background: #f3f4f6 !important;
  }
}
```

---

## 5. Routing & Navigation

### src/App.tsx (VOLLSTÄNDIG)

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
```

### Routen-Übersicht

| Pfad | Seite | Geschützt | Beschreibung |
|---|---|---|---|
| `/` | Index | Nein | Startseite mit Hero, Features, Info |
| `/auth` | Auth | Nein | Login/Registrierung/Passwort-Reset mit 2FA |
| `/anamnesebogen` | Anamnesebogen | **Ja** | 25-Sektionen Anamnese-Formular |
| `/erstanmeldung` | Erstanmeldung | **Ja** | 5-Schritt Onboarding-Workflow |
| `/anamnesebogen-demo` | AnamneseDemo | Nein | Demo mit Beispieldaten (Xaver Lovable) |
| `/datenschutz` | Datenschutz | Nein | DSGVO-Datenschutzerklärung |
| `/heilpraktiker` | Heilpraktiker | Nein | Info über Heilpraktiker-Beruf |
| `/gebueh` | Gebueh | Nein | GebÜH-Preisübersicht |
| `/ernaehrung` | Ernaehrung | Nein | Ernährungsratschläge |
| `/frequenztherapie` | Frequenztherapie | Nein | Frequenztherapie-Info |
| `/faq` | FAQ | Nein | FAQ (DB-gesteuert) |
| `/praxis-info` | PraxisInfo | Nein | Praxis-Info (DB-gesteuert) |
| `/impressum` | Impressum | Nein | Impressum |
| `/patientenaufklaerung` | Patientenaufklaerung | Nein | Kosten & Vereinbarung |
| `/admin` | AdminDashboard | Nein (intern geprüft) | Admin: FAQ/Info/Preise verwalten |
| `/dashboard` | PatientDashboard | **Ja** | Patienten-Dashboard |

---

## 6. Authentifizierung & Sicherheit (vollständiger Quellcode)

### src/contexts/AuthContext.tsx

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
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

### src/components/ProtectedRoute.tsx

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

  // Development bypass: Available in dev mode AND preview environments
  // Add ?dev=true to URL to skip authentication during testing
  const isNonProduction = import.meta.env.DEV || window.location.hostname.includes('preview') || window.location.hostname.includes('localhost');
  const devBypass = isNonProduction && searchParams.get('dev') === 'true';

  if (devBypass) {
    // Development mode bypass - only works in non-production builds
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page, saving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

**Sicherheitskonzept:**
- `?dev=true` Bypass funktioniert NUR in Preview/Development, NICHT in Produktion
- Geschützte Routen: `/anamnesebogen`, `/erstanmeldung`, `/dashboard`
- Admin-Zugang: Intern über `useAdminCheck` Hook geprüft (RPC `has_role()`)
- 2FA für Login, Registrierung, Passwort-Reset und Anamnesebogen-Einreichung

---

## 7. Datenbank-Schema (SQL)

### Enums

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');
CREATE TYPE public.language_code AS ENUM ('de', 'en');
```

### Tabelle: profiles

```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  date_of_birth date,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
-- Kein DELETE erlaubt
```

### Tabelle: user_roles

```sql
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'patient',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
-- Kein INSERT/UPDATE/DELETE erlaubt (nur via Trigger/Admin)
```

### Tabelle: anamnesis_submissions

```sql
CREATE TABLE public.anamnesis_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  form_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  signature_data text
);

ALTER TABLE anamnesis_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions" ON anamnesis_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON anamnesis_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own submissions" ON anamnesis_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own submissions" ON anamnesis_submissions FOR DELETE USING (auth.uid() = user_id);
```

### Tabelle: iaa_submissions

```sql
CREATE TABLE public.iaa_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  therapist_data jsonb DEFAULT '{}'::jsonb,
  appointment_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE iaa_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own IAA" ON iaa_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own IAA" ON iaa_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own IAA" ON iaa_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all IAA" ON iaa_submissions FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
```

### Tabelle: verification_codes

```sql
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL,
  type text NOT NULL DEFAULT 'login',
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification codes" ON verification_codes FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE/DELETE nur via Edge Functions mit Service Role Key
```

### Tabelle: faqs

```sql
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_de text NOT NULL,
  question_en text NOT NULL,
  answer_de text NOT NULL,
  answer_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all faqs" ON faqs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert faqs" ON faqs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faqs" ON faqs FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faqs" ON faqs FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### Tabelle: practice_info

```sql
CREATE TABLE public.practice_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  title_de text NOT NULL,
  title_en text NOT NULL,
  content_de text NOT NULL,
  content_en text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE practice_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published practice info" ON practice_info FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all practice_info" ON practice_info FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert practice_info" ON practice_info FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update practice_info" ON practice_info FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete practice_info" ON practice_info FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### Tabelle: practice_pricing

```sql
CREATE TABLE public.practice_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key text NOT NULL,
  label_de text NOT NULL,
  label_en text NOT NULL,
  price_text_de text NOT NULL,
  price_text_en text NOT NULL,
  note_de text DEFAULT '',
  note_en text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE practice_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pricing" ON practice_pricing FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage pricing" ON practice_pricing FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
```

### Datenbank-Funktionen

```sql
-- Admin-Rolle prüfen
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Neuen Benutzer automatisch anlegen (Trigger auf auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email) VALUES (NEW.id, NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'patient');
  RETURN NEW;
END;
$$;

-- Trigger: handle_new_user wird bei INSERT auf auth.users ausgelöst
-- (Wird automatisch von Supabase verwaltet)

-- updated_at automatisch aktualisieren
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
```

---

## 8. Edge Functions (vollständiger Quellcode)

### 8.1 request-verification-code/index.ts (347 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const verificationRequestSchema = z.object({
  email: z.string()
    .email("Ungültige E-Mail-Adresse")
    .max(255, "E-Mail-Adresse zu lang")
    .transform(val => val.trim().toLowerCase()),
  type: z.enum(["login", "registration", "password_reset"], {
    errorMap: () => ({ message: "Ungültiger Anfrage-Typ" })
  }),
  password: z.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
  userId: z.string()
    .uuid("Ungültige Benutzer-ID")
    .optional(),
});

type VerificationRequest = z.infer<typeof verificationRequestSchema>;

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) {
    throw new Error("Email service not configured");
  }

  let subject: string;
  let bodyText: string;

  switch (type) {
    case "registration":
      subject = "Ihr Bestätigungscode für die Registrierung - Naturheilpraxis Rauch";
      bodyText = "vielen Dank für Ihre Registrierung. Bitte verwenden Sie den folgenden Code, um Ihre E-Mail-Adresse zu bestätigen:";
      break;
    case "login":
      subject = "Ihr Anmeldecode (2FA) - Naturheilpraxis Rauch";
      bodyText = "um Ihre Anmeldung abzuschließen, verwenden Sie bitte den folgenden Bestätigungscode:";
      break;
    case "password_reset":
      subject = "Passwort zurücksetzen - Naturheilpraxis Rauch";
      bodyText = "Sie haben angefordert, Ihr Passwort zurückzusetzen. Verwenden Sie den folgenden Code:";
      break;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
        .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1>
        </div>
        
        <p>Guten Tag,</p>
        
        <p>${bodyText}</p>
        
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        
        <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
        
        <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
        
        <div class="footer">
          <p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p>
          <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const relayUrl = "https://rauch-heilpraktiker.de/mail-relay.php";

  console.log(`[relay] sending ${type} code`);
  
  const response = await fetch(relayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Token": relaySecret,
    },
    body: JSON.stringify({
      to: email,
      subject: subject,
      html: htmlContent,
      from: "info@rauch-heilpraktiker.de",
      meta: {
        type,
        source: "lovable-cloud-request-verification-code",
      },
    }),
  });

  const responseText = await response.text();
  
  if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
    console.error("Relay returned HTML instead of JSON");
    throw new Error("Email service temporarily unavailable");
  }

  if (!response.ok) {
    console.error("Relay error:", response.status);
    throw new Error("Email service error");
  }

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("Failed to parse relay response");
    throw new Error("Email service response error");
  }

  if (!result.success) {
    throw new Error("Email delivery failed");
  }

  console.log("Email sent successfully");
}

const handler = async (req: Request): Promise<Response> => {
  // Periodic cleanup
  cleanupRateLimitMap();
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parseResult = verificationRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, type, password, userId: providedUserId } = parseResult.data;

    // Rate limiting check
    const rateLimitKey = `${email}:${type}`;
    if (!checkRateLimit(rateLimitKey)) {
      console.warn(`Rate limit exceeded for ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie 15 Minuten." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Resolve userId by email using the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      console.error("profile lookup error:", profileError);
      throw new Error("User verification failed");
    }

    const existingUserId = profile?.user_id || null;

    let userId: string;

    if (type === "login") {
      userId = providedUserId || existingUserId || "";
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else if (type === "registration") {
      if (existingUserId) {
        return new Response(
          JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!password || password.length < 8) {
        return new Response(
          JSON.stringify({ error: "Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Create user now (unconfirmed), then verify via code.
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

      if (createError || !created?.user?.id) {
        console.error("createUser error:", createError);
        if (createError?.message?.toLowerCase().includes("already") || 
            createError?.message?.toLowerCase().includes("registered")) {
          return new Response(
            JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        throw new Error("Registration failed");
      }

      userId = created.user.id;
    } else if (type === "password_reset") {
      if (!existingUserId) {
        // Don't reveal if email exists or not for security
        return new Response(
          JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      userId = existingUserId;
    } else {
      throw new Error("Invalid request type");
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old unused codes for this user + type
    await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", userId)
      .eq("type", type)
      .eq("used", false);

    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        user_id: userId,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("insert verification_codes error:", insertError);
      throw insertError;
    }

    // Send verification email
    await sendVerificationEmail(email, code, type);

    console.log(`Verification code sent for ${type}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bestätigungscode wurde gesendet",
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error requesting verification code:", error);
    // Return generic error message to prevent information leakage
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
```

### 8.2 verify-code/index.ts (324 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const verifyCodeSchema = z.object({
  email: z.string()
    .email("Ungültige E-Mail-Adresse")
    .max(255, "E-Mail-Adresse zu lang")
    .transform(val => val.trim().toLowerCase()),
  code: z.string()
    .length(6, "Code muss 6 Ziffern haben")
    .regex(/^\d{6}$/, "Code muss aus 6 Ziffern bestehen"),
  type: z.enum(["login", "registration", "password_reset"], {
    errorMap: () => ({ message: "Ungültiger Anfrage-Typ" })
  }),
  password: z.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
  newPassword: z.string()
    .min(8, "Neues Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
});

type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;

// Rate limiting for verification attempts (prevents brute force)
const verifyAttemptMap = new Map<string, { count: number; resetTime: number }>();
const VERIFY_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_VERIFY_ATTEMPTS_PER_WINDOW = 10;

function checkVerifyRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = verifyAttemptMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    verifyAttemptMap.set(identifier, { count: 1, resetTime: now + VERIFY_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_VERIFY_ATTEMPTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

function cleanupVerifyAttemptMap() {
  const now = Date.now();
  for (const [key, value] of verifyAttemptMap.entries()) {
    if (now > value.resetTime) {
      verifyAttemptMap.delete(key);
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Periodic cleanup
  cleanupVerifyAttemptMap();
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parseResult = verifyCodeSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, code, type, newPassword } = parseResult.data;

    // Rate limiting check for verification attempts
    const rateLimitKey = `verify:${email}`;
    if (!checkVerifyRateLimit(rateLimitKey)) {
      console.warn(`Verify rate limit exceeded for ${email}`);
      return new Response(
        JSON.stringify({ error: "Zu viele Versuche. Bitte warten Sie eine Stunde." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === "registration") {
      // Resolve userId via profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("User verification failed");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "registration")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Confirm email
      const { error: confirmError } = await supabase.auth.admin.updateUserById(profile.user_id, {
        email_confirm: true,
      });

      if (confirmError) {
        throw confirmError;
      }

      console.log("User verified successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Registrierung erfolgreich",
          userId: profile.user_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (type === "login") {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("User verification failed");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "login")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Generate a magic link for sign-in
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: email,
      });

      if (linkError) {
        throw linkError;
      }

      const token = linkData.properties.hashed_token;

      console.log("2FA verified successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "2FA erfolgreich verifiziert",
          token,
          userId: profile.user_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (type === "password_reset") {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("User verification failed");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "password_reset")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!newPassword || newPassword.length < 8) {
        return new Response(
          JSON.stringify({ error: "Neues Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(profile.user_id, {
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      console.log("Password reset successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Passwort erfolgreich zurückgesetzt",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else {
      throw new Error("Invalid request type");
    }
  } catch (error: unknown) {
    console.error("Error verifying code:", error);
    // Return generic error message to prevent information leakage
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
```

### 8.3 submit-anamnesis/index.ts (555 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({
  action: z.enum(["submit", "confirm"]),
  email: z
    .string()
    .email("Ungültige E-Mail-Adresse")
    .max(255)
    .transform((v) => v.trim().toLowerCase()),
  formData: z.record(z.any()).optional(),
  code: z
    .string()
    .length(6)
    .regex(/^\d{6}$/)
    .optional(),
  submissionId: z.string().uuid().optional().nullable(),
  tempUserId: z.string().uuid().optional().nullable(),
  pdfBase64: z.string().optional(),
});

// In-memory rate limiting
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkRateLimit(
  key: string,
  max = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const r = rateLimitMap.get(key);
  if (!r || now > r.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (r.count >= max) return false;
  r.count++;
  return true;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// RFC 2047 encode subject for UTF-8 (fixes umlaut display in email clients)
function encodeSubjectRfc2047(subject: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(subject);
  // Convert to base64
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return `=?UTF-8?B?${b64}?=`;
}

async function sendViaRelay(
  to: string,
  subject: string,
  html: string,
  attachment?: { filename: string; base64: string; contentType: string }
): Promise<{ attachmentSent: boolean }> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) throw new Error("Email service not configured");

  const payload: Record<string, unknown> = {
    to,
    subject: encodeSubjectRfc2047(subject),
    html,
    from: "noreply@rauch-heilpraktiker.de",
  };

  if (attachment) {
    payload.attachment = attachment;
  }

  const resp = await fetch("https://rauch-heilpraktiker.de/mail-relay.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Token": relaySecret,
    },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();
  if (!resp.ok || text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
    // If sending WITH attachment failed, retry WITHOUT attachment
    if (attachment) {
      console.warn("Relay failed with attachment, retrying without. Status:", resp.status, text.substring(0, 200));
      const fallbackPayload: Record<string, unknown> = {
        to,
        subject: encodeSubjectRfc2047(subject),
        html: html + '\n<p style="color:#999;font-size:11px;">⚠️ Hinweis: Der PDF-Anhang konnte aus technischen Gründen nicht beigefügt werden. Bitte wenden Sie sich an die Praxis, falls Sie eine Kopie benötigen.</p>',
        from: "noreply@rauch-heilpraktiker.de",
      };
      const fallbackResp = await fetch("https://rauch-heilpraktiker.de/mail-relay.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Relay-Token": relaySecret,
        },
        body: JSON.stringify(fallbackPayload),
      });
      const fallbackText = await fallbackResp.text();
      if (!fallbackResp.ok) {
        console.error("Relay fallback also failed:", fallbackResp.status, fallbackText.substring(0, 200));
        throw new Error("Email delivery failed");
      }
      let fallbackResult;
      try { fallbackResult = JSON.parse(fallbackText); } catch { throw new Error("Email service response error"); }
      if (!fallbackResult.success) throw new Error("Email delivery failed");
      console.log("Email sent successfully to", to, "(without attachment - fallback)");
      return { attachmentSent: false };
    }
    console.error("Relay error:", resp.status, text.substring(0, 200));
    throw new Error("Email delivery failed");
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    console.error("Failed to parse relay response");
    throw new Error("Email service response error");
  }

  if (!result.success) throw new Error("Email delivery failed");
  console.log("Email sent successfully to", to, attachment ? "(with attachment)" : "");
  return { attachmentSent: !!attachment };
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const parseResult = requestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError =
        parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      console.error("Validation error:", parseResult.error.errors);
      return new Response(JSON.stringify({ error: firstError }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email, formData, code, submissionId, tempUserId, pdfBase64 } =
      parseResult.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get userId from auth header
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch {
        /* not authenticated - ok for dev mode */
      }
    }

    // ── ACTION: SUBMIT ──────────────────────────────────────────────
    if (action === "submit") {
      if (!formData) {
        return new Response(
          JSON.stringify({ error: "Formulardaten fehlen" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!checkRateLimit(`submit:${email}`)) {
        return new Response(
          JSON.stringify({
            error: "Zu viele Anfragen. Bitte warten Sie 15 Minuten.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Use existing tempUserId if resending, or create new
      const effectiveUserId =
        userId || tempUserId || crypto.randomUUID();
      let submId: string | null = null;

      // Save to database if authenticated
      if (userId) {
        // Check if a draft already exists for this user
        const { data: existing } = await supabase
          .from("anamnesis_submissions")
          .select("id")
          .eq("user_id", userId)
          .in("status", ["draft", "pending_verification"])
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing) {
          // Update existing draft
          const { error: updateError } = await supabase
            .from("anamnesis_submissions")
            .update({
              form_data: formData,
              status: "pending_verification",
            })
            .eq("id", existing.id);

          if (updateError) {
            console.error("DB update error:", updateError);
            throw new Error("Failed to save submission");
          }
          submId = existing.id;
        } else {
          const { data: sub, error: subError } = await supabase
            .from("anamnesis_submissions")
            .insert({
              user_id: userId,
              form_data: formData,
              status: "pending_verification",
            })
            .select("id")
            .single();

          if (subError) {
            console.error("DB insert error:", subError);
            throw new Error("Failed to save submission");
          }
          submId = sub.id;
        }
      }

      // Generate 6-digit verification code
      const verCode = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Clean old unused codes
      await supabase
        .from("verification_codes")
        .delete()
        .eq("user_id", effectiveUserId)
        .eq("type", "anamnesis")
        .eq("used", false);

      const { error: codeError } = await supabase
        .from("verification_codes")
        .insert({
          user_id: effectiveUserId,
          code: verCode,
          type: "anamnesis",
          expires_at: expiresAt.toISOString(),
        });

      if (codeError) {
        console.error("Code insert error:", codeError);
        throw new Error("Failed to create verification code");
      }

      // Send verification code email
      const patientName =
        `${formData.vorname || ""} ${formData.nachname || ""}`.trim() ||
        "Patient";

      await sendViaRelay(
        email,
        "Ihr Bestätigungscode – Anamnesebogen – Naturheilpraxis Rauch",
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
  .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
  <p>Guten Tag ${escapeHtml(patientName)},</p>
  <p>vielen Dank für das Ausfüllen des Anamnesebogens. Um Ihre digitale Unterschrift rechtssicher zu bestätigen (§&nbsp;126a BGB), verwenden Sie bitte den folgenden Code:</p>
  <div class="code-box"><div class="code">${verCode}</div></div>
  <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
  <p>Falls Sie diesen Anamnesebogen nicht ausgefüllt haben, können Sie diese E-Mail ignorieren.</p>
  <div class="footer"><p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p></div>
</div></body></html>`
      );

      console.log("Anamnesis verification code sent for", email);

      return new Response(
        JSON.stringify({
          success: true,
          submissionId: submId,
          tempUserId: userId ? undefined : effectiveUserId,
          message: "Bestätigungscode wurde gesendet",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── ACTION: CONFIRM ─────────────────────────────────────────────
    if (action === "confirm") {
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Code ist erforderlich" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!checkRateLimit(`verify:${email}`, 10, 60 * 60 * 1000)) {
        return new Response(
          JSON.stringify({
            error: "Zu viele Versuche. Bitte warten Sie eine Stunde.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const effectiveUserId = userId || tempUserId;
      if (!effectiveUserId) {
        return new Response(
          JSON.stringify({ error: "Benutzer-Identifikation fehlt" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Verify code
      const { data: vc, error: vcError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", effectiveUserId)
        .eq("code", code)
        .eq("type", "anamnesis")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (vcError || !vc) {
        return new Response(
          JSON.stringify({
            error: "Ungültiger oder abgelaufener Code",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", vc.id);

      // Update submission status if exists
      if (submissionId) {
        await supabase
          .from("anamnesis_submissions")
          .update({
            status: "verified",
            signature_data: JSON.stringify({
              verified_at: new Date().toISOString(),
              method: "email_2fa",
              legal_basis: "§ 126a BGB",
            }),
          })
          .eq("id", submissionId);
      }

      // Extract patient info
      const fd = formData || {};
      const patientName =
        `${fd.vorname || ""} ${fd.nachname || ""}`.trim() || "Unbekannt";
      const patientEmail = email;
      const patientPhone = String(fd.telefon || fd.mobil || "-");
      const patientDob = String(fd.geburtsdatum || "-");
      const submittedAt = new Date().toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      });

      // Build PDF attachment info
      const pdfFilename = `Anamnesebogen_${escapeHtml(patientName).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const pdfAttachment = pdfBase64 ? {
        filename: pdfFilename,
        base64: pdfBase64,
        contentType: "application/pdf",
      } : undefined;

      // ── Send notification to practice ──
      await sendViaRelay(
        "info@rauch-heilpraktiker.de",
        `Neuer Anamnesebogen eingegangen: ${escapeHtml(patientName)}`,
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .info-box { background: #f0f7f0; border: 1px solid #4a7c59; border-radius: 8px; padding: 15px; margin: 20px 0; }
  .label { font-weight: bold; color: #4a7c59; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Neuer Anamnesebogen</h1></div>
  <p>Ein neuer Anamnesebogen wurde eingereicht und digital verifiziert:</p>
  <div class="info-box">
    <p><span class="label">Patient:</span> ${escapeHtml(patientName)}</p>
    <p><span class="label">E-Mail:</span> ${escapeHtml(patientEmail)}</p>
    <p><span class="label">Telefon:</span> ${escapeHtml(patientPhone)}</p>
    <p><span class="label">Geburtsdatum:</span> ${escapeHtml(patientDob)}</p>
    <p><span class="label">Eingereicht am:</span> ${escapeHtml(submittedAt)}</p>
    <p><span class="label">Status:</span> ✅ Digital verifiziert (§&nbsp;126a BGB)</p>
  </div>
  <p>📎 Der vollständige Anamnesebogen ist als <strong>PDF im Anhang</strong> beigefügt.</p>
  <div class="footer"><p>Automatische Benachrichtigung – Naturheilpraxis Rauch</p></div>
</div></body></html>`,
        pdfAttachment
      );

      // ── Send confirmation to patient ──
      await sendViaRelay(
        patientEmail,
        "Bestätigung: Ihr Anamnesebogen wurde erfolgreich übermittelt – Naturheilpraxis Rauch",
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .success-box { background: #f0f7f0; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
  <p>Guten Tag ${escapeHtml(patientName)},</p>
  <div class="success-box">
    <h2 style="color: #4a7c59;">✅ Anamnesebogen erfolgreich übermittelt</h2>
    <p>Ihr Anamnesebogen wurde am ${escapeHtml(submittedAt)} erfolgreich übermittelt und digital verifiziert.</p>
  </div>
  <p>Ihre Angaben werden vor Ihrem Termin von Peter Rauch geprüft, um eine optimale Behandlung zu gewährleisten.</p>
  <p>Bei Fragen erreichen Sie uns unter:</p>
  <ul>
    <li>E-Mail: info@rauch-heilpraktiker.de</li>
    <li>Telefon: 0821-4504050</li>
  </ul>
   <p>📎 Eine Kopie Ihres Anamnesebogens finden Sie als <strong>PDF im Anhang</strong> dieser E-Mail.</p>
  <div class="footer">
    <p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p>
    <p style="font-size: 11px; color: #999;">Diese E-Mail wurde automatisch generiert. Ihre Gesundheitsdaten werden gemäß DSGVO geschützt und mit einer Aufbewahrungsfrist von 10 Jahren gespeichert.</p>
  </div>
</div></body></html>`,
        pdfAttachment
      );

      console.log("Anamnesis confirmed and emails sent for", email);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Anamnesebogen erfolgreich übermittelt",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Ungültige Aktion" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in submit-anamnesis:", error);
    return new Response(
      JSON.stringify({
        error:
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

---

## 9. PHP Mail-Relay (vollständiger Quellcode)

### docs/mail-relay-v2.php

```php
<?php
/**
 * E-Mail Relay Endpoint für Naturheilpraxis Rauch - VERSION 2
 * 
 * WICHTIG: Diese Datei muss auf dem Server unter /mail-relay.php liegen!
 * 
 * INSTALLATION:
 * 1. Diese Datei auf Ihren Server kopieren nach: /var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php
 * 2. Den RELAY_SECRET Wert unten durch denselben Wert ersetzen, den Sie in Lovable Cloud eingegeben haben
 */

// ===== VERSION MARKER =====
// Wenn diese Version läuft, erscheint "version": "2026-02-21-v4" in der Response
$RELAY_VERSION = '2026-02-21-v4';

// CORS Headers für Edge Function Zugriff
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Relay-Token');

// Debug-Log Funktion - schreibt nach mail-debug.log im selben Verzeichnis
function relay_log($message) {
    $line = '[' . date('c') . '] ' . $message . "\n";
    @file_put_contents(__DIR__ . '/mail-debug.log', $line, FILE_APPEND);
}

// OPTIONS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed', 'version' => $RELAY_VERSION]);
    exit;
}

// ============================================
// WICHTIG: Ersetzen Sie diesen Wert durch Ihr Secret!
// ============================================
$RELAY_SECRET = '998a476a-cf1c-7443-ea47-3e329d70e934';

// Token validieren
$token = $_SERVER['HTTP_X_RELAY_TOKEN'] ?? '';
if (empty($token) || !hash_equals($RELAY_SECRET, $token)) {
    http_response_code(401);
    relay_log('Unauthorized request: remote=' . ($_SERVER['REMOTE_ADDR'] ?? '-') . ' ua=' . ($_SERVER['HTTP_USER_AGENT'] ?? '-'));
    echo json_encode(['success' => false, 'error' => 'Unauthorized', 'version' => $RELAY_VERSION]);
    exit;
}

// JSON Body lesen
$input = file_get_contents('php://input');

// Check for empty input (might indicate post_max_size exceeded)
if (empty($input)) {
    http_response_code(400);
    $contentLength = $_SERVER['CONTENT_LENGTH'] ?? 'unknown';
    $postMaxSize = ini_get('post_max_size');
    relay_log("Empty input! CONTENT_LENGTH={$contentLength} post_max_size={$postMaxSize}");
    echo json_encode(['success' => false, 'error' => "Empty request body (Content-Length: {$contentLength}, post_max_size: {$postMaxSize})", 'version' => $RELAY_VERSION]);
    exit;
}

$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    relay_log('Invalid JSON: remote=' . ($_SERVER['REMOTE_ADDR'] ?? '-') . ' input_len=' . strlen($input) . ' raw=' . substr($input, 0, 500));
    echo json_encode(['success' => false, 'error' => 'Invalid JSON', 'version' => $RELAY_VERSION]);
    exit;
}

// Pflichtfelder prüfen
$to = filter_var($data['to'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = trim($data['subject'] ?? '');
$html = $data['html'] ?? '';
$from = filter_var($data['from'] ?? 'info@rauch-heilpraktiker.de', FILTER_VALIDATE_EMAIL);

if (!$to || !$subject || !$html) {
    http_response_code(400);
    relay_log('Missing fields: to=' . ($data['to'] ?? '-') . ' subject_len=' . strlen($subject) . ' html_len=' . strlen((string)$html));
    echo json_encode(['success' => false, 'error' => 'Missing required fields: to, subject, html', 'version' => $RELAY_VERSION]);
    exit;
}

relay_log('Accepted: to=' . $to . ' from=' . ($from ?: '-') . ' subject=' . $subject . ' has_attachment=' . (isset($data['attachment']) ? 'yes' : 'no'));

// Subject encoding
if (strpos($subject, '=?UTF-8?') === 0) {
    $encodedSubject = $subject;
} else {
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

$envelopeFrom = $from ?: 'info@rauch-heilpraktiker.de';
// WICHTIG: KEIN escapeshellarg() verwenden!
// escapeshellarg() erzeugt: -f 'email@domain.de' (mit Anführungszeichen)
// Auf diesem Server interpretiert der MTA die Anführungszeichen falsch,
// wodurch die Mail nicht an $to zugestellt wird, sondern lokal an die
// Default-Mailbox (info@) geroutet wird.
$additionalParams = '-f ' . $envelopeFrom;

// Check if attachment is present
$attachment = $data['attachment'] ?? null;

if ($attachment && !empty($attachment['base64']) && !empty($attachment['filename'])) {
    // Multipart MIME email with attachment
    $boundary = '----=_Part_' . md5(uniqid(microtime(true)));
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
        'From: Naturheilpraxis Rauch <' . $from . '>',
        'Reply-To: ' . $from,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $body = '--' . $boundary . "\r\n";
    $body .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    $body .= 'Content-Transfer-Encoding: 8bit' . "\r\n\r\n";
    $body .= $html . "\r\n\r\n";
    
    $body .= '--' . $boundary . "\r\n";
    $contentType = $attachment['contentType'] ?? 'application/octet-stream';
    $filename = $attachment['filename'];
    $body .= 'Content-Type: ' . $contentType . '; name="' . $filename . '"' . "\r\n";
    $body .= 'Content-Disposition: attachment; filename="' . $filename . '"' . "\r\n";
    $body .= 'Content-Transfer-Encoding: base64' . "\r\n\r\n";
    $body .= chunk_split($attachment['base64']) . "\r\n";
    
    $body .= '--' . $boundary . '--';
    
    $success = @mail($to, $encodedSubject, $body, implode("\r\n", $headers), $additionalParams);
    $lastError = error_get_last();
    relay_log('Multipart mail ' . ($success ? 'OK' : 'FAIL') . ': to=' . $to . ' attachment=' . $filename . ' body_len=' . strlen($body) . ' base64_len=' . strlen($attachment['base64']) . ($lastError ? ' error=' . $lastError['message'] : ''));
} else {
    // Simple HTML email (no attachment)
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Naturheilpraxis Rauch <' . $from . '>',
        'Reply-To: ' . $from,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $success = mail($to, $encodedSubject, $html, implode("\r\n", $headers), $additionalParams);
    relay_log('Simple mail ' . ($success ? 'OK' : 'FAIL') . ': to=' . $to);
}

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent',
        'version' => $RELAY_VERSION,
        'has_attachment' => !empty($attachment),
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email', 'version' => $RELAY_VERSION]);
}
```

---

## 10. Internationalisierung

### src/contexts/LanguageContext.tsx (VOLLSTÄNDIG)

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (de: string, en: string) => string;
}

// Default values for context to prevent errors during hot reload
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (de: string, en: string) => {
    return language === 'de' ? de : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
```

---

## 11. SEO & Schema.org (vollständiger Quellcode)

### src/components/seo/SchemaOrg.tsx

```typescript
import { useEffect } from "react";

const SchemaOrg = () => {
  useEffect(() => {
    const schemaId = "schema-org-medical-business";
    
    const existing = document.getElementById(schemaId);
    if (existing) {
      existing.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalBusiness",
          "@id": "https://rauch-heilpraktiker.de/#business",
          name: "Naturheilpraxis Peter Rauch",
          alternateName: "Heilpraktiker Peter Rauch",
          description: "Naturheilpraxis für ganzheitliche Therapien, Irisdiagnose, Darmsanierung und individuelle Gesundheitsberatung in Augsburg.",
          url: "https://rauch-heilpraktiker.de",
          telephone: "+49-821-2621462",
          email: "info@rauch-heilpraktiker.de",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Friedrich-Deffner-Straße 19a",
            addressLocality: "Augsburg",
            postalCode: "86163",
            addressCountry: "DE",
            addressRegion: "Bayern"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 48.3561,
            longitude: 10.9056
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "18:00"
            }
          ],
          priceRange: "€€",
          currenciesAccepted: "EUR",
          paymentAccepted: "Cash, EC Card",
          founder: {
            "@type": "Person",
            "@id": "https://rauch-heilpraktiker.de/#person",
            name: "Peter Rauch",
            jobTitle: "Heilpraktiker",
            description: "Staatlich geprüfter Heilpraktiker nach dem Heilpraktikergesetz"
          },
          medicalSpecialty: ["Naturopathy", "Holistic Medicine", "Alternative Medicine"],
          availableService: [
            { "@type": "MedicalTherapy", name: "Irisdiagnose", description: "Diagnose durch Analyse der Iris" },
            { "@type": "MedicalTherapy", name: "Darmsanierung", description: "Ganzheitliche Darmgesundheit und Mikrobiom-Therapie" },
            { "@type": "MedicalTherapy", name: "Entgiftungstherapie", description: "Unterstützung der körpereigenen Entgiftungsprozesse" }
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://rauch-heilpraktiker.de/#website",
          url: "https://rauch-heilpraktiker.de",
          name: "Naturheilpraxis Peter Rauch",
          publisher: { "@id": "https://rauch-heilpraktiker.de/#business" },
          inLanguage: ["de-DE", "en-US"]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://rauch-heilpraktiker.de/#breadcrumb",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Startseite", item: "https://rauch-heilpraktiker.de/" }
          ]
        }
      ]
    };

    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(schemaId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
};

export default SchemaOrg;
```

---

## 12. DSGVO & Cookie-Banner (vollständiger Quellcode)

### src/components/CookieBanner.tsx

```typescript
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-elevated p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-foreground">
              {t("Cookie-Einstellungen", "Cookie Settings")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "Wir verwenden technisch notwendige Cookies, um die Funktionalität unserer Website zu gewährleisten. Diese Cookies speichern keine personenbezogenen Daten. Weitere Informationen finden Sie in unserer ",
                "We use technically necessary cookies to ensure the functionality of our website. These cookies do not store personal data. For more information, please see our "
              )}
              <Link to="/datenschutz" className="text-primary hover:underline">
                {t("Datenschutzerklärung", "Privacy Policy")}
              </Link>.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleAccept} size="sm">
                {t("Alle akzeptieren", "Accept All")}
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm">
                {t("Nur notwendige", "Necessary Only")}
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("Schließen", "Close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
```

---

## 13. Admin-Prüfung (vollständiger Quellcode)

### src/hooks/useAdminCheck.ts

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
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, isLoading };
};
```

---

## 14. Utility-Funktionen

### src/lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 15. Seiten-Übersicht

| Datei | Zeilen | Beschreibung |
|---|---|---|
| `Index.tsx` | ~350 | Startseite: Hero + Features + Info-Bereich |
| `Auth.tsx` | ~860 | Login, Registrierung, Passwort-Reset mit 2FA (Tabs + OTP) |
| `Anamnesebogen.tsx` | ~880 | 25-Sektionen Formular, Wizard/Accordion, Auto-Save, PDF, 2FA |
| `AnamneseDemo.tsx` | ~600 | Demo mit Testdaten "Xaver Lovable" |
| `Erstanmeldung.tsx` | ~620 | 5-Schritt Onboarding (Gatekeeper → Anamnese → DSGVO → Aufklärung → IAA) |
| `Datenschutz.tsx` | ~300 | DSGVO-Datenschutzerklärung mit PDF-Download |
| `Patientenaufklaerung.tsx` | ~340 | Kosten & Behandlungsvereinbarung |
| `Heilpraktiker.tsx` | ~200 | Info über Heilpraktiker-Beruf |
| `Gebueh.tsx` | ~170 | GebÜH-Preisübersicht (DB-gesteuert) |
| `Frequenztherapie.tsx` | ~200 | Frequenztherapie-Info |
| `Ernaehrung.tsx` | ~200 | Ernährungsratschläge |
| `FAQ.tsx` | ~120 | FAQ-Seite (DB-gesteuert, Accordion) |
| `PraxisInfo.tsx` | ~115 | Praxis-Info (DB-gesteuert) |
| `Impressum.tsx` | ~240 | Impressum |
| `AdminDashboard.tsx` | ~130 | Admin: FAQ/Info/Preise CRUD (Tabs) |
| `PatientDashboard.tsx` | ~340 | Patienten-Dashboard (Formulare, Status) |
| `NotFound.tsx` | ~20 | 404-Seite |

---

## 16. Komponenten-Architektur

### Provider-Hierarchie (von außen nach innen)

```
QueryClientProvider
  └─ LanguageProvider
       └─ AuthProvider
            └─ TooltipProvider
                 ├─ Toaster (shadcn/ui)
                 ├─ Sonner
                 ├─ SchemaOrg (JSON-LD)
                 └─ BrowserRouter
                      ├─ CookieBanner
                      └─ Routes
```

### Layout-Struktur

```
Layout
  ├─ Header (sticky)
  │    ├─ Logo + Praxis-Name
  │    ├─ Desktop-Navigation (NavLink-Komponenten)
  │    ├─ InfothekDropdown (Mega-Menü, 3 Spalten)
  │    ├─ LanguageSwitcher (DE/EN)
  │    ├─ Auth-Buttons (Login/Dashboard)
  │    └─ Mobile-Hamburger (Sheet)
  ├─ Main (children)
  └─ Footer (4-Spalten)
```

### Anamnese-Sektionen (25 Stück, Reihenfolge)

0. IntroSection – Willkommen
1. PatientDataSection – Stammdaten (Name, Geburtsdatum, etc.)
2. FamilyHistorySection – Familiengeschichte
3. NeurologySection – Kopf & Sinne
4. HeartSection – Herz & Kreislauf
5. LungSection – Lunge & Atmung
6. DigestiveSection – Magen & Darm
7. LiverSection – Leber & Galle
8. KidneySection – Niere & Blase
9. HormoneSection – Hormone & Stoffwechsel
10. MusculoskeletalSection – Bewegungsapparat
11. WomenHealthSection – Frauengesundheit (konditional)
12. MensHealthSection – Männergesundheit (konditional)
13. SurgeriesSection – Unfälle & Operationen
14. CancerSection – Krebserkrankungen
15. AllergiesSection – Allergien & Unverträglichkeiten
16. MedicationsSection – Medikamente & Nahrungsergänzung
17. LifestyleSection – Lebensweise (Ernährung, Sport, Schlaf)
18. DentalSection – Zahngesundheit (interaktives Zahndiagramm)
19. EnvironmentSection – Umweltbelastungen
20. InfectionsSection – Infektionen
21. VaccinationsSection – Impfstatus
22. ComplaintsSection – Aktuelle Beschwerden (Freitext)
23. PreferencesSection – Behandlungspräferenzen
24. SocialSection – Persönliches & Soziales
25. SignatureSection – Digitale Unterschrift + Einwilligung

---

## 17. Abhängigkeiten (vollständig)

```json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-context-menu": "^2.2.15",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.15",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.7",
  "@supabase/supabase-js": "^2.90.1",
  "@tanstack/react-query": "^5.83.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "jspdf": "^4.0.0",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-day-picker": "^8.10.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.61.1",
  "react-resizable-panels": "^2.1.9",
  "react-router-dom": "^6.30.1",
  "recharts": "^2.15.4",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^0.9.9",
  "zod": "^3.25.76"
}
```

---

## 18. Secrets & Umgebung

### Konfigurierte Secrets (Lovable Cloud)

| Secret Name | Beschreibung |
|---|---|
| `RELAY_SECRET` | Auth-Token für PHP Mail-Relay (`998a476a-cf1c-7443-ea47-3e329d70e934`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-Key für Edge Functions |
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_ANON_KEY` | Öffentlicher Supabase Key |
| `SUPABASE_PUBLISHABLE_KEY` | Öffentlicher Key (Frontend) |
| `SUPABASE_DB_URL` | Datenbank-URL |
| `SMTP_HOST` | SMTP Server (Legacy, nicht aktiv) |
| `SMTP_PORT` | SMTP Port (Legacy) |
| `SMTP_USER` | SMTP Benutzer (Legacy) |
| `SMTP_PASSWORD` | SMTP Passwort (Legacy) |
| `LOVABLE_API_KEY` | Lovable AI API Key |

### PHP Mail-Relay Deployment

- **Server-Pfad:** `/var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php`
- **URL:** `https://rauch-heilpraktiker.de/mail-relay.php`
- **Authentifizierung:** `X-Relay-Token` Header mit `RELAY_SECRET`
- **Log-Datei:** `mail-debug.log` im selben Verzeichnis
- **Envelope-Sender:** `noreply@rauch-heilpraktiker.de` (via `-f` Flag)

---

## 19. Wiederherstellungsanleitung

### Schritt 1: Projekt erstellen

```bash
# Neues Lovable-Projekt erstellen oder Repository klonen
git clone <REPOSITORY_URL>
cd naturheilpraxis-rauch
npm install
```

### Schritt 2: Datenbank einrichten

1. In Lovable Cloud die SQL-Skripte aus Kapitel 7 ausführen
2. Enums erstellen (`app_role`, `language_code`)
3. Alle 7 Tabellen erstellen mit RLS-Policies
4. Funktionen erstellen (`has_role`, `handle_new_user`, `update_updated_at_column`)
5. Trigger auf `auth.users` für `handle_new_user` einrichten

### Schritt 3: Edge Functions deployen

Die Edge Functions in `supabase/functions/` werden automatisch von Lovable Cloud deployt.

### Schritt 4: Secrets konfigurieren

Alle Secrets aus Kapitel 18 in Lovable Cloud → Secrets eintragen.

### Schritt 5: PHP Mail-Relay

1. `docs/mail-relay-v2.php` auf den Server kopieren nach `/mail-relay.php`
2. `$RELAY_SECRET` im PHP-Skript muss mit dem Cloud-Secret übereinstimmen

### Schritt 6: Frontend starten

```bash
npm run dev    # Entwicklung
npm run build  # Produktion
```

### Schritt 7: Admin-Benutzer anlegen

```sql
-- Bestehenden Benutzer zum Admin machen
INSERT INTO public.user_roles (user_id, role)
VALUES ('<USER_UUID>', 'admin');
```

---

_Ende des Wiederherstellungsdokuments – Erstellt am 2026-02-22_
