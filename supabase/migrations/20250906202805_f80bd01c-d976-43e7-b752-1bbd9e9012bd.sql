-- Add new fields to profiles table for enhanced profile editing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pronouns TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS background_url TEXT,
ADD COLUMN IF NOT EXISTS social_google TEXT,
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_twitter TEXT,
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS social_linkedin TEXT;

-- Add unique constraint on username to prevent duplicates
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_username UNIQUE (username);

-- Create function to check if username exists
CREATE OR REPLACE FUNCTION public.check_username_availability(username_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = username_input
  );
END;
$$;

-- Create function to validate username format
CREATE OR REPLACE FUNCTION public.validate_username(username_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Username must be 3-30 characters, alphanumeric and underscores only, no spaces
  RETURN username_input ~ '^[a-zA-Z0-9_]{3,30}$';
END;
$$;