import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Database,
  BarChart3,
  Workflow as WorkflowIcon,
  Zap,
  Leaf,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Workflow, DatabaseType } from '@/types/database';
import { cn } from '@/lib/utils';

interface WorkflowCardProps {
  workflow: Workflow;
  onExecute: (workflow: Workflow) => void;
}

const iconMap = {
  redis: Database,
  postgres: Database,
  clickhouse: BarChart3,
  kafka: WorkflowIcon,
  scylla: Zap,
  mongodb: Leaf
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'maintenance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'backup':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'performance':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function WorkflowCard({ workflow, onExecute }: WorkflowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const DatabaseIcon = iconMap[workflow.database];
  
  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <DatabaseIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {workflow.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getCategoryColor(workflow.category))}
                >
                  {workflow.category}
                </Badge>
                <span className="text-sm text-muted-foreground capitalize">
                  {workflow.database}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={() => onExecute(workflow)}
            className={cn(
              "transition-all duration-200",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            )}
          >
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {workflow.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Duration
            </div>
            <p className="text-sm font-medium">{workflow.estimatedDuration}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Success Rate
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {workflow.successRate ? `${workflow.successRate.toFixed(1)}%` : 'N/A'}
              </p>
              {workflow.successRate && (
                <Progress value={workflow.successRate} className="h-1 flex-1" />
              )}
            </div>
          </div>
        </div>

        {workflow.lastRun && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Last run: {workflow.lastRun.toLocaleDateString()} at {workflow.lastRun.toLocaleTimeString()}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {workflow.parameters.length} parameter{workflow.parameters.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1">
            {workflow.parameters.slice(0, 3).map((param, index) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full bg-primary/30"
                title={param.name}
              />
            ))}
            {workflow.parameters.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{workflow.parameters.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}