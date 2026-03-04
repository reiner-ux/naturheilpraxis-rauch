# Vollständiger Projekt-Speicherpunkt – 2026-03-04

> **Stand:** 04.03.2026 – Erstellt als kompletter Wiederherstellungspunkt  
> **Projekt:** Naturheilpraxis Peter Rauch – Patienten-App  
> **Plattform:** Lovable Cloud (Supabase-Backend)  
> **Projekt-ID:** `2a361a45-233a-4659-a3f4-a2f1dda0e86d`

---

## Inhaltsverzeichnis

1. [Architektur-Übersicht](#1-architektur-übersicht)
2. [Routing & Seitenstruktur](#2-routing--seitenstruktur)
3. [Authentifizierung & Sicherheit](#3-authentifizierung--sicherheit)
4. [Datenbank-Schema & RLS](#4-datenbank-schema--rls)
5. [Edge Functions](#5-edge-functions)
6. [E-Mail-System (SMTP Relay)](#6-e-mail-system)
7. [Design System](#7-design-system)
8. [Kritische Dateien – Vollständiger Quellcode](#8-kritische-dateien)
9. [Konfigurationsdateien](#9-konfigurationsdateien)
10. [Admin- & Test-Accounts](#10-admin--test-accounts)
11. [Bekannte Besonderheiten](#11-bekannte-besonderheiten)
12. [Abhängigkeiten](#12-abhängigkeiten)

---

## 1. Architektur-Übersicht

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **UI-Bibliothek:** shadcn/ui (Radix Primitives)
- **Backend:** Lovable Cloud (Supabase) – Postgres + Edge Functions (Deno)
- **State Management:** React Context (Auth, Language) + TanStack React Query
- **PDF-Export:** jspdf
- **Routing:** react-router-dom v6
- **E-Mail:** PHP Mail-Relay auf `rauch-heilpraktiker.de`

### Verzeichnisstruktur (Kern)
```
src/
├── App.tsx                    # Router & Provider-Setup
├── main.tsx                   # Entry Point
├── index.css                  # Design Tokens & Animations
├── components/
│   ├── layout/               # Header, Footer, Layout, InfothekDropdown
│   ├── home/                 # HeroSection, FeaturesSection, InfoSection
│   ├── anamnese/             # 25+ Sektions-Komponenten + Shared
│   ├── iaa/                  # IAAForm (Trikombin-Fragebogen)
│   ├── admin/                # FAQManager, PracticeInfoManager, PricingManager, AuditLogManager, ICD10Generator
│   ├── seo/                  # SEOHead, SchemaOrg
│   ├── ui/                   # shadcn/ui Komponenten
│   ├── CookieBanner.tsx
│   ├── LanguageSwitcher.tsx
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   ├── AuthContext.tsx        # Authentifizierung, Admin-Check, Audit-Log
│   └── LanguageContext.tsx    # DE/EN Sprachwechsel
├── hooks/
│   ├── useAdminCheck.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── anamneseFormData.ts   # 606 Zeilen – Komplettt Datenmodell
│   ├── iaaQuestions.ts       # IAA-Fragebogen Fragen
│   ├── icd10Mapping.ts       # ICD-10 Code-Zuordnungen
│   ├── pdfExport.ts          # Basis-PDF-Export
│   ├── pdfExportEnhanced.ts  # Erweiterter PDF-Export mit IAA
│   ├── datenschutzPdfExport.ts
│   ├── icd10PdfExport.ts
│   ├── medicalOptions.ts
│   ├── translations.ts       # Statische Übersetzungen
│   └── utils.ts              # cn() Hilfsfunktion
├── pages/
│   ├── Index.tsx             # Startseite
│   ├── Auth.tsx              # Login/Registrierung/PW-Reset (894 Zeilen)
│   ├── Anamnesebogen.tsx     # Haupt-Anamnesebogen (930 Zeilen)
│   ├── AnamneseDemo.tsx      # Demo mit Beispieldaten
│   ├── Erstanmeldung.tsx     # 3-Schritte-Wizard (555 Zeilen)
│   ├── PatientDashboard.tsx  # Patienten-Übersicht
│   ├── AdminDashboard.tsx    # Admin-Bereich (5 Tabs)
│   ├── Datenschutz.tsx       # DSGVO Seite
│   ├── Patientenaufklaerung.tsx # Kosten & Vereinbarung
│   ├── Heilpraktiker.tsx
│   ├── Frequenztherapie.tsx
│   ├── Ernaehrung.tsx
│   ├── Gebueh.tsx
│   ├── FAQ.tsx
│   ├── PraxisInfo.tsx
│   ├── Impressum.tsx
│   └── NotFound.tsx
└── integrations/supabase/
    ├── client.ts             # Auto-generiert – NICHT EDITIEREN
    └── types.ts              # Auto-generiert – NICHT EDITIEREN

supabase/
├── config.toml               # Auto-generiert – NICHT EDITIEREN
└── functions/
    ├── _shared/smtp.ts       # PHP-Relay E-Mail-Versand
    ├── request-verification-code/index.ts
    ├── verify-code/index.ts
    ├── submit-anamnesis/index.ts
    ├── send-verification-email/index.ts  # Legacy (SMTP direkt)
    ├── generate-icd10/index.ts
    └── send-icd10-report/index.ts
```

---

## 2. Routing & Seitenstruktur

### App.tsx – Routing-Konfiguration
```tsx
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

### Navigation
- **Header:** Start, (🧪 Test – nur für Admins), Erstanmeldung, Infothek-Dropdown
- **Infothek-Gruppen:** 
  - Für Patienten: Anamnesebogen, Datenschutz, Patientenaufklärung
  - Wissen & Therapie: Heilpraktiker, Frequenztherapie, Diamond Shield Zapper
  - Praktisches: GebÜH, FAQ
- **Admin-Links:** Dashboard, Admin (nur sichtbar bei `isAdmin === true`)

---

## 3. Authentifizierung & Sicherheit

### Auth-Flow (Auth.tsx)
1. **Login:** E-Mail + Passwort → Passwort-Check via `signInWithPassword`
   - Admin erkannt → Direkt-Login (kein 2FA)
   - Patient → SignOut → 2FA-Code per E-Mail → `verifyOtp` mit Magic-Link-Token
2. **Registrierung:** E-Mail + Passwort → Edge Function erstellt unbestätigten User → 6-stelliger Code per E-Mail → Bestätigung → `email_confirm: true` → Auto-Login
3. **Passwort-Reset:** E-Mail → 6-stelliger Code → Neues Passwort setzen

### AuthContext
- Verwaltet `user`, `session`, `isAdmin`, `loading`
- Admin-Check via `supabase.rpc('has_role', { _user_id, _role: 'admin' })`
- Audit-Log bei Login/Logout (DSGVO)
- Initiale Session-Prüfung mit `getSession()` VOR dem Listener

### ProtectedRoute
- Prüft `user` aus AuthContext
- Dev-Bypass: `?dev=true` in Non-Production-Umgebungen
- Redirect auf `/auth` mit `state.from` für Rücknavigation

### Login-Seite Titel
- **"Praxis-Login"** (nicht "Patientenportal") – neutral für Admins und Patienten

### Test-Link Sichtbarkeit
- 🧪 Test-Link im Header: Nur sichtbar wenn `isAdmin === true`
- Verlinkt auf `/anamnesebogen?dev=true`

---

## 4. Datenbank-Schema & RLS

### Enums
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');
CREATE TYPE public.language_code AS ENUM ('de', 'en');
```

### Tabellen

#### profiles
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  first_name text, last_name text,
  date_of_birth date, phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
-- RLS: SELECT/UPDATE eigene; INSERT eigene
```

#### user_roles
```sql
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role DEFAULT 'patient',
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT eigene; kein INSERT/UPDATE/DELETE für Clients
```

#### anamnesis_submissions
```sql
CREATE TABLE public.anamnesis_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  form_data jsonb NOT NULL,
  status text DEFAULT 'draft',  -- draft | pending_verification | verified | submitted
  submitted_at timestamptz DEFAULT now(),
  signature_data text,
  updated_at timestamptz DEFAULT now()
);
-- RLS: SELECT/INSERT/UPDATE/DELETE eigene; Admins SELECT alle
```

#### iaa_submissions
```sql
CREATE TABLE public.iaa_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  form_data jsonb DEFAULT '{}',
  status text DEFAULT 'draft',
  submitted_at timestamptz DEFAULT now(),
  therapist_data jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  appointment_number integer DEFAULT 1
);
-- RLS: SELECT/INSERT/UPDATE eigene; Admins ALL
```

#### verification_codes
```sql
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL,
  type text DEFAULT 'login',  -- login | registration | password_reset | anamnesis
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT eigene; kein Client INSERT/UPDATE/DELETE
```

#### audit_log
```sql
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address text, user_agent text,
  created_at timestamptz DEFAULT now()
);
-- RLS: INSERT eigene; Admins SELECT alle
```

#### faqs, practice_info, practice_pricing
- Öffentliches SELECT für `is_published = true`
- Admin CRUD via `has_role('admin', auth.uid())`

### Datenbank-Funktion
```sql
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;
```

---

## 5. Edge Functions

### request-verification-code
- **Pfad:** `supabase/functions/request-verification-code/index.ts`
- **Typen:** login, registration, password_reset
- Rate Limiting: 5 Requests / 15 Min pro E-Mail+Typ
- Registrierung: Erstellt unbestätigten Auth-User, bereinigt Ghost-Accounts
- E-Mail-Versand via `_shared/smtp.ts` (PHP Relay)

### verify-code
- **Pfad:** `supabase/functions/verify-code/index.ts`
- Verifiziert 6-stelligen Code aus `verification_codes`
- Login: Generiert Magic-Link-Token via `admin.generateLink`
- Registration: Bestätigt E-Mail via `admin.updateUserById({ email_confirm: true })`
- Password Reset: Ändert Passwort via `admin.updateUserById({ password })`
- Rate Limiting: 10 Versuche / Stunde

### submit-anamnesis
- **Pfad:** `supabase/functions/submit-anamnesis/index.ts`
- **Aktionen:** `submit` (Formular speichern + Code senden) und `confirm` (Code verifizieren + E-Mails senden)
- Sendet bei Bestätigung:
  - Benachrichtigung an `info@rauch-heilpraktiker.de` + `praxis_rauch@icloud.com` (mit PDF)
  - Bestätigung an Patient (mit PDF-Kopie)
- DSGVO Audit-Log-Eintrag
- Digitale Signatur: `§ 126a BGB` Referenz

### generate-icd10
- **Pfad:** `supabase/functions/generate-icd10/index.ts`
- Nur für Admins (Auth + Role-Check)
- Feste ICD-10-Zuordnungen + KI-basierte Freitext-Analyse (Lovable AI Gateway, Gemini)
- DSGVO: Nur anonymisierte Symptome an KI, keine Patientendaten

### send-icd10-report
- **Pfad:** `supabase/functions/send-icd10-report/index.ts`
- Admin-only, sendet ICD-10 PDF-Bericht per E-Mail

### _shared/smtp.ts
- PHP-Relay auf `https://rauch-heilpraktiker.de/mail-relay.php`
- Benötigt `RELAY_SECRET` Environment Variable
- Unterstützt PDF-Anhänge (Base64)
- Fallback: Sendet ohne Anhang bei Fehler
- Lokale Zustellung (same-domain): 60s Delay für QMail

---

## 6. E-Mail-System

### Architektur
```
Edge Function → _shared/smtp.ts → PHP Mail-Relay → QMail/SMTP → Empfänger
```

### Relay-URL
`https://rauch-heilpraktiker.de/mail-relay.php`

### Authentifizierung
Header `X-Relay-Token` mit Wert aus Secret `RELAY_SECRET`

### E-Mail-Typen
1. **Verifizierungscode** (Login, Registration, Password Reset)
2. **Anamnese-Verifizierungscode** (2FA für Formular-Submit)
3. **Anamnese-Bestätigung** (an Patient + Praxis, mit PDF)
4. **ICD-10-Bericht** (an Praxis, mit PDF)

---

## 7. Design System

### Fonts
- **Serif:** Playfair Display (Überschriften)
- **Sans:** Source Sans 3 (Body)
- Import via Google Fonts in `index.css`

### Farbpalette (HSL)
```css
:root {
  --primary: 145 25% 36%;        /* Sage Green */
  --secondary: 35 35% 85%;       /* Warm Sand */
  --accent: 18 45% 55%;          /* Terracotta */
  --background: 40 30% 97%;      /* Warm White */
  --foreground: 150 20% 15%;     /* Dark Green */
  --destructive: 0 65% 50%;      /* Red */
}
```

### Custom Tokens
- Sage Scale: `--sage-50` bis `--sage-700`
- Sand Scale: `--sand-50` bis `--sand-300`
- Terracotta: `--terracotta`, `--terracotta-light`
- Gradients: `--gradient-hero`, `--gradient-card`, `--gradient-accent`
- Shadows: `--shadow-soft`, `--shadow-card`, `--shadow-elevated`

### Button-Variante
- `variant="hero"` + `size="xl"` für Hero-CTAs (definiert in button.tsx)

---

## 8. Kritische Dateien

### Auth.tsx (894 Zeilen)
- 3 Modi: login, registration, password_reset
- 3 Steps: credentials, verification, reset_password
- Admin-2FA-Bypass nach Passwort-Check
- Titel: "Praxis-Login" (neutral)
- Beschreibung: "Sichere Anmeldung mit Passwort und 2FA"
- Erstanmeldung-Redirect nach Login/Registration

### Anamnesebogen.tsx (930 Zeilen)
- Layout-Selector: Wizard vs. Accordion
- 27 Sektionen (inkl. IAA als Sektion XXIV)
- Autosave im localStorage (user-specific + email-cache Fallback)
- 2FA-Verifizierung via VerificationDialog
- PDF-Export (Enhanced + Base64 für E-Mail)
- Rück-Navigation zu /erstanmeldung wenn `from === "erstanmeldung"`

### Erstanmeldung.tsx (555 Zeilen)
- 4 Steps: Übersicht, Anamnesebogen, Patientenaufklärung, Datenschutz
- Termin-Pflicht-Gate (Checkbox: telefonisch vereinbart)
- Persistierung im localStorage (user-specific)
- Query auf `anamnesis_submissions` für Status-Check
- Eingebettete Preis-Tabelle aus `practice_pricing`

### AuthContext.tsx (119 Zeilen)
- Provider mit `user`, `session`, `loading`, `isAdmin`, `signOut`
- Admin-Check via RPC `has_role`
- Audit-Log bei SIGNED_IN Events
- `isMounted` Pattern gegen Memory Leaks

### Header.tsx (239 Zeilen)
- Test-Link nur für Admins (`showTestLink = isAdmin`)
- Desktop + Mobile Navigation
- Infothek Dropdown Integration
- Auth-Buttons (Login/Logout/Dashboard/Admin)

### anamneseFormData.ts (606 Zeilen)
- 27 Formular-Sektionen mit Emoji, Icon, Farbe
- Vollständiges `initialFormData` Objekt mit allen Feldern
- Typ `AnamneseFormData = typeof initialFormData`

---

## 9. Konfigurationsdateien

### index.html
- Lang: `de`
- Canonical: `https://rauch-heilpraktiker.de/`
- Geo-Tags für Augsburg (48.3561, 10.9056)
- OG + Twitter Meta Tags

### vite.config.ts
- Port: 8080, Host: `::`
- HMR Overlay: disabled
- Alias: `@` → `./src`
- Plugin: `lovable-tagger` (dev only)

### tailwind.config.ts
- Fonts: Source Sans 3, Playfair Display
- Alle Design-Token-Farben (sage, sand, terracotta, sidebar)
- Container: max 1400px, 2rem padding

---

## 10. Admin- & Test-Accounts

| E-Mail | Rolle | Zweck |
|--------|-------|-------|
| redshift-three@gmx.com | admin | Haupt-Admin |
| aktiv@webdesign-pur.de | admin | Entwickler-Admin |
| info@rauch-heilpraktiker.de | admin | Praxis-Admin |
| praxis_rauch@icloud.com | patient | Test-Patient |

---

## 11. Bekannte Besonderheiten

### Ghost-Account-Bereinigung
Bei Registrierung werden unbestätigte Auth-User (ohne `email_confirmed_at`) automatisch gelöscht und neu erstellt.

### localStorage-Keys
- `anamnesebogen:draft:{userId}` – Formular-Entwurf
- `anamnesebogen:email-cache:{email}` – E-Mail-basierter Cache (Fallback)
- `erstanmeldung:state:{userId}` – Onboarding-Fortschritt
- `cookie-consent` – Cookie-Banner Status
- `language` – Sprachpräferenz (de/en)

### 2FA-Architektur
- Login-2FA: Nur für Non-Admins
- Anamnese-2FA: Für alle (rechtssichere digitale Unterschrift § 126a BGB)
- Codes: 6-stellig, 10 Min gültig

### E-Mail-Delay
Lokale Zustellung (an @rauch-heilpraktiker.de) hat 60s Delay wegen QMail Same-Domain-Routing.

### Statische HTML-Seiten
- `/krankheit-ist-messbar.html` – Frequenztherapie (external link)
- `/zapper-diamond-shield.html` – Zapper Info (external link)

---

## 12. Abhängigkeiten

### Produktions-Dependencies
```json
{
  "@supabase/supabase-js": "^2.90.1",
  "@tanstack/react-query": "^5.83.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "jspdf": "^4.0.0",
  "lucide-react": "^0.462.0",
  "zod": "^3.25.76",
  "sonner": "^1.7.4",
  "date-fns": "^3.6.0",
  "input-otp": "^1.4.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0",
  "recharts": "^2.15.4",
  "cmdk": "^1.1.1",
  "embla-carousel-react": "^8.6.0",
  "next-themes": "^0.3.0",
  "react-day-picker": "^8.10.1",
  "react-resizable-panels": "^2.1.9",
  "vaul": "^0.9.9"
}
```

### Dev-Dependencies
```json
{
  "vite": "^5.4.19",
  "typescript": "^5.8.3",
  "tailwindcss": "^3.4.17",
  "vitest": "^3.2.4",
  "@vitejs/plugin-react-swc": "^3.11.0",
  "lovable-tagger": "^1.1.13"
}
```

### Supabase Secrets (erforderlich)
- `RELAY_SECRET` – PHP Mail-Relay Authentifizierung
- `SUPABASE_URL` – Auto-konfiguriert
- `SUPABASE_SERVICE_ROLE_KEY` – Auto-konfiguriert
- `SUPABASE_ANON_KEY` – Auto-konfiguriert
- `LOVABLE_API_KEY` – Für KI-basierte ICD-10-Analyse

---

> **WICHTIG:** Die Dateien `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/config.toml` und `.env` werden automatisch generiert und dürfen NICHT manuell editiert werden.

---

*Erstellt am 04.03.2026 – Naturheilpraxis Peter Rauch Patienten-App*
