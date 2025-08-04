import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { WorkflowProgressCard } from '@/components/WorkflowProgressCard';
import { WorkflowLogDialog } from '@/components/WorkflowLogDialog';
import { DynamicWorkflowForm } from '@/components/DynamicWorkflowForm';
import { WorkflowProgressManager } from '@/components/WorkflowProgressManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockMaintenanceWorkflows, MaintenanceWorkflow } from '@/data/maintenanceData';
import { DatabaseType } from '@/types/database';
import { CheckCircle, Clock, XCircle, Pause, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DBMaintenance = () => {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<MaintenanceWorkflow | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | undefined>();
  const [activeWorkflows, setActiveWorkflows] = useState<Array<{
    id: string;
    database: DatabaseType;
    operationType: string;
    startTime: Date;
    currentStage: number;
    stageProgress: number;
    completedStages: Set<number>;
    stages: any[];
  }>>([]);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const filteredWorkflows = useMemo(() => {
    return mockMaintenanceWorkflows.filter(workflow => {
      if (selectedDatabase !== 'all' && workflow.database !== selectedDatabase) return false;
      if (selectedType !== 'all' && workflow.type !== selectedType) return false;
      return true;
    });
  }, [selectedDatabase, selectedType]);

  const workflowStats = useMemo(() => {
    const stats = {
      total: filteredWorkflows.length,
      running: filteredWorkflows.filter(w => w.status === 'running').length,
      completed: filteredWorkflows.filter(w => w.status === 'completed').length,
      failed: filteredWorkflows.filter(w => w.status === 'failed').length,
      idle: filteredWorkflows.filter(w => w.status === 'idle').length,
    };
    return stats;
  }, [filteredWorkflows]);

  const handleViewLogs = (workflowId: string, stepId?: string) => {
    const workflow = mockMaintenanceWorkflows.find(w => w.id === workflowId);
    if (workflow) {
      setSelectedWorkflow(workflow);
      setSelectedStepId(stepId);
      setLogDialogOpen(true);
    }
  };

  const handleStartWorkflow = (workflowId: string) => {
    console.log('Starting workflow:', workflowId);
    // In a real app, this would trigger the workflow
  };

  const handlePauseWorkflow = (workflowId: string) => {
    console.log('Pausing workflow:', workflowId);
    // In a real app, this would pause the workflow
  };

  const handleWorkflowSubmit = (data: any) => {
    setFormLoading(true);
    console.log('Starting workflow with data:', data);
    
    // Simulate API call
    setTimeout(() => {
      const newWorkflow = {
        id: `workflow-${Date.now()}`,
        database: data.database,
        operationType: data.operationType,
        startTime: new Date(),
        currentStage: 0,
        stageProgress: 0,
        completedStages: new Set<number>(),
        stages: []
      };
      
      setActiveWorkflows(prev => [...prev, newWorkflow]);
      setFormLoading(false);
      
      toast({
        title: "Workflow Started",
        description: `${data.operationType} workflow for ${data.database} has been started.`,
      });
    }, 1000);
  };

  const handleWorkflowComplete = (workflowId: string) => {
    setActiveWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast({
      title: "Workflow Completed",
      description: "The workflow has completed successfully.",
    });
  };

  const handleWorkflowCancel = (workflowId: string) => {
    setActiveWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast({
      title: "Workflow Cancelled",
      description: "The workflow has been cancelled.",
    });
  };

  const databases: Array<{ value: DatabaseType | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'All Databases', icon: '💾' },
    { value: 'redis', label: 'Redis', icon: '🔴' },
    { value: 'postgres', label: 'PostgreSQL', icon: '🐘' },
    { value: 'clickhouse', label: 'ClickHouse', icon: '⚡' },
    { value: 'kafka', label: 'Kafka', icon: '🔄' },
    { value: 'scylla', label: 'ScyllaDB', icon: '⚛️' },
    { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
  ];

  const workflowTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'migration', label: 'Migration' },
    { value: 'upstep', label: 'Upstep' },
    { value: 'creation', label: 'Creation' },
    { value: 'modification', label: 'Modification' },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader 
        title="Database Maintenance" 
        subtitle="Monitor and manage database migration, upstep, creation and modification workflows"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Badge variant="secondary">{workflowStats.total}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{workflowStats.running}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{workflowStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{workflowStats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{workflowStats.idle}</div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Workflow Form */}
      {selectedDatabase !== 'all' && selectedType !== 'all' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DynamicWorkflowForm
            database={selectedDatabase}
            operationType={selectedType}
            onSubmit={handleWorkflowSubmit}
            isLoading={formLoading}
          />
          <div className="space-y-4">
            <WorkflowProgressManager
              activeWorkflows={activeWorkflows}
              onComplete={handleWorkflowComplete}
              onCancel={handleWorkflowCancel}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseType | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select database" />
          </SelectTrigger>
          <SelectContent>
            {databases.map((db) => (
              <SelectItem key={db.value} value={db.value}>
                <div className="flex items-center gap-2">
                  <span>{db.icon}</span>
                  <span>{db.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select workflow type" />
          </SelectTrigger>
          <SelectContent>
            {workflowTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Workflow Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
          <TabsTrigger value="upstep">Upstep</TabsTrigger>
          <TabsTrigger value="creation">Creation</TabsTrigger>
          <TabsTrigger value="modification">Modification</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredWorkflows.map((workflow) => (
              <WorkflowProgressCard
                key={workflow.id}
                workflow={workflow}
                onStart={handleStartWorkflow}
                onPause={handlePauseWorkflow}
                onViewLogs={handleViewLogs}
              />
            ))}
          </div>
          {filteredWorkflows.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No workflows found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more workflows.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {workflowTypes.slice(1).map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredWorkflows
                .filter(w => w.type === type.value)
                .map((workflow) => (
                  <WorkflowProgressCard
                    key={workflow.id}
                    workflow={workflow}
                    onStart={handleStartWorkflow}
                    onPause={handlePauseWorkflow}
                    onViewLogs={handleViewLogs}
                  />
                ))}
            </div>
            {filteredWorkflows.filter(w => w.type === type.value).length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No {type.label.toLowerCase()} workflows found</h3>
                    <p className="text-muted-foreground">
                      No {type.label.toLowerCase()} workflows match your current filters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Log Dialog */}
      <WorkflowLogDialog
        open={logDialogOpen}
        onOpenChange={setLogDialogOpen}
        workflow={selectedWorkflow}
        stepId={selectedStepId}
      />
    </div>
  );
};

export default DBMaintenance;