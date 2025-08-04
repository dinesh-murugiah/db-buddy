import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatabaseType } from '@/types/database';

interface ActiveWorkflow {
  id: string;
  database: DatabaseType;
  operationType: string;
  startTime: Date;
  currentStage: number;
  stageProgress: number;
  completedStages: Set<number>;
  stages: WorkflowStage[];
}

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
}

interface WorkflowProgressManagerProps {
  activeWorkflows: ActiveWorkflow[];
  onComplete: (workflowId: string) => void;
  onCancel: (workflowId: string) => void;
}

const getStagesForOperation = (database: DatabaseType, operationType: string): WorkflowStage[] => {
  const baseStages = {
    migration: [
      { id: 'validation', name: 'Pre-Migration Validation', description: 'Validating source and target connectivity', estimatedDuration: '2-3 min' },
      { id: 'backup', name: 'Backup Creation', description: 'Creating backup of source database', estimatedDuration: '5-10 min' },
      { id: 'schema', name: 'Schema Migration', description: 'Migrating database schema', estimatedDuration: '3-5 min' },
      { id: 'data', name: 'Data Transfer', description: 'Transferring data to target', estimatedDuration: '15-30 min' },
      { id: 'verification', name: 'Data Verification', description: 'Verifying data integrity', estimatedDuration: '5-8 min' }
    ],
    upstep: [
      { id: 'preparation', name: 'Upgrade Preparation', description: 'Preparing for version upgrade', estimatedDuration: '3-5 min' },
      { id: 'backup', name: 'System Backup', description: 'Creating full system backup', estimatedDuration: '10-15 min' },
      { id: 'upgrade', name: 'Version Upgrade', description: 'Upgrading to target version', estimatedDuration: '20-30 min' },
      { id: 'optimization', name: 'Post-Upgrade Optimization', description: 'Optimizing for new version', estimatedDuration: '5-10 min' },
      { id: 'testing', name: 'System Testing', description: 'Running compatibility tests', estimatedDuration: '5-8 min' }
    ],
    creation: [
      { id: 'provisioning', name: 'Resource Provisioning', description: 'Allocating compute and storage', estimatedDuration: '5-8 min' },
      { id: 'installation', name: 'Database Installation', description: 'Installing database software', estimatedDuration: '10-15 min' },
      { id: 'configuration', name: 'Initial Configuration', description: 'Setting up initial configuration', estimatedDuration: '3-5 min' },
      { id: 'security', name: 'Security Setup', description: 'Configuring security settings', estimatedDuration: '5-8 min' },
      { id: 'validation', name: 'Instance Validation', description: 'Validating instance health', estimatedDuration: '2-3 min' }
    ],
    modification: [
      { id: 'analysis', name: 'Change Analysis', description: 'Analyzing proposed modifications', estimatedDuration: '2-3 min' },
      { id: 'backup', name: 'Safety Backup', description: 'Creating backup before changes', estimatedDuration: '5-10 min' },
      { id: 'implementation', name: 'Change Implementation', description: 'Applying modifications', estimatedDuration: '10-20 min' },
      { id: 'testing', name: 'Impact Testing', description: 'Testing modification impact', estimatedDuration: '5-8 min' },
      { id: 'monitoring', name: 'Post-Change Monitoring', description: 'Monitoring system stability', estimatedDuration: '3-5 min' }
    ]
  };

  return baseStages[operationType as keyof typeof baseStages] || [];
};

export const WorkflowProgressManager = ({ activeWorkflows, onComplete, onCancel }: WorkflowProgressManagerProps) => {
  const [workflows, setWorkflows] = useState<Map<string, ActiveWorkflow>>(new Map());

  useEffect(() => {
    const workflowMap = new Map<string, ActiveWorkflow>();
    activeWorkflows.forEach(workflow => {
      const existing = workflows.get(workflow.id);
      if (existing) {
        workflowMap.set(workflow.id, existing);
      } else {
        workflowMap.set(workflow.id, {
          ...workflow,
          stages: getStagesForOperation(workflow.database, workflow.operationType),
          currentStage: 0,
          stageProgress: 0,
          completedStages: new Set()
        });
      }
    });
    setWorkflows(workflowMap);
  }, [activeWorkflows]);

  useEffect(() => {
    const intervals = new Map<string, NodeJS.Timeout>();

    workflows.forEach((workflow, id) => {
      if (workflow.currentStage < workflow.stages.length) {
        const interval = setInterval(() => {
          setWorkflows(prev => {
            const updated = new Map(prev);
            const current = updated.get(id);
            if (!current) return prev;

            let newProgress = current.stageProgress + 2;
            let newStage = current.currentStage;
            let newCompleted = new Set(current.completedStages);

            if (newProgress >= 100) {
              newCompleted.add(current.currentStage);
              newStage++;
              newProgress = 0;

              if (newStage >= current.stages.length) {
                clearInterval(interval);
                onComplete(id);
                return prev;
              }
            }

            updated.set(id, {
              ...current,
              currentStage: newStage,
              stageProgress: newProgress,
              completedStages: newCompleted
            });

            return updated;
          });
        }, 200);

        intervals.set(id, interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [workflows, onComplete]);

  const getStageIcon = (workflow: ActiveWorkflow, stageIndex: number) => {
    if (workflow.completedStages.has(stageIndex)) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    } else if (stageIndex === workflow.currentStage) {
      return <Clock className="h-4 w-4 text-primary animate-spin" />;
    } else {
      return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDatabaseIcon = (database: DatabaseType) => {
    const icons = {
      redis: '🔴',
      postgres: '🐘',
      clickhouse: '⚡',
      kafka: '🔄',
      scylla: '⚛️',
      mongodb: '🍃'
    };
    return icons[database] || '💾';
  };

  const getOverallProgress = (workflow: ActiveWorkflow) => {
    return ((workflow.completedStages.size + (workflow.stageProgress / 100)) / workflow.stages.length) * 100;
  };

  if (workflows.size === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Array.from(workflows.values()).map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>{getDatabaseIcon(workflow.database)}</span>
                {workflow.operationType.charAt(0).toUpperCase() + workflow.operationType.slice(1)} - {workflow.database.charAt(0).toUpperCase() + workflow.database.slice(1)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="default">In Progress</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(workflow.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress(workflow))}%</span>
              </div>
              <Progress value={getOverallProgress(workflow)} className="h-2" />
            </div>

            {/* Current Stage Progress */}
            {workflow.currentStage < workflow.stages.length && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {workflow.stages[workflow.currentStage]?.name}</span>
                  <span>{Math.round(workflow.stageProgress)}%</span>
                </div>
                <Progress value={workflow.stageProgress} className="h-1" />
              </div>
            )}

            {/* Stage List */}
            <div className="space-y-2">
              {workflow.stages.map((stage, index) => {
                const isCompleted = workflow.completedStages.has(index);
                const isCurrent = index === workflow.currentStage;
                const isPending = index > workflow.currentStage;

                return (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded border transition-all duration-200",
                      isCompleted && "bg-success/10 border-success/20",
                      isCurrent && "bg-primary/10 border-primary/20",
                      isPending && "bg-muted/50 border-muted"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {getStageIcon(workflow, index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          isCompleted && "text-success",
                          isCurrent && "text-primary",
                          isPending && "text-muted-foreground"
                        )}>
                          {stage.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stage.estimatedDuration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Completed Stages</span>
              <span>{workflow.completedStages.size} / {workflow.stages.length}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};