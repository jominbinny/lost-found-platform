-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for item images
CREATE POLICY "Anyone can view item images" ON storage.objects
FOR SELECT USING (bucket_id = 'item-images');

CREATE POLICY "Anyone can upload item images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Users can update their own item images" ON storage.objects
FOR UPDATE USING (bucket_id = 'item-images');

CREATE POLICY "Users can delete their own item images" ON storage.objects
FOR DELETE USING (bucket_id = 'item-images');
