import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign,
  TrendingUp, 
  Server,
  Sparkles
} from 'lucide-react';
import { DatabaseLandingCard } from '@/components/DatabaseLandingCard';
import { WorkflowCard } from '@/components/WorkflowCard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockDatabaseOverviews, mockWorkflows } from '@/data/mockData';
import { Workflow, DatabaseType } from '@/types/database';

export default function Dashboard() {
  const [databases] = useState(mockDatabaseOverviews);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('redis');

  // Calculate overall stats
  const totalWeeklyCost = databases.reduce((sum, db) => sum + db.weeklyCost, 0);
  const totalInstances = databases.reduce((sum, db) => sum + db.activeCount, 0);

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
    <div className="flex-1 space-y-8 p-6">
      <DashboardHeader
        title="Database Infrastructure Overview"
        subtitle="Comprehensive view of your database landscape and weekly costs"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Hero Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              Total Weekly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalWeeklyCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              8% reduction from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-success">
              <Server className="h-5 w-5" />
              Total Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInstances.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Across {databases.filter(db => db.activeCount > 0).length} database types
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.8%</div>
            <p className="text-sm text-muted-foreground">
              Overall system uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {databases.map((database) => (
          <DatabaseLandingCard key={database.type} database={database} />
        ))}
      </div>
    </div>
  );
}