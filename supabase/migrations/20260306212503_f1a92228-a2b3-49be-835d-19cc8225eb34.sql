
-- Create storage bucket for anamnesis PDFs (used by resend function)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('anamnesis-pdfs', 'anamnesis-pdfs', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- RLS: Only service role can access (edge functions use service role key)
CREATE POLICY "Service role access only" ON storage.objects
FOR ALL USING (bucket_id = 'anamnesis-pdfs' AND auth.role() = 'service_role');
