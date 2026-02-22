# Naturheilpraxis Peter Rauch – Complete Project Restore Point
**Date:** 2026-02-22
**Project:** Patient App & Practice Management System

## 1. Project Overview & Setup

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Database, Auth, Edge Functions)
- **Deployment:** Lovable Cloud / Vercel / Netlify (SPA compatible)

### Environment Variables (.env)
```bash
VITE_SUPABASE_URL="https://jmebqjadlpltnqawoipb.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[YOUR_PUBLIC_KEY]"
VITE_SUPABASE_PROJECT_ID="jmebqjadlpltnqawoipb"
```

### Installation
1. `npm install`
2. `npm run dev`

---

## 2. Database Schema (Supabase/PostgreSQL)

### Tables

#### `profiles`
Stores user profile information linked to `auth.users`.
```sql
create table public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  email text not null,
  first_name text,
  last_name text,
  date_of_birth date,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
```

#### `anamnesis_submissions`
Stores encrypted anamnesis form data.
```sql
create table public.anamnesis_submissions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  form_data jsonb not null,
  status text default 'draft', -- draft, submitted, verified, reviewed
  submitted_at timestamptz,
  signature_data jsonb, -- verification metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table anamnesis_submissions enable row level security;
```

#### `iaa_submissions`
Stores IAA (Trikombin) questionnaire data.
```sql
create table public.iaa_submissions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  form_data jsonb not null, -- { "1.1": 3, "1.2": 5 ... }
  status text default 'draft',
  submitted_at timestamptz,
  therapist_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table iaa_submissions enable row level security;
```

#### `verification_codes`
Stores 6-digit 2FA codes for email verification.
```sql
create table public.verification_codes (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  code text not null,
  type text not null, -- login, registration, anamnesis, password_reset
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);
```

#### `user_roles`
Manages admin access.
```sql
create table public.user_roles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role public.app_role not null, -- 'admin', 'patient'
  created_at timestamptz default now()
);
```

### Static Content Tables
- `faqs` (question_de, answer_de, ...)
- `practice_info` (title_de, content_de, ...)
- `practice_pricing` (service_key, price_text_de, ...)

---

## 3. Backend Logic (Edge Functions)

### `request-verification-code/index.ts`
Handles generation and sending of 2FA codes via Email Relay.

```typescript
// See supabase/functions/request-verification-code/index.ts for full content
// Key logic: 
// 1. Validates email & type
// 2. Rate limits requests
// 3. Generates 6-digit code
// 4. Stores in verification_codes table
// 5. Calls external PHP mail relay (via RELAY_SECRET)
```

### `verify-code/index.ts`
Verifies 2FA codes and handles login/registration/reset.

```typescript
// See supabase/functions/verify-code/index.ts for full content
// Key logic:
// 1. Validates code against DB
// 2. Checks expiration and usage
// 3. If registration: Confirms email & creates user
// 4. If login: Generates Magic Link token for session
// 5. If reset: Updates password
```

### `submit-anamnesis/index.ts`
Handles secure submission of medical history with 2FA signature.

```typescript
// See supabase/functions/submit-anamnesis/index.ts for full content
// Key logic:
// 1. "submit" action: Saves draft, generates code, sends code email
// 2. "confirm" action: Verifies code, marks submission as 'verified', 
//    adds digital signature metadata (§ 126a BGB), 
//    sends PDF confirmation to patient & practice
```

---

## 4. Frontend Application Structure

### Core Logic Libraries

#### `src/lib/anamneseFormData.ts`
Defines the data structure for the 25-section medical history form.
*Contains `initialFormData` object and `formSections` configuration.*

#### `src/lib/iaaQuestions.ts`
Contains the ~200 questions for the Trikombin analysis, categorized by organ systems.
*Exports `iaaCategories` array.*

#### `src/lib/pdfExportEnhanced.ts`
Generates the official PDF document from the form data using jsPDF.
*Handles layout, branding, and dynamic content rendering.*

### Key Pages

#### `src/pages/Erstanmeldung.tsx`
Orchestrates the onboarding process:
1. Phone appointment check (Gatekeeper)
2. Anamnesis Form link
3. Privacy Policy (GDPR) consent
4. Patient Information (Pricing/Terms) consent
5. IAA Questionnaire

#### `src/pages/Auth.tsx`
Handles Login, Registration, and Password Reset with 2FA integration.
*Uses `Tabs` for mode switching and `InputOTP` for code entry.*

#### `src/pages/Anamnesebogen.tsx`
The main medical history form.
*Features:*
- **Wizard Mode:** Step-by-step guidance
- **Accordion Mode:** Overview of all sections
- **Auto-save:** LocalStorage persistence
- **Validation:** Zod schemas
- **PDF Export:** Client-side generation

---

## 5. Deployment & Recovery

### Restore Instructions
1. **Database:** Run the SQL schema scripts in your Supabase SQL Editor.
2. **Edge Functions:** Deploy the functions using `supabase functions deploy`.
   - Set secrets: `supabase secrets set RELAY_SECRET=...`
3. **Frontend:**
   - Place files in their respective directories as listed in the project structure.
   - Ensure `.env` is configured with new Project ID.
   - Run `npm run build` to generate production assets.

### Critical Secrets
- `RELAY_SECRET`: Authentication token for the PHP mail relay on `rauch-heilpraktiker.de`.
- `SUPABASE_SERVICE_ROLE_KEY`: Required for Edge Functions admin operations.

---

*End of Restore Point Documentation*
