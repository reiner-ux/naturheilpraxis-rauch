-- Remove foreign key constraint on verification_codes.user_id so temp users can use it
ALTER TABLE public.verification_codes DROP CONSTRAINT IF EXISTS verification_codes_user_id_fkey;