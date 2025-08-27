import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  resultsCount: number;
  onClearFilters: () => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  resultsCount,
  onClearFilters
}: SearchFiltersProps) => {
  const hasFilters = searchTerm !== '' || selectedPriority !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search screens, purposes, or elements..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedPriority} onValueChange={onPriorityChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {resultsCount} screen{resultsCount !== 1 ? 's' : ''} found
          </Badge>
          {hasFilters && (
            <Badge variant="outline">
              Filtered
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};