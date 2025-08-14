-- Create storage buckets for user profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-profiles', 'user-profiles', true);

-- Create RLS policies for user profile images
CREATE POLICY "Anyone can view user profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-profiles');

-- Users can upload their own profile images
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own profile images
CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own profile images
CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);