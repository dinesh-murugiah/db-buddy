import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenanceWorkflow, LogEntry } from '@/data/maintenanceData';
import { Info, AlertTriangle, XCircle, Bug } from 'lucide-react';

interface WorkflowLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: MaintenanceWorkflow | null;
  stepId?: string;
}

export function WorkflowLogDialog({ open, onOpenChange, workflow, stepId }: WorkflowLogDialogProps) {
  if (!workflow) return null;

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'debug': return <Bug className="h-4 w-4 text-muted-foreground" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'debug': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getAllLogs = () => {
    return workflow.steps
      .flatMap(step => 
        step.logs.map(log => ({ ...log, stepName: step.name, stepId: step.id }))
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getStepLogs = (targetStepId: string) => {
    const step = workflow.steps.find(s => s.id === targetStepId);
    return step?.logs || [];
  };

  const selectedStep = stepId ? workflow.steps.find(s => s.id === stepId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">
              {workflow.database === 'redis' && '🔴'}
              {workflow.database === 'mysql' && '🐬'}
              {workflow.database === 'clickhouse' && '⚡'}
              {workflow.database === 'kafka' && '🔄'}
              {workflow.database === 'scylla' && '⚛️'}
              {workflow.database === 'mongodb' && '🍃'}
            </span>
            {workflow.name} - Logs
          </DialogTitle>
          <DialogDescription>
            {selectedStep 
              ? `Viewing logs for step: ${selectedStep.name}`
              : 'Viewing all workflow logs'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={stepId ? "step" : "all"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="step" disabled={!stepId}>
              {selectedStep ? `Step: ${selectedStep.name}` : 'Step Logs'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-3">
                {getAllLogs().map((log, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    {getLogIcon(log.level)}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {('stepName' in log) ? log.stepName : 'Workflow'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${getLogLevelColor(log.level)}`}>
                        {log.message}
                      </p>
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            Metadata
                          </summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                {getAllLogs().length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No logs available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="step" className="mt-4">
            {selectedStep && (
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-3">
                  {getStepLogs(stepId!).map((log, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      {getLogIcon(log.level)}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {log.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className={`text-sm ${getLogLevelColor(log.level)}`}>
                          {log.message}
                        </p>
                        {log.metadata && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Metadata
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                  {getStepLogs(stepId!).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No logs available for this step
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}