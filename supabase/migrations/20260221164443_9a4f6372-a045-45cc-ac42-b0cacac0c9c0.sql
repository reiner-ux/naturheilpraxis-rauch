
CREATE TABLE public.iaa_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  therapist_data JSONB DEFAULT '{}'::jsonb,
  appointment_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.iaa_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own IAA" ON public.iaa_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own IAA" ON public.iaa_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own IAA" ON public.iaa_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all IAA" ON public.iaa_submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
