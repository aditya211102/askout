
-- Remove the overly permissive UPDATE policy since webhook uses service_role (bypasses RLS)
DROP POLICY IF EXISTS "Allow marking cards as paid" ON public.cards;
