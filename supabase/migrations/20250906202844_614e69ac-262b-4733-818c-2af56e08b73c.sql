-- Fix search path security issues
CREATE OR REPLACE FUNCTION public.check_username_availability(username_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = username_input
  );
END;
$$;

-- Fix search path security issues  
CREATE OR REPLACE FUNCTION public.validate_username(username_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Username must be 3-30 characters, alphanumeric and underscores only, no spaces
  RETURN username_input ~ '^[a-zA-Z0-9_]{3,30}$';
END;
$$;