-- Allow admins to view all anamnesis submissions for ICD-10 generation
CREATE POLICY "Admins can view all anamnesis submissions"
ON public.anamnesis_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));