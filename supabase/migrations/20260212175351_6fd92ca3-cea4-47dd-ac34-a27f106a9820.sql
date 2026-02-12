
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT NOT NULL DEFAULT 'classic',
  question TEXT NOT NULL DEFAULT 'Will you be my Valentine?',
  yes_message TEXT NOT NULL DEFAULT 'You just made my day! 💕',
  no_button_trick TEXT NOT NULL DEFAULT 'runaway',
  stickers JSONB NOT NULL DEFAULT '[]'::jsonb,
  recipient_name TEXT,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public read access for paid cards (anyone with the link can view)
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view paid cards"
  ON public.cards FOR SELECT
  USING (paid = true);

CREATE POLICY "Anyone can insert cards"
  ON public.cards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Update cards to mark as paid"
  ON public.cards FOR UPDATE
  USING (true)
  WITH CHECK (true);
