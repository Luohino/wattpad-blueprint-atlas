import { useState, useMemo } from 'react';
import { wattpadScreens, getTotalScreenCount } from '@/data/wattpadScreens';
import { Sidebar } from '@/components/Sidebar';
import { CategorySection } from '@/components/CategorySection';
import { SearchFilters } from '@/components/SearchFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Share2, BarChart3 } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedScreens, setCompletedScreens] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  const totalScreens = getTotalScreenCount();

  const toggleScreenComplete = (screenId: string) => {
    const newCompleted = new Set(completedScreens);
    if (newCompleted.has(screenId)) {
      newCompleted.delete(screenId);
    } else {
      newCompleted.add(screenId);
    }
    setCompletedScreens(newCompleted);
  };

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return wattpadScreens.filter(category => {
        return category.screens.some(screen => {
          const matchesSearch = searchTerm === '' || 
            screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            screen.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            screen.functionalElements.some(element => 
              element.toLowerCase().includes(searchTerm.toLowerCase())
            );
          
          const matchesPriority = selectedPriority === 'all' || screen.priority === selectedPriority;
          
          return matchesSearch && matchesPriority;
        });
      });
    } else {
      const category = wattpadScreens.find(cat => cat.id === selectedCategory);
      return category ? [category] : [];
    }
  }, [selectedCategory, searchTerm, selectedPriority]);

  const totalFilteredScreens = useMemo(() => {
    return filteredCategories.reduce((total, category) => {
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
      return total + filteredScreens.length;
    }, 0);
  }, [filteredCategories, searchTerm, selectedPriority]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPriority('all');
  };

  const overallProgress = Math.round((completedScreens.size / totalScreens) * 100);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        completedScreens={completedScreens}
        totalScreens={totalScreens}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                Wattpad-Style App Screen Atlas
              </h1>
              <p className="text-muted-foreground">
                Complete product management checklist with {totalScreens}+ unique screens
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {overallProgress}% Complete
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            resultsCount={totalFilteredScreens}
            onClearFilters={clearFilters}
          />

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-12 pr-4">
              {filteredCategories.map(category => (
                <CategorySection
                  key={category.id}
                  category={category}
                  completedScreens={completedScreens}
                  onToggleComplete={toggleScreenComplete}
                  searchTerm={searchTerm}
                  selectedPriority={selectedPriority}
                />
              ))}
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No screens found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Index;
