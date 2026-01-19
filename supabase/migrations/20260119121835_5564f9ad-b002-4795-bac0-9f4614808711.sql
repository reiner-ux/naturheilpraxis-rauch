-- Fix the permissive RLS policy for verification_codes
-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Service can insert verification codes" ON public.verification_codes;

-- Verification codes should only be inserted via edge function with service role
-- No direct client insert allowed - the edge function will use service role key