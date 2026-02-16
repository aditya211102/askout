
-- Add new columns to cards table for multi-product support
ALTER TABLE public.cards 
ADD COLUMN product_type text NOT NULL DEFAULT 'askout',
ADD COLUMN bouquet_data jsonb DEFAULT NULL,
ADD COLUMN voice_note_url text DEFAULT NULL,
ADD COLUMN voice_duration integer DEFAULT NULL,
ADD COLUMN voice_background_image text DEFAULT NULL;

-- Create storage bucket for voice notes
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-notes', 'voice-notes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-backgrounds', 'voice-backgrounds', true);

-- Storage policies for voice-notes
CREATE POLICY "Anyone can view voice notes" ON storage.objects FOR SELECT USING (bucket_id = 'voice-notes');
CREATE POLICY "Authenticated users can upload voice notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'voice-notes' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own voice notes" ON storage.objects FOR DELETE USING (bucket_id = 'voice-notes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for voice-backgrounds
CREATE POLICY "Anyone can view voice backgrounds" ON storage.objects FOR SELECT USING (bucket_id = 'voice-backgrounds');
CREATE POLICY "Authenticated users can upload voice backgrounds" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'voice-backgrounds' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own voice backgrounds" ON storage.objects FOR DELETE USING (bucket_id = 'voice-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);
