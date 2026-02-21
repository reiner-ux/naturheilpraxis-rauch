
CREATE TABLE public.practice_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key TEXT NOT NULL UNIQUE,
  label_de TEXT NOT NULL,
  label_en TEXT NOT NULL,
  price_text_de TEXT NOT NULL,
  price_text_en TEXT NOT NULL,
  note_de TEXT DEFAULT '',
  note_en TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.practice_pricing ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view published pricing" ON public.practice_pricing
  FOR SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "Admins can manage pricing" ON public.practice_pricing
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Seed default pricing
INSERT INTO public.practice_pricing (service_key, label_de, label_en, price_text_de, price_text_en, note_de, note_en, sort_order) VALUES
('haupttherapie', 'Haupttherapien / Analyseverfahren', 'Main Therapies / Analysis', '90–110 € pro Stunde', '90–110 € per hour', '', '', 1),
('vieva_check', 'Vieva Check', 'Vieva Check', '120 € pro Testung', '120 € per test', '', '', 2),
('omega3_test', 'Omega-3 Test', 'Omega-3 Test', '60 €', '60 €', '', '', 3),
('analyse_versand', 'Versand der Analysen', 'Shipping of Analyses', '15 € pro Analyse', '15 € per analysis', 'Wenn gewünscht', 'If requested', 4),
('befeldung_erstaufnahme', '150MHz Befeldung (Erstaufnahme)', '150MHz Field Therapy (Initial)', '90 € pro Stunde', '90 € per hour', 'Inkl. Anamnese und Befeldung', 'Incl. anamnesis and therapy', 5),
('befeldung_folge', '150MHz Befeldung (Folgetermine)', '150MHz Field Therapy (Follow-up)', '55 € pro Stunde', '55 € per hour', '', '', 6),
('ausfallentschaedigung', 'Ausfallentschädigung', 'Cancellation Fee', '80–110 € pro Stunde', '80–110 € per hour', 'Bei Absage < 48 Stunden', 'For cancellation < 48 hours', 7);
