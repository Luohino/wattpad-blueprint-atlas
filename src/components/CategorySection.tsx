import { ScreenCategory } from '@/data/wattpadScreens';
import { ScreenCard } from './ScreenCard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getCategoryProgress } from '@/data/wattpadScreens';

interface CategorySectionProps {
  category: ScreenCategory;
  completedScreens: Set<string>;
  onToggleComplete: (screenId: string) => void;
  searchTerm: string;
  selectedPriority: string;
}

export const CategorySection = ({ 
  category, 
  completedScreens, 
  onToggleComplete, 
  searchTerm,
  selectedPriority 
}: CategorySectionProps) => {
  const filteredScreens = category.screens.filter(screen => {
    const matchesSearch = searchTerm === '' || 
      screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.functionalElements.some(element => 
        element.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesPriority = selectedPriority === 'all' || screen.priority === selectedPriority;
    
    return matchesSearch && matchesPriority;
  });

  if (filteredScreens.length === 0) {
    return null;
  }

  const progress = getCategoryProgress(category.id, completedScreens);
  const completedCount = category.screens.filter(screen => 
    completedScreens.has(screen.id)
  ).length;

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {category.name}
            </h2>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              {completedCount}/{category.screens.length} Complete
            </Badge>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScreens.map(screen => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            isCompleted={completedScreens.has(screen.id)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </section>
  );
};