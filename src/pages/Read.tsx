import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Settings, Moon, Sun, Home } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface Chapter {
  id: string;
  title: string;
  content: string;
  chapter_number: number;
  word_count: number;
  read_time: number;
  published_at: string;
  story_id: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  user_id: string;
  votes_count: number;
  reads_count: number;
  comments_count: number;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  } | null;
  story_genres: {
    genres: {
      name: string;
    };
  }[];
}

export default function Read() {
  const { storyId, chapterNumber } = useParams<{ storyId: string; chapterNumber: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    if (storyId && chapterNumber) {
      fetchData();
    }
  }, [storyId, chapterNumber]);

  useEffect(() => {
    if (user && storyId && chapter) {
      updateReadingProgress();
    }
  }, [user, storyId, chapter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch story details
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          ),
          story_genres (
            genres (
              name
            )
          )
        `)
        .eq('id', storyId)
        .single();

      if (storyError) throw storyError;

      // Fetch all chapters for navigation
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .eq('published', true)
        .order('chapter_number');

      if (chaptersError) throw chaptersError;

      // Find current chapter
      const currentChapter = chaptersData.find(ch => ch.chapter_number === parseInt(chapterNumber!));

      if (!currentChapter) {
        toast({
          title: "Chapter not found",
          description: "This chapter doesn't exist or isn't published yet.",
          variant: "destructive"
        });
        navigate(`/story/${storyId}`);
        return;
      }

      setStory(storyData as unknown as Story);
      setChapter(currentChapter);
      setAllChapters(chaptersData);

      // Increment read count
      await supabase.rpc('increment_reads_count', { story_id_param: storyId });

      // Check if user has voted
      if (user) {
        const { data: voteData } = await supabase
          .from('story_votes')
          .select('id')
          .eq('story_id', storyId)
          .eq('user_id', user.id)
          .single();

        setIsVoted(!!voteData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load chapter.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReadingProgress = async () => {
    if (!user || !storyId || !chapter) return;

    try {
      const { error } = await supabase
        .from('reading_progress')
        .upsert({
          user_id: user.id,
          story_id: storyId,
          chapter_id: chapter.id,
          chapter_number: chapter.chapter_number,
          last_read_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating reading progress:', error);
    }
  };

  const handleVote = async () => {
    if (!user || !story) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote on stories.",
      });
      return;
    }

    try {
      if (isVoted) {
        await supabase
          .from('story_votes')
          .delete()
          .eq('story_id', story.id)
          .eq('user_id', user.id);

        setIsVoted(false);
        toast({ title: "Vote removed" });
      } else {
        await supabase
          .from('story_votes')
          .insert({
            story_id: story.id,
            user_id: user.id
          });

        setIsVoted(true);
        toast({ title: "Voted successfully!" });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!chapter || !allChapters.length) return;

    const currentIndex = allChapters.findIndex(ch => ch.chapter_number === chapter.chapter_number);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < allChapters.length) {
      const newChapter = allChapters[newIndex];
      navigate(`/read/${storyId}/${newChapter.chapter_number}`);
    }
  };

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;
    setReadProgress(Math.min(progress, 100));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading chapter...</div>
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentChapterIndex = allChapters.findIndex(ch => ch.chapter_number === chapter.chapter_number);
  const hasPrevious = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < allChapters.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress value={readProgress} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/story/${storyId}`)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-sm">{story.title}</h1>
              <p className="text-xs text-muted-foreground">Chapter {chapter.chapter_number}: {chapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {story.cover_url && (
              <img 
                src={story.cover_url} 
                alt={story.title}
                className="w-12 h-16 object-cover rounded"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{chapter.title}</h1>
              <p className="text-muted-foreground">
                Chapter {chapter.chapter_number} • {chapter.word_count} words • {chapter.read_time} min read
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{story.profiles?.display_name || 'Unknown Author'}</Badge>
                {story.story_genres.map((genre, index) => (
                  <Badge key={index} variant="secondary">
                    {genre.genres.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleVote}>
              <Heart className={`h-4 w-4 mr-2 ${isVoted ? 'fill-current text-red-500' : ''}`} />
              {story.votes_count} Votes
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {story.comments_count} Comments
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {story.reads_count} Reads
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Chapter Content */}
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
            >
              {chapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t">
          <Button
            variant="outline"
            onClick={() => navigateChapter('prev')}
            disabled={!hasPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Chapter
          </Button>

          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>

          <Button
            variant="outline"
            onClick={() => navigateChapter('next')}
            disabled={!hasNext}
          >
            Next Chapter
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}