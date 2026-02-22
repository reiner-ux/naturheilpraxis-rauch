# Naturheilpraxis Peter Rauch – Patienten-App
## Vollständige Projektdokumentation & Wiederherstellungspunkt

**Stand:** 2026-02-22  
**Version:** Produktiv  
**Projekt-ID (Lovable):** 2a361a45-233a-4659-a3f4-a2f1dda0e86d  
**Backend-ID:** jmebqjadlpltnqawoipb  
**Published URL:** https://naturheilpraxis-rauch.lovable.app  
**Preview URL:** https://id-preview--2a361a45-233a-4659-a3f4-a2f1dda0e86d.lovable.app  

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Technologie-Stack](#2-technologie-stack)
3. [Dateistruktur](#3-dateistruktur)
4. [Design System](#4-design-system)
5. [Routing & Navigation](#5-routing--navigation)
6. [Authentifizierung & Rollen](#6-authentifizierung--rollen)
7. [Datenbank-Schema](#7-datenbank-schema)
8. [Edge Functions (Backend)](#8-edge-functions-backend)
9. [Seitenkomponenten im Detail](#9-seitenkomponenten-im-detail)
10. [Anamnesebogen-System](#10-anamnesebogen-system)
11. [IAA-Fragebogen-System](#11-iaa-fragebogen-system)
12. [Erstanmeldung-Workflow](#12-erstanmeldung-workflow)
13. [E-Mail-System](#13-e-mail-system)
14. [PDF-Export](#14-pdf-export)
15. [SEO & Structured Data](#15-seo--structured-data)
16. [Internationalisierung (i18n)](#16-internationalisierung-i18n)
17. [DSGVO-Compliance](#17-dsgvo-compliance)
18. [Admin-Dashboard](#18-admin-dashboard)
19. [Secrets & Konfiguration](#19-secrets--konfiguration)
20. [Wiederherstellungsanleitung](#20-wiederherstellungsanleitung)

---

## 1. Projektübersicht

### Zweck
Patienten-App für die **Naturheilpraxis Peter Rauch** (www.rauch-heilpraktiker.de) in Augsburg. Die App dient der digitalen Patientenaufnahme, dem Informationsangebot und der Praxisverwaltung.

### Kernfunktionen
- **Digitaler Anamnesebogen** mit 25+ medizinischen Sektionen (Wizard + Akkordeon-Modus)
- **IAA-Fragebogen** (Individuelle Austestung & Analyse) für Trikombin-Gerät (~200 Fragen)
- **Erstanmeldungs-Workflow** mit Telefon-Gate und 4 Pflichtdokumenten
- **2FA-Verifizierung** per E-Mail (6-stelliger OTP-Code) bei Formularabsendung
- **PDF-Export** und E-Mail-Versand (Praxis + Patient) mit PDF-Anhang
- **Mehrsprachigkeit** (Deutsch/Englisch)
- **Admin-Dashboard** für FAQ-, Praxisinfo- und Preisverwaltung
- **Rollenbasierte Zugriffskontrolle** (Admin/Patient)
- **DSGVO-konforme Datenschutzerklärung** mit PDF-Download
- **Cookie-Banner** mit Akzeptieren/Ablehnen
- **Schema.org** Structured Data (MedicalBusiness)
- **Statische Infoseiten**: Heilpraktiker, Frequenztherapie, GebÜH, Ernährung, FAQ, Impressum

### Praxisdaten
| Feld | Wert |
|------|------|
| Inhaber | Peter Rauch, Heilpraktiker |
| Adresse | Friedrich-Deffner-Straße 19a, 86163 Augsburg |
| Telefon | 0821-2621462 |
| E-Mail | info@rauch-heilpraktiker.de |
| Website | www.rauch-heilpraktiker.de |
| Berufsverband | Bund Deutscher Heilpraktiker e.V. (BDH) |
| Koordinaten | 48.3561, 10.9056 |

---

## 2. Technologie-Stack

| Kategorie | Technologie | Version |
|-----------|------------|---------|
| Framework | React + TypeScript | ^18.3.1 |
| Build Tool | Vite + SWC | — |
| Styling | Tailwind CSS + tailwindcss-animate | — |
| UI-Bibliothek | shadcn/ui (Radix UI Primitives) | — |
| Icons | Lucide React | ^0.462.0 |
| Routing | React Router DOM | ^6.30.1 |
| State Management | React Context (Auth, Language) + TanStack React Query | ^5.83.0 |
| Forms | React Hook Form + Zod | ^7.61.1 / ^3.25.76 |
| PDF-Export | jsPDF | ^4.0.0 |
| Backend | Lovable Cloud (Supabase) | ^2.90.1 |
| Fonts | Google Fonts: Playfair Display + Source Sans 3 | CDN |
| Toasts | Sonner + shadcn/ui Toaster | ^1.7.4 |
| Carousel | Embla Carousel React | ^8.6.0 |
| Datum | date-fns | ^3.6.0 |
| Charts | Recharts | ^2.15.4 |
| OTP Input | input-otp | ^1.4.2 |
| CSS Utilities | class-variance-authority, clsx, tailwind-merge | — |
| Drawer | vaul | ^0.9.9 |
| Command | cmdk | ^1.1.1 |

### Vollständige Dependencies (package.json)
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

## 3. Dateistruktur

```
/
├── index.html                          # HTML-Entry mit SEO Meta-Tags
├── vite.config.ts                      # Vite + SWC + Lovable Tagger
├── tailwind.config.ts                  # Tailwind-Konfiguration mit Design-Tokens
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── components.json                     # shadcn/ui Konfiguration
├── vitest.config.ts                    # Test-Konfiguration
├── eslint.config.js
│
├── docs/
│   ├── design-specification.md         # Detaillierte Design-Spezifikation (1527 Zeilen)
│   ├── PROJECT-DOCUMENTATION.md        # Diese Datei
│   ├── mail-relay-v2.php               # PHP-Mail-Relay auf Praxis-Server
│   ├── mail-relay-v2.php.old           # Alte Version
│   └── send-email-relay.php            # Alternatives Relay
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   ├── krankheit-ist-messbar.html      # Statische Seite: Frequenztherapie
│   └── zapper-diamond-shield.html      # Statische Seite: Zapper-Info
│
├── src/
│   ├── main.tsx                        # App-Einstiegspunkt
│   ├── App.tsx                         # Root-Komponente mit Provider + Routing
│   ├── App.css                         # (leer/minimal)
│   ├── index.css                       # Globale Styles, Design-Tokens, Print-CSS
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── hero-nature.jpg             # Hero-Hintergrundbild
│   │   ├── practice-icon.png           # Praxis-Icon
│   │   └── practice-logo.png           # Praxis-Logo
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx              # Auth State (User, Session, signOut)
│   │   └── LanguageContext.tsx          # Sprache (de/en) + t()-Helper
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Responsive Hook
│   │   ├── use-toast.ts                # Toast Hook
│   │   └── useAdminCheck.ts            # Admin-Rollen-Check via RPC
│   │
│   ├── lib/
│   │   ├── anamneseFormData.ts          # 25 Sektionsdefinitionen + initialFormData (605 Zeilen)
│   │   ├── iaaQuestions.ts              # IAA-Kategorien + Fragen (409 Zeilen)
│   │   ├── medicalOptions.ts            # Medizinische Optionslisten
│   │   ├── pdfExport.ts                 # PDF-Basis-Export
│   │   ├── pdfExportEnhanced.ts         # Erweiterter PDF-Export mit Base64
│   │   ├── datenschutzPdfExport.ts      # Datenschutz-PDF-Export
│   │   ├── translations.ts             # Statische Übersetzungen
│   │   └── utils.ts                     # cn() Utility (clsx + tailwind-merge)
│   │
│   ├── integrations/supabase/
│   │   ├── client.ts                    # Auto-generierter Supabase-Client
│   │   └── types.ts                     # Auto-generierte DB-Typen
│   │
│   ├── pages/
│   │   ├── Index.tsx                    # Startseite (Hero + Features + Info)
│   │   ├── Auth.tsx                     # Login/Register/Passwort-Reset (861 Zeilen)
│   │   ├── Anamnesebogen.tsx            # Geschützter Anamnesebogen (879 Zeilen)
│   │   ├── AnamneseDemo.tsx             # Öffentliche Demo (Xaver Lovable, 603 Zeilen)
│   │   ├── Erstanmeldung.tsx            # 4-Schritte Erstanmeldung (621 Zeilen)
│   │   ├── Datenschutz.tsx              # DSGVO-Datenschutzerklärung (300 Zeilen)
│   │   ├── Patientenaufklaerung.tsx      # Kosteninfo + Preise (342 Zeilen)
│   │   ├── Heilpraktiker.tsx            # Was ist ein Heilpraktiker?
│   │   ├── Frequenztherapie.tsx          # Frequenztherapie-Info
│   │   ├── Gebueh.tsx                   # GebÜH-Tabelle
│   │   ├── Ernaehrung.tsx               # Ernährungsratschläge
│   │   ├── FAQ.tsx                       # DB-gespeiste FAQ-Seite
│   │   ├── PraxisInfo.tsx               # DB-gespeiste Praxis-Infos
│   │   ├── Impressum.tsx                # Rechtliche Angaben
│   │   ├── AdminDashboard.tsx           # Admin: FAQ/Info/Preise verwalten
│   │   ├── PatientDashboard.tsx          # Patienten-Übersicht (nur Admin)
│   │   └── NotFound.tsx                 # 404-Seite
│   │
│   ├── components/
│   │   ├── CookieBanner.tsx             # DSGVO Cookie-Banner
│   │   ├── LanguageSwitcher.tsx          # DE/EN Toggle
│   │   ├── NavLink.tsx                  # Nav-Link-Komponente
│   │   ├── ProtectedRoute.tsx           # Auth-Guard + Dev-Bypass
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx               # Wrapper: Header + Main + Footer
│   │   │   ├── Header.tsx               # Sticky Header mit Navigation
│   │   │   ├── Footer.tsx               # 4-Spalten Footer
│   │   │   └── InfothekDropdown.tsx      # Kategorisiertes Dropdown-Menü
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx          # Hero mit Hintergrundbild + CTA
│   │   │   ├── FeaturesSection.tsx       # 5 Feature-Karten
│   │   │   └── InfoSection.tsx          # Über die Praxis + Zitat
│   │   │
│   │   ├── seo/
│   │   │   ├── SEOHead.tsx              # Dynamische Meta-Tags
│   │   │   └── SchemaOrg.tsx            # JSON-LD Structured Data
│   │   │
│   │   ├── admin/
│   │   │   ├── FAQManager.tsx           # CRUD für FAQs
│   │   │   ├── PracticeInfoManager.tsx   # CRUD für Praxis-Infos
│   │   │   └── PricingManager.tsx       # CRUD für Preisliste
│   │   │
│   │   ├── iaa/
│   │   │   └── IAAForm.tsx              # IAA-Fragebogen (Schweregrad 1-6)
│   │   │
│   │   ├── anamnese/
│   │   │   ├── IntroSection.tsx          # Willkommen
│   │   │   ├── PatientDataSection.tsx    # Patientendaten
│   │   │   ├── FamilyHistorySection.tsx  # Familiengeschichte
│   │   │   ├── NeurologySection.tsx      # Kopf, Sinne, Schlaf, Psyche
│   │   │   ├── HeartSection.tsx          # Herz & Kreislauf
│   │   │   ├── LungSection.tsx           # Lunge & Atmung
│   │   │   ├── DigestiveSection.tsx      # Magen & Darm
│   │   │   ├── LiverSection.tsx          # Leber & Galle
│   │   │   ├── KidneySection.tsx         # Niere & Blase
│   │   │   ├── HormoneSection.tsx        # Hormone
│   │   │   ├── MusculoskeletalSection.tsx # Bewegungsapparat
│   │   │   ├── WomenHealthSection.tsx    # Frauengesundheit
│   │   │   ├── MensHealthSection.tsx     # Männergesundheit
│   │   │   ├── SurgeriesSection.tsx      # Unfälle & OPs
│   │   │   ├── CancerSection.tsx         # Krebs
│   │   │   ├── AllergiesSection.tsx      # Allergien
│   │   │   ├── MedicationsSection.tsx    # Medikamente
│   │   │   ├── LifestyleSection.tsx      # Lebensweise
│   │   │   ├── DentalSection.tsx         # Zahngesundheit
│   │   │   ├── EnvironmentSection.tsx    # Umweltbelastungen
│   │   │   ├── InfectionsSection.tsx     # Infektionen
│   │   │   ├── VaccinationsSection.tsx   # Impfstatus
│   │   │   ├── ComplaintsSection.tsx     # Beschwerden
│   │   │   ├── PreferencesSection.tsx    # Behandlungspräferenzen
│   │   │   ├── SocialSection.tsx         # Soziales
│   │   │   ├── SignatureSection.tsx      # Unterschrift + Einwilligungen
│   │   │   ├── VerificationDialog.tsx   # 2FA OTP-Dialog
│   │   │   ├── PrintView.tsx            # Druckansicht
│   │   │   ├── FilteredSummaryView.tsx  # Gefilterte Zusammenfassung
│   │   │   └── shared/
│   │   │       ├── DentalChart.tsx       # Zahnschema-Übersicht
│   │   │       ├── MultiEntryField.tsx   # Dynamische Listen (OPs, Medikamente)
│   │   │       ├── MultiSelectCheckbox.tsx # Multi-Select mit Grid
│   │   │       ├── NumericInput.tsx      # Sanitized numerische Eingabe
│   │   │       ├── SubConditionList.tsx  # Sub-Diagnosen-Liste
│   │   │       ├── TemporalStatusSelect.tsx # Zeitlicher Status
│   │   │       ├── ToothDiagram.tsx      # Interaktives FDI-Zahnschema
│   │   │       └── YearMonthSelect.tsx   # Jahr/Monat-Auswahl mit Validierung
│   │   │
│   │   └── ui/                          # 45+ shadcn/ui Komponenten
│   │       ├── accordion.tsx, alert.tsx, badge.tsx, button.tsx, ...
│   │       └── (alle Standard shadcn/ui Komponenten)
│   │
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
│
└── supabase/
    ├── config.toml                      # project_id = "jmebqjadlpltnqawoipb"
    ├── migrations/                      # DB-Migrationen (read-only)
    └── functions/
        ├── request-verification-code/   # Auth 2FA: Code anfordern
        │   └── index.ts                 # (347 Zeilen)
        ├── verify-code/                 # Auth 2FA: Code verifizieren
        │   └── index.ts                 # (324 Zeilen)
        ├── submit-anamnesis/            # Anamnese: Submit + Confirm + E-Mail
        │   └── index.ts                 # (555 Zeilen)
        └── send-verification-email/     # Legacy SMTP-Versand
            └── index.ts                 # (127 Zeilen)
```

---

## 4. Design System

### 4.1 Typografie

| Verwendung | Font | Fallback |
|-----------|------|----------|
| Überschriften (h1-h6) | Playfair Display (400-700) | Georgia, serif |
| Fließtext (body) | Source Sans 3 (300-600) | system-ui, sans-serif |

**Font-Import (index.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
```

**Typografie-Regeln:**
```css
body { font-family: 'Source Sans 3', system-ui, sans-serif; @apply antialiased; }
h1-h6 { font-family: 'Playfair Display', Georgia, serif; @apply font-medium tracking-tight; }
```

### 4.2 Farbpalette – Light Mode (:root)

```css
/* Basis */
--background: 40 30% 97%;        /* Warmer Elfenbein */
--foreground: 150 20% 15%;       /* Dunkles Salbeigrün */
--card: 40 25% 95%;
--card-foreground: 150 20% 15%;
--popover: 40 30% 97%;
--popover-foreground: 150 20% 15%;

/* Primary: Salbeigrün (Markenfarbe) */
--primary: 145 25% 36%;
--primary-foreground: 40 30% 97%;

/* Secondary: Warmer Sandton */
--secondary: 35 35% 85%;
--secondary-foreground: 150 20% 20%;

/* Muted: Gedämpftes Salbei */
--muted: 145 15% 90%;
--muted-foreground: 150 10% 45%;

/* Accent: Terracotta */
--accent: 18 45% 55%;
--accent-foreground: 40 30% 97%;

/* Destructive */
--destructive: 0 65% 50%;
--destructive-foreground: 40 30% 97%;

/* UI-Elemente */
--border: 145 15% 85%;
--input: 145 15% 88%;
--ring: 145 25% 36%;
--radius: 0.75rem;
```

### 4.3 Erweiterte Paletten

**Sage (8 Stufen):** `--sage-50` bis `--sage-700` (145° Hue, 22-30% Sättigung)  
**Sand (4 Stufen):** `--sand-50` bis `--sand-300` (35° Hue)  
**Terracotta (2 Stufen):** `--terracotta` + `--terracotta-light` (18° Hue)

### 4.4 Dark Mode (.dark)

Vorhanden aber nicht aktiv geschaltet. Aktivierung via `darkMode: ["class"]` in tailwind.config.ts.

### 4.5 Gradienten

```css
--gradient-hero:   linear-gradient(135deg, hsl(145 25% 36%/0.9), hsl(145 30% 28%/0.95));
--gradient-card:   linear-gradient(180deg, hsl(40 30% 97%), hsl(40 25% 94%));
--gradient-accent: linear-gradient(135deg, hsl(18 45% 55%), hsl(18 50% 45%));
```

### 4.6 Schatten

```css
--shadow-soft:     0 4px 20px -4px hsl(145 20% 30% / 0.1);
--shadow-card:     0 8px 30px -8px hsl(145 20% 30% / 0.12);
--shadow-elevated: 0 20px 50px -15px hsl(145 20% 20% / 0.2);
```

### 4.7 Animationen

| Klasse | Keyframe | Dauer |
|--------|----------|-------|
| `animate-fade-in` | opacity 0→1 | 0.6s ease-out |
| `animate-slide-up` | opacity + translateY(20→0) | 0.6s ease-out |
| `animate-scale-in` | opacity + scale(0.95→1) | 0.4s ease-out |
| `animate-accordion-down` | height 0→auto | 0.2s ease-out |
| `animate-accordion-up` | height auto→0 | 0.2s ease-out |

### 4.8 Button-Varianten

| Variante | Beschreibung |
|----------|-------------|
| `default` | Salbeigrün-Hintergrund mit Hover-Vertiefung |
| `destructive` | Rot |
| `outline` | Primärfarbener Rahmen, transparent |
| `secondary` | Sand-Hintergrund |
| `ghost` | Transparent, Hover sage-100 |
| `link` | Unterstrichen |
| `hero` | Groß, elevated shadow, abgerundet xl |
| `accent` | Terracotta-Hintergrund |

**Größen:** `default` (h-10), `sm` (h-9), `lg` (h-12), `xl` (h-14), `icon` (h-10 w-10)

---

## 5. Routing & Navigation

### 5.1 Routen-Tabelle

| Route | Komponente | Schutz | Beschreibung |
|-------|-----------|--------|-------------|
| `/` | `Index` | Öffentlich | Startseite (Hero, Features, Info) |
| `/auth` | `Auth` | Öffentlich | Login/Register/Passwort-Reset |
| `/erstanmeldung` | `Erstanmeldung` | ProtectedRoute | 4-Schritte-Erstanmeldung |
| `/anamnesebogen` | `Anamnesebogen` | ProtectedRoute | Geschützter Anamnesebogen |
| `/anamnesebogen-demo` | `AnamneseDemo` | Öffentlich | Demo mit Testdaten (Xaver Lovable) |
| `/datenschutz` | `Datenschutz` | Öffentlich | DSGVO-Datenschutzerklärung |
| `/patientenaufklaerung` | `Patientenaufklaerung` | Öffentlich | Kosten, Erstattung, Vereinbarung |
| `/heilpraktiker` | `Heilpraktiker` | Öffentlich | Was ist ein Heilpraktiker? |
| `/frequenztherapie` | `Frequenztherapie` | Öffentlich | Frequenztherapie-Info |
| `/gebueh` | `Gebueh` | Öffentlich | GebÜH-Gebührenordnung |
| `/ernaehrung` | `Ernaehrung` | Öffentlich | Ernährungsratschläge |
| `/faq` | `FAQ` | Öffentlich | FAQ (aus Datenbank) |
| `/praxis-info` | `PraxisInfo` | Öffentlich | Praxis-Info (aus Datenbank) |
| `/impressum` | `Impressum` | Öffentlich | Rechtliche Angaben |
| `/admin` | `AdminDashboard` | Admin-Rolle | Verwaltung FAQ/Info/Preise |
| `/dashboard` | `PatientDashboard` | Admin-only (UI) | Eingereichte Bögen anzeigen |
| `*` | `NotFound` | — | 404-Seite |

### 5.2 Navigation

**Hauptnavigation (3 Elemente):**
1. Start (`/`)
2. Erstanmeldung (`/erstanmeldung`)
3. Infothek (Dropdown)

**Infothek-Dropdown (3 Gruppen):**
- **Für Patienten:** Anamnesebogen, Datenschutzerklärung, Patientenaufklärung
- **Wissen & Therapie:** Heilpraktiker, Frequenztherapie (extern), Diamond Shield Zapper (extern)
- **Praktisches:** GebÜH, FAQ

**Sichtbarkeitsregeln:**
- Dashboard-Link: Nur für Admins sichtbar
- Admin-Dashboard-Link: Nur für Admins sichtbar
- Test-Link (`/anamnesebogen?dev=true`): Nur in Preview/Dev UND nur für Admins

### 5.3 Provider-Hierarchie

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

---

## 6. Authentifizierung & Rollen

### 6.1 Auth-Flow

**Registrierung:**
1. E-Mail + Passwort eingeben
2. Edge Function `request-verification-code` erstellt User (unconfirmed) + sendet 6-stelligen Code
3. Code eingeben → `verify-code` bestätigt E-Mail + aktiviert Account
4. Automatischer Login nach Verifizierung

**Login:**
1. E-Mail + Passwort eingeben → `signInWithPassword` → sofort `signOut`
2. 2FA-Code per E-Mail anfordern
3. Code eingeben → `verify-code` generiert Magic Link Token
4. `verifyOtp` mit Token → Session aktiv

**Passwort-Reset:**
1. E-Mail eingeben → Code anfordern
2. Code + neues Passwort eingeben → `verify-code` setzt Passwort

### 6.2 Rollenmodell

| Rolle | Berechtigungen |
|-------|---------------|
| `patient` | Eigene Daten lesen/schreiben, Formulare ausfüllen |
| `admin` | Alle Patientendaten, FAQ/Info/Preise verwalten, Dashboard |

**Admin-Check:** `useAdminCheck()` Hook → RPC `has_role(_user_id, 'admin')`

### 6.3 ProtectedRoute

```typescript
// Dev-Bypass: ?dev=true in Preview/Localhost
const devBypass = isNonProduction && searchParams.get('dev') === 'true';
// Sonst: Redirect zu /auth wenn nicht eingeloggt
```

### 6.4 Auto-Confirm E-Mail

Aktiviert (`auto_confirm_email: true`) – Patienten können sich sofort anmelden ohne E-Mail-Bestätigung.

---

## 7. Datenbank-Schema

### 7.1 Tabellen

#### `profiles`
| Spalte | Typ | Nullable | Default |
|--------|-----|----------|---------|
| id | uuid | Nein | gen_random_uuid() |
| user_id | uuid | Nein | — |
| email | text | Nein | — |
| first_name | text | Ja | — |
| last_name | text | Ja | — |
| phone | text | Ja | — |
| date_of_birth | date | Ja | — |
| created_at | timestamptz | Nein | now() |
| updated_at | timestamptz | Nein | now() |

**RLS:** User kann eigenes Profil lesen, einfügen, aktualisieren (nicht löschen).

#### `user_roles`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| user_id | uuid | — |
| role | app_role (enum) | 'patient' |
| created_at | timestamptz | now() |

**RLS:** User kann nur eigene Rollen lesen. Kein INSERT/UPDATE/DELETE für User.

#### `anamnesis_submissions`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| user_id | uuid | — |
| form_data | jsonb | — |
| signature_data | text (nullable) | — |
| status | text | 'draft' |
| submitted_at | timestamptz | now() |
| updated_at | timestamptz | now() |

**Status-Werte:** `draft`, `pending_verification`, `verified`  
**RLS:** User CRUD nur eigene Einreichungen.

#### `iaa_submissions`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| user_id | uuid | — |
| form_data | jsonb | '{}' |
| therapist_data | jsonb (nullable) | '{}' |
| appointment_number | integer | 1 |
| status | text | 'draft' |
| submitted_at / updated_at | timestamptz | now() |

**RLS:** User CRUD eigene, Admins können alle verwalten.

#### `verification_codes`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| user_id | uuid | — |
| code | text | — |
| type | text | 'login' |
| expires_at | timestamptz | — |
| used | boolean | false |
| created_at | timestamptz | now() |

**Typen:** `login`, `registration`, `password_reset`, `anamnesis`  
**RLS:** User kann nur eigene lesen. Kein INSERT/UPDATE/DELETE für User.

#### `faqs`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| question_de / question_en | text | — |
| answer_de / answer_en | text | — |
| sort_order | integer | 0 |
| is_published | boolean | true |
| created_at / updated_at | timestamptz | now() |

**RLS:** Öffentlich: published lesen. Admin: alle Operationen.

#### `practice_info`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| slug | text | — |
| title_de / title_en | text | — |
| content_de / content_en | text | — |
| icon | text (nullable) | — |
| sort_order | integer | 0 |
| is_published | boolean | true |
| created_at / updated_at | timestamptz | now() |

**RLS:** Öffentlich: published lesen. Admin: alle Operationen.

#### `practice_pricing`
| Spalte | Typ | Default |
|--------|-----|---------|
| id | uuid | gen_random_uuid() |
| service_key | text | — |
| label_de / label_en | text | — |
| price_text_de / price_text_en | text | — |
| note_de / note_en | text (nullable) | '' |
| sort_order | integer | 0 |
| is_published | boolean | true |
| created_at / updated_at | timestamptz | now() |

**RLS:** Öffentlich: published lesen. Admin: alle Operationen.

### 7.2 Enums

```sql
CREATE TYPE app_role AS ENUM ('admin', 'patient');
CREATE TYPE language_code AS ENUM ('de', 'en');
```

### 7.3 Funktionen

```sql
-- Admin-Rollen-Check
CREATE FUNCTION has_role(_user_id uuid, _role app_role) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER
  AS $$ SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Neuer User → Profil + Patient-Rolle
CREATE FUNCTION handle_new_user() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$ BEGIN
    INSERT INTO profiles (user_id, email) VALUES (NEW.id, NEW.email);
    INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'patient');
    RETURN NEW;
  END; $$;

-- Auto-Update updated_at
CREATE FUNCTION update_updated_at_column() RETURNS trigger
  AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
```

### 7.4 Trigger

Der `handle_new_user` Trigger wird auf `auth.users` nach INSERT ausgelöst (erstellt automatisch Profil + Patient-Rolle).

---

## 8. Edge Functions (Backend)

### 8.1 `request-verification-code`
**Zweck:** OTP-Code für Login, Registrierung oder Passwort-Reset anfordern  
**Endpunkt:** `POST /functions/v1/request-verification-code`  
**Input:** `{ email, type: "login"|"registration"|"password_reset", password?, userId? }`  
**Ablauf:**
1. Zod-Validierung
2. Rate-Limiting (5 Anfragen/15 Min pro E-Mail)
3. Bei Registration: `auth.admin.createUser` (unconfirmed)
4. 6-stelliger Code generieren, in `verification_codes` speichern (10 Min gültig)
5. E-Mail über PHP-Relay senden
6. Response mit `{ success, userId }`

### 8.2 `verify-code`
**Zweck:** OTP-Code verifizieren  
**Endpunkt:** `POST /functions/v1/verify-code`  
**Input:** `{ email, code, type, newPassword? }`  
**Ablauf:**
1. Rate-Limiting (10 Versuche/Stunde)
2. Code in DB prüfen (user_id + type + unused + nicht abgelaufen)
3. Code als `used` markieren
4. Je nach Typ:
   - `registration`: E-Mail bestätigen via `auth.admin.updateUserById`
   - `login`: Magic Link Token generieren via `auth.admin.generateLink`
   - `password_reset`: Passwort ändern via `auth.admin.updateUserById`

### 8.3 `submit-anamnesis`
**Zweck:** Anamnesebogen einreichen + verifizieren + per E-Mail versenden  
**Endpunkt:** `POST /functions/v1/submit-anamnesis`  
**Input:** `{ action: "submit"|"confirm", email, formData?, code?, submissionId?, tempUserId?, pdfBase64? }`  

**Action "submit":**
1. Formulardaten in `anamnesis_submissions` speichern (Status: `pending_verification`)
2. OTP-Code generieren + per E-Mail senden
3. Für unauthentifizierte User: temporäre UUID generieren

**Action "confirm":**
1. Code verifizieren
2. Submission-Status auf `verified` setzen + Signatur-Metadaten speichern
3. PDF-Anhang an Praxis senden (info@rauch-heilpraktiker.de)
4. Bestätigungs-E-Mail an Patient senden (mit PDF-Anhang)
5. Fallback: Bei fehlgeschlagenem Anhang ohne PDF senden

### 8.4 `send-verification-email` (Legacy)
**Zweck:** Direkter SMTP-Versand (nicht mehr primär genutzt)  
**Methode:** denomailer SMTP-Client  
**Hinweis:** Wurde durch PHP-Relay-Ansatz ersetzt

---

## 9. Seitenkomponenten im Detail

### 9.1 Startseite (Index.tsx)
- `HeroSection`: Vollbild-Hintergrundbild (hero-nature.jpg) + Salbeigrün-Overlay + CTA-Buttons + SVG-Welle
- `FeaturesSection`: 5 Feature-Karten (Anamnesebogen hervorgehoben) im Grid
- `InfoSection`: Praxisvorstellung + 3 Benefits + Schopenhauer-Zitat

### 9.2 Auth (Auth.tsx – 861 Zeilen)
- Tab-UI: Login | Registrierung
- Passwort-vergessen-Link
- 2FA OTP-Eingabe (InputOTP mit 6 Slots)
- Code-erneut-senden-Funktion
- Passwort-Sichtbarkeit-Toggle
- Zod-Validierung: E-Mail, Passwort (min 8 Zeichen)

### 9.3 Datenschutz (Datenschutz.tsx – 300 Zeilen)
14 DSGVO-Abschnitte mit Icons:
- Zweck, Erhobene Daten, Voraussetzung, Empfänger, Rechtsgrundlage
- Datensicherheit, Speicherdauer, Rechte, Auskunft, Widerspruch
- Löschung, Beschwerderecht, Newsletter, KI-Plattform
- PDF-Download-Button
- Verantwortliche Person mit Kontaktdaten

### 9.4 Patientenaufklärung (Patientenaufklaerung.tsx – 342 Zeilen)
- GKV-Hinweis (keine Kostenübernahme)
- Kostenerstattung PKV
- GebÜH-Erklärung
- Preistabelle (aus DB `practice_pricing`)
- Zahlungspflicht-Warnung
- Terminregelung & Absagepolicy (48h)
- Therapeuten-Verhinderung

### 9.5 Heilpraktiker (Heilpraktiker.tsx)
Statische Infoseite: Was jeder Patient wissen sollte, Qualifikation (Ausbildung, Zulassung, Pflichten), Vertrauen, Ganzheitlicher Ansatz, Behandlungsmethoden-Liste.

### 9.6 Frequenztherapie (Frequenztherapie.tsx)
Was ist Frequenztherapie?, 4 Anwendungsgebiete (Cards), Behandlungsablauf (4 Schritte), Hinweis (kein Arzt-Ersatz), CTA.

### 9.7 GebÜH (Gebueh.tsx)
GebÜH-Erklärung, Beispieltabelle (7 Ziffern), Link zum BDH-Verzeichnis, PKV/GKV-Info.

### 9.8 Ernährung (Ernaehrung.tsx)
4 Grundtipps (Cards), 8 Empfehlungen (gut/schlecht), Spezialhinweise (Verdauung, Energie), Individuelle-Beratung-Hinweis.

### 9.9 FAQ (FAQ.tsx)
Aus `faqs`-Tabelle gespeist, Accordion-UI, Skeleton-Loading, Kontakt-CTA mit Telefon.

### 9.10 PraxisInfo (PraxisInfo.tsx)
Aus `practice_info`-Tabelle gespeist, dynamische Icons, Schopenhauer-Zitat-Karte.

### 9.11 Impressum (Impressum.tsx)
Anbieter, Kontakt, Berufsbezeichnung, Berufsverband, Inhaltlich Verantwortlicher, Haftungshinweise (Inhalte, Links, Urheberrecht).

---

## 10. Anamnesebogen-System

### 10.1 Übersicht
- **26 Sektionen** (inkl. Willkommen) basierend auf 41-seitigem Word-Dokument
- **2 Darstellungsmodi:** Wizard (Schritt für Schritt) + Akkordeon
- **Autosave** in LocalStorage (debounced 300ms)
- **PDF-Export** + Druckansicht + Gefilterte Zusammenfassung
- **2FA-Verifizierung** vor finalem Absenden
- **E-Mail-Versand** mit PDF-Anhang an Praxis + Patient

### 10.2 Sektionsliste (26 Sektionen)

| # | ID | Titel (DE) | Emoji | Farbe |
|---|-----|-----------|-------|-------|
| 1 | intro | Willkommen | 👋 | emerald |
| 2 | patientData | I. Patientendaten | 👤 | blue |
| 3 | familyHistory | II. Familie | 👨‍👩‍👧 | cyan |
| 4 | neurology | III. Kopf & Sinne | 🧠 | purple |
| 5 | heart | IV. Herz & Kreislauf | ❤️ | red |
| 6 | lung | V. Lunge & Atmung | 🫁 | sky |
| 7 | digestive | VI. Magen & Darm | 🍽️ | orange |
| 8 | liver | VII. Leber & Galle | 🫀 | amber |
| 9 | kidney | VIII. Niere & Blase | 💧 | blue |
| 10 | hormone | IX. Hormone | ⚡ | yellow |
| 11 | musculoskeletal | X. Bewegungsapparat | 🦴 | stone |
| 12 | womenHealth | XI. Frauengesundheit | 👩 | pink |
| 13 | mensHealth | XI. Männergesundheit | 👨 | blue |
| 14 | surgeries | XII. Unfälle & OPs | 🏥 | red |
| 15 | cancer | XIII. Krebs | ⚠️ | amber |
| 16 | allergies | XIV. Allergien | 🤧 | yellow |
| 17 | medications | XV. Medikamente | 💊 | purple |
| 18 | lifestyle | XVI. Lebensweise | 🌿 | green |
| 19 | dental | XVII. Zahngesundheit | 🦷 | cyan |
| 20 | environment | XVIII. Umwelt | 🌍 | teal |
| 21 | infections | XIX. Infektionen | 🦠 | rose |
| 22 | vaccinations | XX. Impfstatus | 💉 | indigo |
| 23 | complaints | XXI. Beschwerden | 📋 | slate |
| 24 | preferences | XXII. Präferenzen | ✨ | violet |
| 25 | social | XXIII. Persönliches | 🏠 | sky |
| 26 | signature | XXIV. Unterschrift | ✍️ | stone |

### 10.3 Input-Validierung

| Feld | Regel |
|------|-------|
| Namen | Nur Buchstaben + Umlaute + Bindestrich (Regex) |
| Körpergröße | 0-210 cm, nur Zahlen |
| Gewicht | 1-200 kg, nur Zahlen |
| Zeitangaben | Select-Dropdowns (kein Freitext) |
| Jahreszahlen | 4-stellig, currentYear-100 bis currentYear |

### 10.4 Pflichtfelder beim Absenden
1. Nachname, Vorname, E-Mail
2. Unterschrift: Bestätigung, Datum, Name in Druckbuchstaben
3. Datenschutz-Einwilligung

### 10.5 Demo-Modus (AnamneseDemo.tsx)
Öffentlich zugänglich unter `/anamnesebogen-demo`. Vorgefüllt mit fiktivem Patienten **"Xaver Lovable"** (geb. 1976, Augsburg) mit umfangreichen Testdaten über alle Sektionen.

---

## 11. IAA-Fragebogen-System

### 11.1 Übersicht
- **~200 Fragen** in ~20 Kategorien
- **Schweregrad-Skala:** 1 (sehr leicht) bis 6 (extrem)
- **Farbcodierung:** Grün→Gelb→Orange→Rot
- **Therapeuten-Bereich:** Sichtbar aber gesperrt für Patienten

### 11.2 Patienten-Kategorien
Stuhlverhalten, Blähungen, Nahrungsmittelunverträglichkeiten, Appetit/Magen, Allergien, Durst/Niere/Blase, Schlaf, Bewegung/Atmung, Haut, Bewegungsapparat, Abwehr/Immunsystem, Ohren/Gehör, Zähne, Lymphe, Nervensystem/Kopfschmerzen, Psyche/Vitalität

### 11.3 Therapeuten-Kategorien (gesperrt)
Kreislauf/Blut, Augen, Frauenheilkunde

### 11.4 Datenstruktur
```typescript
Record<string, number>  // { "1.1": 3, "2.1.1": 5, ... }
```
Gespeichert in `iaa_submissions.form_data`.

---

## 12. Erstanmeldung-Workflow

### 12.1 Ablauf
1. **Telefon-Gate:** Checkbox "Ich habe bereits telefonisch einen Termin vereinbart"
2. **Übersicht:** 4 Dokumente mit Fortschrittsbalken
3. **Schritt 1 - Anamnesebogen:** Link zu `/anamnesebogen`, Status-Check
4. **Schritt 2 - Datenschutz:** Inline-Anzeige + Bestätigungs-Checkbox
5. **Schritt 3 - Patientenaufklärung:** Preistabelle + Vereinbarung + Bestätigung
6. **Schritt 4 - IAA-Fragebogen:** Inline IAA-Form + Submit

### 12.2 Fortschrittsverfolgung
- Anamnesebogen: Check via `anamnesis_submissions` (status === 'verified')
- IAA: Check via `iaa_submissions` (status === 'submitted')
- Datenschutz/Aufklärung: Client-State (Checkboxen)

---

## 13. E-Mail-System

### 13.1 Architektur
```
Edge Function → PHP Mail Relay → SMTP → Empfänger
                (rauch-heilpraktiker.de/mail-relay.php)
```

### 13.2 Mail-Relay
- **URL:** `https://rauch-heilpraktiker.de/mail-relay.php`
- **Auth:** `X-Relay-Token: RELAY_SECRET`
- **Payload:** `{ to, subject, html, from, attachment? }`
- **Anhänge:** `{ filename, base64, contentType }`
- **Fallback:** Bei Fehler mit Anhang → erneut ohne Anhang senden

### 13.3 E-Mail-Typen

| Typ | Absender | Empfänger | Anhang |
|-----|----------|-----------|--------|
| Registrierungs-Code | noreply@ | Patient | — |
| Login 2FA-Code | info@ | Patient | — |
| Passwort-Reset-Code | info@ | Patient | — |
| Anamnese-Verifikations-Code | noreply@ | Patient | — |
| Anamnese an Praxis | noreply@ | info@rauch-heilpraktiker.de | PDF |
| Anamnese-Bestätigung Patient | noreply@ | Patient | PDF |

### 13.4 E-Mail-Template
HTML-Templates mit:
- Salbeigrün-Branding (#4a7c59)
- Code-Box mit 32px Schrift
- 10-Minuten-Gültigkeit
- RFC 2047 encoded Subject (UTF-8/Umlaute)

---

## 14. PDF-Export

### 14.1 Technologie
jsPDF 4.0.0 mit direkter Canvas-Generierung.

### 14.2 Dateien
- `src/lib/pdfExport.ts` – Basis-Export
- `src/lib/pdfExportEnhanced.ts` – Erweiterter Export + Base64-Variante
- `src/lib/datenschutzPdfExport.ts` – Datenschutz-PDF

### 14.3 Funktionen
```typescript
generateEnhancedAnamnesePdf({ formData, language });     // Download
generateAnamnesePdfBase64({ formData, language });        // Base64 für E-Mail
generateDatenschutzPdf({ language });                     // Datenschutz-Download
```

### 14.4 Druckansicht
```tsx
// Full-Screen Overlay → window.print()
<PrintView ref={printRef} formData={formData} language={language} />
```

Print-CSS: A4-Format, 1.5cm Ränder, Backgrounds exact, Header/Footer/Buttons hidden.

---

## 15. SEO & Structured Data

### 15.1 Meta-Tags (index.html + SEOHead.tsx)
- Title: "Naturheilpraxis Peter Rauch | Heilpraktiker in Augsburg"
- Description: 155 Zeichen, Deutsch
- Open Graph: Typ, URL, Titel, Beschreibung, Bild, Locale
- Twitter Card: Summary Large Image
- Geo-Tags: Bayern, Augsburg, 48.3561/10.9056
- Canonical URL: dynamisch

### 15.2 Schema.org (SchemaOrg.tsx)
JSON-LD `@graph` mit:
- **MedicalBusiness:** Name, Adresse, Geo, Öffnungszeiten, Gründer, Services (Irisdiagnose, Darmsanierung, Entgiftung)
- **WebSite:** URL, Name, Publisher
- **BreadcrumbList:** Startseite

### 15.3 robots.txt
```
User-agent: *
Allow: /
```

---

## 16. Internationalisierung (i18n)

### 16.1 Mechanismus
```typescript
const { language, setLanguage, t } = useLanguage();
// Inline-Verwendung:
t("Deutscher Text", "English Text")
language === "de" ? "..." : "..."
```

### 16.2 Sprachpersistenz
`localStorage.getItem('language')` – Default: `'de'`

### 16.3 Statische Übersetzungen (translations.ts)
Bereiche: Navigation, Header, FAQ-Seite, Praxis-Info-Seite, Common (Loading/Error)

### 16.4 Abgedeckte Bereiche
- Alle UI-Labels und Platzhalter
- Alle 26 Sektions-Titel
- Alle medizinischen Optionslabels
- Toast-Nachrichten, Validierungsfehler
- Monatsbezeichnungen (YearMonthSelect)
- E-Mail-Inhalte (teilweise nur DE)

---

## 17. DSGVO-Compliance

### 17.1 Implementierte Maßnahmen
- **Cookie-Banner:** Akzeptieren/Ablehnen, `localStorage`-Persistenz
- **Datenschutzerklärung:** 14 Abschnitte, PDF-Download
- **Einwilligungserklärung:** Pflicht-Checkbox vor Formularabsendung
- **2FA-Verifizierung:** E-Mail-basiert (§ 126a BGB)
- **10-Jahres-Aufbewahrungspflicht:** Dokumentiert
- **30-Jahres-Röntgen-Aufbewahrungspflicht:** Dokumentiert
- **TLS-Verschlüsselung:** Standardmäßig
- **RLS-Policies:** Auf allen Tabellen
- **Minimalprinzip:** User sehen nur eigene Daten
- **Automatische Session-Beendigung:** Auth-Provider

### 17.2 Rechtsgrundlagen
- Art. 9 Abs. 2 h DSGVO i.V.m. § 22 Abs. 1 Nr. 1 b BDSG
- Art. 6 Abs. 1 b DSGVO (Behandlungsvertrag)
- Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, 2FA)

---

## 18. Admin-Dashboard

### 18.1 Zugriff
Route `/admin` – nur für User mit `admin`-Rolle in `user_roles`.

### 18.2 Verwaltungsbereiche (Tabs)
1. **FAQs:** CRUD, Sortierung, Veröffentlichungsstatus, DE/EN
2. **Praxis-Info:** CRUD, Icons, Slug, DE/EN
3. **Preise:** CRUD, Serviceschlüssel, DE/EN, Hinweise

### 18.3 Komponenten
- `FAQManager.tsx` – FAQ CRUD
- `PracticeInfoManager.tsx` – Praxis-Info CRUD
- `PricingManager.tsx` – Preis-CRUD

---

## 19. Secrets & Konfiguration

### 19.1 Backend-Secrets (Edge Functions)

| Secret | Verwendung |
|--------|-----------|
| `RELAY_SECRET` | Authentifizierung beim PHP-Mail-Relay |
| `LOVABLE_API_KEY` | Lovable AI API |
| `SMTP_HOST` | SMTP-Server (Legacy) |
| `SMTP_PORT` | SMTP-Port (Legacy) |
| `SMTP_USER` | SMTP-Benutzername (Legacy) |
| `SMTP_PASSWORD` | SMTP-Passwort (Legacy) |
| `SUPABASE_URL` | Auto-konfiguriert |
| `SUPABASE_ANON_KEY` | Auto-konfiguriert |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-konfiguriert |
| `SUPABASE_DB_URL` | Auto-konfiguriert |
| `SUPABASE_PUBLISHABLE_KEY` | Auto-konfiguriert |

### 19.2 Umgebungsvariablen (.env – auto-generiert)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=jmebqjadlpltnqawoipb
```

### 19.3 Vite-Konfiguration
```typescript
// vite.config.ts
server: { host: "::", port: 8080, hmr: { overlay: false } }
plugins: [react-swc(), lovable-tagger (dev only)]
alias: { "@": "./src" }
```

---

## 20. Wiederherstellungsanleitung

### 20.1 Voraussetzungen
1. Node.js 18+ / Bun
2. Lovable-Account mit Cloud-Zugang
3. Zugriff auf das Supabase-Projekt (jmebqjadlpltnqawoipb)

### 20.2 Frontend-Restore
1. Alle Dateien aus dem Repository wiederherstellen
2. `npm install` / `bun install`
3. `.env` wird automatisch von Lovable Cloud generiert
4. `npm run dev` zum lokalen Starten

### 20.3 Backend-Restore (Datenbank)
1. Supabase-Migrationen befinden sich in `supabase/migrations/`
2. Tabellen: profiles, user_roles, anamnesis_submissions, iaa_submissions, verification_codes, faqs, practice_info, practice_pricing
3. Funktionen: has_role, handle_new_user, update_updated_at_column
4. Trigger: handle_new_user auf auth.users
5. Enums: app_role, language_code
6. RLS-Policies: siehe Abschnitt 7

### 20.4 Edge Functions
4 Edge Functions müssen deployed werden:
1. `request-verification-code/index.ts`
2. `verify-code/index.ts`
3. `submit-anamnesis/index.ts`
4. `send-verification-email/index.ts`

### 20.5 Secrets
Folgende Secrets müssen konfiguriert werden:
- `RELAY_SECRET` – Token für PHP-Mail-Relay
- SMTP-Konfiguration (falls SMTP-Direktversand gewünscht)

### 20.6 Externe Abhängigkeiten
- **PHP-Mail-Relay:** `https://rauch-heilpraktiker.de/mail-relay.php` muss auf dem Praxis-Webserver verfügbar sein
- **Google Fonts CDN:** Playfair Display + Source Sans 3
- **Hero-Bild:** Lokal in `src/assets/hero-nature.jpg`

### 20.7 Admin-User einrichten
```sql
-- Nach Registrierung eines Users die Admin-Rolle zuweisen:
INSERT INTO public.user_roles (user_id, role) 
VALUES ('<user-uuid>', 'admin');
```

### 20.8 Kritische Dateien für Restore

**Nicht veränderbare Auto-Dateien (von Lovable/Supabase generiert):**
- `.env`
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `supabase/migrations/*`

**Alle anderen Dateien** können aus dem Repository wiederhergestellt werden.

---

## Anhang: Statische HTML-Seiten (public/)

### krankheit-ist-messbar.html
Statische Seite über Frequenztherapie (physikalische Grundlagen). Verlinkt aus Infothek als externer Link.

### zapper-diamond-shield.html
Statische Seite über den Diamond Shield Zapper. Verlinkt aus Infothek als externer Link.

---

*Dokumentation erstellt am 2026-02-22. Für die vollständige Design-Spezifikation siehe `docs/design-specification.md` (1527 Zeilen).*
