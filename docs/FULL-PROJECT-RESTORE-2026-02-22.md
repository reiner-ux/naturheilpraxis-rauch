# Naturheilpraxis Peter Rauch – Vollständiger Wiederherstellungspunkt
**Datum:** 2026-02-22
**Projekt:** Patienten-App & Praxisverwaltungssystem
**Version:** Produktiv

---

## Inhaltsverzeichnis

1. [Projektübersicht & Setup](#1-projektübersicht--setup)
2. [Dateistruktur (vollständig)](#2-dateistruktur-vollständig)
3. [Design System (vollständig)](#3-design-system-vollständig)
4. [Routing & Navigation](#4-routing--navigation)
5. [Authentifizierung & Sicherheit](#5-authentifizierung--sicherheit)
6. [Datenbank-Schema (SQL)](#6-datenbank-schema-sql)
7. [Edge Functions (Backend)](#7-edge-functions-backend)
8. [Seiten-Dokumentation (alle Pages)](#8-seiten-dokumentation-alle-pages)
9. [Komponenten-Architektur](#9-komponenten-architektur)
10. [Anamnesebogen-Datenmodell](#10-anamnesebogen-datenmodell)
11. [IAA-Fragebogen](#11-iaa-fragebogen)
12. [PDF-Export](#12-pdf-export)
13. [i18n / Mehrsprachigkeit](#13-i18n--mehrsprachigkeit)
14. [SEO & Schema.org](#14-seo--schemaorg)
15. [DSGVO & Cookie-Banner](#15-dsgvo--cookie-banner)
16. [Admin-Dashboard](#16-admin-dashboard)
17. [Externe Abhängigkeiten (Mail-Relay)](#17-externe-abhängigkeiten-mail-relay)
18. [Wiederherstellungsanleitung](#18-wiederherstellungsanleitung)

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

### Umgebungsvariablen (.env)

```bash
VITE_SUPABASE_PROJECT_ID="jmebqjadlpltnqawoipb"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIs..."
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

### vite.config.ts

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

### index.html

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
    <!-- Open Graph, Twitter, Geo Tags für lokales SEO -->
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

---

## 2. Dateistruktur (vollständig)

```
├── docs/
│   ├── design-specification.md          # Design-Spezifikation (1527 Zeilen)
│   ├── FULL-PROJECT-RESTORE-2026-02-22.md  # Diese Datei
│   ├── PROJECT-DOCUMENTATION.md         # Kurz-Übersicht
│   ├── mail-relay-v2.php                # PHP Mail-Relay Skript
│   ├── mail-relay-v2.php.old            # Backup
│   └── send-email-relay.php             # E-Mail-Relay
├── public/
│   ├── favicon.ico
│   ├── krankheit-ist-messbar.html       # Statische Info-Seite Frequenztherapie
│   ├── placeholder.svg
│   ├── robots.txt
│   └── zapper-diamond-shield.html       # Statische Info-Seite Diamond Shield
├── src/
│   ├── main.tsx                         # App-Einstiegspunkt
│   ├── App.tsx                          # Router & Provider-Struktur
│   ├── App.css                          # (leer/minimal)
│   ├── index.css                        # Design-Tokens, Fonts, Animationen, Print-Styles
│   ├── vite-env.d.ts                    # Vite TypeScript Deklarationen
│   ├── assets/
│   │   ├── hero-nature.jpg              # Hero-Hintergrundbild
│   │   ├── practice-icon.png            # Praxis-Icon
│   │   └── practice-logo.png            # Praxis-Logo
│   ├── components/
│   │   ├── CookieBanner.tsx             # DSGVO Cookie-Banner
│   │   ├── LanguageSwitcher.tsx          # DE/EN Toggle
│   │   ├── NavLink.tsx                  # Navigation Link
│   │   ├── ProtectedRoute.tsx           # Auth-Guard mit Dev-Bypass
│   │   ├── admin/
│   │   │   ├── FAQManager.tsx           # CRUD für FAQs
│   │   │   ├── PracticeInfoManager.tsx  # CRUD für Praxis-Infos
│   │   │   └── PricingManager.tsx       # CRUD für Preisliste
│   │   ├── anamnese/
│   │   │   ├── IntroSection.tsx          # Willkommen
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
│   │   │   ├── HeroSection.tsx           # Hero mit Naturbild
│   │   │   ├── FeaturesSection.tsx       # Feature-Karten
│   │   │   └── InfoSection.tsx           # Info-Bereich mit Zitat
│   │   ├── iaa/
│   │   │   └── IAAForm.tsx               # IAA Fragebogen-Formular
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Sticky Header + Navigation
│   │   │   ├── Footer.tsx                # 4-Spalten Footer
│   │   │   ├── Layout.tsx                # Wrapper: Header + Main + Footer
│   │   │   └── InfothekDropdown.tsx      # Mega-Dropdown Navigation
│   │   ├── seo/
│   │   │   ├── SEOHead.tsx               # Dynamische Meta-Tags
│   │   │   └── SchemaOrg.tsx             # JSON-LD Schema.org
│   │   └── ui/                           # 50+ shadcn/ui Komponenten
│   │       ├── accordion.tsx, alert.tsx, button.tsx, card.tsx,
│   │       │   checkbox.tsx, dialog.tsx, input.tsx, label.tsx,
│   │       │   select.tsx, tabs.tsx, textarea.tsx, toast.tsx, ...
│   │       └── (etc.)
│   ├── contexts/
│   │   ├── AuthContext.tsx               # Supabase Auth State
│   │   └── LanguageContext.tsx           # DE/EN Sprachumschaltung
│   ├── hooks/
│   │   ├── use-mobile.tsx               # Mobile-Erkennung
│   │   ├── use-toast.ts                 # Toast Hook
│   │   └── useAdminCheck.ts             # Admin-Rolle prüfen (RPC)
│   ├── integrations/supabase/
│   │   ├── client.ts                    # Supabase Client (auto-generiert)
│   │   └── types.ts                     # Datenbank-Typen (auto-generiert)
│   ├── lib/
│   │   ├── anamneseFormData.ts          # Formular-Datenmodell (605 Zeilen)
│   │   ├── iaaQuestions.ts              # IAA Fragenkatalog (409 Zeilen)
│   │   ├── pdfExport.ts                 # PDF-Export (basic, 267 Zeilen)
│   │   ├── pdfExportEnhanced.ts         # PDF-Export (enhanced, 631 Zeilen)
│   │   ├── datenschutzPdfExport.ts      # Datenschutz-PDF Export
│   │   ├── medicalOptions.ts            # Medizinische Optionslisten
│   │   ├── translations.ts             # Übersetzungen (nav, header, faq, etc.)
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
│   ├── config.toml                      # project_id
│   ├── functions/
│   │   ├── request-verification-code/index.ts  # 2FA Code senden (347 Zeilen)
│   │   ├── verify-code/index.ts                # 2FA Code prüfen (324 Zeilen)
│   │   ├── submit-anamnesis/index.ts           # Anamnese einreichen (555 Zeilen)
│   │   └── send-verification-email/index.ts    # (Legacy)
│   └── migrations/                      # DB-Migrationen (read-only)
├── .env                                 # Umgebungsvariablen
├── components.json                      # shadcn/ui Konfiguration
├── eslint.config.js
├── index.html
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 3. Design System (vollständig)

### 3.1 Typografie

**Font-Import (index.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
```

| Verwendung | Font | Tailwind-Klasse |
|---|---|---|
| Body / Fließtext | Source Sans 3 | `font-sans` |
| Überschriften (h1-h6) | Playfair Display | `font-serif` |

**CSS-Regeln:**
```css
body { font-family: 'Source Sans 3', system-ui, sans-serif; }
h1-h6 { font-family: 'Playfair Display', Georgia, serif; font-weight: 500; letter-spacing: -0.025em; }
```

### 3.2 Farbpalette – Light Mode (:root)

```css
:root {
  --background: 40 30% 97%;        /* Warmer Elfenbein */
  --foreground: 150 20% 15%;       /* Dunkles Salbeigrün */
  --card: 40 25% 95%;
  --card-foreground: 150 20% 15%;
  --popover: 40 30% 97%;
  --popover-foreground: 150 20% 15%;
  --primary: 145 25% 36%;          /* Salbeigrün (Markenfarbe) */
  --primary-foreground: 40 30% 97%;
  --secondary: 35 35% 85%;         /* Warmer Sandton */
  --secondary-foreground: 150 20% 20%;
  --muted: 145 15% 90%;
  --muted-foreground: 150 10% 45%;
  --accent: 18 45% 55%;            /* Terracotta */
  --accent-foreground: 40 30% 97%;
  --destructive: 0 65% 50%;
  --destructive-foreground: 40 30% 97%;
  --border: 145 15% 85%;
  --input: 145 15% 88%;
  --ring: 145 25% 36%;
  --radius: 0.75rem;
}
```

### 3.3 Erweiterte Farbpaletten

**Sage (Salbeigrün, 8 Stufen):**
```css
--sage-50: 145 25% 96%; --sage-100: 145 22% 90%; --sage-200: 145 20% 80%;
--sage-300: 145 20% 65%; --sage-400: 145 22% 50%; --sage-500: 145 25% 36%;
--sage-600: 145 28% 28%; --sage-700: 145 30% 22%;
```

**Sand (4 Stufen):**
```css
--sand-50: 35 40% 97%; --sand-100: 35 38% 92%;
--sand-200: 35 35% 85%; --sand-300: 35 30% 75%;
```

**Terracotta (2 Stufen):**
```css
--terracotta: 18 45% 55%; --terracotta-light: 18 40% 70%;
```

### 3.4 Dark Mode (.dark)

```css
.dark {
  --background: 150 20% 8%;     --foreground: 40 25% 95%;
  --card: 150 18% 12%;          --primary: 145 30% 50%;
  --secondary: 150 15% 18%;     --muted: 150 15% 18%;
  --accent: 18 40% 50%;         --destructive: 0 55% 45%;
  --border: 150 15% 20%;        --ring: 145 30% 50%;
}
```

### 3.5 Gradienten

```css
--gradient-hero:   linear-gradient(135deg, hsl(145 25% 36% / 0.9), hsl(145 30% 28% / 0.95));
--gradient-card:   linear-gradient(180deg, hsl(40 30% 97%), hsl(40 25% 94%));
--gradient-accent: linear-gradient(135deg, hsl(18 45% 55%), hsl(18 50% 45%));
```

### 3.6 Schatten

```css
--shadow-soft:     0 4px 20px -4px hsl(145 20% 30% / 0.1);
--shadow-card:     0 8px 30px -8px hsl(145 20% 30% / 0.12);
--shadow-elevated: 0 20px 50px -15px hsl(145 20% 20% / 0.2);
```

### 3.7 Animationen

```css
.animate-fade-in  { animation: fadeIn 0.6s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
```

### 3.8 Button-Varianten

| Variante | Klassen |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-sage-600 shadow-soft` |
| `outline` | `border-2 border-primary bg-transparent text-primary hover:bg-primary` |
| `ghost` | `hover:bg-sage-100 hover:text-primary` |
| `hero` | `bg-primary shadow-elevated text-base px-8 py-6 rounded-xl` |
| `accent` | `bg-accent text-accent-foreground hover:bg-terracotta-light` |

### 3.9 Container

```typescript
container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } }
```

### 3.10 Print-Styles

Definiert in `index.css`: Header/Footer/Buttons werden ausgeblendet, `.print-view` wird als absolute Vollseite angezeigt, A4-Format mit 1.5cm Rändern.

---

## 4. Routing & Navigation

### 4.1 Route-Konfiguration (App.tsx)

```typescript
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
```

### 4.2 Geschützte Routen

`ProtectedRoute.tsx` prüft `useAuth()`. Dev-Bypass: `?dev=true` in Preview/Dev-Umgebungen.

### 4.3 Provider-Hierarchie (App.tsx)

```
QueryClientProvider → LanguageProvider → AuthProvider → TooltipProvider
  → Toaster + Sonner + SchemaOrg → BrowserRouter → CookieBanner + Routes
```

### 4.4 Header-Navigation

**Desktop (≥ lg):**
- Start, Erstanmeldung, Test (nur Admin+Preview)
- Infothek-Dropdown (3 Gruppen: Für Patienten, Wissen & Therapie, Praktisches)
- Sprachumschalter (DE/EN)
- Login/Logout + Dashboard/Admin (wenn eingeloggt + Admin)

**Mobile (< lg):**
- Hamburger-Menü mit Slide-Up Animation
- Infothek als aufklappbare Gruppe

### 4.5 Infothek-Dropdown Inhalte

**Für Patienten:** Anamnesebogen, Datenschutzerklärung, Patientenaufklärung
**Wissen & Therapie:** Heilpraktiker, Frequenztherapie (→ /krankheit-ist-messbar.html), Diamond Shield Zapper (→ /zapper-diamond-shield.html)
**Praktisches:** GebÜH, FAQ

### 4.6 Footer

4-Spalten Grid: Brand/Logo, Quick Links (Anamnesebogen, Heilpraktiker, GebÜH, Ernährung, FAQ), Kontakt (Tel, Mail, Adresse), Website-Link. Fußzeile: © + Impressum + Datenschutz.

**Praxis-Kontaktdaten:**
- Telefon: 0821-2621462
- E-Mail: info@rauch-heilpraktiker.de
- Adresse: Friedrich-Deffner-Straße 19a, 86163 Augsburg

---

## 5. Authentifizierung & Sicherheit

### 5.1 AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
```

Verwendet `supabase.auth.onAuthStateChange()` + `getSession()`. Session wird in localStorage persistiert.

### 5.2 Auth-Flow (Auth.tsx – 861 Zeilen)

**3 Modi:** `login` | `registration` | `password_reset`
**2 Schritte:** `credentials` → `verification` (bzw. `reset_password`)

**Login-Flow:**
1. E-Mail + Passwort eingeben
2. `signInWithPassword()` → sofort `signOut()` (Passwort-Prüfung ohne Session)
3. Edge Function `request-verification-code` → 6-stelliger Code per E-Mail
4. Code eingeben → Edge Function `verify-code` → Magic Link Token
5. `verifyOtp({ token_hash, type: 'magiclink' })` → Session erstellt
6. Weiterleitung zu `/anamnesebogen`

**Registrierung-Flow:**
1. E-Mail + Passwort + Passwort-Bestätigung
2. Edge Function `request-verification-code` → erstellt User (unbestätigt) + sendet Code
3. Code eingeben → Edge Function `verify-code` → bestätigt E-Mail
4. `signInWithPassword()` → Session erstellt

**Passwort-Reset-Flow:**
1. E-Mail eingeben → Edge Function sendet Code
2. Code + neues Passwort eingeben → Edge Function aktualisiert Passwort

### 5.3 Admin-Prüfung

`useAdminCheck.ts` verwendet `supabase.rpc('has_role', { _user_id, _role: 'admin' })`.

### 5.4 Validierung

- E-Mail: `z.string().email().max(255)`
- Passwort: `z.string().min(8)`
- OTP-Code: 6-stellig via `InputOTP`

---

## 6. Datenbank-Schema (SQL)

### 6.1 Enums

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');
CREATE TYPE public.language_code AS ENUM ('de', 'en');
```

### 6.2 Tabellen

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

### 6.3 Datenbank-Funktion

```sql
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

---

## 7. Edge Functions (Backend)

### 7.1 request-verification-code (347 Zeilen)

**Endpoint:** `POST /functions/v1/request-verification-code`
**Eingabe:** `{ email, type: 'login'|'registration'|'password_reset', password?, userId? }`
**Logik:**
1. Zod-Validierung + E-Mail normalisieren (lowercase, trim)
2. Rate-Limiting: 5 Anfragen pro 15 Min pro email+type
3. User-Lookup via `profiles`-Tabelle
4. **Login:** userId muss existieren
5. **Registration:** Prüft ob E-Mail existiert → `auth.admin.createUser({ email, password, email_confirm: false })`
6. **Password Reset:** Stille Antwort wenn E-Mail nicht existiert (Sicherheit)
7. 6-stelliger Code generieren, in `verification_codes` speichern (10 Min gültig)
8. E-Mail via PHP-Relay senden (HTML-Template mit Code-Box)
**Mail-Relay:** `https://rauch-heilpraktiker.de/mail-relay.php` mit `X-Relay-Token` Header

### 7.2 verify-code (324 Zeilen)

**Endpoint:** `POST /functions/v1/verify-code`
**Eingabe:** `{ email, code, type, newPassword? }`
**Logik:**
1. Rate-Limiting: 10 Versuche pro Stunde
2. Code in `verification_codes` prüfen (nicht abgelaufen, nicht benutzt)
3. Code als `used` markieren
4. **Registration:** `auth.admin.updateUserById(userId, { email_confirm: true })`
5. **Login:** `auth.admin.generateLink({ type: 'magiclink', email })` → hashed_token zurückgeben
6. **Password Reset:** `auth.admin.updateUserById(userId, { password: newPassword })`

### 7.3 submit-anamnesis (555 Zeilen)

**Endpoint:** `POST /functions/v1/submit-anamnesis`
**Eingabe:** `{ action: 'submit'|'confirm', email, formData?, code?, submissionId?, tempUserId?, pdfBase64? }`

**Action "submit":**
1. Rate-Limiting
2. Formulardaten in DB speichern (oder Draft aktualisieren) → Status `pending_verification`
3. 6-stelliger Code generieren + in `verification_codes` speichern (Typ: `anamnesis`)
4. Code-E-Mail an Patient senden (§ 126a BGB Hinweis)
5. Rückgabe: `{ submissionId, tempUserId }`

**Action "confirm":**
1. Code verifizieren
2. Submission-Status auf `verified` setzen + `signature_data` speichern
3. **Praxis-Benachrichtigung:** E-Mail an `info@rauch-heilpraktiker.de` mit Patientendaten + PDF-Anhang
4. **Patienten-Bestätigung:** E-Mail an Patient mit Bestätigung + PDF-Anhang
5. Fallback: Wenn PDF-Anhang zu groß → E-Mail ohne Anhang + Hinweis
6. RFC 2047 Encoding für UTF-8 Subject (Umlaute)

### 7.4 Secrets (Edge Functions)

- `RELAY_SECRET`: Token für PHP Mail-Relay
- `SUPABASE_SERVICE_ROLE_KEY`: Automatisch verfügbar
- `SUPABASE_URL`: Automatisch verfügbar

---

## 8. Seiten-Dokumentation (alle Pages)

### 8.1 Index (Startseite)

**Datei:** `src/pages/Index.tsx` (17 Zeilen)
**Aufbau:** `Layout > SEOHead + HeroSection + FeaturesSection + InfoSection`

**HeroSection:** Vollbild-Naturbild (`hero-nature.jpg`) mit Gradient-Overlay (`from-sage-700/90 via-sage-600/80 to-sage-500/70`). Titel: "Ganzheitliche Heilkunde für Körper und Seele". Zwei CTAs: "Anamnesebogen ausfüllen" (hero-Variante) + "Häufige Fragen" (outline). Dekorative SVG-Welle am unteren Rand.

**FeaturesSection:** 5 Feature-Karten (Anamnesebogen [accent-hervorgehoben], Heilpraktiker, Frequenztherapie, GebÜH, FAQ). Grid: `md:grid-cols-2 lg:grid-cols-3`. Hover: `-translate-y-1` + Shadow-Elevation.

**InfoSection:** 2-Spalten Layout. Links: Text "Naturheilkunde mit Herz und Verstand" + 3 Benefits (Ganzheitlicher Ansatz, Natürliche Heilmethoden, Individuelle Betreuung). Rechts: Dekoratives Quadrat mit Schopenhauer-Zitat + farbige Kreise als Dekoration.

### 8.2 Auth (Login/Register/Reset)

**Datei:** `src/pages/Auth.tsx` (861 Zeilen)
**Aufbau:** Layout > Card mit Tabs (Anmelden/Registrieren) + Passwort-vergessen Link
**Details:** Siehe Abschnitt 5.2.

### 8.3 Anamnesebogen (Hauptformular)

**Datei:** `src/pages/Anamnesebogen.tsx` (879 Zeilen)
**Schutz:** `ProtectedRoute`

**Layout-Auswahl:** 2 Karten nebeneinander
1. **Wizard (Schritt für Schritt):** Emojis, Fortschrittsleiste, Einzelschritte
2. **Accordion (Alle Bereiche sichtbar):** Icons, frei navigierbar

**26 Sektionen:** Intro, Patientendaten, Familie, Kopf&Sinne, Herz, Lunge, Magen&Darm, Leber, Niere, Hormone, Bewegungsapparat, Frauengesundheit, Männergesundheit, Unfälle&OPs, Krebs, Allergien, Medikamente, Lebensweise, Zahngesundheit, Umwelt, Infektionen, Impfstatus, Beschwerden, Präferenzen, Persönliches, Unterschrift

**Features:**
- Auto-Save: LocalStorage (`anamnesebogen_form_data`) mit 2s Debounce
- Sektionsfarben: Jede Sektion hat eigene Hintergrundfarbe
- Druckansicht: `PrintView`-Komponente
- Zusammenfassung: `FilteredSummaryView` (nur ausgefüllte Felder)
- PDF-Export: `generateEnhancedAnamnesePdf`
- 2FA-Signatur: `VerificationDialog` → Edge Function `submit-anamnesis`

### 8.4 AnamneseDemo

**Datei:** `src/pages/AnamneseDemo.tsx` (603 Zeilen)
**Zugang:** Öffentlich (kein Auth nötig), URL: `/anamnesebogen-demo`
**Inhalt:** Vorausgefülltes Formular mit fiktivem Patient "Xaver Lovable" (geb. 01.12.1976, Augsburg). Vollständige Testdaten für alle Sektionen. Accordion-Layout. Volle Submit-Funktionalität inkl. 2FA.

### 8.5 Erstanmeldung (5-Schritt-Onboarding)

**Datei:** `src/pages/Erstanmeldung.tsx` (621 Zeilen)
**Schutz:** `ProtectedRoute`

**Gate:** Telefontermin-Bestätigung (Checkbox: "Ich habe bereits telefonisch einen Termin vereinbart")

**5 Schritte:**
1. **Übersicht:** 4 Dokumente als Karten mit Fortschrittsanzeige
2. **Anamnesebogen:** Link zu `/anamnesebogen`, zeigt Status (erledigt/offen)
3. **Datenschutz:** DSGVO-Text + Checkbox-Einwilligung
4. **Patientenaufklärung:** Kosten/GebÜH/Regelungen + Checkbox-Einwilligung
5. **IAA-Fragebogen:** Eingebettetes `IAAForm` mit Slider (0-10) pro Frage, Submit an DB

### 8.6 Datenschutz

**Datei:** `src/pages/Datenschutz.tsx` (300 Zeilen)
**Inhalt:** 14 Sektionen (Zweck, Welche Daten, Voraussetzung, Empfänger, Rechtsgrundlage, Datensicherheit, Speicherdauer, Rechte, Auskunft, Widerspruch, Löschung, Beschwerderecht, Newsletter, KI-Plattform). PDF-Download-Button via `datenschutzPdfExport.ts`. DSGVO-Badge.

### 8.7 Patientenaufklärung

**Datei:** `src/pages/Patientenaufklaerung.tsx` (342 Zeilen)
**Inhalt:** GKV-Hinweis, Kostenerstattung, GebÜH-Erklärung, Preisliste (DB-gesteuert via `practice_pricing`), Zahlungspflicht, Terminregelung (48h Absagefrist), Therapeuten-Verhinderung, Datenschutz-Verweis.

### 8.8 FAQ

**Datei:** `src/pages/FAQ.tsx` (122 Zeilen)
**Datenquelle:** Supabase `faqs`-Tabelle (published, sortiert)
**Darstellung:** Accordion. Kontakt-CTA am Ende.

### 8.9 Weitere Seiten

- **Heilpraktiker:** Was ist ein Heilpraktiker? Qualifikation, Zulassung, Behandlungsmethoden
- **Gebueh:** GebÜH-Erklärung + Beispiel-Tabelle (Ziffern 1-25)
- **Frequenztherapie:** Beschreibung, 4 Anwendungsgebiete, Behandlungsablauf, Hinweis
- **Ernaehrung:** 4 Grundtipps, Empfehlungen (gut/schlecht), Verdauung/Energie-Tipps
- **PraxisInfo:** DB-gesteuert (practice_info), Schopenhauer-Zitat
- **Impressum:** § 5 TMG, Kontakt, Berufsbezeichnung, BDH-Mitgliedschaft, Haftung
- **AdminDashboard:** 3 Tabs (FAQs, Praxis-Info, Preise) – nur für Admins
- **PatientDashboard:** Anamnese-Übersicht, PDF-Download, Dokumente

---

## 9. Komponenten-Architektur

### 9.1 Layout-System

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

### 9.2 Anamnese-Sektionskomponenten

Jede Sektion empfängt `formData`, `updateFormData(field, value)` und `language`.
Gemeinsame Hilfskomponenten:
- `MultiSelectCheckbox`: Checkboxen mit Mehrfachauswahl
- `MultiEntryField`: Dynamische Liste (z.B. Medikamente, Operationen)
- `TemporalStatusSelect`: "aktuell" / "seit [Jahr]" / "früher"
- `YearMonthSelect`: Jahr+Monat Auswahl
- `NumericInput`: Zahlenfeld mit Einheit
- `DentalChart` / `ToothDiagram`: Interaktives Zahnschema (32 Zähne, FDI-Nomenklatur)
- `SubConditionList`: Unterbedingungen bei Ja/Nein-Feldern

### 9.3 Verification Dialog

Modal mit 6-stelligem OTP-Input. Zeigt E-Mail-Adresse, Timer, Resend-Button. Verwendet `InputOTP` von shadcn.

---

## 10. Anamnesebogen-Datenmodell

**Datei:** `src/lib/anamneseFormData.ts` (605 Zeilen)

### 10.1 formSections (26 Sektionen)

Jede Sektion hat: `id`, `titleDe`, `titleEn`, `emoji`, `icon` (Lucide-Name), `color` (Tailwind-Klassen), `iconColor`.

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

### 10.2 initialFormData Datenstruktur

Das `initialFormData`-Objekt enthält ~250+ Felder, organisiert in verschachtelten Objekten. Hauptbereiche:

- **Patientendaten:** nachname, vorname, geburtsdatum, geschlecht, kontaktdaten, versicherung, beruf, körpermaße
- **Familie:** 12 Erkrankungen (hoherBlutdruck bis autoimmun) mit Verwandten-Zuordnung
- **Kopf&Sinne:** Augen (10 Sub), Ohren (7 Sub), Sinusitis, Kopfschmerzen (8 Sub), Schwindel, Neuralgien
- **Schlaf&Psyche:** 12 Symptome mit Seit/Status, 8 psychische Erkrankungen
- **Herz:** 14 Bedingungen (Blutdruck, Rhythmus, Schrittmacher, Thrombose, Ödeme, etc.)
- **Lunge:** 11 Bedingungen (Asthma, Bronchitis, COPD, Husten, Atemnot, etc.)
- **Magen&Darm:** 14 Bedingungen + Durst/Appetit/Ernährungstyp
- **Leber:** 8 Bedingungen (Hepatitis A/B/C, Zirrhose, Gallensteine, etc.)
- **Niere:** 8 Bedingungen (Blasenentzündung, Inkontinenz, Nierensteine, etc.)
- **Männer:** Prostata (6 Sub), Hoden (6 Sub), Nebenhoden, Erektionsstörung
- **Hormone:** Schilddrüse (10 Sub), Hypophyse (5 Sub), Nebenniere (5 Sub)
- **Bewegungsapparat:** HWS/BWS/LWS (je 3 Sub), 8 Gelenke (beidseitig), Rheuma
- **Haut:** 9 Bedingungen (Ekzem, Psoriasis, Akne, Hyperhidrose, etc.)
- **Frauen:** Gesamter gynäkologischer Bereich (20+ Felder)
- **Unfälle/OPs:** Operationen-Liste, Nuklearmedizin, Krankenhausaufenthalte
- **Krebs:** TNM-Stadium, Therapien, Metastasen
- **Allergien:** Inhalation, Nahrung, Medikamente, Kontakt, Intoleranzen
- **Medikamente:** Aktuelle Liste (Name, Dosis, Grund), Unverträglichkeiten
- **Lebensweise:** Rauchen, Alkohol, Sport, Schlaf, Stress, Ernährung
- **Zahngesundheit:** Gebisstyp, Zahnbefunde (32-Zähne-Schema), Parodontitis, Bruxismus
- **Umwelt:** Chemosensibilität (14 Stoffe), Körperbelastungen (Strahlung, Zahnherde, Toxine)
- **Infektionen:** Tropenreise, Zeckenbiss, Borreliose, Haustiere
- **Impfungen:** 10 Standard + COVID (4 Dosen + Long-COVID)
- **Beschwerden:** Hauptbeschwerde, Verlauf, Schmerzqualität/-intensität (0-10), Verschlimmerung/Verbesserung
- **Präferenzen:** 12 Therapiemethoden (Interesse/Erfahrung)
- **Soziales:** Familienstand, Kinder, Wohnumfeld, Stress, Hobbys
- **Unterschrift:** Ort, Datum, Name, Bestätigungen (Datenschutz, Aufklärung, 2FA)

**TypeScript-Typ:** `export type AnamneseFormData = typeof initialFormData;`

---

## 11. IAA-Fragebogen

**Datei:** `src/lib/iaaQuestions.ts` (409 Zeilen)

### 11.1 Datenstruktur

```typescript
interface IAAQuestion { id: string; textDe: string; textEn: string; hintDe?: string; hintEn?: string; }
interface IAACategory { id: string; titleDe: string; titleEn: string; questions: IAAQuestion[]; }
```

### 11.2 Kategorien (19 Patienten + 1 Therapeut)

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

## 12. PDF-Export

### 12.1 Basic Export (pdfExport.ts, 267 Zeilen)

Einfacher jsPDF-Export ohne Branding. Sektionsheader in Blau, Checkboxen, Seitenzahlen.

### 12.2 Enhanced Export (pdfExportEnhanced.ts, 631 Zeilen)

**Branding-Farben (RGB):**
- Primary: `rgb(76, 140, 74)` – Praxisgrün
- Secondary: `rgb(91, 173, 88)` – Helles Grün
- Text: `rgb(51, 51, 51)`
- Muted: `rgb(120, 120, 120)`

**Praxis-Info im Header/Footer:**
```
Naturheilpraxis Peter Rauch
Peter Rauch, Heilpraktiker
Friedrich-Deffner-Straße 19a, 86163 Augsburg
Tel: 0821-2621462 | info@rauch-heilpraktiker.de
```

**Features:**
- Grüner Header-Balken auf jeder Seite
- Patient-Info-Box (grüner Rahmen)
- Sektionsheader mit grünem Hintergrund + Emoji
- Checkbox-Felder mit grünem Fill
- Footer: Website + Seitenzahl + Datum + Disclaimer
- `generateEnhancedAnamnesePdf()`: Speichert PDF lokal
- `generateAnamnesePdfBase64()`: Gibt Base64-String zurück (für E-Mail-Anhang)

---

## 13. i18n / Mehrsprachigkeit

### 13.1 LanguageContext

```typescript
type Language = 'de' | 'en';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (de: string, en: string) => string;  // Inline-Übersetzung
}
```

Sprache wird in `localStorage.language` persistiert. `document.documentElement.lang` wird gesetzt.

### 13.2 translations.ts

Zentrale Übersetzungsdatei für: Navigation, Header, FAQ-Seite, Praxis-Info, Common-Begriffe.

### 13.3 Verwendung in Komponenten

```tsx
const { t, language } = useLanguage();
// Inline:
<h1>{t("Willkommen", "Welcome")}</h1>
// DB-gesteuert:
{language === 'de' ? faq.question_de : faq.question_en}
```

### 13.4 LanguageSwitcher

Zwei Buttons (DE/EN) in einer Border-Box. Aktive Sprache: `bg-primary text-primary-foreground`.

---

## 14. SEO & Schema.org

### 14.1 SEOHead.tsx

Dynamische Meta-Tags via `useEffect` + `document.createElement`. Setzt: title, description, og:*, twitter:*, canonical, robots.

### 14.2 SchemaOrg.tsx

JSON-LD `@graph` mit:
- `MedicalBusiness` (Name, Adresse, Öffnungszeiten Mo-Fr 9-18, Geo, Services)
- `WebSite` (Name, URL, Sprachen)
- `BreadcrumbList`

**Services:** Irisdiagnose, Darmsanierung, Entgiftungstherapie

---

## 15. DSGVO & Cookie-Banner

### 15.1 CookieBanner.tsx

Erscheint nach 1s Delay wenn kein `cookie-consent` in localStorage. Buttons: "Alle akzeptieren" / "Nur notwendige". Speichert `cookie-consent` + `cookie-consent-date` in localStorage.

### 15.2 Datenschutz-Seite

14 Sektionen mit vollständigem DSGVO-Text (DE + EN). PDF-Download via `datenschutzPdfExport.ts`.

---

## 16. Admin-Dashboard

### 16.1 Zugang

Nur für User mit `app_role = 'admin'` in `user_roles`-Tabelle. Prüfung via `useAdminCheck()` → `has_role` RPC.

### 16.2 Funktionen

3 Tabs:
1. **FAQs:** CRUD für `faqs`-Tabelle (Frage/Antwort DE+EN, Sortierung, Veröffentlichung)
2. **Praxis-Info:** CRUD für `practice_info`-Tabelle (Titel/Inhalt DE+EN, Icon, Sortierung)
3. **Preise:** CRUD für `practice_pricing`-Tabelle (Service, Preis DE+EN, Hinweis, Sortierung)

---

## 17. Externe Abhängigkeiten (Mail-Relay)

### 17.1 PHP Mail-Relay

**URL:** `https://rauch-heilpraktiker.de/mail-relay.php`
**Authentifizierung:** `X-Relay-Token` Header mit `RELAY_SECRET`
**Payload:**
```json
{
  "to": "patient@example.com",
  "subject": "=?UTF-8?B?...?=",
  "html": "<html>...</html>",
  "from": "info@rauch-heilpraktiker.de",
  "attachment": {
    "filename": "Anamnesebogen.pdf",
    "base64": "JVBERi0...",
    "contentType": "application/pdf"
  }
}
```

**Fallback:** Wenn Anhang fehlschlägt → E-Mail ohne Anhang + Hinweis.

---

## 18. Wiederherstellungsanleitung

### 18.1 Frontend

1. Repository klonen / Dateien wiederherstellen
2. `npm install`
3. `.env` konfigurieren (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID)
4. `npm run dev` zum Testen
5. `npm run build` für Produktions-Build

### 18.2 Datenbank

1. SQL-Schema aus Abschnitt 6 im SQL-Editor ausführen
2. RLS-Policies konfigurieren
3. `has_role`-Funktion erstellen
4. Admin-User in `user_roles` eintragen

### 18.3 Edge Functions

1. `supabase functions deploy request-verification-code`
2. `supabase functions deploy verify-code`
3. `supabase functions deploy submit-anamnesis`
4. Secret setzen: `supabase secrets set RELAY_SECRET=...`

### 18.4 Mail-Relay

PHP-Skript auf `rauch-heilpraktiker.de` deployen (siehe `docs/mail-relay-v2.php`).

### 18.5 Kritische Secrets

| Secret | Zweck | Wo gesetzt |
|---|---|---|
| `RELAY_SECRET` | Auth-Token für PHP Mail-Relay | Supabase Secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-Operationen in Edge Functions | Automatisch |

---

*Ende der vollständigen Wiederherstellungsdokumentation*
*Erstellt: 2026-02-22 | Naturheilpraxis Peter Rauch Patienten-App*
