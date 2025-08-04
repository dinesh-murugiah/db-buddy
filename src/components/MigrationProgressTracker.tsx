import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MigrationStage {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
}

interface MigrationProgressTrackerProps {
  isActive: boolean;
  onComplete?: () => void;
}

const migrationStages: MigrationStage[] = [
  {
    id: 'phase1',
    name: 'Pre-Migration Validation',
    description: 'Validating source database and connectivity',
    estimatedDuration: '2-3 minutes'
  },
  {
    id: 'phase2',
    name: 'Snapshot Creation',
    description: 'Creating database snapshot for backup',
    estimatedDuration: '5-10 minutes'
  },
  {
    id: 'phase3',
    name: 'Target Database Setup',
    description: 'Provisioning target database instance',
    estimatedDuration: '8-12 minutes'
  },
  {
    id: 'phase4',
    name: 'Schema Migration',
    description: 'Migrating database schema and structure',
    estimatedDuration: '3-5 minutes'
  },
  {
    id: 'phase5',
    name: 'Data Transfer',
    description: 'Transferring data to target database',
    estimatedDuration: '15-30 minutes'
  },
  {
    id: 'phase6',
    name: 'Index Reconstruction',
    description: 'Rebuilding indexes and constraints',
    estimatedDuration: '5-8 minutes'
  },
  {
    id: 'phase7',
    name: 'Performance Optimization',
    description: 'Optimizing performance settings',
    estimatedDuration: '2-3 minutes'
  },
  {
    id: 'phase8',
    name: 'Post-Migration Validation',
    description: 'Validating migration and running tests',
    estimatedDuration: '3-5 minutes'
  }
];

export const MigrationProgressTracker = ({ isActive, onComplete }: MigrationProgressTrackerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0);
      setStageProgress(0);
      setCompletedStages(new Set());
      return;
    }

    const totalStages = migrationStages.length;
    let stage = 0;
    let progress = 0;

    const interval = setInterval(() => {
      if (stage < totalStages) {
        progress += 2;
        
        if (progress >= 100) {
          setCompletedStages(prev => new Set([...prev, stage]));
          stage++;
          progress = 0;
          setCurrentStage(stage);
        }
        
        setStageProgress(progress);
        
        if (stage >= totalStages) {
          clearInterval(interval);
          onComplete?.();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  const overallProgress = ((completedStages.size + (stageProgress / 100)) / migrationStages.length) * 100;

  const getStageIcon = (index: number) => {
    if (completedStages.has(index)) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    } else if (index === currentStage && isActive) {
      return <Clock className="h-5 w-5 text-primary animate-spin" />;
    } else {
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStageStatus = (index: number) => {
    if (completedStages.has(index)) {
      return 'completed';
    } else if (index === currentStage && isActive) {
      return 'running';
    } else if (index < currentStage) {
      return 'completed';
    } else {
      return 'pending';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Migration Progress</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "In Progress" : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Current Stage Progress */}
        {isActive && currentStage < migrationStages.length && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Stage: {migrationStages[currentStage]?.name}</span>
              <span>{Math.round(stageProgress)}%</span>
            </div>
            <Progress value={stageProgress} className="h-2" />
          </div>
        )}

        {/* Stage List */}
        <div className="space-y-3">
          {migrationStages.map((stage, index) => {
            const status = getStageStatus(index);
            
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200",
                  status === 'completed' && "bg-success/10 border-success/20",
                  status === 'running' && "bg-primary/10 border-primary/20 shadow-sm",
                  status === 'pending' && "bg-muted/50 border-muted"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStageIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "text-sm font-medium",
                      status === 'completed' && "text-success",
                      status === 'running' && "text-primary",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {stage.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {stage.estimatedDuration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stage.description}
                  </p>
                  {status === 'running' && (
                    <div className="mt-2">
                      <Progress value={stageProgress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex justify-between text-sm pt-4 border-t">
          <span>Completed Stages</span>
          <span>{completedStages.size} / {migrationStages.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};