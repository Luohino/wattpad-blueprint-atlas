import { Story } from '@/types/story';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MessageCircle, BookOpen, Crown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'featured' | 'compact';
}

export const StoryCard = ({ story, variant = 'default' }: StoryCardProps) => {
  const navigate = useNavigate();
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Handle data structure differences between mock and real data
  const getStoryData = (story: any) => {
    return {
      id: story.id,
      title: story.title,
      description: story.description,
      cover: story.cover_url || story.cover || '/placeholder.svg',
      author: {
        username: story.profiles?.username || story.author?.username || 'Unknown',
        displayName: story.profiles?.display_name || story.author?.displayName || 'Unknown Author',
        avatar: story.profiles?.avatar_url || story.author?.avatar || '',
        verified: story.profiles?.verified || story.author?.verified || false
      },
      genres: story.story_genres?.map((sg: any) => sg.genres?.name).filter(Boolean) || story.genres || [],
      stats: {
        reads: story.reads_count || story.stats?.reads || 0,
        votes: story.votes_count || story.stats?.votes || 0,
        comments: story.comments_count || story.stats?.comments || 0,
        rank: story.stats?.rank
      },
      status: story.status || 'ongoing'
    };
  };

  const storyData = getStoryData(story);

  const handleReadClick = () => {
    navigate(`/story/${story.id}`);
  };

  const handleCardClick = () => {
    navigate(`/story/${story.id}`);
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={storyData.cover}
              alt={storyData.title}
              className="w-16 h-24 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{storyData.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={storyData.author.avatar} />
                  <AvatarFallback className="text-xs">{storyData.author.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{storyData.author.displayName}</span>
                {storyData.author.verified && <CheckCircle className="w-3 h-3 text-primary" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(storyData.stats.reads)}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatNumber(storyData.stats.votes)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300" onClick={handleCardClick}>
        <div className="relative">
          <img
            src={storyData.cover}
            alt={storyData.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {storyData.stats.rank && storyData.stats.rank <= 3 && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              <Crown className="w-3 h-3 mr-1" />
              #{storyData.stats.rank}
            </Badge>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{storyData.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={storyData.author.avatar} />
                <AvatarFallback className="text-xs">{storyData.author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{storyData.author.displayName}</span>
              {storyData.author.verified && <CheckCircle className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(storyData.stats.reads)}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatNumber(storyData.stats.votes)}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {formatNumber(storyData.stats.comments)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleCardClick}>
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={storyData.cover}
          alt={storyData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {storyData.stats.rank && storyData.stats.rank <= 10 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            #{storyData.stats.rank}
          </Badge>
        )}
        {storyData.status === 'completed' && (
          <Badge className="absolute top-2 right-2 bg-green-600 text-white">
            Complete
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">{storyData.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={storyData.author.avatar} />
            <AvatarFallback className="text-xs">{storyData.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">{storyData.author.displayName}</span>
          {storyData.author.verified && <CheckCircle className="w-4 h-4 text-primary" />}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{storyData.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {storyData.genres.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatNumber(storyData.stats.reads)}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {formatNumber(storyData.stats.votes)}
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-primary hover:text-primary-foreground hover:bg-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleReadClick();
            }}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Read
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};