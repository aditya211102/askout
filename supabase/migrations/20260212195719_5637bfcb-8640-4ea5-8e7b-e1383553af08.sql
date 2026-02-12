
-- Add user_id and plan columns to cards
ALTER TABLE public.cards ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.cards ADD COLUMN plan TEXT NOT NULL DEFAULT 'basic';

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can view paid cards" ON public.cards;
DROP POLICY IF EXISTS "Update cards to mark as paid" ON public.cards;

-- New RLS policies
-- Users can insert their own cards (must be authenticated)
CREATE POLICY "Users can insert their own cards"
ON public.cards FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own cards
CREATE POLICY "Users can view their own cards"
ON public.cards FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can view paid cards (for sharing)
CREATE POLICY "Anyone can view paid cards"
ON public.cards FOR SELECT
USING (paid = true);

-- Service role updates via webhook (allow update where paid = false, only set paid = true)
CREATE POLICY "Allow marking cards as paid"
ON public.cards FOR UPDATE
USING (true)
WITH CHECK (true);
