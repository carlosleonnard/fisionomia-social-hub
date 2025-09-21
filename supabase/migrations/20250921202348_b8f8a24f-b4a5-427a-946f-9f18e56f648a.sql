-- Create storage bucket for phenotype reference images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('phenotype-references', 'phenotype-references', true);

-- Create table for phenotype reference images
CREATE TABLE public.phenotype_reference_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phenotype TEXT NOT NULL,
  subregion TEXT NOT NULL,
  region TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  image_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.phenotype_reference_images ENABLE ROW LEVEL SECURITY;

-- Create policies for phenotype reference images
CREATE POLICY "Anyone can view phenotype reference images" 
ON public.phenotype_reference_images 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can upload phenotype reference images" 
ON public.phenotype_reference_images 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own phenotype reference images" 
ON public.phenotype_reference_images 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own phenotype reference images" 
ON public.phenotype_reference_images 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Create storage policies for phenotype-references bucket
CREATE POLICY "Anyone can view phenotype reference images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'phenotype-references');

CREATE POLICY "Authenticated users can upload phenotype reference images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'phenotype-references' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own phenotype reference images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'phenotype-references' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own phenotype reference images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'phenotype-references' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_phenotype_reference_images_updated_at
BEFORE UPDATE ON public.phenotype_reference_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();