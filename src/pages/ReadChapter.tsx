import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen, Eye } from 'lucide-react';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ReadChapter() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (storyId && chapterId) {
      fetchData();
      trackView();
    }
  }, [storyId, chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch story details
      const { data: storyData } = await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('id', storyId)
        .single();

      setStory(storyData);

      // Fetch current chapter
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .eq('published', true)
        .single();

      setChapter(chapterData);

      // Fetch all chapters for navigation
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('id, title, chapter_number')
        .eq('story_id', storyId)
        .eq('published', true)
        .order('chapter_number', { ascending: true });

      setChapters(chaptersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    // Increment story reads count
    await supabase.rpc('increment_reads_count', { 
      story_id_param: storyId 
    });

    // Update reading progress if user is logged in
    if (user) {
      await supabase
        .from('reading_progress')
        .upsert({
          user_id: user.id,
          story_id: storyId,
          chapter_id: chapterId,
          chapter_number: chapter?.chapter_number || 0,
          scroll_position: 0,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,story_id'
        });
    }
  };

  const getCurrentChapterIndex = () => {
    return chapters.findIndex(c => c.id === chapterId);
  };

  const navigateToChapter = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentChapterIndex();
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < chapters.length) {
      const targetChapter = chapters[targetIndex];
      navigate(`/read/${storyId}/${targetChapter.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse p-6 max-w-4xl mx-auto">
          <div className="h-6 bg-muted rounded mb-4 w-1/2"></div>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!chapter || !story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Chapter not found</p>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentChapterIndex();
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Reading Progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/story/${storyId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Story
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Chapter {chapter.chapter_number} of {chapters.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{story.reads_count.toLocaleString()} reads</span>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {chapter.title}
          </h1>
          <p className="text-muted-foreground">
            By {story.profiles?.display_name} • {chapter.word_count.toLocaleString()} words • {chapter.read_time} min read
          </p>
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            className="whitespace-pre-wrap text-foreground leading-relaxed"
            style={{ 
              lineHeight: '1.8',
              fontSize: '1.1rem'
            }}
          >
            {chapter.content}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigateToChapter('prev')}
            disabled={!hasPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {hasPrevious && `Chapter ${chapters[currentIndex - 1]?.chapter_number}`}
            {!hasPrevious && 'First Chapter'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Chapter {chapter.chapter_number} of {chapters.length}
            </p>
            <h3 className="font-medium text-foreground">{story.title}</h3>
          </div>

          <Button 
            variant="outline" 
            onClick={() => navigateToChapter('next')}
            disabled={!hasNext}
            className="flex items-center gap-2"
          >
            {hasNext && `Chapter ${chapters[currentIndex + 1]?.chapter_number}`}
            {!hasNext && 'Last Chapter'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Story Info */}
        <div className="mt-8 p-6 bg-card border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground mb-1">{story.title}</h4>
              <p className="text-sm text-muted-foreground">
                {story.votes_count.toLocaleString()} votes • {story.reads_count.toLocaleString()} reads
              </p>
            </div>
            <Button onClick={() => navigate(`/story/${storyId}`)}>
              View Story Details
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}