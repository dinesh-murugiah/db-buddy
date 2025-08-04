import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Play, Pause, AlertCircle } from 'lucide-react';
import { MaintenanceWorkflow, WorkflowStep } from '@/data/maintenanceData';
import { cn } from '@/lib/utils';

interface WorkflowProgressCardProps {
  workflow: MaintenanceWorkflow;
  onStart?: (workflowId: string) => void;
  onPause?: (workflowId: string) => void;
  onViewLogs?: (workflowId: string, stepId?: string) => void;
}

export function WorkflowProgressCard({ workflow, onStart, onPause, onViewLogs }: WorkflowProgressCardProps) {
  const getStatusColor = (status: MaintenanceWorkflow['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'running': return 'bg-primary text-primary-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'paused': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running': return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const getDatabaseIcon = (database: string) => {
    const icons: Record<string, string> = {
      redis: '🔴',
      mysql: '🐬',
      clickhouse: '⚡',
      kafka: '🔄',
      scylla: '⚛️',
      mongodb: '🍃'
    };
    return icons[database] || '💾';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getDatabaseIcon(workflow.database)}</span>
            <div>
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {workflow.type} • {workflow.database}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(workflow.status)}>
            {workflow.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{workflow.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{workflow.progress}%</span>
          </div>
          <Progress 
            value={workflow.progress} 
            className={cn(
              "h-2",
              workflow.status === 'failed' && "bg-destructive/20"
            )}
          />
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Steps</h4>
          <div className="space-y-2">
            {workflow.steps.map((step, index) => (
              <div 
                key={step.id} 
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border",
                  step.status === 'failed' && "border-destructive/20 bg-destructive/5",
                  step.status === 'running' && "border-primary/20 bg-primary/5",
                  step.status === 'completed' && "border-success/20 bg-success/5"
                )}
              >
                {getStepIcon(step)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{step.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                  {step.errorMessage && (
                    <p className="text-xs text-destructive mt-1">{step.errorMessage}</p>
                  )}
                </div>
                {step.duration && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(step.duration / 60)}m
                  </span>
                )}
                {step.logs.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewLogs?.(workflow.id, step.id)}
                    className="h-6 px-2"
                  >
                    Logs
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Info */}
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
          <span>Duration: {workflow.estimatedDuration}</span>
          {workflow.startedAt && (
            <span>Started: {workflow.startedAt.toLocaleTimeString()}</span>
          )}
        </div>

        {/* Error Message */}
        {workflow.errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Workflow Failed</p>
              <p className="text-xs text-destructive/80">{workflow.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {workflow.status === 'idle' && (
            <Button 
              size="sm" 
              onClick={() => onStart?.(workflow.id)}
              className="flex items-center gap-2"
            >
              <Play className="h-3 w-3" />
              Start
            </Button>
          )}
          {workflow.status === 'running' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onPause?.(workflow.id)}
              className="flex items-center gap-2"
            >
              <Pause className="h-3 w-3" />
              Pause
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewLogs?.(workflow.id)}
          >
            View Full Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}