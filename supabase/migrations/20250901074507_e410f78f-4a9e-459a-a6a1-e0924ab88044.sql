-- Fix function search path issues for security
CREATE OR REPLACE FUNCTION increment_reads_count(story_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.stories 
  SET reads_count = reads_count + 1 
  WHERE id = story_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION get_trending_stories()
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  cover_url TEXT,
  user_id UUID,
  votes_count INTEGER,
  reads_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  trending_score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.title,
    s.description,
    s.cover_url,
    s.user_id,
    s.votes_count,
    s.reads_count,
    s.comments_count,
    s.created_at,
    -- Calculate trending score based on recent activity
    (s.votes_count * 2 + s.reads_count * 0.1 + s.comments_count * 3) * 
    (CASE 
      WHEN s.created_at > now() - interval '7 days' THEN 2
      WHEN s.created_at > now() - interval '30 days' THEN 1.5
      ELSE 1
    END) as trending_score
  FROM public.stories s
  WHERE s.published = true
  ORDER BY trending_score DESC;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  );
  RETURN NEW;
END;
$function$;