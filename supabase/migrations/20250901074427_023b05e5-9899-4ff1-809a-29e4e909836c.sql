-- Create storage bucket for story covers and profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('story-covers', 'story-covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('chapter-images', 'chapter-images', true);

-- Create storage policies for story covers
CREATE POLICY "Story cover images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'story-covers');

CREATE POLICY "Users can upload story covers for their stories" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'story-covers' 
  AND EXISTS (
    SELECT 1 FROM public.stories 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their story covers" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'story-covers' 
  AND EXISTS (
    SELECT 1 FROM public.stories 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their story covers" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'story-covers' 
  AND EXISTS (
    SELECT 1 FROM public.stories 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

-- Create storage policies for profile pictures
CREATE POLICY "Profile pictures are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile picture" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile picture" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for chapter images
CREATE POLICY "Chapter images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chapter-images');

CREATE POLICY "Users can upload chapter images for their stories" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'chapter-images' 
  AND EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.stories s ON c.story_id = s.id
    WHERE c.id::text = (storage.foldername(name))[1] 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update chapter images for their stories" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'chapter-images' 
  AND EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.stories s ON c.story_id = s.id
    WHERE c.id::text = (storage.foldername(name))[1] 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete chapter images for their stories" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'chapter-images' 
  AND EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.stories s ON c.story_id = s.id
    WHERE c.id::text = (storage.foldername(name))[1] 
    AND s.user_id = auth.uid()
  )
);

-- Update stories table to include reads tracking
UPDATE stories SET reads_count = 0 WHERE reads_count IS NULL;

-- Create a function to update reads count when someone reads a story
CREATE OR REPLACE FUNCTION increment_reads_count(story_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.stories 
  SET reads_count = reads_count + 1 
  WHERE id = story_id_param;
END;
$$;

-- Create a function to get trending stories (based on recent votes and reads)
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