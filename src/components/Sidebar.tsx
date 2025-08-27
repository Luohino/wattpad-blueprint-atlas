import { wattpadScreens, getCategoryProgress } from '@/data/wattpadScreens';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Target, TrendingUp } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  completedScreens: Set<string>;
  totalScreens: number;
}

export const Sidebar = ({ 
  selectedCategory, 
  onCategorySelect, 
  completedScreens,
  totalScreens 
}: SidebarProps) => {
  const overallProgress = Math.round((completedScreens.size / totalScreens) * 100);

  return (
    <div className="w-80 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">Wattpad Blueprint</h1>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedScreens.size}/{totalScreens}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <Badge variant="secondary" className="w-fit">
            {overallProgress}% Complete
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onCategorySelect('all')}
          >
            <Target className="w-4 h-4 mr-2" />
            All Categories
          </Button>
          
          {wattpadScreens.map(category => {
            const progress = getCategoryProgress(category.id, completedScreens);
            const completedCount = category.screens.filter(screen => 
              completedScreens.has(screen.id)
            ).length;
            
            return (
              <div key={category.id}>
                <Button
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-start mb-2"
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                      ) : (
                        <TrendingUp className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {completedCount}/{category.screens.length}
                    </Badge>
                  </div>
                </Button>
                {selectedCategory === category.id && (
                  <div className="ml-6 mb-2">
                    <Progress value={progress} className="h-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};