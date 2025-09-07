-- Fix security warning: Set search_path for existing functions
CREATE OR REPLACE FUNCTION public.check_username_availability(username_input text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $$  
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = username_input
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_username(username_input text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $$
BEGIN
  -- Username must be 3-30 characters, alphanumeric and underscores only, no spaces
  RETURN username_input ~ '^[a-zA-Z0-9_]{3,30}$';
END;
$$;