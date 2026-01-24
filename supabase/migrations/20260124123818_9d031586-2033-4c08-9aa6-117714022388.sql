-- RLS Policies für Admins auf faqs Tabelle
CREATE POLICY "Admins can insert faqs"
ON public.faqs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update faqs"
ON public.faqs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete faqs"
ON public.faqs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies für Admins auf practice_info Tabelle
CREATE POLICY "Admins can insert practice_info"
ON public.practice_info
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update practice_info"
ON public.practice_info
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete practice_info"
ON public.practice_info
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins sollten auch alle FAQs und Practice Infos sehen können (nicht nur published)
CREATE POLICY "Admins can view all faqs"
ON public.faqs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all practice_info"
ON public.practice_info
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));