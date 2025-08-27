import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Screen } from '@/data/wattpadScreens';
import { CheckCircle, Circle, Star, AlertTriangle, Info } from 'lucide-react';

interface ScreenCardProps {
  screen: Screen;
  isCompleted: boolean;
  onToggleComplete: (screenId: string) => void;
}

const priorityConfig = {
  critical: { icon: AlertTriangle, color: 'destructive', label: 'Critical' },
  high: { icon: Star, color: 'primary', label: 'High' },
  medium: { icon: Info, color: 'secondary', label: 'Medium' },
  low: { icon: Circle, color: 'muted', label: 'Low' }
};

export const ScreenCard = ({ screen, isCompleted, onToggleComplete }: ScreenCardProps) => {
  const PriorityIcon = priorityConfig[screen.priority].icon;
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-[var(--shadow-card)] ${
      isCompleted 
        ? 'bg-gradient-to-br from-accent/20 to-accent/10 border-primary/30' 
        : 'bg-card hover:bg-accent/5'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => onToggleComplete(screen.id)}
                className="flex-shrink-0"
              />
              <CardTitle className="text-base leading-tight">{screen.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={priorityConfig[screen.priority].color as any}
                className="text-xs"
              >
                <PriorityIcon className="w-3 h-3 mr-1" />
                {priorityConfig[screen.priority].label}
              </Badge>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Purpose</h4>
            <p className="text-sm text-foreground">{screen.purpose}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">User Journey</h4>
            <p className="text-sm text-foreground">{screen.userJourney}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Functional Elements</h4>
            <div className="flex flex-wrap gap-1">
              {screen.functionalElements.map((element, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {element}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};