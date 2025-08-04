import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DatabaseType } from '@/types/database';

interface Alert {
  id: string;
  database: DatabaseType;
  databaseName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  source: string;
  affectedInstances: string[];
}

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    database: 'mysql',
    databaseName: 'MySQL RDS',
    severity: 'critical',
    title: 'Database Connection Limit Reached',
    description: 'RDS instance rds-prod-02 has reached maximum connection limit (100/100). New connections are being rejected.',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    resolved: false,
    source: 'CloudWatch',
    affectedInstances: ['rds-prod-02']
  },
  {
    id: 'alert-2',
    database: 'mysql',
    databaseName: 'MySQL RDS',
    severity: 'critical',
    title: 'High CPU Usage',
    description: 'CPU usage on rds-analytics-01 has been above 90% for the last 15 minutes.',
    timestamp: new Date('2024-01-15T11:30:00Z'),
    resolved: false,
    source: 'CloudWatch',
    affectedInstances: ['rds-analytics-01']
  },
  {
    id: 'alert-3',
    database: 'redis',
    databaseName: 'Redis',
    severity: 'medium',
    title: 'High Memory Usage',
    description: 'Memory usage on redis-cluster-03 is at 87% and approaching the warning threshold.',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    resolved: false,
    source: 'Redis Metrics',
    affectedInstances: ['redis-cluster-03']
  },
  {
    id: 'alert-4',
    database: 'kafka',
    databaseName: 'Kafka',
    severity: 'medium',
    title: 'Consumer Lag Detected',
    description: 'Consumer group user-analytics has accumulated lag of 1,247 messages on topic user-events.',
    timestamp: new Date('2024-01-15T11:45:00Z'),
    resolved: false,
    source: 'Kafka Manager',
    affectedInstances: ['kafka-broker-01', 'kafka-broker-02']
  },
  {
    id: 'alert-5',
    database: 'clickhouse',
    databaseName: 'ClickHouse',
    severity: 'high',
    title: 'Large Query Running',
    description: 'A query on the events table has been running for over 10 minutes and is consuming significant resources.',
    timestamp: new Date('2024-01-15T12:20:00Z'),
    resolved: false,
    source: 'ClickHouse System Tables',
    affectedInstances: ['clickhouse-node-01']
  },
  {
    id: 'alert-6',
    database: 'scylla',
    databaseName: 'ScyllaDB',
    severity: 'low',
    title: 'Node Repair Needed',
    description: 'Node scylla-03 has not been repaired in the last 7 days. Scheduled repair recommended.',
    timestamp: new Date('2024-01-15T06:00:00Z'),
    resolved: false,
    source: 'ScyllaDB Monitoring',
    affectedInstances: ['scylla-03']
  },

  // Resolved Alerts
  {
    id: 'alert-7',
    database: 'redis',
    databaseName: 'Redis',
    severity: 'low',
    title: 'Connection Pool Optimization',
    description: 'Connection pool optimization completed successfully on redis-cluster-01.',
    timestamp: new Date('2024-01-14T14:20:00Z'),
    resolved: true,
    resolvedAt: new Date('2024-01-14T14:25:00Z'),
    resolvedBy: 'Auto-remediation',
    source: 'Redis Metrics',
    affectedInstances: ['redis-cluster-01']
  },
  {
    id: 'alert-8',
    database: 'mysql',
    databaseName: 'MySQL RDS',
    severity: 'medium',
    title: 'Slow Query Performance',
    description: 'Query optimization completed for analytics queries. Average execution time reduced by 45%.',
    timestamp: new Date('2024-01-14T16:45:00Z'),
    resolved: true,
    resolvedAt: new Date('2024-01-14T17:10:00Z'),
    resolvedBy: 'DBA Team',
    source: 'Query Monitor',
    affectedInstances: ['rds-analytics-01']
  },
  {
    id: 'alert-9',
    database: 'kafka',
    databaseName: 'Kafka',
    severity: 'high',
    title: 'Broker Restart Required',
    description: 'Kafka broker kafka-broker-02 required restart due to memory leak. Successfully restarted.',
    timestamp: new Date('2024-01-14T18:30:00Z'),
    resolved: true,
    resolvedAt: new Date('2024-01-14T18:45:00Z'),
    resolvedBy: 'Infrastructure Team',
    source: 'Kafka JMX',
    affectedInstances: ['kafka-broker-02']
  },
  {
    id: 'alert-10',
    database: 'scylla',
    databaseName: 'ScyllaDB',
    severity: 'medium',
    title: 'Compaction Process',
    description: 'Major compaction completed successfully on user_data keyspace. Storage optimized.',
    timestamp: new Date('2024-01-14T20:15:00Z'),
    resolved: true,
    resolvedAt: new Date('2024-01-14T20:45:00Z'),
    resolvedBy: 'Scheduled Task',
    source: 'ScyllaDB Logs',
    affectedInstances: ['scylla-01', 'scylla-02']
  },
  {
    id: 'alert-11',
    database: 'clickhouse',
    databaseName: 'ClickHouse',
    severity: 'low',
    title: 'Table Optimization',
    description: 'Table optimization completed for events table. Partition structure improved.',
    timestamp: new Date('2024-01-14T22:00:00Z'),
    resolved: true,
    resolvedAt: new Date('2024-01-14T22:30:00Z'),
    resolvedBy: 'Auto-optimization',
    source: 'ClickHouse Monitor',
    affectedInstances: ['clickhouse-node-01', 'clickhouse-node-02']
  }
];

export default function Alerts() {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getFilteredAlerts = (resolved: boolean) => {
    return mockAlerts.filter(alert => {
      const matchesResolved = alert.resolved === resolved;
      const matchesDatabase = selectedDatabase === 'all' || alert.database === selectedDatabase;
      return matchesResolved && matchesDatabase;
    });
  };

  const activeAlerts = getFilteredAlerts(false);
  const resolvedAlerts = getFilteredAlerts(true);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'outline border-orange-500 text-orange-700 bg-orange-50';
      case 'medium': return 'outline border-yellow-500 text-yellow-700 bg-yellow-50';
      case 'low': return 'outline border-blue-500 text-blue-700 bg-blue-50';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <Database className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <DashboardHeader
        title="Alerts Dashboard"
        subtitle="Monitor active and resolved database alerts across all systems"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Database Filter */}
      <Tabs value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseType | 'all')}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 p-1 rounded-xl border border-amber-200/50 dark:border-amber-800/50 shadow-lg backdrop-blur-sm">
          <TabsTrigger value="all" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/15 data-[state=active]:to-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-primary/5 hover:text-primary hover:scale-105 animate-fade-in">All</TabsTrigger>
          <TabsTrigger value="redis" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/15 data-[state=active]:to-red-600/15 data-[state=active]:text-red-700 data-[state=active]:shadow-md hover:bg-red-50/50 hover:text-red-600 hover:scale-105 animate-fade-in">Redis</TabsTrigger>
          <TabsTrigger value="mysql" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/15 data-[state=active]:to-blue-600/15 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:bg-blue-50/50 hover:text-blue-600 hover:scale-105 animate-fade-in">MySQL RDS</TabsTrigger>
          <TabsTrigger value="clickhouse" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/15 data-[state=active]:to-yellow-600/15 data-[state=active]:text-yellow-700 data-[state=active]:shadow-md hover:bg-yellow-50/50 hover:text-yellow-600 hover:scale-105 animate-fade-in">ClickHouse</TabsTrigger>
          <TabsTrigger value="kafka" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500/15 data-[state=active]:to-gray-600/15 data-[state=active]:text-gray-700 data-[state=active]:shadow-md hover:bg-gray-50/50 hover:text-gray-600 hover:scale-105 animate-fade-in">Kafka</TabsTrigger>
          <TabsTrigger value="scylla" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/15 data-[state=active]:to-purple-600/15 data-[state=active]:text-purple-700 data-[state=active]:shadow-md hover:bg-purple-50/50 hover:text-purple-600 hover:scale-105 animate-fade-in">ScyllaDB</TabsTrigger>
          <TabsTrigger value="mongodb" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/15 data-[state=active]:to-green-600/15 data-[state=active]:text-green-700 data-[state=active]:shadow-md hover:bg-green-50/50 hover:text-green-600 hover:scale-105 animate-fade-in">MongoDB</TabsTrigger>
        </TabsList>

        {/* Alert Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeAlerts.filter(a => a.severity === 'critical').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeAlerts.filter(a => a.severity === 'high').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-600">Medium Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeAlerts.filter(a => a.severity === 'medium').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resolvedAlerts.filter(a => {
                  const today = new Date();
                  const alertDate = a.resolvedAt || a.timestamp;
                  return alertDate.toDateString() === today.toDateString();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Lists */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border border-slate-200 dark:border-slate-700 shadow-md rounded-lg p-1">
            <TabsTrigger 
              value="active" 
              className="font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/10 data-[state=active]:to-orange-500/10 data-[state=active]:text-red-700 data-[state=active]:border data-[state=active]:border-red-200 data-[state=active]:shadow-sm hover:bg-red-50/30 hover:text-red-600 hover:scale-105 animate-fade-in"
            >
              🚨 Active Alerts ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="resolved" 
              className="font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/10 data-[state=active]:to-emerald-500/10 data-[state=active]:text-green-700 data-[state=active]:border data-[state=active]:border-green-200 data-[state=active]:shadow-sm hover:bg-green-50/30 hover:text-green-600 hover:scale-105 animate-fade-in"
            >
              ✅ Recently Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAlerts.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-lg font-medium">No Active Alerts</div>
                <div className="text-muted-foreground">
                  All systems are operating normally.
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity) as any} className="capitalize">
                              {getSeverityIcon(alert.severity)}
                              <span className="ml-1">{alert.severity}</span>
                            </Badge>
                            <Badge variant="outline">{alert.databaseName}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {getTimeSince(alert.timestamp)}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Source: {alert.source}</span>
                        <span>Time: {formatTime(alert.timestamp)}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-medium">Affected Instances:</div>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedInstances.map((instance, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {instance}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedAlerts.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  No recently resolved alerts.
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {resolvedAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-green-500 opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                            <Badge variant={getSeverityColor(alert.severity) as any} className="capitalize">
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.databaseName}</Badge>
                          </div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Resolved by: {alert.resolvedBy}</span>
                        <span>Resolved: {alert.resolvedAt ? formatTime(alert.resolvedAt) : 'Unknown'}</span>
                        <span>Duration: {alert.resolvedAt ? 
                          Math.floor((alert.resolvedAt.getTime() - alert.timestamp.getTime()) / 60000) + 'm' : 
                          'Unknown'
                        }</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-medium">Affected Instances:</div>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedInstances.map((instance, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {instance}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Tabs>
    </div>
  );
}