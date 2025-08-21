-- Add region column to complete_profiles and keep it in sync with general_phenotype_primary
ALTER TABLE public.complete_profiles
ADD COLUMN IF NOT EXISTS region text;

-- Function to compute region from general_phenotype_primary
CREATE OR REPLACE FUNCTION public.compute_region_from_general(primary_text text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  IF primary_text IS NULL OR btrim(primary_text) = '' THEN
    RETURN NULL;
  END IF;

  -- Normalize to lowercase for comparisons
  IF lower(primary_text) LIKE '%africa%' THEN
    RETURN 'Africa';
  ELSIF lower(primary_text) LIKE '%americas%' OR lower(primary_text) LIKE '%america%' THEN
    RETURN 'Americas';
  ELSIF lower(primary_text) LIKE '%asia%' THEN
    RETURN 'Asia';
  ELSIF lower(primary_text) LIKE '%australia%' OR lower(primary_text) LIKE '%melanesia%' OR lower(primary_text) LIKE '%polynesia%' THEN
    RETURN 'Oceania';
  ELSIF lower(primary_text) LIKE '%levant%' OR lower(primary_text) LIKE '%anatolia%' OR lower(primary_text) LIKE '%arabian peninsula%' OR lower(primary_text) LIKE '%persian plateau%' THEN
    RETURN 'Middle East';
  ELSE
    RETURN NULL; -- Not matched to specified regions
  END IF;
END;
$$;

-- Trigger function to set region automatically
CREATE OR REPLACE FUNCTION public.set_region_from_general()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.region := public.compute_region_from_general(NEW.general_phenotype_primary);
  RETURN NEW;
END;
$$;

-- Create trigger on insert/update of general_phenotype_primary
DROP TRIGGER IF EXISTS trg_set_region_from_general ON public.complete_profiles;
CREATE TRIGGER trg_set_region_from_general
BEFORE INSERT OR UPDATE OF general_phenotype_primary ON public.complete_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_region_from_general();

-- Backfill existing data
UPDATE public.complete_profiles
SET region = public.compute_region_from_general(general_phenotype_primary)
WHERE region IS NULL OR btrim(region) = '';

-- Helpful index for filtering by region
CREATE INDEX IF NOT EXISTS idx_complete_profiles_region ON public.complete_profiles (region);
