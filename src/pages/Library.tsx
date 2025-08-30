import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StoryCard } from '@/components/StoryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Clock, List, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [votedStories, setVotedStories] = useState<any[]>([]);
  const [readingLists, setReadingLists] = useState<any[]>([]);
  const [readingProgress, setReadingProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLibraryData();
  }, [user, navigate]);

  const fetchLibraryData = async () => {
    if (!user) return;

    try {
      // Fetch voted stories
      const { data: votes } = await supabase
        .from('story_votes')
        .select(`
          stories (
            *,
            profiles!stories_user_id_fkey (
              username,
              display_name,
              avatar_url
            ),
            story_genres (
              genres (name)
            )
          )
        `)
        .eq('user_id', user.id);

      setVotedStories(votes?.map(vote => vote.stories) || []);

      // Fetch reading lists
      const { data: lists } = await supabase
        .from('reading_lists')
        .select(`
          *,
          reading_list_stories (
            stories (
              id,
              title,
              cover_url,
              reads_count,
              votes_count
            )
          )
        `)
        .eq('user_id', user.id);

      setReadingLists(lists || []);

      // Fetch reading progress
      const { data: progress } = await supabase
        .from('reading_progress')
        .select(`
          *,
          stories (
            *,
            profiles!stories_user_id_fkey (
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false });

      setReadingProgress(progress || []);
    } catch (error) {
      console.error('Error fetching library data:', error);
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse p-6">
          <div className="h-8 bg-muted rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
          <Button onClick={() => navigate('/discover')}>
            <Plus className="mr-2 h-4 w-4" />
            Find Stories
          </Button>
        </div>

        <Tabs defaultValue="continue" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="continue">Continue Reading</TabsTrigger>
            <TabsTrigger value="liked">Liked Stories</TabsTrigger>
            <TabsTrigger value="lists">Reading Lists</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="continue" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readingProgress.map((item) => (
                <div key={item.id} className="relative">
                  <StoryCard story={item.stories} />
                  <div className="mt-2 text-sm text-muted-foreground">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Chapter {item.chapter_number || 1}
                  </div>
                </div>
              ))}
              {readingProgress.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No stories in progress</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votedStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {votedStories.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No liked stories yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lists" className="mt-6">
            <div className="grid gap-6">
              {readingLists.map((list) => (
                <Card key={list.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{list.name}</span>
                      <Badge variant="outline">
                        {list.reading_list_stories?.length || 0} stories
                      </Badge>
                    </CardTitle>
                    {list.description && (
                      <p className="text-sm text-muted-foreground">{list.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {list.reading_list_stories?.slice(0, 4).map((item: any) => (
                        <div key={item.stories.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 cursor-pointer">
                          <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center flex-shrink-0">
                            {item.stories.cover_url ? (
                              <img 
                                src={item.stories.cover_url} 
                                alt={item.stories.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.stories.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {item.stories.reads_count} reads
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {readingLists.length === 0 && (
                <div className="text-center py-12">
                  <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reading lists created yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readingProgress.map((item) => (
                <div key={item.id} className="relative">
                  <StoryCard story={item.stories} />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Last read: {new Date(item.last_read_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {readingProgress.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reading history</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}