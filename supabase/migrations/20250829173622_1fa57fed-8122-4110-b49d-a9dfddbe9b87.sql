-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  stories_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stories table
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  status TEXT CHECK (status IN ('ongoing', 'completed', 'on-hold')) DEFAULT 'ongoing',
  maturity_rating TEXT CHECK (maturity_rating IN ('everyone', 'teen', 'mature')) DEFAULT 'everyone',
  language TEXT DEFAULT 'en',
  reads_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  chapters_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create genres table
CREATE TABLE public.genres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create story_genres junction table
CREATE TABLE public.story_genres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  UNIQUE(story_id, genre_id)
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  word_count INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, chapter_number)
);

-- Create story_tags table
CREATE TABLE public.story_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Create follows table
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create story_votes table  
CREATE TABLE public.story_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading_lists table
CREATE TABLE public.reading_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading_list_stories junction table
CREATE TABLE public.reading_list_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_list_id UUID NOT NULL REFERENCES public.reading_lists(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reading_list_id, story_id)
);

-- Create reading_progress table
CREATE TABLE public.reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_number INTEGER DEFAULT 0,
  scroll_position INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_chapter', 'new_follower', 'story_vote', 'comment', 'mention')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default genres
INSERT INTO public.genres (name, description) VALUES 
('Romance', 'Love stories and romantic relationships'),
('Fantasy', 'Magical and supernatural elements'),
('Young Adult', 'Stories targeting young adult readers'),
('Mystery', 'Suspense and mystery plots'),
('Science Fiction', 'Futuristic and sci-fi themes'),
('Thriller', 'High tension and suspenseful stories'),
('Horror', 'Scary and frightening content'),
('Adventure', 'Action-packed adventures'),
('Drama', 'Emotional and dramatic stories'),
('Comedy', 'Humorous and funny content'),
('Historical Fiction', 'Stories set in the past'),
('Contemporary', 'Modern day settings and themes');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_list_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for stories
CREATE POLICY "Published stories are viewable by everyone" ON public.stories FOR SELECT USING (published = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their own stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stories" ON public.stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for genres
CREATE POLICY "Genres are viewable by everyone" ON public.genres FOR SELECT USING (true);

-- RLS Policies for story_genres
CREATE POLICY "Story genres are viewable by everyone" ON public.story_genres FOR SELECT USING (true);
CREATE POLICY "Users can manage their story genres" ON public.story_genres FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stories WHERE id = story_id AND user_id = auth.uid())
);

-- RLS Policies for chapters
CREATE POLICY "Published chapters are viewable by everyone" ON public.chapters 
FOR SELECT USING (
  published = true OR 
  EXISTS (SELECT 1 FROM public.stories WHERE id = story_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage their story chapters" ON public.chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stories WHERE id = story_id AND user_id = auth.uid())
);

-- RLS Policies for story_tags
CREATE POLICY "Story tags are viewable by everyone" ON public.story_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage their story tags" ON public.story_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stories WHERE id = story_id AND user_id = auth.uid())
);

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow/unfollow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for story_votes
CREATE POLICY "Story votes are viewable by everyone" ON public.story_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on stories" ON public.story_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their votes" ON public.story_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reading_lists
CREATE POLICY "Public reading lists are viewable by everyone" ON public.reading_lists FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage their own reading lists" ON public.reading_lists FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reading_list_stories
CREATE POLICY "Reading list stories are viewable by list owners or if public" ON public.reading_list_stories FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = reading_list_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage their reading list stories" ON public.reading_list_stories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = reading_list_id AND user_id = auth.uid())
);

-- RLS Policies for reading_progress
CREATE POLICY "Users can view their own reading progress" ON public.reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own reading progress" ON public.reading_progress FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update story stats
CREATE OR REPLACE FUNCTION public.update_story_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'story_votes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.stories SET votes_count = votes_count + 1 WHERE id = NEW.story_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.stories SET votes_count = votes_count - 1 WHERE id = OLD.story_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.stories SET comments_count = comments_count + 1 WHERE id = NEW.story_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.stories SET comments_count = comments_count - 1 WHERE id = OLD.story_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers to update story stats
CREATE TRIGGER update_story_votes_count
  AFTER INSERT OR DELETE ON public.story_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_story_stats();

CREATE TRIGGER update_story_comments_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_story_stats();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = followers_count - 1 WHERE user_id = OLD.following_id;
    UPDATE public.profiles SET following_count = following_count - 1 WHERE user_id = OLD.follower_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update follow counts
CREATE TRIGGER update_follow_counts
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reading_lists_updated_at BEFORE UPDATE ON public.reading_lists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();