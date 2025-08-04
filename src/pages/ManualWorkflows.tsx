import { useState } from 'react';
import { Search, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DatabaseType } from '@/types/database';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: string;
}

interface EnhancedWorkflow {
  id: string;
  name: string;
  database: DatabaseType;
  description: string;
  category: string;
  estimatedDuration: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  lastRun?: Date;
  successRate: number;
  steps: WorkflowStep[];
  triggers: string[];
}

const mockEnhancedWorkflows: Record<DatabaseType, EnhancedWorkflow[]> = {
  redis: [
    {
      id: 'redis-1',
      name: 'Increase Memory Allocation',
      database: 'redis',
      description: 'Dynamically increase memory allocation for Redis instances',
      category: 'Performance',
      estimatedDuration: '3-5 minutes',
      status: 'running',
      progress: 65,
      lastRun: new Date('2024-01-15T10:30:00Z'),
      successRate: 98.5,
      triggers: ['Memory usage > 85%', 'Manual trigger', 'Schedule-based'],
      steps: [
        { id: '1', name: 'Validate current memory usage', status: 'completed' },
        { id: '2', name: 'Calculate optimal memory size', status: 'completed' },
        { id: '3', name: 'Update instance configuration', status: 'running' },
        { id: '4', name: 'Restart Redis service', status: 'pending' },
        { id: '5', name: 'Verify memory allocation', status: 'pending' }
      ]
    },
    {
      id: 'redis-2',
      name: 'Scale Up Shards',
      database: 'redis',
      description: 'Add additional shards to Redis cluster for better performance',
      category: 'Scaling',
      estimatedDuration: '10-15 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-14T15:30:00Z'),
      successRate: 96.2,
      triggers: ['CPU usage > 80%', 'Connection count > threshold'],
      steps: [
        { id: '1', name: 'Analyze cluster performance', status: 'pending' },
        { id: '2', name: 'Provision new shard instances', status: 'pending' },
        { id: '3', name: 'Configure shard routing', status: 'pending' },
        { id: '4', name: 'Rebalance data distribution', status: 'pending' },
        { id: '5', name: 'Update cluster configuration', status: 'pending' }
      ]
    },
    {
      id: 'redis-3',
      name: 'Optimize Cache Keys',
      database: 'redis',
      description: 'Analyze and optimize cache key patterns for better performance',
      category: 'Optimization',
      estimatedDuration: '5-8 minutes',
      status: 'completed',
      progress: 100,
      lastRun: new Date('2024-01-15T08:20:00Z'),
      successRate: 94.8,
      triggers: ['Cache hit ratio < 90%', 'Memory fragmentation > 20%'],
      steps: [
        { id: '1', name: 'Scan cache key patterns', status: 'completed', duration: '2m' },
        { id: '2', name: 'Identify optimization opportunities', status: 'completed', duration: '1m' },
        { id: '3', name: 'Apply key optimizations', status: 'completed', duration: '2m' },
        { id: '4', name: 'Validate performance improvements', status: 'completed', duration: '1m' }
      ]
    }
  ],
  mysql: [
    {
      id: 'mysql-1',
      name: 'Scale Database Instance',
      database: 'mysql',
      description: 'Vertically scale MySQL RDS instance for increased performance',
      category: 'Scaling',
      estimatedDuration: '8-12 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-13T03:00:00Z'),
      successRate: 97.3,
      triggers: ['CPU usage > 85%', 'Connection pool exhaustion'],
      steps: [
        { id: '1', name: 'Create database snapshot', status: 'pending' },
        { id: '2', name: 'Provision larger instance', status: 'pending' },
        { id: '3', name: 'Migrate data to new instance', status: 'pending' },
        { id: '4', name: 'Update connection strings', status: 'pending' },
        { id: '5', name: 'Verify application connectivity', status: 'pending' }
      ]
    },
    {
      id: 'mysql-2',
      name: 'Increase Connection Pool',
      database: 'mysql',
      description: 'Dynamically increase connection pool size based on demand',
      category: 'Performance',
      estimatedDuration: '2-4 minutes',
      status: 'failed',
      progress: 30,
      lastRun: new Date('2024-01-15T11:45:00Z'),
      successRate: 89.1,
      triggers: ['Active connections > 80% of limit', 'Connection wait time > 5s'],
      steps: [
        { id: '1', name: 'Analyze current connection usage', status: 'completed' },
        { id: '2', name: 'Calculate optimal pool size', status: 'failed' },
        { id: '3', name: 'Update pool configuration', status: 'pending' },
        { id: '4', name: 'Restart connection pooler', status: 'pending' }
      ]
    },
    {
      id: 'mysql-3',
      name: 'Optimize Slow Queries',
      database: 'mysql',
      description: 'Identify and optimize slow-running database queries',
      category: 'Optimization',
      estimatedDuration: '15-20 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-12T16:30:00Z'),
      successRate: 92.7,
      triggers: ['Average query time > 500ms', 'Lock wait events detected'],
      steps: [
        { id: '1', name: 'Analyze query performance logs', status: 'pending' },
        { id: '2', name: 'Identify optimization candidates', status: 'pending' },
        { id: '3', name: 'Generate index recommendations', status: 'pending' },
        { id: '4', name: 'Apply query optimizations', status: 'pending' },
        { id: '5', name: 'Validate performance improvements', status: 'pending' }
      ]
    }
  ],
  clickhouse: [
    {
      id: 'clickhouse-1',
      name: 'Optimize Table Partitions',
      database: 'clickhouse',
      description: 'Reorganize table partitions for optimal query performance',
      category: 'Optimization',
      estimatedDuration: '10-15 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-12T04:00:00Z'),
      successRate: 96.8,
      triggers: ['Partition size > 1GB', 'Query performance degradation'],
      steps: [
        { id: '1', name: 'Analyze partition distribution', status: 'pending' },
        { id: '2', name: 'Calculate optimal partition strategy', status: 'pending' },
        { id: '3', name: 'Create new partition structure', status: 'pending' },
        { id: '4', name: 'Migrate data to new partitions', status: 'pending' },
        { id: '5', name: 'Drop old partitions', status: 'pending' }
      ]
    },
    {
      id: 'clickhouse-2',
      name: 'Scale Cluster Nodes',
      database: 'clickhouse',
      description: 'Add additional nodes to ClickHouse cluster for better performance',
      category: 'Scaling',
      estimatedDuration: '20-30 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-10T02:00:00Z'),
      successRate: 94.2,
      triggers: ['CPU usage > 80%', 'Query queue length > 50'],
      steps: [
        { id: '1', name: 'Provision new cluster nodes', status: 'pending' },
        { id: '2', name: 'Configure cluster topology', status: 'pending' },
        { id: '3', name: 'Sync data to new nodes', status: 'pending' },
        { id: '4', name: 'Update load balancer configuration', status: 'pending' },
        { id: '5', name: 'Verify cluster health', status: 'pending' }
      ]
    },
    {
      id: 'clickhouse-3',
      name: 'Compress Historical Data',
      database: 'clickhouse',
      description: 'Apply compression to historical data to reduce storage costs',
      category: 'Maintenance',
      estimatedDuration: '5-10 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-14T22:00:00Z'),
      successRate: 99.1,
      triggers: ['Storage usage > 85%', 'Data age > 30 days'],
      steps: [
        { id: '1', name: 'Identify compressible data', status: 'pending' },
        { id: '2', name: 'Apply compression algorithms', status: 'pending' },
        { id: '3', name: 'Verify data integrity', status: 'pending' },
        { id: '4', name: 'Update storage statistics', status: 'pending' }
      ]
    }
  ],
  kafka: [
    {
      id: 'kafka-1',
      name: 'Scale Partition Count',
      database: 'kafka',
      description: 'Increase partition count for high-throughput topics',
      category: 'Scaling',
      estimatedDuration: '8-12 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-14T12:00:00Z'),
      successRate: 97.3,
      triggers: ['Producer lag > 1000ms', 'Topic throughput > threshold'],
      steps: [
        { id: '1', name: 'Analyze topic throughput patterns', status: 'pending' },
        { id: '2', name: 'Calculate optimal partition count', status: 'pending' },
        { id: '3', name: 'Create additional partitions', status: 'pending' },
        { id: '4', name: 'Rebalance consumer groups', status: 'pending' },
        { id: '5', name: 'Monitor partition distribution', status: 'pending' }
      ]
    },
    {
      id: 'kafka-2',
      name: 'Increase Broker Memory',
      database: 'kafka',
      description: 'Scale up broker memory allocation for better performance',
      category: 'Performance',
      estimatedDuration: '5-8 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-13T18:30:00Z'),
      successRate: 95.8,
      triggers: ['Memory usage > 85%', 'GC frequency increase'],
      steps: [
        { id: '1', name: 'Check current memory usage', status: 'pending' },
        { id: '2', name: 'Calculate memory requirements', status: 'pending' },
        { id: '3', name: 'Update broker configuration', status: 'pending' },
        { id: '4', name: 'Rolling restart brokers', status: 'pending' },
        { id: '5', name: 'Validate memory allocation', status: 'pending' }
      ]
    },
    {
      id: 'kafka-3',
      name: 'Optimize Consumer Lag',
      database: 'kafka',
      description: 'Resolve consumer lag issues and optimize consumption patterns',
      category: 'Optimization',
      estimatedDuration: '6-10 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-15T09:15:00Z'),
      successRate: 91.4,
      triggers: ['Consumer lag > 1000 messages', 'Processing time increase'],
      steps: [
        { id: '1', name: 'Identify lagging consumer groups', status: 'pending' },
        { id: '2', name: 'Analyze consumption patterns', status: 'pending' },
        { id: '3', name: 'Optimize consumer configuration', status: 'pending' },
        { id: '4', name: 'Reset consumer offsets if needed', status: 'pending' },
        { id: '5', name: 'Monitor lag reduction', status: 'pending' }
      ]
    }
  ],
  scylla: [
    {
      id: 'scylla-1',
      name: 'Scale Cluster Capacity',
      database: 'scylla',
      description: 'Add new nodes to ScyllaDB cluster for increased capacity',
      category: 'Scaling',
      estimatedDuration: '25-35 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-11T01:00:00Z'),
      successRate: 92.1,
      triggers: ['Disk usage > 80%', 'Read/write latency increase'],
      steps: [
        { id: '1', name: 'Provision new cluster nodes', status: 'pending' },
        { id: '2', name: 'Bootstrap nodes to cluster', status: 'pending' },
        { id: '3', name: 'Stream data to new nodes', status: 'pending' },
        { id: '4', name: 'Update replication strategy', status: 'pending' },
        { id: '5', name: 'Verify cluster consistency', status: 'pending' }
      ]
    },
    {
      id: 'scylla-2',
      name: 'Optimize Compaction Strategy',
      database: 'scylla',
      description: 'Tune compaction strategy for better write performance',
      category: 'Performance',
      estimatedDuration: '10-15 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-12T14:20:00Z'),
      successRate: 96.7,
      triggers: ['Write latency > 10ms', 'Compaction queue buildup'],
      steps: [
        { id: '1', name: 'Analyze current compaction metrics', status: 'pending' },
        { id: '2', name: 'Select optimal compaction strategy', status: 'pending' },
        { id: '3', name: 'Update table configurations', status: 'pending' },
        { id: '4', name: 'Trigger manual compaction', status: 'pending' },
        { id: '5', name: 'Monitor performance improvements', status: 'pending' }
      ]
    },
    {
      id: 'scylla-3',
      name: 'Increase Memory Cache',
      database: 'scylla',
      description: 'Expand memory cache allocation for better read performance',
      category: 'Performance',
      estimatedDuration: '4-6 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-14T11:30:00Z'),
      successRate: 98.3,
      triggers: ['Cache hit ratio < 85%', 'Read latency increase'],
      steps: [
        { id: '1', name: 'Check current cache utilization', status: 'pending' },
        { id: '2', name: 'Calculate optimal cache size', status: 'pending' },
        { id: '3', name: 'Update memory configuration', status: 'pending' },
        { id: '4', name: 'Restart ScyllaDB service', status: 'pending' },
        { id: '5', name: 'Validate cache performance', status: 'pending' }
      ]
    }
  ],
  mongodb: [
    {
      id: 'mongodb-1',
      name: 'Scale Replica Set',
      database: 'mongodb',
      description: 'Add additional replica set members for better read performance',
      category: 'Scaling',
      estimatedDuration: '15-20 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-14T06:30:00Z'),
      successRate: 99.1,
      triggers: ['Read latency > 100ms', 'Primary CPU > 80%'],
      steps: [
        { id: '1', name: 'Provision new replica member', status: 'pending' },
        { id: '2', name: 'Configure replica set member', status: 'pending' },
        { id: '3', name: 'Add member to replica set', status: 'pending' },
        { id: '4', name: 'Wait for initial sync', status: 'pending' },
        { id: '5', name: 'Verify replication health', status: 'pending' }
      ]
    },
    {
      id: 'mongodb-2',
      name: 'Optimize Index Usage',
      database: 'mongodb',
      description: 'Analyze and optimize database indexes for better query performance',
      category: 'Optimization',
      estimatedDuration: '8-12 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-13T20:15:00Z'),
      successRate: 94.6,
      triggers: ['Query execution time > 1s', 'Index usage efficiency < 70%'],
      steps: [
        { id: '1', name: 'Analyze query patterns', status: 'pending' },
        { id: '2', name: 'Identify missing indexes', status: 'pending' },
        { id: '3', name: 'Create recommended indexes', status: 'pending' },
        { id: '4', name: 'Drop unused indexes', status: 'pending' },
        { id: '5', name: 'Monitor query performance', status: 'pending' }
      ]
    },
    {
      id: 'mongodb-3',
      name: 'Increase Connection Pool',
      database: 'mongodb',
      description: 'Scale connection pool to handle increased application load',
      category: 'Performance',
      estimatedDuration: '3-5 minutes',
      status: 'idle',
      progress: 0,
      lastRun: new Date('2024-01-15T07:45:00Z'),
      successRate: 97.8,
      triggers: ['Connection pool exhaustion', 'Application timeout errors'],
      steps: [
        { id: '1', name: 'Check current connection usage', status: 'pending' },
        { id: '2', name: 'Calculate optimal pool size', status: 'pending' },
        { id: '3', name: 'Update connection pool configuration', status: 'pending' },
        { id: '4', name: 'Restart application connections', status: 'pending' }
      ]
    }
  ]
};

export default function ManualWorkflows() {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('redis');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const filteredWorkflows = mockEnhancedWorkflows[selectedDatabase]?.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'failed': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-muted/50 text-muted-foreground border-muted/20';
    }
  };

  const handleExecuteWorkflow = (workflowId: string) => {
    console.log('Executing workflow:', workflowId);
    // TODO: Implement workflow execution
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <DashboardHeader
        title="Manual Workflows"
        subtitle="Execute and monitor database maintenance and optimization workflows"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Search and Database Selection */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Database Type Selector */}
        <Tabs value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseType)}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-xl border border-border/50 shadow-sm">
            <TabsTrigger 
              value="redis" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/10 data-[state=active]:to-red-600/10 data-[state=active]:text-red-700 data-[state=active]:border-red-200 data-[state=active]:shadow-sm hover:bg-red-50/50 hover:text-red-600 hover:scale-105 animate-fade-in"
            >
              Redis
            </TabsTrigger>
            <TabsTrigger 
              value="mysql" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-blue-600/10 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 data-[state=active]:shadow-sm hover:bg-blue-50/50 hover:text-blue-600 hover:scale-105 animate-fade-in"
            >
              MySQL RDS
            </TabsTrigger>
            <TabsTrigger 
              value="clickhouse" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/10 data-[state=active]:to-yellow-600/10 data-[state=active]:text-yellow-700 data-[state=active]:border-yellow-200 data-[state=active]:shadow-sm hover:bg-yellow-50/50 hover:text-yellow-600 hover:scale-105 animate-fade-in"
            >
              ClickHouse
            </TabsTrigger>
            <TabsTrigger 
              value="kafka" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500/10 data-[state=active]:to-gray-600/10 data-[state=active]:text-gray-700 data-[state=active]:border-gray-200 data-[state=active]:shadow-sm hover:bg-gray-50/50 hover:text-gray-600 hover:scale-105 animate-fade-in"
            >
              Kafka
            </TabsTrigger>
            <TabsTrigger 
              value="scylla" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-purple-600/10 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 data-[state=active]:shadow-sm hover:bg-purple-50/50 hover:text-purple-600 hover:scale-105 animate-fade-in"
            >
              ScyllaDB
            </TabsTrigger>
            <TabsTrigger 
              value="mongodb" 
              className="text-xs font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/10 data-[state=active]:to-green-600/10 data-[state=active]:text-green-700 data-[state=active]:border-green-200 data-[state=active]:shadow-sm hover:bg-green-50/50 hover:text-green-600 hover:scale-105 animate-fade-in"
            >
              MongoDB
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Workflows Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {workflow.category}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(workflow.status)}`}
                    >
                      {getStatusIcon(workflow.status)}
                      {workflow.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExecuteWorkflow(workflow.id)}
                  disabled={workflow.status === 'running'}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Run
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {workflow.description}
              </p>

              {/* Progress Bar (if running) */}
              {workflow.status === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>
              )}

              {/* Workflow Steps */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Workflow Steps:</div>
                <div className="space-y-1">
                  {workflow.steps.slice(0, 3).map((step) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'running' ? 'bg-yellow-500' :
                        step.status === 'failed' ? 'bg-red-500' :
                        'bg-muted'
                      }`} />
                      <span className={`flex-1 ${
                        step.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {step.name}
                      </span>
                      {step.duration && (
                        <span className="text-muted-foreground">({step.duration})</span>
                      )}
                    </div>
                  ))}
                  {workflow.steps.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{workflow.steps.length - 3} more steps
                    </div>
                  )}
                </div>
              </div>

              {/* Triggers */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Triggers:</div>
                <div className="flex flex-wrap gap-1">
                  {workflow.triggers.slice(0, 2).map((trigger, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trigger}
                    </Badge>
                  ))}
                  {workflow.triggers.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{workflow.triggers.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                <span>Duration: {workflow.estimatedDuration}</span>
                <span>Success: {workflow.successRate}%</span>
              </div>
              
              {workflow.lastRun && (
                <div className="text-xs text-muted-foreground">
                  Last run: {workflow.lastRun.toLocaleDateString()} at {workflow.lastRun.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            No workflows found matching your search criteria.
          </div>
        </Card>
      )}
    </div>
  );
}