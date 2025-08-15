-- Create or update table for complete profile data with voting information
CREATE TABLE IF NOT EXISTS public.complete_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Basic information
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  gender TEXT NOT NULL,
  category TEXT NOT NULL,
  height NUMERIC NOT NULL,
  ancestry TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  
  -- Images
  front_image_url TEXT NOT NULL,
  profile_image_url TEXT,
  
  -- General Phenotype (from form)
  general_phenotype_primary TEXT,
  general_phenotype_secondary TEXT,
  general_phenotype_tertiary TEXT,
  
  -- Specific Phenotype (from form)  
  specific_phenotype_primary TEXT,
  specific_phenotype_secondary TEXT,
  specific_phenotype_tertiary TEXT,
  
  -- Physical Characteristics (from form)
  hair_color TEXT,
  hair_texture TEXT,
  eye_color TEXT,
  skin_tone TEXT,
  nasal_breadth TEXT,
  facial_breadth TEXT,
  body_type TEXT,
  jaw_type TEXT,
  head_breadth TEXT,
  face_shape TEXT,
  
  -- Additional metadata
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complete_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for complete_profiles
CREATE POLICY "Anyone can view complete profiles" 
ON public.complete_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own complete profiles" 
ON public.complete_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own complete profiles" 
ON public.complete_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own complete profiles" 
ON public.complete_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_complete_profiles_updated_at
BEFORE UPDATE ON public.complete_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique index to ensure one complete profile per user profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_complete_profiles_profile_id 
ON public.complete_profiles(profile_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_complete_profiles_user_id 
ON public.complete_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_complete_profiles_category 
ON public.complete_profiles(category);