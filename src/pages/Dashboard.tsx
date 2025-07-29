import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Server,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { DatabaseOverviewCard } from '@/components/DatabaseOverviewCard';
import { WorkflowCard } from '@/components/WorkflowCard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockDatabaseOverviews, mockWorkflows } from '@/data/mockData';
import { Workflow, DatabaseType } from '@/types/database';

export default function Dashboard() {
  const [databases] = useState(mockDatabaseOverviews);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('redis');

  // Calculate overall stats
  const totalInstances = databases.reduce((sum, db) => sum + db.activeCount, 0);
  const totalHealthy = databases.reduce((sum, db) => sum + db.healthyCount, 0);
  const totalAlerts = databases.reduce((sum, db) => sum + db.alerts.filter(a => !a.resolved).length, 0);
  const avgResponseTime = databases.reduce((sum, db) => sum + db.metrics.responseTime, 0) / databases.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleWorkflowExecute = (workflow: Workflow) => {
    console.log('Executing workflow:', workflow.name);
    // TODO: Implement workflow execution
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader
        title="Database Management Portal"
        subtitle="Monitor and manage your database infrastructure"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">
              Across {databases.length} database types
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {Math.round((totalHealthy / totalInstances) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {totalHealthy}/{totalInstances} instances healthy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)}ms</div>
            <p className="text-xs text-muted-foreground">
              Across all databases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Database Overview</TabsTrigger>
          <TabsTrigger value="workflows">Quick Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {databases.map((database) => (
              <DatabaseOverviewCard key={database.type} database={database} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* Database Type Selector */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(mockWorkflows).map((dbType) => (
                <Button
                  key={dbType}
                  variant={selectedDatabase === dbType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDatabase(dbType as DatabaseType)}
                  className="capitalize"
                >
                  {dbType}
                  <Badge variant="secondary" className="ml-2">
                    {mockWorkflows[dbType as DatabaseType].length}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Workflows Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockWorkflows[selectedDatabase]?.map((workflow) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow}
                  onExecute={handleWorkflowExecute}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}