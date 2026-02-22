# Restore Part 5: Styling & Design System

## src/index.css (Complete)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

@layer base {
  :root {
    --background: 40 30% 97%;
    --foreground: 150 20% 15%;
    --card: 40 25% 95%;
    --card-foreground: 150 20% 15%;
    --popover: 40 30% 97%;
    --popover-foreground: 150 20% 15%;
    --primary: 145 25% 36%;
    --primary-foreground: 40 30% 97%;
    --secondary: 35 35% 85%;
    --secondary-foreground: 150 20% 20%;
    --muted: 145 15% 90%;
    --muted-foreground: 150 10% 45%;
    --accent: 18 45% 55%;
    --accent-foreground: 40 30% 97%;
    --destructive: 0 65% 50%;
    --destructive-foreground: 40 30% 97%;
    --border: 145 15% 85%;
    --input: 145 15% 88%;
    --ring: 145 25% 36%;
    --radius: 0.75rem;

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

    --gradient-hero: linear-gradient(135deg, hsl(145 25% 36% / 0.9), hsl(145 30% 28% / 0.95));
    --gradient-card: linear-gradient(180deg, hsl(40 30% 97%), hsl(40 25% 94%));
    --gradient-accent: linear-gradient(135deg, hsl(18 45% 55%), hsl(18 50% 45%));

    --shadow-soft: 0 4px 20px -4px hsl(145 20% 30% / 0.1);
    --shadow-card: 0 8px 30px -8px hsl(145 20% 30% / 0.12);
    --shadow-elevated: 0 20px 50px -15px hsl(145 20% 20% / 0.2);

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
  * { @apply border-border; }
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
  .hero-gradient { background: var(--gradient-hero); }
  .card-gradient { background: var(--gradient-card); }
  .accent-gradient { background: var(--gradient-accent); }
  .shadow-soft { box-shadow: var(--shadow-soft); }
  .shadow-card { box-shadow: var(--shadow-card); }
  .shadow-elevated { box-shadow: var(--shadow-elevated); }
  .text-balance { text-wrap: balance; }
}

@layer utilities {
  .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
  .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
}

@media print {
  body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  header, footer, nav, .no-print, button, .print-hide { display: none !important; }
  .print-view { display: block !important; position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; font-size: 12pt; line-height: 1.4; }
  .print-section { page-break-inside: avoid; break-inside: avoid; }
  .print-view * { background: transparent !important; box-shadow: none !important; }
  .print-view h1, .print-view h2, .print-view h3 { color: black !important; }
  .print-view input, .print-view textarea, .print-view select { border: 1px solid #ccc !important; background: white !important; }
  .print-view input[type="checkbox"] { appearance: auto !important; -webkit-appearance: checkbox !important; }
  @page { margin: 1.5cm; size: A4; }
  .print-view .bg-gray-100 { background: #f3f4f6 !important; }
}
```

## tailwind.config.ts (Complete)
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
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
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        sage: {
          50: "hsl(var(--sage-50))", 100: "hsl(var(--sage-100))", 200: "hsl(var(--sage-200))",
          300: "hsl(var(--sage-300))", 400: "hsl(var(--sage-400))", 500: "hsl(var(--sage-500))",
          600: "hsl(var(--sage-600))", 700: "hsl(var(--sage-700))",
        },
        sand: { 50: "hsl(var(--sand-50))", 100: "hsl(var(--sand-100))", 200: "hsl(var(--sand-200))", 300: "hsl(var(--sand-300))" },
        terracotta: { DEFAULT: "hsl(var(--terracotta))", light: "hsl(var(--terracotta-light))" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))", foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))", "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))", "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))", ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
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

## Design Philosophy
- **Fonts:** Playfair Display (headings), Source Sans 3 (body)
- **Primary:** Sage green (#4a7c59 / HSL 145 25% 36%)
- **Secondary:** Warm sand tones
- **Accent:** Terracotta
- **Approach:** Natural, organic, calming – fitting for a naturopathic practice
