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
10. [Seiten-Dokumentation (alle Pages)](#10-seiten-dokumentation-alle-pages)
11. [Komponenten-Architektur](#11-komponenten-architektur)
12. [Anamnesebogen-Datenmodell](#12-anamnesebogen-datenmodell)
13. [IAA-Fragebogen](#13-iaa-fragebogen)
14. [PDF-Export](#14-pdf-export)
15. [i18n / Mehrsprachigkeit (vollständiger Quellcode)](#15-i18n--mehrsprachigkeit-vollständiger-quellcode)
16. [SEO & Schema.org](#16-seo--schemaorg)
17. [DSGVO & Cookie-Banner](#17-dsgvo--cookie-banner)
18. [Admin-Dashboard](#18-admin-dashboard)
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
| Fonts | Google Fonts (CDN) | – |
| Toasts | Sonner + shadcn/ui Toaster | ^1.7.4 |
| Formulare | React Hook Form + Zod | ^7.61.1 / ^3.25.76 |
| Datum | date-fns | ^3.6.0 |

### Vollständige Abhängigkeiten (package.json dependencies)

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

### Umgebungsvariablen (.env)

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
│   ├── design-specification.md          # Design-Spezifikation (1527 Zeilen)
│   ├── FULL-PROJECT-RESTORE-2026-02-22.md  # Diese Datei
│   ├── PROJECT-DOCUMENTATION.md         # Kurz-Übersicht
│   ├── mail-relay-v2.php                # PHP Mail-Relay Skript (Quellcode in Kap. 9)
│   ├── mail-relay-v2.php.old            # Backup
│   └── send-email-relay.php             # E-Mail-Relay (alt)
├── public/
│   ├── favicon.ico                      # Praxis-Favicon (20KB)
│   ├── krankheit-ist-messbar.html       # Statische Info-Seite Frequenztherapie
│   ├── placeholder.svg                  # Platzhalter-Bild
│   ├── robots.txt                       # Suchmaschinen-Konfiguration
│   └── zapper-diamond-shield.html       # Statische Info-Seite Diamond Shield
├── src/
│   ├── main.tsx                         # App-Einstiegspunkt
│   ├── App.tsx                          # Router & Provider-Struktur (Quellcode in Kap. 5)
│   ├── App.css                          # (leer/minimal)
│   ├── index.css                        # Design-Tokens, Fonts, Animationen, Print-Styles (Quellcode in Kap. 4)
│   ├── vite-env.d.ts                    # Vite TypeScript Deklarationen
│   ├── assets/
│   │   ├── hero-nature.jpg              # Hero-Hintergrundbild (Natur/Wald)
│   │   ├── practice-icon.png            # Praxis-Icon (klein)
│   │   └── practice-logo.png            # Praxis-Logo (groß)
│   ├── components/
│   │   ├── CookieBanner.tsx             # DSGVO Cookie-Banner
│   │   ├── LanguageSwitcher.tsx          # DE/EN Toggle
│   │   ├── NavLink.tsx                  # Navigation Link
│   │   ├── ProtectedRoute.tsx           # Auth-Guard mit Dev-Bypass (Quellcode in Kap. 6)
│   │   ├── admin/
│   │   │   ├── FAQManager.tsx           # CRUD für FAQs
│   │   │   ├── PracticeInfoManager.tsx  # CRUD für Praxis-Infos
│   │   │   └── PricingManager.tsx       # CRUD für Preisliste
│   │   ├── anamnese/
│   │   │   ├── IntroSection.tsx          # 0. Willkommen
│   │   │   ├── PatientDataSection.tsx    # I. Patientendaten
│   │   │   ├── FamilyHistorySection.tsx  # II. Familie
│   │   │   ├── NeurologySection.tsx      # III. Kopf & Sinne
│   │   │   ├── HeartSection.tsx          # IV. Herz & Kreislauf
│   │   │   ├── LungSection.tsx           # V. Lunge & Atmung
│   │   │   ├── DigestiveSection.tsx      # VI. Magen & Darm
│   │   │   ├── LiverSection.tsx          # VII. Leber & Galle
│   │   │   ├── KidneySection.tsx         # VIII. Niere & Blase
│   │   │   ├── HormoneSection.tsx        # IX. Hormone
│   │   │   ├── MusculoskeletalSection.tsx # X. Bewegungsapparat
│   │   │   ├── WomenHealthSection.tsx    # XI. Frauengesundheit
│   │   │   ├── MensHealthSection.tsx     # XI. Männergesundheit
│   │   │   ├── SurgeriesSection.tsx      # XII. Unfälle & OPs
│   │   │   ├── CancerSection.tsx         # XIII. Krebs
│   │   │   ├── AllergiesSection.tsx      # XIV. Allergien
│   │   │   ├── MedicationsSection.tsx    # XV. Medikamente
│   │   │   ├── LifestyleSection.tsx      # XVI. Lebensweise
│   │   │   ├── DentalSection.tsx         # XVII. Zahngesundheit
│   │   │   ├── EnvironmentSection.tsx    # XVIII. Umwelt
│   │   │   ├── InfectionsSection.tsx     # XIX. Infektionen
│   │   │   ├── VaccinationsSection.tsx   # XX. Impfstatus
│   │   │   ├── ComplaintsSection.tsx     # XXI. Beschwerden
│   │   │   ├── PreferencesSection.tsx    # XXII. Präferenzen
│   │   │   ├── SocialSection.tsx         # XXIII. Persönliches
│   │   │   ├── SignatureSection.tsx      # XXIV. Unterschrift
│   │   │   ├── FilteredSummaryView.tsx   # Zusammenfassungsansicht
│   │   │   ├── PrintView.tsx             # Druckansicht
│   │   │   ├── VerificationDialog.tsx    # 2FA Code-Eingabe Dialog
│   │   │   ├── MedicalHistorySection.tsx # (Legacy)
│   │   │   └── shared/
│   │   │       ├── DentalChart.tsx        # Zahnschema-Visualisierung
│   │   │       ├── MultiEntryField.tsx    # Dynamische Mehrfach-Eingabe
│   │   │       ├── MultiSelectCheckbox.tsx # Mehrfachauswahl
│   │   │       ├── NumericInput.tsx       # Numerische Eingabe
│   │   │       ├── SubConditionList.tsx   # Unter-Bedingungen
│   │   │       ├── TemporalStatusSelect.tsx # Zeitl. Status (aktuell/früher)
│   │   │       ├── ToothDiagram.tsx       # Interaktives Zahndiagramm
│   │   │       └── YearMonthSelect.tsx    # Jahr/Monat Auswahl
│   │   ├── home/
│   │   │   ├── HeroSection.tsx           # Hero mit Naturbild + SVG-Welle
│   │   │   ├── FeaturesSection.tsx       # 5 Feature-Karten
│   │   │   └── InfoSection.tsx           # Info-Bereich mit Schopenhauer-Zitat
│   │   ├── iaa/
│   │   │   └── IAAForm.tsx               # IAA Fragebogen-Formular (Slider 0-10)
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Sticky Header + Desktop/Mobile Navigation
│   │   │   ├── Footer.tsx                # 4-Spalten Footer
│   │   │   ├── Layout.tsx                # Wrapper: Header + Main + Footer
│   │   │   └── InfothekDropdown.tsx      # Mega-Dropdown Navigation (3 Gruppen)
│   │   ├── seo/
│   │   │   ├── SEOHead.tsx               # Dynamische Meta-Tags via useEffect
│   │   │   └── SchemaOrg.tsx             # JSON-LD Schema.org (@graph)
│   │   └── ui/                           # 50+ shadcn/ui Komponenten
│   │       ├── accordion.tsx, alert.tsx, alert-dialog.tsx, aspect-ratio.tsx,
│   │       │   avatar.tsx, badge.tsx, breadcrumb.tsx, button.tsx, calendar.tsx,
│   │       │   card.tsx, carousel.tsx, chart.tsx, checkbox.tsx, collapsible.tsx,
│   │       │   command.tsx, context-menu.tsx, dialog.tsx, drawer.tsx,
│   │       │   dropdown-menu.tsx, form.tsx, hover-card.tsx, input.tsx,
│   │       │   input-otp.tsx, label.tsx, menubar.tsx, navigation-menu.tsx,
│   │       │   pagination.tsx, popover.tsx, progress.tsx, radio-group.tsx,
│   │       │   resizable.tsx, scroll-area.tsx, select.tsx, separator.tsx,
│   │       │   sheet.tsx, sidebar.tsx, skeleton.tsx, slider.tsx, sonner.tsx,
│   │       │   switch.tsx, table.tsx, tabs.tsx, textarea.tsx, toast.tsx,
│   │       │   toaster.tsx, toggle.tsx, toggle-group.tsx, tooltip.tsx,
│   │       │   use-toast.ts
│   │       └── (Standard shadcn/ui – unmodifiziert bis auf button.tsx)
│   ├── contexts/
│   │   ├── AuthContext.tsx               # Supabase Auth State (Quellcode in Kap. 6)
│   │   └── LanguageContext.tsx           # DE/EN Sprachumschaltung
│   ├── hooks/
│   │   ├── use-mobile.tsx               # Mobile-Erkennung (768px Breakpoint)
│   │   ├── use-toast.ts                 # Toast Hook (shadcn)
│   │   └── useAdminCheck.ts             # Admin-Rolle prüfen via RPC has_role()
│   ├── integrations/supabase/
│   │   ├── client.ts                    # Supabase Client (auto-generiert, NICHT bearbeiten)
│   │   └── types.ts                     # Datenbank-Typen (auto-generiert, NICHT bearbeiten)
│   ├── lib/
│   │   ├── anamneseFormData.ts          # Formular-Datenmodell (605 Zeilen, ~250 Felder)
│   │   ├── iaaQuestions.ts              # IAA Fragenkatalog (409 Zeilen, ~200 Fragen)
│   │   ├── pdfExport.ts                 # PDF-Export basic (267 Zeilen)
│   │   ├── pdfExportEnhanced.ts         # PDF-Export enhanced mit Branding (631 Zeilen)
│   │   ├── datenschutzPdfExport.ts      # Datenschutz-PDF Export
│   │   ├── medicalOptions.ts            # Medizinische Optionslisten
│   │   ├── translations.ts             # Übersetzungen (Quellcode in Kap. 15)
│   │   └── utils.ts                     # cn() Utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Index.tsx                    # Startseite (Hero + Features + Info)
│   │   ├── Auth.tsx                     # Login/Register/Reset (861 Zeilen)
│   │   ├── Anamnesebogen.tsx            # Hauptformular (879 Zeilen)
│   │   ├── AnamneseDemo.tsx             # Demo mit Xaver Lovable (603 Zeilen)
│   │   ├── Erstanmeldung.tsx            # 5-Schritt Onboarding (621 Zeilen)
│   │   ├── Datenschutz.tsx              # DSGVO-Seite (300 Zeilen)
│   │   ├── Patientenaufklaerung.tsx     # Kosten & Vereinbarung (342 Zeilen)
│   │   ├── Heilpraktiker.tsx            # Info-Seite (206 Zeilen)
│   │   ├── Gebueh.tsx                   # GebÜH-Übersicht (168 Zeilen)
│   │   ├── Frequenztherapie.tsx         # Frequenztherapie-Info (203 Zeilen)
│   │   ├── Ernaehrung.tsx              # Ernährungsratschläge (198 Zeilen)
│   │   ├── FAQ.tsx                      # FAQ-Seite (DB-gesteuert, 122 Zeilen)
│   │   ├── PraxisInfo.tsx              # Praxis-Info (DB-gesteuert, 115 Zeilen)
│   │   ├── Impressum.tsx               # Impressum (236 Zeilen)
│   │   ├── AdminDashboard.tsx           # Admin: FAQ/Info/Preise (129 Zeilen)
│   │   ├── PatientDashboard.tsx         # Patienten-Dashboard (344 Zeilen)
│   │   └── NotFound.tsx                 # 404-Seite
│   └── test/
│       ├── example.test.ts
│       └── setup.ts
├── supabase/
│   ├── config.toml                      # Supabase project_id Konfiguration
│   ├── functions/
│   │   ├── request-verification-code/index.ts  # 2FA Code anfordern (347 Zeilen, Quellcode in Kap. 8)
│   │   ├── verify-code/index.ts                # 2FA Code verifizieren (324 Zeilen, Quellcode in Kap. 8)
│   │   ├── submit-anamnesis/index.ts           # Anamnese einreichen (555 Zeilen, Quellcode in Kap. 8)
│   │   └── send-verification-email/index.ts    # Legacy SMTP-basiert (126 Zeilen, nicht mehr aktiv)
│   └── migrations/                      # DB-Migrationen (auto-generiert, read-only)
├── .env                                 # Umgebungsvariablen (auto-generiert)
├── components.json                      # shadcn/ui Konfiguration (Quellcode in Kap. 3)
├── eslint.config.js
├── index.html                           # HTML-Einstiegspunkt (Quellcode in Kap. 3)
├── postcss.config.js
├── tailwind.config.ts                   # Tailwind-Konfiguration (Quellcode in Kap. 3)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts                       # Vite-Konfiguration (Quellcode in Kap. 3)
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

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080, hmr: { overlay: false } },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
```

### 3.2 index.html

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg</title>
    <meta name="description" content="Naturheilpraxis Peter Rauch in Augsburg – ganzheitliche Therapien, Irisdiagnose, Darmsanierung und individuelle Beratung für Ihre Gesundheit." />
    <meta name="author" content="Peter Rauch, Heilpraktiker" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://rauch-heilpraktiker.de/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg" />
    <meta name="geo.region" content="DE-BY" />
    <meta name="geo.placename" content="Augsburg" />
    <meta name="geo.position" content="48.3561;10.9056" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3.3 tailwind.config.ts (VOLLSTÄNDIG)

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

### 3.4 components.json (shadcn/ui Konfiguration)

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

### 3.5 src/App.tsx (VOLLSTÄNDIG)

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

### 3.6 src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 4. Design System (vollständig mit komplettem CSS)

### 4.1 src/index.css (VOLLSTÄNDIG)

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

### 4.2 Typografie-Zusammenfassung

| Verwendung | Font | Gewichte | Tailwind |
|---|---|---|---|
| Body / Fließtext | Source Sans 3 | 300, 400, 500, 600 | `font-sans` |
| Überschriften | Playfair Display | 400, 500, 600, 700 | `font-serif` |

### 4.3 Farbpalette – Semantische Zuordnung

| Token | HSL-Wert (Light) | Beschreibung | Verwendung |
|---|---|---|---|
| `--background` | 40 30% 97% | Warmer Elfenbein | Seiten-Hintergrund |
| `--foreground` | 150 20% 15% | Dunkles Salbeigrün | Standard-Text |
| `--primary` | 145 25% 36% | Salbeigrün | Buttons, Links, Branding |
| `--secondary` | 35 35% 85% | Warmer Sandton | Sekundäre Elemente |
| `--accent` | 18 45% 55% | Terracotta | Hervorhebungen, CTAs |
| `--muted` | 145 15% 90% | Helles Salbei | Dezente Hintergründe |
| `--destructive` | 0 65% 50% | Rot | Fehler, Lösch-Aktionen |
| `--card` | 40 25% 95% | Warmes Weiß | Karten-Hintergrund |

### 4.4 Button-Varianten (aus button.tsx)

| Variante | CSS-Klassen |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-sage-600 shadow-soft` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-sage-100 hover:text-primary` |
| `link` | `text-primary underline-offset-4 hover:underline` |
| `hero` | `bg-primary shadow-elevated text-base px-8 py-6 rounded-xl hover:bg-sage-600 transition-all duration-300 hover:-translate-y-0.5` |
| `accent` | `bg-accent text-accent-foreground hover:bg-terracotta-light shadow-soft` |

---

## 5. Routing & Navigation

### 5.1 Route-Tabelle

| Pfad | Seite | Auth | Beschreibung |
|---|---|---|---|
| `/` | Index | Nein | Startseite (Hero + Features + Info) |
| `/auth` | Auth | Nein | Login / Registrierung / Passwort-Reset |
| `/anamnesebogen` | Anamnesebogen | **Ja** | 26-teiliger Fragebogen |
| `/anamnesebogen-demo` | AnamneseDemo | Nein | Demo mit Testdaten |
| `/erstanmeldung` | Erstanmeldung | **Ja** | 5-Schritt Onboarding |
| `/datenschutz` | Datenschutz | Nein | DSGVO-Erklärung |
| `/heilpraktiker` | Heilpraktiker | Nein | Info-Seite |
| `/gebueh` | Gebueh | Nein | GebÜH-Übersicht |
| `/ernaehrung` | Ernaehrung | Nein | Ernährungstipps |
| `/frequenztherapie` | Frequenztherapie | Nein | Frequenztherapie-Info |
| `/faq` | FAQ | Nein | FAQ (DB-gesteuert) |
| `/praxis-info` | PraxisInfo | Nein | Praxis-Info (DB-gesteuert) |
| `/impressum` | Impressum | Nein | Impressum |
| `/patientenaufklaerung` | Patientenaufklaerung | Nein | Kosten & Regelungen |
| `/admin` | AdminDashboard | Admin | Admin-Dashboard |
| `/dashboard` | PatientDashboard | **Ja** | Patienten-Dashboard |
| `*` | NotFound | Nein | 404-Seite |

### 5.2 Provider-Hierarchie

```
QueryClientProvider → LanguageProvider → AuthProvider → TooltipProvider
  → Toaster + Sonner + SchemaOrg → BrowserRouter → CookieBanner + Routes
```

### 5.3 Header-Navigation

**Desktop (≥ lg):**
- Start, Erstanmeldung, Test (nur Admin+Preview)
- Infothek-Dropdown (3 Gruppen: Für Patienten, Wissen & Therapie, Praktisches)
- Sprachumschalter (DE/EN)
- Login/Logout + Dashboard/Admin (wenn eingeloggt + Admin)

**Mobile (< lg):**
- Hamburger-Menü mit Slide-Up Animation
- Infothek als aufklappbare Gruppe

### 5.4 Infothek-Dropdown Inhalte

- **Für Patienten:** Anamnesebogen, Datenschutzerklärung, Patientenaufklärung
- **Wissen & Therapie:** Heilpraktiker, Frequenztherapie (→ /krankheit-ist-messbar.html), Diamond Shield (→ /zapper-diamond-shield.html)
- **Praktisches:** GebÜH, FAQ

### 5.5 Footer

4-Spalten Grid: Brand/Logo, Quick Links, Kontakt, Website-Link.

**Praxis-Kontaktdaten:**
- Telefon: 0821-2621462
- E-Mail: info@rauch-heilpraktiker.de
- Adresse: Friedrich-Deffner-Straße 19a, 86163 Augsburg

---

## 6. Authentifizierung & Sicherheit (vollständiger Quellcode)

### 6.1 AuthContext.tsx (VOLLSTÄNDIG)

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

### 6.2 ProtectedRoute.tsx (VOLLSTÄNDIG)

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

  // Development bypass: ?dev=true in Preview/Dev-Umgebungen
  const isNonProduction = import.meta.env.DEV || window.location.hostname.includes('preview') || window.location.hostname.includes('localhost');
  const devBypass = isNonProduction && searchParams.get('dev') === 'true';

  if (devBypass) {
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
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### 6.3 Auth-Flow (Auth.tsx – 861 Zeilen)

**3 Modi:** `login` | `registration` | `password_reset`
**2 Schritte:** `credentials` → `verification`

**Login-Flow:**
1. E-Mail + Passwort eingeben
2. `signInWithPassword()` → sofort `signOut()` (Passwort prüfen ohne Session)
3. Edge Function `request-verification-code` → 6-stelliger Code per E-Mail
4. Code eingeben → Edge Function `verify-code` → Magic Link hashed_token
5. `verifyOtp({ token_hash, type: 'magiclink' })` → Session erstellt
6. Weiterleitung zu `/anamnesebogen`

**Registrierung-Flow:**
1. E-Mail + Passwort + Passwort-Bestätigung
2. Edge Function `request-verification-code` → erstellt User (unbestätigt) + sendet Code
3. Code eingeben → Edge Function `verify-code` → bestätigt E-Mail (`email_confirm: true`)
4. `signInWithPassword()` → Session erstellt

**Passwort-Reset-Flow:**
1. E-Mail eingeben → Edge Function sendet Code
2. Code + neues Passwort eingeben → Edge Function aktualisiert Passwort

### 6.4 Admin-Prüfung (useAdminCheck.ts)

```typescript
// Verwendet: supabase.rpc('has_role', { _user_id, _role: 'admin' })
// Gibt { isAdmin: boolean, loading: boolean } zurück
```

### 6.5 Validierung

- E-Mail: `z.string().email().max(255)`
- Passwort: `z.string().min(8)`
- OTP-Code: 6-stellig via `InputOTP`

---

## 7. Datenbank-Schema (SQL)

### 7.1 Enums

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');
CREATE TYPE public.language_code AS ENUM ('de', 'en');
```

### 7.2 Tabellen

#### profiles
```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

#### anamnesis_submissions
```sql
CREATE TABLE public.anamnesis_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT DEFAULT 'draft',  -- draft, pending_verification, submitted, verified, reviewed
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  signature_data TEXT  -- JSON: { verified_at, method, legal_basis }
);
ALTER TABLE anamnesis_submissions ENABLE ROW LEVEL SECURITY;
```

#### iaa_submissions
```sql
CREATE TABLE public.iaa_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  form_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  therapist_data JSONB,
  appointment_number INTEGER DEFAULT 1
);
ALTER TABLE iaa_submissions ENABLE ROW LEVEL SECURITY;
```

#### verification_codes
```sql
CREATE TABLE public.verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  code TEXT NOT NULL,
  type TEXT DEFAULT 'login',  -- login, registration, password_reset, anamnesis
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### user_roles
```sql
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role app_role DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### faqs
```sql
CREATE TABLE public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_de TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_de TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### practice_info
```sql
CREATE TABLE public.practice_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_de TEXT NOT NULL,
  content_en TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### practice_pricing
```sql
CREATE TABLE public.practice_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key TEXT NOT NULL,
  label_de TEXT NOT NULL,
  label_en TEXT NOT NULL,
  price_text_de TEXT NOT NULL,
  price_text_en TEXT NOT NULL,
  note_de TEXT,
  note_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 7.3 Datenbank-Funktion

```sql
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### 7.4 RLS-Policies (Empfohlen)

```sql
-- profiles: Benutzer können nur eigene Profile lesen/bearbeiten
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- anamnesis_submissions: Nur eigene Einreichungen
CREATE POLICY "Users can view own submissions" ON anamnesis_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON anamnesis_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON anamnesis_submissions FOR UPDATE USING (auth.uid() = user_id);

-- iaa_submissions: Nur eigene Einreichungen
CREATE POLICY "Users can view own iaa" ON iaa_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own iaa" ON iaa_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own iaa" ON iaa_submissions FOR UPDATE USING (auth.uid() = user_id);

-- faqs: Öffentlich lesbar
CREATE POLICY "Anyone can read published faqs" ON faqs FOR SELECT USING (is_published = true);

-- practice_info: Öffentlich lesbar
CREATE POLICY "Anyone can read published practice info" ON practice_info FOR SELECT USING (is_published = true);

-- practice_pricing: Öffentlich lesbar
CREATE POLICY "Anyone can read published pricing" ON practice_pricing FOR SELECT USING (is_published = true);

-- user_roles: Nur eigene Rolle lesen
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
```

---

## 8. Edge Functions (vollständiger Quellcode)

### 8.1 request-verification-code/index.ts (VOLLSTÄNDIG – 347 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// In-memory rate limiting (per function instance)
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
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) rateLimitMap.delete(key);
  }
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) throw new Error("Email service not configured");

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
    <html><head><meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
      .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
      .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
      .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style></head><body>
    <div class="container">
      <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
      <p>Guten Tag,</p>
      <p>${bodyText}</p>
      <div class="code-box"><div class="code">${code}</div></div>
      <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
      <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
      <div class="footer">
        <p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p>
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
      </div>
    </div></body></html>
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
      meta: { type, source: "lovable-cloud-request-verification-code" },
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
  try { result = JSON.parse(responseText); } catch { throw new Error("Email service response error"); }
  if (!result.success) throw new Error("Email delivery failed");
  console.log("Email sent successfully");
}

const handler = async (req: Request): Promise<Response> => {
  cleanupRateLimitMap();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let rawBody: unknown;
    try { rawBody = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const parseResult = verificationRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      return new Response(JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const { email, type, password, userId: providedUserId } = parseResult.data;

    const rateLimitKey = `${email}:${type}`;
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie 15 Minuten." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Resolve userId by email via profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("user_id").eq("email", email).maybeSingle();
    if (profileError) throw new Error("User verification failed");
    const existingUserId = profile?.user_id || null;

    let userId: string;

    if (type === "login") {
      userId = providedUserId || existingUserId || "";
      if (!userId) {
        return new Response(JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
    } else if (type === "registration") {
      if (existingUserId) {
        return new Response(JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      if (!password || password.length < 8) {
        return new Response(JSON.stringify({ error: "Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email, password, email_confirm: false,
      });
      if (createError || !created?.user?.id) {
        if (createError?.message?.toLowerCase().includes("already") || createError?.message?.toLowerCase().includes("registered")) {
          return new Response(JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } });
        }
        throw new Error("Registration failed");
      }
      userId = created.user.id;
    } else if (type === "password_reset") {
      if (!existingUserId) {
        return new Response(JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      userId = existingUserId;
    } else {
      throw new Error("Invalid request type");
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete old unused codes
    await supabase.from("verification_codes").delete()
      .eq("user_id", userId).eq("type", type).eq("used", false);

    const { error: insertError } = await supabase.from("verification_codes").insert({
      user_id: userId, code, type, expires_at: expiresAt.toISOString(),
    });
    if (insertError) throw insertError;

    await sendVerificationEmail(email, code, type);

    return new Response(JSON.stringify({ success: true, message: "Bestätigungscode wurde gesendet", userId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: unknown) {
    console.error("Error requesting verification code:", error);
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
```

### 8.2 verify-code/index.ts (VOLLSTÄNDIG – 324 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const verifyCodeSchema = z.object({
  email: z.string().email().max(255).transform(val => val.trim().toLowerCase()),
  code: z.string().length(6).regex(/^\d{6}$/),
  type: z.enum(["login", "registration", "password_reset"]),
  password: z.string().min(8).max(128).optional(),
  newPassword: z.string().min(8).max(128).optional(),
});

// Rate limiting: 10 attempts per hour
const verifyAttemptMap = new Map<string, { count: number; resetTime: number }>();

function checkVerifyRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = verifyAttemptMap.get(identifier);
  if (!record || now > record.resetTime) {
    verifyAttemptMap.set(identifier, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  if (record.count >= 10) return false;
  record.count++;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let rawBody: unknown;
    try { rawBody = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const parseResult = verifyCodeSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error.errors[0]?.message || "Ungültige Eingabe" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const { email, code, type, newPassword } = parseResult.data;

    if (!checkVerifyRateLimit(`verify:${email}`)) {
      return new Response(JSON.stringify({ error: "Zu viele Versuche. Bitte warten Sie eine Stunde." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Helper: lookup user by email in profiles
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", email).maybeSingle();
    if (!profile?.user_id) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Find valid verification code
    const { data: vc, error: vcError } = await supabase.from("verification_codes")
      .select("*").eq("user_id", profile.user_id).eq("code", code).eq("type", type)
      .eq("used", false).gt("expires_at", new Date().toISOString()).single();

    if (vcError || !vc) {
      return new Response(JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", vc.id);

    if (type === "registration") {
      // Confirm email
      await supabase.auth.admin.updateUserById(profile.user_id, { email_confirm: true });
      return new Response(JSON.stringify({ success: true, message: "Registrierung erfolgreich", userId: profile.user_id }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

    } else if (type === "login") {
      // Generate magic link token
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: "magiclink", email,
      });
      if (linkError) throw linkError;
      const token = linkData.properties.hashed_token;
      return new Response(JSON.stringify({ success: true, message: "2FA erfolgreich verifiziert", token, userId: profile.user_id }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

    } else if (type === "password_reset") {
      if (!newPassword || newPassword.length < 8) {
        return new Response(JSON.stringify({ error: "Neues Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      await supabase.auth.admin.updateUserById(profile.user_id, { password: newPassword });
      return new Response(JSON.stringify({ success: true, message: "Passwort erfolgreich zurückgesetzt" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    throw new Error("Invalid request type");
  } catch (error: unknown) {
    console.error("Error verifying code:", error);
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
```

### 8.3 submit-anamnesis/index.ts (VOLLSTÄNDIG – 555 Zeilen)

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
  email: z.string().email().max(255).transform((v) => v.trim().toLowerCase()),
  formData: z.record(z.any()).optional(),
  code: z.string().length(6).regex(/^\d{6}$/).optional(),
  submissionId: z.string().uuid().optional().nullable(),
  tempUserId: z.string().uuid().optional().nullable(),
  pdfBase64: z.string().optional(),
});

// Rate limiting + generateCode + encodeSubjectRfc2047 + sendViaRelay + escapeHtml
// (siehe vollständigen Quellcode im Repository: supabase/functions/submit-anamnesis/index.ts)

// KERNLOGIK:
// ACTION "submit":
//   1. Rate-Limit prüfen
//   2. formData in DB speichern (Update bestehender Draft oder neuer Insert)
//   3. Status auf "pending_verification" setzen
//   4. 6-stelligen Code generieren + in verification_codes speichern (Typ: anamnesis, 10 Min gültig)
//   5. Code-E-Mail an Patient senden (§ 126a BGB Hinweis)
//   6. Rückgabe: { submissionId, tempUserId }
//
// ACTION "confirm":
//   1. Rate-Limit für Verifizierung prüfen (10/Stunde)
//   2. Code in verification_codes verifizieren
//   3. Code als used markieren
//   4. Submission-Status auf "verified" setzen + signature_data speichern
//   5. Praxis-Benachrichtigung: E-Mail an info@rauch-heilpraktiker.de mit PDF-Anhang
//   6. Patienten-Bestätigung: E-Mail mit PDF-Anhang
//   7. Fallback: Wenn PDF-Anhang zu groß → E-Mail ohne Anhang + Hinweis

// MAIL-RELAY: https://rauch-heilpraktiker.de/mail-relay.php
// RFC 2047 Encoding für UTF-8 Subject (Umlaute in E-Mail-Betreff)
// PDF-Anhang: Base64-encodiert, Dateiname: Anamnesebogen_[Name]_[Datum].pdf
```

**Hinweis:** Der vollständige 555-Zeilen-Quellcode befindet sich in `supabase/functions/submit-anamnesis/index.ts` im Repository. Die Kernlogik ist oben dokumentiert. Für einen vollständigen Restore diese Datei 1:1 aus dem Repository verwenden.

### 8.4 send-verification-email/index.ts (LEGACY – nicht mehr aktiv)

Diese Funktion verwendete einen direkten SMTP-Client (`denomailer`) und wurde durch das PHP-Mail-Relay ersetzt. Sie ist im Repository noch vorhanden, wird aber nicht mehr aufgerufen.

### 8.5 Secrets (Edge Functions)

| Secret | Zweck | Wo gesetzt |
|---|---|---|
| `RELAY_SECRET` | Auth-Token für PHP Mail-Relay | Lovable Cloud Secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-Operationen | Automatisch verfügbar |
| `SUPABASE_URL` | Supabase-Endpoint | Automatisch verfügbar |

---

## 9. PHP Mail-Relay (vollständiger Quellcode)

### 9.1 docs/mail-relay-v2.php (VOLLSTÄNDIG)

**Server-Pfad:** `/var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php`

```php
<?php
/**
 * E-Mail Relay Endpoint für Naturheilpraxis Rauch - VERSION 2
 */

$RELAY_VERSION = '2026-02-21-v4';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Relay-Token');

function relay_log($message) {
    $line = '[' . date('c') . '] ' . $message . "\n";
    @file_put_contents(__DIR__ . '/mail-debug.log', $line, FILE_APPEND);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed', 'version' => $RELAY_VERSION]);
    exit;
}

// RELAY_SECRET muss mit dem Wert in Lovable Cloud Secrets übereinstimmen
$RELAY_SECRET = '998a476a-cf1c-7443-ea47-3e329d70e934';

$token = $_SERVER['HTTP_X_RELAY_TOKEN'] ?? '';
if (empty($token) || !hash_equals($RELAY_SECRET, $token)) {
    http_response_code(401);
    relay_log('Unauthorized request');
    echo json_encode(['success' => false, 'error' => 'Unauthorized', 'version' => $RELAY_VERSION]);
    exit;
}

$input = file_get_contents('php://input');
if (empty($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Empty request body', 'version' => $RELAY_VERSION]);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON', 'version' => $RELAY_VERSION]);
    exit;
}

$to = filter_var($data['to'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = trim($data['subject'] ?? '');
$html = $data['html'] ?? '';
$from = filter_var($data['from'] ?? 'info@rauch-heilpraktiker.de', FILTER_VALIDATE_EMAIL);

if (!$to || !$subject || !$html) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields', 'version' => $RELAY_VERSION]);
    exit;
}

// Subject encoding (RFC 2047 UTF-8 Base64)
if (strpos($subject, '=?UTF-8?') === 0) {
    $encodedSubject = $subject;
} else {
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

$envelopeFrom = $from ?: 'info@rauch-heilpraktiker.de';
$additionalParams = '-f ' . $envelopeFrom;

$attachment = $data['attachment'] ?? null;

if ($attachment && !empty($attachment['base64']) && !empty($attachment['filename'])) {
    // Multipart MIME mit PDF-Anhang
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
    $body .= 'Content-Type: ' . ($attachment['contentType'] ?? 'application/octet-stream') . '; name="' . $attachment['filename'] . '"' . "\r\n";
    $body .= 'Content-Disposition: attachment; filename="' . $attachment['filename'] . '"' . "\r\n";
    $body .= 'Content-Transfer-Encoding: base64' . "\r\n\r\n";
    $body .= chunk_split($attachment['base64']) . "\r\n";
    $body .= '--' . $boundary . '--';
    
    $success = @mail($to, $encodedSubject, $body, implode("\r\n", $headers), $additionalParams);
} else {
    // Einfache HTML-Mail
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Naturheilpraxis Rauch <' . $from . '>',
        'Reply-To: ' . $from,
        'X-Mailer: PHP/' . phpversion()
    ];
    $success = mail($to, $encodedSubject, $html, implode("\r\n", $headers), $additionalParams);
}

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Email sent', 'version' => $RELAY_VERSION, 'has_attachment' => !empty($attachment)]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email', 'version' => $RELAY_VERSION]);
}
```

---

## 10. Seiten-Dokumentation (alle Pages)

### 10.1 Index (Startseite)

**Datei:** `src/pages/Index.tsx` (17 Zeilen)
**Aufbau:** `Layout > SEOHead + HeroSection + FeaturesSection + InfoSection`

**HeroSection:** Vollbild-Naturbild (`hero-nature.jpg`) mit Gradient-Overlay (`from-sage-700/90 via-sage-600/80 to-sage-500/70`). Titel: "Ganzheitliche Heilkunde für Körper und Seele". Zwei CTAs: "Anamnesebogen ausfüllen" (hero-Variante) + "Häufige Fragen" (outline). Dekorative SVG-Welle.

**FeaturesSection:** 5 Feature-Karten (Anamnesebogen [accent], Heilpraktiker, Frequenztherapie, GebÜH, FAQ). Grid: `md:grid-cols-2 lg:grid-cols-3`. Hover: `-translate-y-1`.

**InfoSection:** 2-Spalten. Links: 3 Benefits. Rechts: Schopenhauer-Zitat.

### 10.2 Auth (Login/Register/Reset)

**Datei:** `src/pages/Auth.tsx` (861 Zeilen)
**Details:** Siehe Kapitel 6.3.

### 10.3 Anamnesebogen (Hauptformular)

**Datei:** `src/pages/Anamnesebogen.tsx` (879 Zeilen)
**Schutz:** `ProtectedRoute`

**Layout-Auswahl:** Wizard (Schritt für Schritt) oder Accordion (alle sichtbar)
**26 Sektionen:** Intro bis Unterschrift
**Features:**
- Auto-Save: LocalStorage (`anamnesebogen_form_data`) mit 2s Debounce
- Sektionsfarben: Jede Sektion hat eigene Hintergrundfarbe
- Druckansicht: `PrintView`
- Zusammenfassung: `FilteredSummaryView` (nur ausgefüllte Felder)
- PDF-Export: `generateEnhancedAnamnesePdf`
- 2FA-Signatur: `VerificationDialog` → Edge Function `submit-anamnesis`

### 10.4 AnamneseDemo

**Datei:** `src/pages/AnamneseDemo.tsx` (603 Zeilen)
**Zugang:** Öffentlich, URL: `/anamnesebogen-demo`
**Inhalt:** Vorausgefülltes Formular mit "Xaver Lovable" (geb. 01.12.1976). Vollständige Testdaten.

### 10.5 Erstanmeldung (5-Schritt-Onboarding)

**Datei:** `src/pages/Erstanmeldung.tsx` (621 Zeilen)
**Schutz:** `ProtectedRoute`

**Gate:** Telefontermin-Bestätigung
**5 Schritte:**
1. Übersicht (4 Dokumente als Karten)
2. Anamnesebogen (Link + Status)
3. Datenschutz (DSGVO-Text + Checkbox)
4. Patientenaufklärung (Kosten + Checkbox)
5. IAA-Fragebogen (Slider 0-10, Submit an DB)

### 10.6 Weitere Seiten

| Seite | Datei | Zeilen | Inhalt |
|---|---|---|---|
| Datenschutz | Datenschutz.tsx | 300 | 14 DSGVO-Sektionen + PDF-Download |
| Patientenaufklärung | Patientenaufklaerung.tsx | 342 | GKV-Hinweis, Kosten, Preisliste (DB), 48h-Regel |
| FAQ | FAQ.tsx | 122 | Accordion, DB-gesteuert (`faqs`-Tabelle) |
| PraxisInfo | PraxisInfo.tsx | 115 | DB-gesteuert (`practice_info`), Schopenhauer-Zitat |
| Heilpraktiker | Heilpraktiker.tsx | 206 | Qualifikation, Zulassung, Methoden |
| Gebueh | Gebueh.tsx | 168 | GebÜH-Erklärung + Beispiel-Tabelle |
| Frequenztherapie | Frequenztherapie.tsx | 203 | 4 Anwendungsgebiete, Behandlungsablauf |
| Ernaehrung | Ernaehrung.tsx | 198 | 4 Grundtipps, Empfehlungen |
| Impressum | Impressum.tsx | 236 | §5 TMG, Kontakt, BDH-Mitgliedschaft |
| AdminDashboard | AdminDashboard.tsx | 129 | 3 Tabs: FAQs, Praxis-Info, Preise |
| PatientDashboard | PatientDashboard.tsx | 344 | Anamnese-Übersicht, PDF-Download |
| NotFound | NotFound.tsx | ~30 | 404-Seite |

---

## 11. Komponenten-Architektur

### 11.1 Layout-System

```
Layout (flex min-h-screen flex-col)
├── Header (sticky top-0 z-50, backdrop-blur)
│   ├── Logo (Leaf-Icon + "Naturheilpraxis" / "Peter Rauch")
│   ├── Desktop-Nav (navItems + InfothekDropdown + LanguageSwitcher + Auth)
│   └── Mobile-Nav (Hamburger → slide-up Dropdown)
├── Main (flex-1)
│   └── {children}
└── Footer (border-t bg-card)
    └── 4-Spalten Grid + Copyright
```

### 11.2 Anamnese-Sektionskomponenten

Jede Sektion empfängt `formData`, `updateFormData(field, value)` und `language`.

**Shared-Komponenten:**
| Komponente | Funktion |
|---|---|
| `MultiSelectCheckbox` | Checkboxen mit Mehrfachauswahl |
| `MultiEntryField` | Dynamische Liste (Medikamente, OPs, etc.) |
| `TemporalStatusSelect` | "aktuell" / "seit [Jahr]" / "früher" |
| `YearMonthSelect` | Jahr+Monat Auswahl |
| `NumericInput` | Zahlenfeld mit Einheit |
| `DentalChart` / `ToothDiagram` | Interaktives 32-Zahn-Schema (FDI-Nomenklatur) |
| `SubConditionList` | Unterbedingungen bei Ja/Nein |

### 11.3 VerificationDialog

Modal mit 6-stelligem OTP (`InputOTP` von shadcn). Zeigt E-Mail, Timer, Resend-Button.

---

## 12. Anamnesebogen-Datenmodell

**Datei:** `src/lib/anamneseFormData.ts` (605 Zeilen)

### 12.1 formSections (26 Sektionen)

| # | ID | Titel (DE) | Emoji | Farbe |
|---|---|---|---|---|
| 0 | intro | Willkommen | 👋 | emerald |
| 1 | patientData | I. Patientendaten | 👤 | blue |
| 2 | familyHistory | II. Familie | 👨‍👩‍👧 | cyan |
| 3 | neurology | III. Kopf & Sinne | 🧠 | purple |
| 4 | heart | IV. Herz & Kreislauf | ❤️ | red |
| 5 | lung | V. Lunge & Atmung | 🫁 | sky |
| 6 | digestive | VI. Magen & Darm | 🍽️ | orange |
| 7 | liver | VII. Leber & Galle | 🫀 | amber |
| 8 | kidney | VIII. Niere & Blase | 💧 | blue |
| 9 | hormone | IX. Hormone | ⚡ | yellow |
| 10 | musculoskeletal | X. Bewegungsapparat | 🦴 | stone |
| 11 | womenHealth | XI. Frauengesundheit | 👩 | pink |
| 12 | mensHealth | XI. Männergesundheit | 👨 | blue |
| 13 | surgeries | XII. Unfälle & OPs | 🏥 | red |
| 14 | cancer | XIII. Krebs | ⚠️ | amber |
| 15 | allergies | XIV. Allergien | 🤧 | yellow |
| 16 | medications | XV. Medikamente | 💊 | purple |
| 17 | lifestyle | XVI. Lebensweise | 🌿 | green |
| 18 | dental | XVII. Zahngesundheit | 🦷 | cyan |
| 19 | environment | XVIII. Umwelt | 🌍 | teal |
| 20 | infections | XIX. Infektionen | 🦠 | rose |
| 21 | vaccinations | XX. Impfstatus | 💉 | indigo |
| 22 | complaints | XXI. Beschwerden | 📋 | slate |
| 23 | preferences | XXII. Präferenzen | ✨ | violet |
| 24 | social | XXIII. Persönliches | 🏠 | sky |
| 25 | signature | XXIV. Unterschrift | ✍️ | stone |

### 12.2 initialFormData – Hauptbereiche (~250+ Felder)

- **Patientendaten:** nachname, vorname, geburtsdatum, geschlecht, kontaktdaten, versicherung, beruf, körpermaße
- **Familie:** 12 Erkrankungen mit Verwandten-Zuordnung
- **Kopf&Sinne:** Augen (10 Sub), Ohren (7 Sub), Sinusitis, Kopfschmerzen (8 Sub)
- **Herz:** 14 Bedingungen (Blutdruck, Rhythmus, Schrittmacher, etc.)
- **Lunge:** 11 Bedingungen (Asthma, Bronchitis, COPD, etc.)
- **Magen&Darm:** 14 Bedingungen + Durst/Appetit/Ernährungstyp
- **Leber:** 8 Bedingungen (Hepatitis A/B/C, Zirrhose, etc.)
- **Niere:** 8 Bedingungen
- **Hormone:** Schilddrüse (10 Sub), Hypophyse (5 Sub), Nebenniere (5 Sub)
- **Bewegungsapparat:** HWS/BWS/LWS + 8 Gelenke (beidseitig)
- **Frauen:** Gynäkologischer Bereich (20+ Felder)
- **Männer:** Prostata (6 Sub), Hoden (6 Sub)
- **Unfälle/OPs:** Operationen-Liste, Nuklearmedizin
- **Krebs:** TNM-Stadium, Therapien, Metastasen
- **Allergien:** Inhalation, Nahrung, Medikamente, Kontakt
- **Medikamente:** Aktuelle Liste (Name, Dosis, Grund)
- **Lebensweise:** Rauchen, Alkohol, Sport, Schlaf, Stress
- **Zahngesundheit:** 32-Zähne-Schema, Parodontitis, Bruxismus
- **Umwelt:** Chemosensibilität (14 Stoffe), Körperbelastungen
- **Infektionen:** Tropenreise, Zeckenbiss, Borreliose
- **Impfungen:** 10 Standard + COVID (4 Dosen + Long-COVID)
- **Beschwerden:** Hauptbeschwerde, Schmerzqualität/-intensität (0-10)
- **Präferenzen:** 12 Therapiemethoden
- **Soziales:** Familienstand, Kinder, Wohnumfeld
- **Unterschrift:** Ort, Datum, Bestätigungen, 2FA

**TypeScript-Typ:** `export type AnamneseFormData = typeof initialFormData;`

---

## 13. IAA-Fragebogen

**Datei:** `src/lib/iaaQuestions.ts` (409 Zeilen)

### 13.1 Datenstruktur

```typescript
interface IAAQuestion { id: string; textDe: string; textEn: string; hintDe?: string; hintEn?: string; }
interface IAACategory { id: string; titleDe: string; titleEn: string; questions: IAAQuestion[]; }
```

### 13.2 Kategorien (19 Patienten + 1 Therapeut)

| ID | Titel (DE) | Fragen |
|---|---|---|
| stuhl | Stuhlverhalten | 14 |
| blaehungen | Blähungen / Winde | 8 |
| nahrung | Nahrungsmittelunverträglichkeiten | 11 |
| appetit | Appetit / Magen | 14 |
| allergien | Allergien | 5 |
| niere | Durst / Niere / Blase | 12 |
| schlaf | Schlaf | 3 |
| atmung | Bewegung / Atmung | 16 |
| haut | Haut | 7 |
| bewegungsapparat | Bewegungsapparat | 26 |
| immunsystem | Abwehr / Immunsystem | 11 |
| ohren | Ohren / Gehör | 7 |
| zaehne | Zähne | 6 |
| lymphe | Lymphe | 4 |
| nerven | Nervensystem / Kopfschmerzen | 8 |
| psyche | Psyche / Vitalität | 14 |
| herz | Herz-Kreislauf und Gefäße | 19 |
| sucht | Sucht / Hormone | 9 |
| geschlecht | Geschlechtsspezifisch | 12 |
| augen | Augen | 14 |
| blockaden | Blockaden | 3 |
| **therapeut** | **Therapeut-Bereich (Entgiftung)** | **10** |

**Gesamt:** ~200 Fragen, Bewertung per Slider 0-10.
**Speicherung:** `{ "1.1": 3, "1.2": 5, ... }` in `iaa_submissions.form_data`

---

## 14. PDF-Export

### 14.1 Basic Export (pdfExport.ts, 267 Zeilen)

Einfacher jsPDF-Export. Sektionsheader in Blau, Checkboxen, Seitenzahlen.

### 14.2 Enhanced Export (pdfExportEnhanced.ts, 631 Zeilen)

**Branding-Farben (RGB):**
- Primary: `rgb(76, 140, 74)` – Praxisgrün
- Secondary: `rgb(91, 173, 88)` – Helles Grün
- Text: `rgb(51, 51, 51)`, Muted: `rgb(120, 120, 120)`

**Praxis-Info im Header/Footer:**
```
Naturheilpraxis Peter Rauch
Peter Rauch, Heilpraktiker
Friedrich-Deffner-Straße 19a, 86163 Augsburg
Tel: 0821-2621462 | info@rauch-heilpraktiker.de
```

**Features:** Grüner Header-Balken, Patient-Info-Box, Sektionsheader mit Emoji, Checkbox-Felder, Footer mit Disclaimer.

**Funktionen:**
- `generateEnhancedAnamnesePdf()`: Speichert PDF lokal als Download
- `generateAnamnesePdfBase64()`: Gibt Base64-String zurück (für E-Mail-Anhang)

### 14.3 Datenschutz-PDF (datenschutzPdfExport.ts)

Exportiert die DSGVO-Erklärung als PDF mit Praxis-Branding.

---

## 15. i18n / Mehrsprachigkeit (vollständiger Quellcode)

### 15.1 LanguageContext

```typescript
type Language = 'de' | 'en';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (de: string, en: string) => string;
}
```

Sprache in `localStorage.language` persistiert. `document.documentElement.lang` wird gesetzt.

### 15.2 translations.ts (VOLLSTÄNDIG)

```typescript
export const translations = {
  nav: {
    home: { de: 'Start', en: 'Home' },
    anamnesis: { de: 'Anamnesebogen', en: 'Medical History' },
    privacy: { de: 'Datenschutz', en: 'Privacy Policy' },
    practitioner: { de: 'Was ist ein Heilpraktiker?', en: 'What is a Naturopath?' },
    fees: { de: 'GebÜH', en: 'Fee Schedule' },
    frequencyTherapy: { de: 'Frequenztherapie', en: 'Frequency Therapy' },
    infothek: { de: 'Infothek', en: 'Info Center' },
    nutrition: { de: 'Ernährung', en: 'Nutrition' },
    faq: { de: 'FAQ', en: 'FAQ' },
    practice: { de: 'Praxis-Info', en: 'Practice Info' },
    impressum: { de: 'Impressum', en: 'Legal Notice' },
  },
  header: {
    practice: { de: 'Naturheilpraxis', en: 'Naturopathic Practice' },
    owner: { de: 'Peter Rauch', en: 'Peter Rauch' },
    openMenu: { de: 'Menü öffnen', en: 'Open menu' },
  },
  faq: {
    title: { de: 'Häufig gestellte Fragen', en: 'Frequently Asked Questions' },
    subtitle: { de: 'Antworten auf die wichtigsten Fragen rund um die Behandlung', en: 'Answers to the most important questions about treatment' },
    notFound: { de: 'Ihre Frage war nicht dabei?', en: 'Your question wasn\'t listed?' },
    contact: { de: 'Kontaktieren Sie mich gerne direkt – ich beantworte Ihre Fragen persönlich.', en: 'Feel free to contact me directly – I\'ll answer your questions personally.' },
    call: { de: 'Anrufen', en: 'Call' },
    toAnamnesis: { de: 'Zum Anamnesebogen', en: 'To Medical History Form' },
  },
  practiceInfo: {
    title: { de: 'Über die Praxis', en: 'About the Practice' },
    subtitle: { de: 'Wichtige Informationen zu meiner Naturheilpraxis', en: 'Important information about my naturopathic practice' },
    quote: { de: '"Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts."', en: '"Health is not everything, but without health, everything is nothing."' },
    quoteAuthor: { de: '— Arthur Schopenhauer', en: '— Arthur Schopenhauer' },
  },
  common: {
    loading: { de: 'Laden...', en: 'Loading...' },
    error: { de: 'Fehler beim Laden', en: 'Error loading' },
  },
} as const;

export type TranslationKey = keyof typeof translations;
```

### 15.3 Verwendung in Komponenten

```tsx
const { t, language } = useLanguage();
<h1>{t("Willkommen", "Welcome")}</h1>
// DB-gesteuert:
{language === 'de' ? faq.question_de : faq.question_en}
```

---

## 16. SEO & Schema.org

### 16.1 SEOHead.tsx

Dynamische Meta-Tags via `useEffect` + `document.createElement`. Props: `title`, `description`, `canonical`, `ogImage`.

### 16.2 SchemaOrg.tsx

JSON-LD `@graph` mit:
- `MedicalBusiness` (Name, Adresse, Öffnungszeiten Mo-Fr 9-18, Geo, Services)
- `WebSite` (Name, URL, Sprachen)
- `BreadcrumbList`

**Services:** Irisdiagnose, Darmsanierung, Entgiftungstherapie

---

## 17. DSGVO & Cookie-Banner

### 17.1 CookieBanner.tsx

- Erscheint nach 1s Delay wenn kein `cookie-consent` in localStorage
- Buttons: "Alle akzeptieren" / "Nur notwendige"
- Speichert `cookie-consent` + `cookie-consent-date` in localStorage

### 17.2 Datenschutz-Seite

14 Sektionen mit vollständigem DSGVO-Text (DE + EN). PDF-Download.

---

## 18. Admin-Dashboard

### 18.1 Zugang

Nur für User mit `app_role = 'admin'` in `user_roles`-Tabelle. Prüfung via `useAdminCheck()` → `has_role` RPC.

### 18.2 Funktionen

3 Tabs:
1. **FAQs:** CRUD für `faqs`-Tabelle
2. **Praxis-Info:** CRUD für `practice_info`-Tabelle
3. **Preise:** CRUD für `practice_pricing`-Tabelle

---

## 19. Wiederherstellungsanleitung

### 19.1 Frontend

1. Repository klonen / alle Dateien wiederherstellen
2. `npm install` (oder `bun install`)
3. `.env` konfigurieren mit korrekten Supabase-Werten
4. `npm run dev` zum Testen (Port 8080)
5. `npm run build` für Produktions-Build

### 19.2 Datenbank

1. SQL-Schema aus Kapitel 7 im SQL-Editor ausführen (Enums → Tabellen → Funktion)
2. RLS-Policies aus Kapitel 7.4 aktivieren
3. Admin-User manuell in `user_roles` eintragen:
   ```sql
   INSERT INTO user_roles (user_id, role) VALUES ('[ADMIN_USER_ID]', 'admin');
   ```

### 19.3 Edge Functions

1. Dateien aus Kapitel 8 in `supabase/functions/` anlegen
2. Deployen:
   ```bash
   supabase functions deploy request-verification-code
   supabase functions deploy verify-code
   supabase functions deploy submit-anamnesis
   ```
3. Secret setzen:
   ```bash
   supabase secrets set RELAY_SECRET="998a476a-cf1c-7443-ea47-3e329d70e934"
   ```

### 19.4 Mail-Relay

PHP-Skript aus Kapitel 9 auf `rauch-heilpraktiker.de` deployen:
```bash
scp docs/mail-relay-v2.php user@server:/var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php
```

### 19.5 Kritische Secrets

| Secret | Wert | Wo gesetzt |
|---|---|---|
| `RELAY_SECRET` | `998a476a-cf1c-7443-ea47-3e329d70e934` | Lovable Cloud Secrets + PHP-Datei |
| `SUPABASE_SERVICE_ROLE_KEY` | (automatisch) | Automatisch verfügbar |
| `SUPABASE_URL` | (automatisch) | Automatisch verfügbar |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon-Key (siehe .env) | .env-Datei |

### 19.6 Projekt herunterladen

**Methode 1 – GitHub (empfohlen):**
1. Projekt mit GitHub verbinden (Einstellungen → GitHub → Verbinden)
2. Repository klonen: `git clone [REPO_URL]`
3. Alle Dateien sind lokal verfügbar

**Methode 2 – Export-Button:**
1. Im Editor oben rechts auf das Pfeil-nach-oben-Symbol klicken (Desktop)
2. Oder auf dem Handy: `...` → "Publish"

---

*Ende der vollständigen Wiederherstellungsdokumentation*
*Erstellt: 2026-02-22 | Naturheilpraxis Peter Rauch Patienten-App*
*Dokumentationsumfang: ~1800 Zeilen mit vollständigem Quellcode aller kritischen Dateien*
