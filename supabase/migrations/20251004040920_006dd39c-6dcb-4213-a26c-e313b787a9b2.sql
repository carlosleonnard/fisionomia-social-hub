-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.is_admin());

-- Update user_profiles RLS policies to allow admin access
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.user_profiles;
CREATE POLICY "Users can update their own profiles or admins can update any"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own profiles" ON public.user_profiles;
CREATE POLICY "Users can delete their own profiles or admins can delete any"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = user_id OR public.is_admin());

-- Insert admin role for contact@phenotypeindex.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'contact@phenotypeindex.com'
ON CONFLICT (user_id, role) DO NOTHING;