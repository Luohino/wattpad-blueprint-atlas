import { useState } from 'react';
import { Header } from '@/components/Header';
import { StoryCard } from '@/components/StoryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStories, popularGenres, trendingTags } from '@/data/mockData';
import { TrendingUp, Crown, Clock, Star, BookOpen, Users, Flame } from 'lucide-react';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const featuredStory = mockStories[0];
  const trendingStories = mockStories.slice(0, 3);
  const newStories = mockStories;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary-glow/20 p-8 md:p-12">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Stories
                </span>
                <br />
                Come Alive Here
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Discover millions of stories from writers around the world. 
                Share your own story and join a community of passionate readers and writers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Reading
                </Button>
                <Button size="lg" variant="outline">
                  <Star className="w-5 h-5 mr-2" />
                  Start Writing
                </Button>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="w-full h-full bg-gradient-to-l from-primary to-transparent" />
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <Tabs defaultValue="discover" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              New & Updated
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            {/* Featured Story */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Featured Story</h2>
              </div>
              <StoryCard story={featuredStory} variant="featured" />
            </section>

            {/* Genre Filter */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Browse by Genre</h3>
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedGenre === null ? "default" : "outline"}
                    onClick={() => setSelectedGenre(null)}
                    className="whitespace-nowrap"
                  >
                    All Genres
                  </Button>
                  {popularGenres.map(genre => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      onClick={() => setSelectedGenre(genre)}
                      className="whitespace-nowrap"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </section>

            {/* Stories Grid */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Popular Stories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {newStories.map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="trending" className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Trending This Week</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingStories.map(story => (
                  <StoryCard key={story.id} story={story} variant="featured" />
                ))}
              </div>
            </section>

            {/* Trending Tags */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="new" className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Fresh Stories</h2>
              </div>
              <div className="space-y-4">
                {newStories.map(story => (
                  <StoryCard key={story.id} story={story} variant="compact" />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="community" className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Community Picks</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {newStories.map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
