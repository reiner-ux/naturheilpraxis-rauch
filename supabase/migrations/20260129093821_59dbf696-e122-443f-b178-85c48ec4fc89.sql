-- Delete test users from auth.users via admin function
-- Note: This uses a DO block to delete multiple users
DO $$
DECLARE
  user_ids UUID[] := ARRAY[
    'fa2ddc1e-1b31-45d4-ac7e-3bdf1f17b9a4'::uuid,
    'ab715e10-fb0f-4780-b1f8-a48afe5daea0'::uuid,
    'ecb0a7cb-3744-4e48-843f-47e6e0159510'::uuid,
    '870492e0-f9b6-4ee3-aba2-abd7b5cbe4af'::uuid,
    '474a3622-b496-4313-a75f-11cce775435e'::uuid,
    'ef619bd5-e4d7-4628-8a7b-c475849f2718'::uuid,
    '7abc7137-9aed-4a2b-8463-dadf1b3d6a63'::uuid
  ];
  uid UUID;
BEGIN
  FOREACH uid IN ARRAY user_ids
  LOOP
    DELETE FROM auth.users WHERE id = uid;
  END LOOP;
END $$;