# Restore Part 2: Database Schema & RLS Policies

## Enums
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');
CREATE TYPE public.language_code AS ENUM ('de', 'en');
```

## Tables

### profiles
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  email text NOT NULL,
  first_name text,
  last_name text,
  date_of_birth date,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### anamnesis_submissions
```sql
CREATE TABLE public.anamnesis_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  form_data jsonb NOT NULL,
  status text DEFAULT 'draft',
  submitted_at timestamptz DEFAULT now(),
  signature_data text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE anamnesis_submissions ENABLE ROW LEVEL SECURITY;
```

### iaa_submissions
```sql
CREATE TABLE public.iaa_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  form_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft',
  submitted_at timestamptz DEFAULT now(),
  therapist_data jsonb,
  updated_at timestamptz DEFAULT now(),
  appointment_number integer DEFAULT 1
);
ALTER TABLE iaa_submissions ENABLE ROW LEVEL SECURITY;
```

### verification_codes
```sql
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  code text NOT NULL,
  type text DEFAULT 'login',
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### user_roles
```sql
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  role public.app_role DEFAULT 'patient',
  created_at timestamptz DEFAULT now()
);
```

### faqs
```sql
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_de text NOT NULL,
  question_en text NOT NULL,
  answer_de text NOT NULL,
  answer_en text NOT NULL,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### practice_info
```sql
CREATE TABLE public.practice_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  title_de text NOT NULL,
  title_en text NOT NULL,
  content_de text NOT NULL,
  content_en text NOT NULL,
  icon text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### practice_pricing
```sql
CREATE TABLE public.practice_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key text NOT NULL,
  label_de text NOT NULL,
  label_en text NOT NULL,
  price_text_de text NOT NULL,
  price_text_en text NOT NULL,
  note_de text,
  note_en text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Database Function
```sql
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;
```

## RLS Policies (Key Examples)
```sql
-- profiles: Users can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- anamnesis_submissions: Users can CRUD own submissions
CREATE POLICY "Users can view own submissions" ON anamnesis_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON anamnesis_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON anamnesis_submissions FOR UPDATE USING (auth.uid() = user_id);

-- faqs/practice_info/practice_pricing: Public read, admin write
CREATE POLICY "Public can read published FAQs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage FAQs" ON faqs FOR ALL USING (public.has_role('admin', auth.uid()));
```
