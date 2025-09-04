import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, BookOpen, Eye, Calendar, User, Plus, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isVoted, setIsVoted] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStory();
      fetchChapters();
      if (user) {
        checkVoteStatus();
        checkReadingListStatus();
      }
    }
  }, [id, user]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey (
            username,
            display_name,
            avatar_url,
            verified
          ),
          story_genres (
            genres (
              name
            )
          ),
          story_tags (
            tag
          )
        `)
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setStory(data);
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', id)
        .eq('published', true)
        .order('chapter_number', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const { data } = await supabase
        .from('story_votes')
        .select('id')
        .eq('story_id', id)
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setIsVoted(!!data);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const checkReadingListStatus = async () => {
    try {
      const { data: readingLists } = await supabase
        .from('reading_list_stories')
        .select('id')
        .eq('story_id', id);
      
      setIsInReadingList((readingLists?.length || 0) > 0);
    } catch (error) {
      console.error('Error checking reading list status:', error);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      if (isVoted) {
        await supabase
          .from('story_votes')
          .delete()
          .eq('story_id', id)
          .eq('user_id', user.id);
        setIsVoted(false);
        toast.success('Vote removed');
      } else {
        await supabase
          .from('story_votes')
          .insert({ story_id: id, user_id: user.id });
        setIsVoted(true);
        toast.success('Voted!');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const addToReadingList = async () => {
    if (!user) {
      toast.error('Please sign in to add to reading list');
      return;
    }

    try {
      // Get or create default reading list
      let { data: readingList } = await supabase
        .from('reading_lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'My Reading List')
        .maybeSingle();

      if (!readingList) {
        const { data: newList } = await supabase
          .from('reading_lists')
          .insert({
            user_id: user.id,
            name: 'My Reading List',
            description: 'Stories I want to read'
          })
          .select('id')
          .single();
        readingList = newList;
      }

      await supabase
        .from('reading_list_stories')
        .insert({
          reading_list_id: readingList.id,
          story_id: id
        });

      setIsInReadingList(true);
      toast.success('Added to reading list');
    } catch (error) {
      console.error('Error adding to reading list:', error);
      toast.error('Failed to add to reading list');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse p-6">
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="h-6 bg-muted rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Story not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Story Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              {story.cover_url ? (
                <img 
                  src={story.cover_url} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              )}
            </div>

            <div className="mt-4 space-y-3">
              <Button 
                onClick={handleVote}
                variant={isVoted ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                <Heart className={`mr-2 h-4 w-4 ${isVoted ? 'fill-current' : ''}`} />
                {isVoted ? 'Voted' : 'Vote'} ({story.votes_count})
              </Button>

              <Button 
                onClick={addToReadingList}
                variant={isInReadingList ? "secondary" : "outline"}
                className="w-full"
                size="lg"
              >
                {isInReadingList ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    In Reading List
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to List
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Story Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {story.reads_count.toLocaleString()} reads
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {story.votes_count.toLocaleString()} votes
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {story.comments_count.toLocaleString()} comments
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(story.created_at).getFullYear()}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={story.profiles?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {story.profiles?.display_name}
                    </span>
                    {story.profiles?.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{story.profiles?.username}
                  </p>
                </div>
              </div>

              {/* Genres & Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {story.story_genres?.map((genre: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {genre.genres.name}
                  </Badge>
                ))}
                {story.story_tags?.map((tag: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    #{tag.tag}
                  </Badge>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={story.status === 'completed' ? 'default' : 'secondary'}>
                  {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {story.maturity_rating.charAt(0).toUpperCase() + story.maturity_rating.slice(1)}
                </Badge>
              </div>

              {/* Description */}
              {story.description && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {story.description}
                  </p>
                </div>
              )}
            </div>

            {/* Chapters */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Chapters ({chapters.length})
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <Card 
                    key={chapter.id} 
                    className="hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/read/${id}/${chapter.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            Chapter {chapter.chapter_number}: {chapter.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{chapter.word_count.toLocaleString()} words</span>
                            <span>{chapter.read_time} min read</span>
                            <span>
                              {new Date(chapter.published_at || chapter.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}