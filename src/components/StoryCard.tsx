import { Story } from '@/types/story';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MessageCircle, BookOpen, Crown, CheckCircle } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'featured' | 'compact';
}

export const StoryCard = ({ story, variant = 'default' }: StoryCardProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={story.cover}
              alt={story.title}
              className="w-16 h-24 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{story.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback className="text-xs">{story.author.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{story.author.displayName}</span>
                {story.author.verified && <CheckCircle className="w-3 h-3 text-primary" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(story.stats.reads)}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatNumber(story.stats.votes)}
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
      <Card className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <img
            src={story.cover}
            alt={story.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {story.stats.rank && story.stats.rank <= 3 && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              <Crown className="w-3 h-3 mr-1" />
              #{story.stats.rank}
            </Badge>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{story.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={story.author.avatar} />
                <AvatarFallback className="text-xs">{story.author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{story.author.displayName}</span>
              {story.author.verified && <CheckCircle className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(story.stats.reads)}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatNumber(story.stats.votes)}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {formatNumber(story.stats.comments)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={story.cover}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {story.stats.rank && story.stats.rank <= 10 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            #{story.stats.rank}
          </Badge>
        )}
        {story.status === 'completed' && (
          <Badge className="absolute top-2 right-2 bg-green-600 text-white">
            Complete
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">{story.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={story.author.avatar} />
            <AvatarFallback className="text-xs">{story.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">{story.author.displayName}</span>
          {story.author.verified && <CheckCircle className="w-4 h-4 text-primary" />}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {story.genres.slice(0, 2).map(genre => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatNumber(story.stats.reads)}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {formatNumber(story.stats.votes)}
            </div>
          </div>
          
          <Button size="sm" variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
            <BookOpen className="w-4 h-4 mr-1" />
            Read
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};