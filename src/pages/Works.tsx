import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StoryCard } from '@/components/StoryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit3, Eye, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Works() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [publishedStories, setPublishedStories] = useState<any[]>([]);
  const [draftStories, setDraftStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchWorks();
  }, [user, navigate]);

  const fetchWorks = async () => {
    if (!user) return;

    try {
      // Fetch all user stories
      const { data: stories } = await supabase
        .from('stories')
        .select(`
          *,
          story_genres (
            genres (name)
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      const published = stories?.filter(story => story.published) || [];
      const drafts = stories?.filter(story => !story.published) || [];
      
      setPublishedStories(published);
      setDraftStories(drafts);
    } catch (error) {
      console.error('Error fetching works:', error);
      toast.error('Failed to load your works');
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (storyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ published: !currentStatus })
        .eq('id', storyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success(currentStatus ? 'Story unpublished' : 'Story published');
      fetchWorks();
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error('Failed to update story');
    }
  };

  const deleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Story deleted');
      fetchWorks();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
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
          <h1 className="text-3xl font-bold text-foreground">My Works</h1>
          <Button onClick={() => navigate('/write')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Story
          </Button>
        </div>

        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="published">
              Published ({publishedStories.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({draftStories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="mt-6">
            <div className="grid gap-6">
              {publishedStories.map((story) => (
                <Card key={story.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-4">{story.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{story.reads_count} reads</span>
                          <span>{story.votes_count} votes</span>
                          <span>{story.comments_count} comments</span>
                          <Badge variant={story.status === 'completed' ? 'default' : 'secondary'}>
                            {story.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/write?story=${story.id}`)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishStatus(story.id, true)}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStory(story.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(story.updated_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {publishedStories.length === 0 && (
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No published stories yet</p>
                  <Button className="mt-4" onClick={() => navigate('/write')}>
                    Write Your First Story
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <div className="grid gap-6">
              {draftStories.map((story) => (
                <Card key={story.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-4">{story.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">Draft</Badge>
                          <span>{story.chapters_count || 0} chapters</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/write?story=${story.id}`)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishStatus(story.id, false)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStory(story.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {draftStories.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No drafts saved</p>
                  <Button className="mt-4" onClick={() => navigate('/write')}>
                    Start Writing
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}