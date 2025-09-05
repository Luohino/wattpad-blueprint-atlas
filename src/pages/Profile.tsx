import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, User, Settings, UserPlus, UserMinus, Edit3 } from 'lucide-react';
import { Header } from '@/components/Header';
import { StoryCard } from '@/components/StoryCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [readingLists, setReadingLists] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = user && profile && user.id === profile.user_id;

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(profileData);

      // Fetch user's stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey (
            username,
            display_name,
            avatar_url
          ),
          story_genres (
            genres (name)
          )
        `)
        .eq('user_id', profileData.user_id)
        .eq('published', true)
        .order('created_at', { ascending: false });

      setStories(storiesData || []);

      // Fetch reading lists if it's the user's own profile
      if (user?.id === profileData.user_id) {
        const { data: listsData } = await supabase
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
          .eq('user_id', profileData.user_id)
          .order('created_at', { ascending: false });

        setReadingLists(listsData || []);
      }

      // Check if current user is following this profile
      if (user && user.id !== profileData.user_id) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', profileData.user_id)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.user_id);
        setIsFollowing(false);
        toast.success('Unfollowed user');
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.user_id
          });
        setIsFollowing(true);
        toast.success('Following user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse p-6">
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-6 bg-muted rounded mb-4 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Profile Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.display_name}
                </h1>
                {profile.verified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-2">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-foreground mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{profile.stories_count}</span>
                  <span className="text-muted-foreground">stories</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{profile.followers_count}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{profile.following_count}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isOwnProfile ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${profile.username}/edit`)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleFollow}
                  variant={isFollowing ? "secondary" : "default"}
                  size="sm"
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="reading-lists" disabled={!isOwnProfile}>
              Reading Lists
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {stories.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No stories published yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reading-lists" className="mt-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.reading_list_stories?.slice(0, 6).map((item: any) => (
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
                              {item.stories.reads_count} reads • {item.stories.votes_count} votes
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
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reading lists created yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Activity feed coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}