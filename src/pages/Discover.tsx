import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, TrendingUp, Star, Clock, Eye } from 'lucide-react';
import { Header } from '@/components/Header';
import { StoryCard } from '@/components/StoryCard';
import { supabase } from '@/integrations/supabase/client';

export default function Discover() {
  const [stories, setStories] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchGenres();
    fetchStories();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [selectedGenre, sortBy]);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchStories = async () => {
    setLoading(true);
    try {
      let query = supabase
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
              id,
              name
            )
          ),
          story_tags (
            tag
          )
        `)
        .eq('published', true);

      // Apply genre filter
      if (selectedGenre !== 'all') {
        const { data: storyIds } = await supabase
          .from('story_genres')
          .select('story_id')
          .eq('genre_id', selectedGenre);
        
        const ids = storyIds?.map(item => item.story_id) || [];
        if (ids.length > 0) {
          query = query.in('id', ids);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('votes_count', { ascending: false });
          break;
        case 'trending':
          query = query.order('reads_count', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'updated':
          query = query.order('updated_at', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story => 
    searchQuery === '' || 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.profiles?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'popular':
        return <Star className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'newest':
        return <Clock className="h-4 w-4" />;
      case 'updated':
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Discover Stories</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filters:</span>
              </div>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Voted</SelectItem>
                  <SelectItem value="trending">Most Read</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="updated">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(selectedGenre !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedGenre !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {genres.find(g => g.id === selectedGenre)?.name}
                    <button
                      onClick={() => setSelectedGenre('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <Tabs value={sortBy} onValueChange={setSortBy} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="popular" className="gap-2">
              <Star className="h-4 w-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="newest" className="gap-2">
              <Clock className="h-4 w-4" />
              New
            </TabsTrigger>
            <TabsTrigger value="updated" className="gap-2">
              <Eye className="h-4 w-4" />
              Updated
            </TabsTrigger>
          </TabsList>

          <TabsContent value={sortBy}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredStories.length} stories found`}
              </p>
              <div className="flex items-center gap-2">
                {getSortIcon(sortBy)}
                <span className="text-sm font-medium text-foreground">
                  Sorted by {sortBy}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No stories found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find more stories.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}