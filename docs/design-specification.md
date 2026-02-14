# Naturheilpraxis Patienten-App – Vollständige Design-Spezifikation

> **Zweck:** Dieses Dokument beschreibt das aktuelle Design so detailliert, dass ein Entwickler es 1:1 in einem anderen Projekt nachbilden kann.

---

## 1. Technologie-Stack

| Kategorie | Technologie | Version |
|---|---|---|
| Framework | React + TypeScript | ^18.3.1 |
| Build Tool | Vite | — |
| Styling | Tailwind CSS + `tailwindcss-animate` | — |
| UI-Bibliothek | shadcn/ui (Radix UI Primitives) | — |
| Icons | Lucide React | ^0.462.0 |
| Routing | React Router DOM | ^6.30.1 |
| State Management | React Context (Auth, Language) + TanStack React Query | ^5.83.0 |
| PDF-Export | jsPDF | ^4.0.0 |
| Backend | Supabase (Lovable Cloud) | ^2.90.1 |
| Fonts | Google Fonts (CDN-Import) | — |
| Toasts | Sonner + shadcn/ui Toaster | ^1.7.4 |
| Formular | React Hook Form + Zod | ^7.61.1 / ^3.25.76 |
| Carousel | Embla Carousel React | ^8.6.0 |
| Datum | date-fns | ^3.6.0 |

### 1.1 Abhängigkeiten (vollständig)

```json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
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

## 2. Design System

### 2.1 Typografie

**Font-Import (in `index.css`):**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
```

**Font-Familien (in `tailwind.config.ts`):**
```typescript
fontFamily: {
  sans: ["'Source Sans 3'", "system-ui", "sans-serif"],  // Body-Text
  serif: ["'Playfair Display'", "Georgia", "serif"],      // Überschriften
}
```

**Typografie-Regeln (in `index.css` → `@layer base`):**
```css
body {
  @apply bg-background text-foreground font-sans antialiased;
  font-family: 'Source Sans 3', system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', Georgia, serif;
  @apply font-medium tracking-tight;
}
```

### 2.2 Farbpalette – Light Mode (`:root`)

Alle Werte sind HSL ohne `hsl()` Wrapper (Tailwind-Konvention):

```css
:root {
  /* Basis */
  --background: 40 30% 97%;           /* Warmer Elfenbein */
  --foreground: 150 20% 15%;          /* Dunkles Salbeigrün */

  /* Karten */
  --card: 40 25% 95%;                 /* Leicht dunkler als Background */
  --card-foreground: 150 20% 15%;

  /* Popovers */
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

  /* Destructive: Rot */
  --destructive: 0 65% 50%;
  --destructive-foreground: 40 30% 97%;

  /* UI-Elemente */
  --border: 145 15% 85%;
  --input: 145 15% 88%;
  --ring: 145 25% 36%;
  --radius: 0.75rem;
}
```

### 2.3 Erweiterte Farbpaletten

#### Sage (Salbeigrün) – 8 Stufen
```css
--sage-50:  145 25% 96%;
--sage-100: 145 22% 90%;
--sage-200: 145 20% 80%;
--sage-300: 145 20% 65%;
--sage-400: 145 22% 50%;
--sage-500: 145 25% 36%;   /* = --primary */
--sage-600: 145 28% 28%;
--sage-700: 145 30% 22%;
```

#### Sand (Warmton) – 4 Stufen
```css
--sand-50:  35 40% 97%;
--sand-100: 35 38% 92%;
--sand-200: 35 35% 85%;   /* = --secondary */
--sand-300: 35 30% 75%;
```

#### Terracotta – 2 Stufen
```css
--terracotta:       18 45% 55%;   /* = --accent */
--terracotta-light: 18 40% 70%;
```

### 2.4 Farbpalette – Dark Mode (`.dark`)

```css
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
}
```

Dark Mode wird via `class`-Strategie aktiviert: `darkMode: ["class"]` in `tailwind.config.ts`.

### 2.5 Sidebar-Tokens

```css
/* Light */
--sidebar-background: 145 20% 97%;
--sidebar-foreground: 150 20% 20%;
--sidebar-primary: 145 25% 36%;
--sidebar-primary-foreground: 40 30% 97%;
--sidebar-accent: 145 15% 92%;
--sidebar-accent-foreground: 150 20% 20%;
--sidebar-border: 145 15% 88%;
--sidebar-ring: 145 25% 36%;

/* Dark */
--sidebar-background: 150 18% 10%;
--sidebar-foreground: 40 25% 95%;
--sidebar-primary: 145 30% 50%;
--sidebar-primary-foreground: 150 20% 8%;
--sidebar-accent: 150 15% 15%;
--sidebar-accent-foreground: 40 25% 95%;
--sidebar-border: 150 15% 18%;
--sidebar-ring: 145 30% 50%;
```

### 2.6 Gradienten (CSS Custom Properties)

```css
--gradient-hero:   linear-gradient(135deg, hsl(145 25% 36% / 0.9), hsl(145 30% 28% / 0.95));
--gradient-card:   linear-gradient(180deg, hsl(40 30% 97%), hsl(40 25% 94%));
--gradient-accent:  linear-gradient(135deg, hsl(18 45% 55%), hsl(18 50% 45%));
```

**Tailwind-Utility-Klassen (in `@layer components`):**
```css
.hero-gradient   { background: var(--gradient-hero); }
.card-gradient   { background: var(--gradient-card); }
.accent-gradient { background: var(--gradient-accent); }
```

### 2.7 Schatten (CSS Custom Properties)

```css
--shadow-soft:     0 4px 20px -4px hsl(145 20% 30% / 0.1);
--shadow-card:     0 8px 30px -8px hsl(145 20% 30% / 0.12);
--shadow-elevated: 0 20px 50px -15px hsl(145 20% 20% / 0.2);
```

**Tailwind-Utility-Klassen (in `@layer components`):**
```css
.shadow-soft     { box-shadow: var(--shadow-soft); }
.shadow-card     { box-shadow: var(--shadow-card); }
.shadow-elevated { box-shadow: var(--shadow-elevated); }
```

### 2.8 Border-Radius (in `tailwind.config.ts`)

```typescript
borderRadius: {
  lg: "var(--radius)",                // 0.75rem
  md: "calc(var(--radius) - 2px)",    // ~0.625rem
  sm: "calc(var(--radius) - 4px)",    // ~0.5rem
}
```

### 2.9 Animationen

#### Keyframes (in `@layer utilities` von `index.css`)

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

**Utility-Klassen:**
```css
.animate-fade-in  { animation: fadeIn 0.6s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
```

#### Accordion-Animationen (in `tailwind.config.ts`)

```typescript
keyframes: {
  "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
  "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up":   "accordion-up 0.2s ease-out",
}
```

### 2.10 Weitere Utilities

```css
.text-balance { text-wrap: balance; }
```

---

## 3. Button-Komponente

**Datei:** `src/components/ui/button.tsx`

Basiert auf `class-variance-authority` (CVA) mit `@radix-ui/react-slot` für `asChild`-Pattern.

**Basis-Klassen:**
```
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium
ring-offset-background transition-all duration-300
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50
[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
```

### 3.1 Varianten

| Variante | Klassen |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-sage-600 shadow-soft hover:shadow-card` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-sand-300` |
| `ghost` | `hover:bg-sage-100 hover:text-primary` |
| `link` | `text-primary underline-offset-4 hover:underline` |
| `hero` | `bg-primary text-primary-foreground hover:bg-sage-600 shadow-elevated hover:shadow-card text-base px-8 py-6 rounded-xl` |
| `accent` | `bg-accent text-accent-foreground hover:bg-terracotta-light shadow-soft` |

### 3.2 Größen

| Größe | Klassen |
|---|---|
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 rounded-md px-3` |
| `lg` | `h-12 rounded-lg px-8 text-base` |
| `xl` | `h-14 rounded-xl px-10 text-lg` |
| `icon` | `h-10 w-10` |

---

## 4. Layout-System

### 4.1 Layout-Wrapper

**Datei:** `src/components/layout/Layout.tsx`

```tsx
<div className="flex min-h-screen flex-col">
  <Header />           {/* sticky top-0, z-50, backdrop-blur */}
  <main className="flex-1">
    {children}
  </main>
  <Footer />           {/* border-t, bg-card */}
</div>
```

### 4.2 Container

```typescript
// tailwind.config.ts
container: {
  center: true,
  padding: "2rem",
  screens: { "2xl": "1400px" },
}
```

### 4.3 Header

**Datei:** `src/components/layout/Header.tsx`

**Struktur:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ sticky top-0 z-50 border-b border-border/50                        │
│ bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 │
│                                                                     │
│ ┌─ container ─── h-16 md:h-20 ───────────────────────────────────┐ │
│ │ [Logo]                                    [Desktop-Nav] [Auth] │ │
│ │ ┌──────────┐                              ┌──────────────────┐ │ │
│ │ │ ● Leaf   │ Naturheilpraxis              │ Home │ Anamnese │ │ │
│ │ │ (primary)│ Peter Rauch                  │ ... │ [Infothek]│ │ │
│ │ └──────────┘                              │ [DE/EN] [Login] │ │ │
│ │                                            └──────────────────┘ │ │
│ └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Logo:**
- Kreis: `h-10 w-10 rounded-full bg-primary`
- Icon: `<Leaf className="h-5 w-5 text-primary-foreground" />`
- Text: `font-serif text-lg font-semibold leading-tight text-foreground`
- Subtext: `text-xs text-muted-foreground`

**Desktop-Navigation (≥ `lg`):**
- Klassen: `rounded-lg px-3 py-2 text-sm font-medium transition-colors`
- Aktiv: `bg-sage-100 text-primary`
- Inaktiv: `text-muted-foreground`
- Hover: `hover:bg-sage-100 hover:text-primary`

**Mobile-Navigation (< `lg`):**
- Hamburger-Button: `variant="ghost" size="icon"`
- Dropdown: `animate-slide-up border-t border-border bg-background p-4`
- Links: `rounded-lg px-4 py-3 text-sm font-medium`

**Auth-Buttons:**
- Eingeloggt: Dashboard-Link + Admin-Link (wenn Admin) + Logout-Button (`variant="outline" size="sm"`)
- Nicht eingeloggt: Login-Button (`variant="default" size="sm"`)

**Sprachumschalter:** `<LanguageSwitcher />` (DE/EN Toggle)

**Test-Link:** Nur in Preview/Dev sichtbar (`import.meta.env.DEV || hostname.includes('preview')`)

### 4.4 Footer

**Datei:** `src/components/layout/Footer.tsx`

```
┌─────────────────────────────────────────────────────────────────────┐
│ border-t border-border bg-card                                      │
│ container py-12 md:py-16                                            │
│                                                                     │
│ ┌─ grid gap-8 md:grid-cols-2 lg:grid-cols-4 ─────────────────────┐ │
│ │ Brand          │ Quick Links    │ Kontakt        │ Website      │ │
│ │ ● Logo         │ Anamnesebogen  │ ☎ 0821-...    │ 🔗 www...   │ │
│ │ Beschreibung   │ Heilpraktiker  │ ✉ info@...    │              │ │
│ │                │ GebÜH          │ 📍 Adresse    │              │ │
│ │                │ Ernährung      │               │              │ │
│ │                │ FAQ            │               │              │ │
│ └────────────────┴────────────────┴───────────────┴──────────────┘ │
│                                                                     │
│ ── border-t ── mt-12 pt-6 ──────────────────────────────────────── │
│ © 2026 Naturheilpraxis...              Impressum │ Datenschutz    │
└─────────────────────────────────────────────────────────────────────┘
```

**Link-Styling:** `text-sm text-muted-foreground transition-colors hover:text-primary`

---

## 5. Startseite (Index)

**Datei:** `src/pages/Index.tsx`

```tsx
<Layout>
  <SEOHead />
  <HeroSection />
  <FeaturesSection />
  <InfoSection />
</Layout>
```

### 5.1 Hero Section

**Datei:** `src/components/home/HeroSection.tsx`

**Aufbau:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ position: relative, overflow: hidden                                │
│                                                                     │
│ ┌─ Hintergrundbild (absolute inset-0) ──────────────────────────┐ │
│ │ <img src={heroImage} className="h-full w-full object-cover" /> │ │
│ │ Gradient-Overlay:                                               │ │
│ │ bg-gradient-to-r from-sage-700/90 via-sage-600/80              │ │
│ │                   to-sage-500/70                                │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─ container relative py-24 md:py-32 lg:py-40 ──────────────────┐ │
│ │ max-w-2xl animate-fade-in                                       │ │
│ │                                                                 │ │
│ │ <p> Subtitle (text-sm uppercase tracking-wider text-sage-200)  │ │
│ │ <h1> Haupttitel (font-serif 4xl→6xl text-primary-foreground)   │ │
│ │ <p> Beschreibung (text-lg→xl text-sage-100)                    │ │
│ │                                                                 │ │
│ │ ┌─ flex gap-4 sm:flex-row ──────────────────────────────────┐  │ │
│ │ │ [Anamnesebogen ausfüllen]  variant="hero" size="xl"       │  │ │
│ │ │ [Häufige Fragen]           variant="outline" size="xl"    │  │ │
│ │ │   border-sage-200 bg-transparent text-primary-foreground  │  │ │
│ │ │   hover:bg-sage-100/20                                    │  │ │
│ │ └──────────────────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─ Dekorative SVG-Welle (absolute bottom-0) ────────────────────┐ │
│ │ fill-background                                                 │ │
│ └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Features Section

**Datei:** `src/components/home/FeaturesSection.tsx`

**Padding:** `py-16 md:py-24`

**Überschrift:**
- H2: `font-serif text-3xl md:text-4xl font-semibold text-foreground`
- Untertitel: `text-lg text-muted-foreground max-w-2xl mx-auto`

**Feature-Karten** (`grid gap-6 md:grid-cols-2 lg:grid-cols-3`):

| Feature | Icon | Hervorgehoben |
|---|---|---|
| Anamnesebogen | `FileText` | ✅ Ja |
| Was ist ein Heilpraktiker? | `Stethoscope` | Nein |
| Frequenztherapie | `Zap` | Nein |
| GebÜH | `Euro` | Nein |
| Häufige Fragen | `HelpCircle` | Nein |

**Hervorgehobene Karte:**
- `bg-primary text-primary-foreground shadow-elevated`
- Icon-Container: `bg-sage-600`
- Icon: `text-primary-foreground`
- Text: `text-sage-100` (Beschreibung), `text-sage-200` (Link)

**Standard-Karte:**
- `bg-card shadow-card hover:shadow-elevated`
- Icon-Container: `bg-sage-100`
- Icon: `text-primary`
- Text: `text-muted-foreground`

**Karten-Styling:**
```css
rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1
```

**Icon-Container:**
```css
h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-110
```

**"Mehr erfahren" Link:**
```css
text-sm font-medium transition-transform duration-300 group-hover:translate-x-1
/* + ArrowRight Icon */
```

---

## 6. Anamnesebogen – Hauptseite

**Datei:** `src/pages/Anamnesebogen.tsx`
**Route:** `/anamnesebogen` (geschützt durch `<ProtectedRoute>`)

### 6.1 Seitenkopf

```tsx
<div className="bg-gradient-to-b from-muted/30 to-background min-h-screen">
  <div className="container py-8">
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
        Anamnesebogen
      </h1>
      <p className="text-lg text-muted-foreground">
        Bitte füllen Sie diesen Fragebogen vor Ihrem ersten Termin aus...
      </p>
    </div>
  </div>
</div>
```

### 6.2 Layout-Auswahl

Wird angezeigt wenn `selectedLayout === null`.

**Struktur:** `container py-12` → `mx-auto max-w-4xl` → `grid md:grid-cols-2 gap-6`

#### Wizard-Option
```
┌─ Card ──────────────────────────────────────────┐
│ cursor-pointer hover:shadow-lg hover:border-primary/50 │
│                                                  │
│ ┌─ CardHeader pb-4 ───────────────────────────┐ │
│ │ [●] w-12 h-12 rounded-full bg-primary/10    │ │
│ │ [Sparkles icon text-primary]                 │ │
│ │ "Schritt für Schritt"  font-serif text-xl    │ │
│ │ "mit Emojis 👤 ❤️ 🧠"                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─ CardContent ────────────────────────────────┐ │
│ │ Emoji-Vorschau: 👋 👤 👨‍👩‍👧 🩺 💊               │ │
│ │ (w-10 h-10 rounded-full bg-muted)            │ │
│ │                                                │ │
│ │ Vorteile-Box: bg-muted/50 rounded-lg p-4      │ │
│ │ • Geführte Eingabe                             │ │
│ │ • Fortschrittsanzeige                          │ │
│ │ • Ideal für Smartphones                        │ │
│ │ • Übersichtlich bei vielen Fragen              │ │
│ │                                                │ │
│ │ Empfehlung: text-sm text-muted-foreground      │ │
│ │                                                │ │
│ │ [Diese Variante wählen →]  variant="outline"   │ │
│ └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

#### Akkordeon-Option
Gleiche Struktur, aber:
- Icon-Container: `bg-secondary/10`
- Icon: `<LayoutList className="w-6 h-6 text-secondary-foreground" />`
- Vorschau-Icons: `User, Heart, Stethoscope, Pill, Leaf` (Lucide, in `bg-muted` Kreisen)
- Vorteile: Komplette Übersicht, Freies Wechseln, Professionelles Design, Schneller Zugriff

### 6.3 Wizard-Modus

**Container:** `container py-8` → `mx-auto max-w-3xl`

**"Layout ändern" Button:** `variant="ghost"` mit `ChevronLeft` Icon

#### Fortschrittsleiste

```tsx
<div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
  {formSections.map((section, index) => (
    <div className="flex items-center">
      {/* Kreis */}
      <div className={`flex flex-col items-center cursor-pointer transition-all ${
        wizardStep === index ? "scale-110"
        : wizardStep > index ? "opacity-70"
        : "opacity-40"
      }`}>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          text-xl sm:text-2xl mb-1 transition-all ${
          wizardStep === index
            ? "bg-primary text-primary-foreground shadow-lg"
            : wizardStep > index
              ? "bg-green-500 text-white"
              : "bg-muted"
        }`}>
          {wizardStep > index ? <Check /> : section.emoji}
        </div>
        <span className="text-[10px] sm:text-xs text-center hidden md:block max-w-[60px] truncate">
          {title ohne Nummerierung}
        </span>
      </div>
      {/* Verbindungslinie */}
      {index < length - 1 && (
        <div className={`h-0.5 w-4 sm:w-8 mx-1 sm:mx-2 ${
          wizardStep > index ? "bg-green-500" : "bg-muted"
        }`} />
      )}
    </div>
  ))}
</div>
```

#### Sektionskarte

```tsx
<Card className={`${currentSection.color} border-2`}>
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
        <Icon className={`w-6 h-6 ${currentSection.iconColor}`} />
      </div>
      <div>
        <CardTitle className="font-serif text-xl">{title}</CardTitle>
        <CardDescription>Schritt X von 25</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent className="bg-background rounded-b-lg">
    {renderSectionContent(currentSection.id)}
    
    {/* Navigation */}
    <div className="flex justify-between mt-8 pt-6 border-t">
      <Button variant="outline" disabled={wizardStep === 0}>← Zurück</Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">[ListFilter] Zusammenfassung</Button>
        <Button variant="outline">[Printer] Drucken</Button>
        <Button variant="outline">[FileDown] PDF</Button>
        {letzterSchritt
          ? <Button type="submit">[Send] Absenden</Button>
          : <Button>Weiter →</Button>
        }
      </div>
    </div>
  </CardContent>
</Card>
```

### 6.4 Akkordeon-Modus

**Container:** `container py-8` → `mx-auto max-w-4xl`

```tsx
<Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems}
  className="space-y-4">
  {formSections.map((section) => (
    <AccordionItem value={section.id}
      className={`${section.color} border-2 rounded-lg overflow-hidden`}>
      
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${section.iconColor}`} />
          </div>
          <div className="text-left">
            <span className="font-serif text-lg block">{title}</span>
            <span className="text-xl">{section.emoji}</span>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-6 pb-6 bg-background">
        <div className="pt-4">{renderSectionContent(section.id)}</div>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>

{/* Footer-Buttons */}
<div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
  <Button variant="outline" size="lg">[ListFilter] Zusammenfassung</Button>
  <Button variant="outline" size="lg">[Printer] Drucken</Button>
  <Button variant="outline" size="lg">[FileDown] Als PDF speichern</Button>
  <Button type="submit" size="lg">[Send] Anamnesebogen absenden</Button>
</div>
```

---

## 7. Sektionsdefinitionen (25 Sektionen)

**Datei:** `src/lib/anamneseFormData.ts`

### 7.1 FormSection Interface

```typescript
export interface FormSection {
  id: string;
  titleDe: string;
  titleEn: string;
  emoji: string;
  icon: string;        // Lucide Icon Name
  color: string;       // Tailwind BG-Klasse (Light + Dark)
  iconColor: string;   // Tailwind Text-Klasse
}
```

### 7.2 Vollständige Sektionsliste

| # | `id` | `titleDe` | `emoji` | `icon` | `color` | `iconColor` |
|---|---|---|---|---|---|---|
| 1 | `intro` | Willkommen | 👋 | `Sparkles` | `bg-emerald-100 dark:bg-emerald-950/30` | `text-emerald-500` |
| 2 | `patientData` | I. Patientendaten | 👤 | `User` | `bg-blue-100 dark:bg-blue-950/30` | `text-blue-500` |
| 3 | `familyHistory` | II. Familie | 👨‍👩‍👧 | `Users` | `bg-cyan-100 dark:bg-cyan-950/30` | `text-cyan-500` |
| 4 | `neurology` | III. Kopf & Sinne | 🧠 | `Brain` | `bg-purple-100 dark:bg-purple-950/30` | `text-purple-500` |
| 5 | `heart` | IV. Herz & Kreislauf | ❤️ | `Heart` | `bg-red-100 dark:bg-red-950/30` | `text-red-500` |
| 6 | `lung` | V. Lunge & Atmung | 🫁 | `Wind` | `bg-sky-100 dark:bg-sky-950/30` | `text-sky-500` |
| 7 | `digestive` | VI. Magen & Darm | 🍽️ | `Apple` | `bg-orange-100 dark:bg-orange-950/30` | `text-orange-500` |
| 8 | `liver` | VII. Leber & Galle | 🫀 | `FlaskConical` | `bg-amber-100 dark:bg-amber-950/30` | `text-amber-600` |
| 9 | `kidney` | VIII. Niere & Blase | 💧 | `Droplets` | `bg-blue-100 dark:bg-blue-950/30` | `text-blue-500` |
| 10 | `hormone` | IX. Hormone | ⚡ | `Activity` | `bg-yellow-100 dark:bg-yellow-950/30` | `text-yellow-600` |
| 11 | `musculoskeletal` | X. Bewegungsapparat | 🦴 | `Bone` | `bg-stone-100 dark:bg-stone-950/30` | `text-stone-500` |
| 12 | `womenHealth` | XI. Frauengesundheit | 👩 | `Heart` | `bg-pink-100 dark:bg-pink-950/30` | `text-pink-500` |
| 13 | `mensHealth` | XI. Männergesundheit | 👨 | `User` | `bg-blue-100 dark:bg-blue-950/30` | `text-blue-500` |
| 14 | `surgeries` | XII. Unfälle & OPs | 🏥 | `Building2` | `bg-red-100 dark:bg-red-950/30` | `text-red-500` |
| 15 | `cancer` | XIII. Krebs | ⚠️ | `AlertTriangle` | `bg-amber-100 dark:bg-amber-950/30` | `text-amber-600` |
| 16 | `allergies` | XIV. Allergien | 🤧 | `ShieldAlert` | `bg-yellow-100 dark:bg-yellow-950/30` | `text-yellow-600` |
| 17 | `medications` | XV. Medikamente | 💊 | `Pill` | `bg-purple-100 dark:bg-purple-950/30` | `text-purple-500` |
| 18 | `lifestyle` | XVI. Lebensweise | 🌿 | `Leaf` | `bg-green-100 dark:bg-green-950/30` | `text-green-500` |
| 19 | `environment` | XVII. Umwelt | 🌍 | `Globe` | `bg-teal-100 dark:bg-teal-950/30` | `text-teal-500` |
| 20 | `infections` | XVIII. Infektionen | 🦠 | `Bug` | `bg-rose-100 dark:bg-rose-950/30` | `text-rose-500` |
| 21 | `vaccinations` | XIX. Impfstatus | 💉 | `Syringe` | `bg-indigo-100 dark:bg-indigo-950/30` | `text-indigo-500` |
| 22 | `complaints` | XX. Beschwerden | 📋 | `ClipboardList` | `bg-slate-100 dark:bg-slate-950/30` | `text-slate-500` |
| 23 | `preferences` | XXI. Präferenzen | ✨ | `Wand2` | `bg-violet-100 dark:bg-violet-950/30` | `text-violet-500` |
| 24 | `social` | XXII. Persönliches | 🏠 | `Home` | `bg-sky-100 dark:bg-sky-950/30` | `text-sky-500` |
| 25 | `signature` | XXIII. Unterschrift | ✍️ | `PenTool` | `bg-stone-100 dark:bg-stone-950/30` | `text-stone-500` |

### 7.3 Icon-Mapping (in `Anamnesebogen.tsx`)

```typescript
import { Sparkles, User, Users, Heart, Building2, AlertTriangle, ShieldAlert,
  Pill, Leaf, Globe, Bug, Syringe, ClipboardList, Wand2, Home, PenTool,
  Brain, Wind, Apple, FlaskConical, Droplets, Activity, Bone,
  type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sparkles, User, Users, Stethoscope, Heart, Building2, AlertTriangle,
  ShieldAlert, Pill, Leaf, Globe, Bug, Syringe, ClipboardList, Wand2,
  Home, PenTool, Brain, Wind, Apple, FlaskConical, Droplets, Activity, Bone,
};

const formSections = formSectionsData.map(section => ({
  ...section,
  Icon: iconMap[section.icon] || AlertCircle,
}));
```

---

## 8. Formular-Datenstruktur (vollständig)

**Datei:** `src/lib/anamneseFormData.ts`

### 8.1 Datentyp-Muster

```typescript
// 1. Einfacher Boolean mit Zeitangabe
{ ja: false, jahr: "" }

// 2. Boolean mit Zeitangabe und Lateralität
{ ja: false, jahr: "", links: false, rechts: false, beidseitig: false }

// 3. Boolean mit Zeitangabe, Subtypen und Freitext
{ ja: false, seit: "", migraene: false, spannungskopfschmerz: false, sonstige: "" }

// 4. Boolean mit Stadien
{ ja: false, jahr: "", stadium: "" }

// 5. Familien-Matrix
{ ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false }

// 6. Array-Einträge (dynamisch erweiterbar)
operationen: [] as { jahr: string; grund: string }[]
aktuelle: [] as { name: string; dosierung: string; taeglich: boolean; proWoche: string; grund: string; seit: string }[]

// 7. Multi-Select mit Array
typen: [] as string[]
```

### 8.2 Bereiche (komplett)

#### I. Patientendaten
```typescript
nachname: ""
vorname: ""
geburtsdatum: ""
nationalitaet: ""
geschlecht: ""
zivilstand: ""
strasse: ""
plz: ""
wohnort: ""
telefonPrivat: ""
telefonBeruflich: ""
mobil: ""
email: ""
mitversicherte: [] as { name: string; verhaeltnis: string; geburtsdatum: string }[]
versicherungstyp: ""           // "privat" | "gesetzlich"
versicherungsname: ""
versicherungsnummer: ""
tarif: ""
kostenuebernahmeNaturheilkunde: false
beruf: ""
arbeitgeber: ""
branche: ""
arbeitsunfaehigSeit: ""
berentnerSeit: ""
unfallrenteProzent: ""
schwerbehinderungProzent: ""
koerpergroesse: ""             // Max 210, nur Zahlen
gewicht: ""                    // 1-200, nur Zahlen
informationsquelle: [] as string[]
empfehlungVon: ""
hausarzt: ""                   // Nur Buchstaben
fachaerzte: ""
heilpraktiker: ""
physiotherapeut: ""
psychotherapeut: ""
sonstigeTherapeutenn: ""
```

#### II. Familiengeschichte
12 Erkrankungen als Matrix-Objekte:
`hoherBlutdruck`, `herzinfarkt`, `schlaganfall`, `diabetes`, `gicht`, `lungenasthma`, `lungentuberkulose`, `nervenleiden`, `krebs` (+ `welches`), `allergien`, `sucht`, `autoimmun`

#### III. Kopf & Sinne (`kopfErkrankungen`)
- `augenerkrankung` (10 Subtypen: Netzhaut, Grauer/Grüner Star, Makula, etc.)
- `schwerhoerig` (Links/Rechts/Beidseitig)
- `ohrenerkrankung` (6 Subtypen: Tinnitus, Hörsturz, Morbus Menière, etc.)
- `sinusitis` (chronisch/akut)
- `mandelentzuendung`
- `kopfschmerzen` (8 Subtypen: Migräne, Spannungskopfschmerz, Cluster, etc.)
- `schwindel` (5 Subtypen: Lagerung, Dreh, Schwank, etc.)
- `geruchsminderung` (Vollverlust/Teilminderung)
- `geschmacksminderung`
- `neuralgien` (6 Subtypen: Trigeminus, Glossopharyngeus, etc.)

#### Schlaf & Psyche (`schlafSymptome`)
12 Symptome: `schlafstörung`, `einschlafstörung`, `durchschlafstörung`, `fruehAufwachen`, `konzentrationsstörung`, `muedigkeit`, `leistungsabfall`, `vergesslichkeit`, `angstzustaende`, `stress`, `partnerschaftsprobleme`, `sexualprobleme`

#### Psychische Erkrankungen (`psychischeErkrankungen`)
8 Diagnosen: `depression`, `schizophrenie`, `psychose`, `zwangsgedanken`, `phobien`, `epilepsie`, `trauma`, `mobbing`

#### IV. Herz & Kreislauf (`herzKreislauf`)
12 Erkrankungen: `blutdruckWechselhaft`, `blutdruckNiedrig`, `blutdruckHoch`, `herzrhythmusstörung`, `herzschrittmacher`, `herzschmerzen`, `herzinfarkt`, `stent`, `herzklappenfehler`, `krampfadern`, `thrombose`, `oedeme` + `sonstige`

#### V. Lunge & Atmung (`lungeAtmung`)
10 Erkrankungen: `asthma`, `lungenentzuendung`, `rippenfellentzuendung`, `bronchitis`, `tuberkulose`, `sarkoidose`, `husten`, `auswurf`, `atemnot`, `copd`, `lungenembolie` + `sonstige`

#### VI. Magen & Darm (`magenDarm`)
14 Erkrankungen: `magengeschwuer`, `duennDarmgeschwuer`, `sodbrennen`, `magensaeurehemmer`, `uebelkeit`, `erbrechen`, `verstopfung`, `durchfall`, `blaehungen`, `bauchschmerzen`, `zoeliakie`, `morbusCrohn`, `colitis`, `reizdarm` + `sonstige`, `durst`, `appetit`, `ernaehrungstyp`

#### VII. Leber & Galle (`leberGalle`)
8 Erkrankungen: `lebererkrankung` (Hepatitis A/B/C, Fettleber), `leberzirrhose`, `leberkrebs`, `gelbsucht`, `gallensteine`, `gallenleiden`, `gallenblasenentfernung`, `gallengangentzuendung` + `sonstige`

#### VIII. Niere & Blase (`niereBlase`)
8 Erkrankungen: `nierenerkrankung`, `blasenleiden`, `miktionsfrequenz`, `nykturie`, `miktionsbeschwerden`, `inkontinenz` (Belastung/Drang/Überlauf), `haematurie`, `nierensteine` + `sonstige`

#### IX. Männergesundheit (`maennergesundheit`)
`prostata` (5 Subtypen), `hoden` (5 Subtypen), `nebenhoden` (3 Subtypen), `erektionsstoerung` + `sonstige`

#### X. Hormone (`hormongesundheit`)
`schilddruese` (8 Subtypen), `hypophyse` (5 Subtypen), `nebenniere` (4 Subtypen) + `sonstige`

#### XI. Bewegungsapparat (`wirbelsaeuleGelenke`)
12 Regionen je mit Rechts/Links/Beidseitig: `hws`, `bws`, `lws`, `iliosakral`, `schulter`, `ellbogen`, `handgelenk`, `finger`, `huefte`, `knie`, `fuss`, `zehen`, `rheuma` + `sonstige`

#### Haut & Infektionen (`hautInfektionen`)
10 Erkrankungen + 3 Schweiß-Flags: `hauterkrankung`, `ekzem`, `psoriasis`, `urticaria`, `juckreiz`, `akne`, `rosazea`, `geschlechtskrankheit`, `hyperhidrose`, `nachtschweiss`, `stressSchweiss`, `staendigSchweiss`

#### XII. Frauengesundheit (`frauengesundheit`)
`geburtsgewicht`, `fruehgeburt`, `gebaermuttererkrankung`, `gebaermutterentfernung`, `eierstockentfernung`, `gebaermutterausschabung`, `eierstockzyste`, `endometriose`, `myome`, `pille`, `hormonbehandlung`, `periodeNormal`, `periodeSchwach`, `periodeStark`, `periodeUnregelmaessig`, `periodenbeschwerden`, `menopause`, `schwangerschaften`, `fehlgeburten`, `geburten`, `wochenbettdepression` + `sonstige`

#### XIII. Unfälle & OPs (`unfaelleOperationen`)
`unfall`, `knochenbruch`, `kopfverletzung`, `operationen` (Array), `krankenhausaufenthalt`, `kuraufenthalt`, `bluttransfusion`, `chemotherapie`, `strahlentherapie`, `szintigraphie`, `petCt`, `radioiodtherapie`

#### XIV. Krebs (`krebserkrankung`)
`hatKrebs`, `welche`, `welcheTyp`, `diagnoseJahr`, `betroffeneOrgane`, `betroffeneOrganeList`, `tnmStadium` (T/N/M), `operationDurchgefuehrt`, `operationenList`, `chemotherapieErhalten` (+ Typen-Array), `strahlentherapieErhalten` (+ Typen-Array), `metastasen` (+ Organe-Array), `aktuelleTumortherapie` (+ Typen-Array), `krebsBestaetigung`

#### XV. Allergien (`allergien`)
`inhalation` (4 Typen), `tierepithelien` (4 Typen), `nahrungsmittel`, `medikamente`, `kontakt`, `laktose` (3 Schweregrade), `gluten`, `fruktose`, `histamin` (3 Schweregrade), `sonstigeUnvertraeglichkeit`

#### XVI. Medikamente (`medikamente`)
`inAerztlicherBehandlung`, `fachaerzte`, `aktuelle` (Array: Name/Dosierung/Täglich/ProWoche/Grund/Seit), `unvertraeglichkeiten` (Array: Name/Allergie/Unverträglichkeit/Reaktion)

#### XVII. Lebensweise (`lebensweise`)
`raucher` (aktiv/ehemals/nein), `raucherSeitWann`, `zigarettenProTag`, `exRaucherBisWann`, `passivRauchen`, `passivRauchenTypen`, `alkohol` (+ Typen-Array mit Menge), `sport` (+ Arten-Array), `taeglicheBewegung`, `spaziergang`, `meterZuFuss`, `schlafQualitaet`, `schlafDauer`, `stressLevel`, `ernaehrungsgewohnheiten`, `ernaehrungsTypen`, `ernaehrungSonstiges`

#### XVIII. Umweltbelastungen (`umweltbelastungen`)
**Chemosensibilitäten** (14 Stoffe je mit Ja/Stärke): Diesel, Tabak, Pestizide, Benzin, Farben, Desinfektionsmittel, Reiniger, Parfüms, Teer, Nagellack, Haarspray, neue Raumausstattung, Kunststoff, neues Auto

**Körperbelastungen**: Strahlung (5 Typen), Zahnherde, Quecksilber, Zahnbeschwerden, Metalle im Mund, Implantate, Nebenhöhlen, Tonsillen, Narben, Mangelzustände (5 Typen), Mikroorganismen (4 Typen), Toxisch (4 Typen)

#### XIX. Infektionen (`infektionen`)
`tropenReise`, `zeckenbiss`, `borreliose`, `fsmeImpfung`, `hund`, `katze`, `pferd`, `andereHaustiere`

#### XX. Impfstatus (`impfungen`)
10 Standard-Impfungen: `mmr`, `tetanus`, `diphtherie`, `keuchhusten`, `polio`, `hepatitisA`, `hepatitisB`, `windpocken`, `influenza`, `pneumokokken`
COVID-19: 4 Dosen (Datum + Hersteller), `weitereAnzahl`, `impfreaktionen`, `infiziert`, `longCovid`

#### XXI. Beschwerden (`beschwerden`)
`hauptbeschwerde`, `weitereBeschwerden`, `beginnDerBeschwerden`, `verlauf` (konstant/zunehmend/abnehmend/wechselhaft), `auftreten` (Multi-Select), `ausstrahlung`, `artDerBeschwerden` (Multi-Select), `schmerzqualitaet` (Multi-Select), `schmerzintensitaet` (0-10), `verschlimmerung` (Multi-Select), `verbesserung` (Multi-Select), `bisherigeBehandlungen`, `ergebnisBisherigerBehandlungen`

#### XXII. Behandlungspräferenzen (`behandlungspraeferenzen`)
12 Methoden (je `interesse`/`erfahren`): Homöopathie, Biophysikalisch, Metatron, Trikombin, Zapper, EAV, Mineraltestung, Akupunktur, Phytotherapie, Bachblüten, Sanum, Hypnotherapie
+ `therapieerwartungen`, `gesundheitsziele`

#### XXIII. Soziales (`soziales`)
`familienstand`, `kinderAnzahl`, `kinderAlter`, `wohnumfeld`, `wohntyp`, `berufStress`, `finanzBelastung`, `sozialesNetzwerk`, `hobbys`

#### XXIV. Unterschrift (`unterschrift`)
`ort` (Default: "Augsburg"), `datum`, `nameInDruckbuchstaben`, `bestaetigung`, `datenschutzEinwilligung`, `bestaetigung2fa`, `erziehungsberechtigter`

---

## 9. Shared Components

### 9.1 YearMonthSelect

**Datei:** `src/components/anamnese/shared/YearMonthSelect.tsx`

**Props:**
```typescript
interface YearMonthSelectProps {
  yearValue: string;
  monthValue?: string;
  onYearChange: (value: string) => void;
  onMonthChange?: (value: string) => void;
  showMonth?: boolean;           // default: true
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  className?: string;
  birthYear?: number;            // Geburtsjahr des Patienten
  showAgeHint?: boolean;         // default: true
}
```

**Validierungslogik:**
```typescript
const currentYear = new Date().getFullYear();
const hardMinYear = currentYear - 100;
const calculatedMinYear = Math.max(hardMinYear, minYear ?? hardMinYear, birthYear ?? hardMinYear);
const calculatedMaxYear = maxYear ?? currentYear;
// Jahre werden absteigend generiert (neuestes zuerst)
```

**Darstellung:**
- Jahr-Select: `w-[100px]`
- Monat-Select: `w-[120px]` (optional)
- Dropdown-Höhe: `max-h-[200px]`
- Monate: Lokalisiert (DE/EN)
- Warnung bei Geburtsjahr > 100: `text-xs text-muted-foreground`

### 9.2 NumericInput

**Datei:** `src/components/anamnese/shared/NumericInput.tsx`

Sanitized Input: nur Ziffern, `inputMode="numeric"`, `pattern="[0-9]*"`, Min/Max-Constraints.

### 9.3 MultiSelectCheckbox

**Datei:** `src/components/anamnese/shared/MultiSelectCheckbox.tsx`

Grid-Layout mit Checkboxen + optionalem "Sonstige"-Freitext-Feld.

### 9.4 MultiEntryField

**Datei:** `src/components/anamnese/shared/MultiEntryField.tsx`

Dynamische Liste: Einträge hinzufügen/entfernen. Verwendet für OPs, Medikamente, etc.

### 9.5 ToothDiagram

**Datei:** `src/components/anamnese/shared/ToothDiagram.tsx`

Interaktives FDI-Zahnschema (Zähne 11-48). Klickbare Zähne zur Markierung.

---

## 10. Medizinische Sektions-Komponenten

### 10.1 Standard-Interface

```typescript
interface SectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}
```

### 10.2 Standard-Aufbau (Beispiel: HeartSection)

```tsx
<div className="space-y-6">
  {/* Einleitungstext */}
  <p className="text-muted-foreground">
    Bitte geben Sie an, ob Sie eine der folgenden Erkrankungen haben...
  </p>

  {/* Erkrankungs-Grid */}
  <div className="grid gap-4">
    {conditions.map((item) => (
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={isChecked} onCheckedChange={...} />
          <div className="space-y-2 flex-1">
            <Label>{label}</Label>
            {isChecked && (
              <div className="mt-2 max-w-xs">
                <YearMonthSelect birthYear={birthYear} ... />
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Sonstiges */}
  <div className="border rounded-lg p-4 bg-muted/30">
    <Label className="text-base font-medium">Sonstige Erkrankungen</Label>
    <Textarea placeholder="..." className="mt-2" rows={2} />
  </div>
</div>
```

### 10.3 Nested-Update-Logik

```typescript
// Aktualisiert formData[section][field][subfield]
const updateNestedField = (section, field, subfield, value) => {
  const current = formData[section];
  updateFormData(section, {
    ...current,
    [field]: { ...current?.[field], [subfield]: value }
  });
};

// Kombiniert Jahr + Monat zu "YYYY-MM" String
const setYearMonthCombined = (section, field, timeKey, { year?, month? }) => {
  const current = parseYearMonth(fieldData[timeKey]);
  const combined = month ? `${year}-${month}` : year;
  updateNestedField(section, field, timeKey, combined);
};
```

### 10.4 Sektions-Komponentenliste

| Datei | Section ID | Datenfeld |
|---|---|---|
| `IntroSection.tsx` | `intro` | — |
| `PatientDataSection.tsx` | `patientData` | Flache Felder |
| `FamilyHistorySection.tsx` | `familyHistory` | `familyHistory` |
| `NeurologySection.tsx` | `neurology` | `kopfErkrankungen`, `schlafSymptome`, `psychischeErkrankungen` |
| `HeartSection.tsx` | `heart` | `herzKreislauf` |
| `LungSection.tsx` | `lung` | `lungeAtmung` |
| `DigestiveSection.tsx` | `digestive` | `magenDarm` |
| `LiverSection.tsx` | `liver` | `leberGalle` |
| `KidneySection.tsx` | `kidney` | `niereBlase` |
| `HormoneSection.tsx` | `hormone` | `hormongesundheit` |
| `MusculoskeletalSection.tsx` | `musculoskeletal` | `wirbelsaeuleGelenke` |
| `WomenHealthSection.tsx` | `womenHealth` | `frauengesundheit` |
| `MensHealthSection.tsx` | `mensHealth` | `maennergesundheit` |
| `SurgeriesSection.tsx` | `surgeries` | `unfaelleOperationen` |
| `CancerSection.tsx` | `cancer` | `krebserkrankung` |
| `AllergiesSection.tsx` | `allergies` | `allergien` |
| `MedicationsSection.tsx` | `medications` | `medikamente` |
| `LifestyleSection.tsx` | `lifestyle` | `lebensweise` |
| `EnvironmentSection.tsx` | `environment` | `umweltbelastungen` |
| `InfectionsSection.tsx` | `infections` | `infektionen` |
| `VaccinationsSection.tsx` | `vaccinations` | `impfungen` |
| `ComplaintsSection.tsx` | `complaints` | `beschwerden` |
| `PreferencesSection.tsx` | `preferences` | `behandlungspraeferenzen` |
| `SocialSection.tsx` | `social` | `soziales` |
| `SignatureSection.tsx` | `signature` | `unterschrift` |

---

## 11. Validierung

### 11.1 Input-Sanitierung

| Feldtyp | Methode | Regel |
|---|---|---|
| Namen (Nachname, Vorname, Hausarzt) | Regex-Replace | `/[^a-zA-ZäöüÄÖÜßéèêàáâ\s\-']/g` → nur Buchstaben + Umlaute + Bindestrich |
| Körpergröße | NumericInput | Min: 0, Max: 210, `inputMode="numeric"` |
| Gewicht | NumericInput | Min: 1, Max: 200, `inputMode="numeric"` |
| Zeitangaben | YearMonthSelect | Kein Freitext, nur Select-Dropdowns |
| Jahreszahlen | YearMonthSelect | 4-stellig, Min: `currentYear - 100`, Max: `currentYear` |

### 11.2 Pflichtfeld-Validierung vor Absenden

```typescript
// 1. Grunddaten
if (!formData.nachname || !formData.vorname || !formData.email) {
  toast.error("Bitte füllen Sie alle Pflichtfelder aus");
  return;
}

// 2. Signatur-Vollständigkeit
if (!(formData.unterschrift?.bestaetigung &&
      formData.unterschrift?.datum &&
      formData.unterschrift?.nameInDruckbuchstaben)) {
  toast.error("Unterschrift erforderlich", {
    description: "Ausführliche Erklärung...",
    duration: 8000,
  });
  return;
}
```

---

## 12. Datenpersistenz (Autosave)

### 12.1 LocalStorage-Draft

```typescript
// Storage-Key (pro User)
const draftStorageKey = `anamnesebogen:draft:${user.id}`;

// Gespeicherte Daten
{
  formData: AnamneseFormData,
  selectedLayout: "wizard" | "accordion" | null,
  wizardStep: number,
  openAccordionItems: string[]
}

// Autosave: Debounced (300ms)
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem(draftStorageKey, JSON.stringify({...}));
  }, 300);
  return () => clearTimeout(timer);
}, [formData, selectedLayout, wizardStep, openAccordionItems]);

// Restore: Beim Login
useEffect(() => {
  const raw = localStorage.getItem(draftStorageKey);
  if (raw) {
    const parsed = JSON.parse(raw);
    setFormData(parsed.formData);
    setSelectedLayout(parsed.selectedLayout);
    setWizardStep(parsed.wizardStep);
    setOpenAccordionItems(parsed.openAccordionItems);
  }
}, [draftStorageKey]);
```

---

## 13. Export & Druck

### 13.1 PDF-Export

```typescript
import { generateEnhancedAnamnesePdf } from "@/lib/pdfExportEnhanced";

generateEnhancedAnamnesePdf({ formData, language: "de" | "en" });
// → Automatischer Download als PDF
```

### 13.2 Drucken

```tsx
// PrintView als Full-Screen Overlay
{showPrintView && (
  <div className="fixed inset-0 z-50 bg-white">
    <PrintView ref={printRef} formData={formData} language={"de" | "en"} />
  </div>
)}

// Workflow:
setShowPrintView(true);
setTimeout(() => {
  window.print();
  setTimeout(() => setShowPrintView(false), 500);
}, 100);
```

### 13.3 Print-CSS

```css
@media print {
  body { print-color-adjust: exact !important; }

  header, footer, nav, .no-print, button, .print-hide {
    display: none !important;
  }

  .print-view {
    display: block !important;
    position: absolute; left: 0; top: 0; width: 100%;
    background: white !important; color: black !important;
    font-size: 12pt; line-height: 1.4;
  }

  .print-section { page-break-inside: avoid; break-inside: avoid; }
  .print-view * { background: transparent !important; box-shadow: none !important; }

  @page { margin: 1.5cm; size: A4; }
}
```

### 13.4 Gefilterte Zusammenfassung

```tsx
// Full-Screen Modal
{showFilteredSummary && (
  <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h2>Gefilterte Zusammenfassung</h2>
        <Button variant="outline" onClick={close}>← Zurück zum Formular</Button>
        <Card>
          <CardContent className="pt-6">
            <FilteredSummaryView formData={formData} />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)}
```

---

## 14. Routing

**Datei:** `src/App.tsx`

| Route | Komponente | Schutz |
|---|---|---|
| `/` | `Index` | Öffentlich |
| `/auth` | `Auth` | Öffentlich |
| `/anamnesebogen` | `Anamnesebogen` | `ProtectedRoute` |
| `/anamnesebogen-demo` | `AnamneseDemo` | Öffentlich |
| `/datenschutz` | `Datenschutz` | Öffentlich |
| `/heilpraktiker` | `Heilpraktiker` | Öffentlich |
| `/gebueh` | `Gebueh` | Öffentlich |
| `/ernaehrung` | `Ernaehrung` | Öffentlich |
| `/frequenztherapie` | `Frequenztherapie` | Öffentlich |
| `/faq` | `FAQ` | Öffentlich |
| `/praxis-info` | `PraxisInfo` | Öffentlich |
| `/impressum` | `Impressum` | Öffentlich |
| `/admin` | `AdminDashboard` | Admin-Rolle |
| `/dashboard` | `PatientDashboard` | `ProtectedRoute` |
| `*` | `NotFound` | — |

---

## 15. Provider-Hierarchie

```
QueryClientProvider
  └─ LanguageProvider
       └─ AuthProvider
            └─ TooltipProvider
                 ├─ Toaster (shadcn/ui Toast)
                 ├─ Sonner (Toast-Library)
                 ├─ SchemaOrg (SEO JSON-LD)
                 └─ BrowserRouter
                      ├─ CookieBanner
                      └─ Routes (alle Seiten)
```

---

## 16. Internationalisierung (i18n)

**Sprachen:** Deutsch (Standard) + Englisch

**Mechanismus:**
```typescript
// contexts/LanguageContext.tsx
const { language, t } = useLanguage();

// Inline-Verwendung überall:
language === "de" ? "Deutscher Text" : "English Text"
t("Deutscher Text", "English Text")
```

**Abgedeckte Bereiche:**
- Alle UI-Labels und Platzhalter
- Alle Sektions-Titel (in `formSections`)
- Alle medizinischen Optionslabels
- Toast-Nachrichten
- Validierungsfehler
- Monatsbezeichnungen (YearMonthSelect)

---

## 17. Dateistruktur (vollständig)

```
src/
├── assets/
│   ├── hero-nature.jpg              # Hero-Hintergrundbild
│   ├── practice-icon.png            # Praxis-Icon
│   └── practice-logo.png            # Praxis-Logo
│
├── components/
│   ├── anamnese/
│   │   ├── shared/
│   │   │   ├── MultiEntryField.tsx   # Dynamische Listen
│   │   │   ├── MultiSelectCheckbox.tsx # Multi-Select Checkboxen
│   │   │   ├── NumericInput.tsx      # Numerische Eingabe
│   │   │   ├── ToothDiagram.tsx      # FDI-Zahnschema
│   │   │   └── YearMonthSelect.tsx   # Jahr/Monat-Auswahl
│   │   │
│   │   ├── AllergiesSection.tsx
│   │   ├── CancerSection.tsx
│   │   ├── ComplaintsSection.tsx
│   │   ├── DigestiveSection.tsx
│   │   ├── EnvironmentSection.tsx
│   │   ├── FamilyHistorySection.tsx
│   │   ├── FilteredSummaryView.tsx
│   │   ├── HeartSection.tsx
│   │   ├── HormoneSection.tsx
│   │   ├── InfectionsSection.tsx
│   │   ├── IntroSection.tsx
│   │   ├── KidneySection.tsx
│   │   ├── LifestyleSection.tsx
│   │   ├── LiverSection.tsx
│   │   ├── LungSection.tsx
│   │   ├── MedicalHistorySection.tsx
│   │   ├── MedicationsSection.tsx
│   │   ├── MensHealthSection.tsx
│   │   ├── MusculoskeletalSection.tsx
│   │   ├── NeurologySection.tsx
│   │   ├── PatientDataSection.tsx
│   │   ├── PreferencesSection.tsx
│   │   ├── PrintView.tsx
│   │   ├── SignatureSection.tsx
│   │   ├── SocialSection.tsx
│   │   ├── SurgeriesSection.tsx
│   │   ├── VaccinationsSection.tsx
│   │   └── WomenHealthSection.tsx
│   │
│   ├── admin/
│   │   ├── FAQManager.tsx
│   │   └── PracticeInfoManager.tsx
│   │
│   ├── home/
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   └── InfoSection.tsx
│   │
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── InfothekDropdown.tsx
│   │   └── Layout.tsx
│   │
│   ├── seo/
│   │   ├── SchemaOrg.tsx
│   │   └── SEOHead.tsx
│   │
│   ├── ui/                           # shadcn/ui Komponenten
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── tooltip.tsx
│   │   └── ... (weitere)
│   │
│   ├── CookieBanner.tsx
│   ├── LanguageSwitcher.tsx
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
│
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useAdminCheck.ts
│
├── integrations/supabase/
│   ├── client.ts                     # Auto-generiert
│   └── types.ts                      # Auto-generiert
│
├── lib/
│   ├── anamneseFormData.ts           # Sektionsdefinitionen + initialFormData
│   ├── datenschutzPdfExport.ts
│   ├── medicalOptions.ts             # Medizinische Auswahllisten
│   ├── pdfExport.ts
│   ├── pdfExportEnhanced.ts
│   ├── translations.ts              # UI-Übersetzungen
│   └── utils.ts                      # cn() Utility
│
├── pages/
│   ├── AdminDashboard.tsx
│   ├── AnamneseDemo.tsx
│   ├── Anamnesebogen.tsx             # Haupt-Formulaseite
│   ├── Auth.tsx
│   ├── Datenschutz.tsx
│   ├── Ernaehrung.tsx
│   ├── FAQ.tsx
│   ├── Frequenztherapie.tsx
│   ├── Gebueh.tsx
│   ├── Heilpraktiker.tsx
│   ├── Impressum.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   ├── PatientDashboard.tsx
│   └── PraxisInfo.tsx
│
├── App.tsx                           # Router + Provider-Setup
├── App.css                           # Legacy (nicht verwendet)
├── index.css                         # Design Tokens + Tailwind
├── main.tsx                          # Entry Point
└── vite-env.d.ts
```

---

## 18. Backend-Datenbank (Tabellen)

| Tabelle | Beschreibung |
|---|---|
| `profiles` | Benutzerprofile (user_id, Name, Geburtsdatum, etc.) |
| `anamnesis_submissions` | Eingereichte Anamnesebögen (form_data als JSON, Signatur, Status) |
| `faqs` | FAQ-Einträge (DE/EN, sortierbar, publishbar) |
| `practice_info` | Praxisinformationen (DE/EN, Icons, Slugs) |
| `user_roles` | Benutzerrollen (`admin` \| `patient`) |
| `verification_codes` | 2FA-Codes (Code, Ablauf, Typ) |

### 18.1 Rollen-System

```typescript
type app_role = "admin" | "patient";

// Prüfung via DB-Funktion
has_role(_role: app_role, _user_id: string) → boolean

// Frontend-Hook
const { isAdmin } = useAdminCheck();
```

---

*Stand: Februar 2026*
