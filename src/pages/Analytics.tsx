import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DatabaseType } from '@/types/database';

interface AnalyticsData {
  database: DatabaseType;
  name: string;
  metrics: {
    avgResponseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  };
  monthlyAlerts: {
    month: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  }[];
  alertFrequency: {
    type: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const mockAnalyticsData: AnalyticsData[] = [
  {
    database: 'redis',
    name: 'Redis',
    metrics: {
      avgResponseTime: 2.3,
      throughput: 150000,
      errorRate: 0.01,
      availability: 99.97
    },
    monthlyAlerts: [
      { month: 'Jan', critical: 2, high: 5, medium: 12, low: 8, total: 27 },
      { month: 'Dec', critical: 1, high: 3, medium: 15, low: 10, total: 29 },
      { month: 'Nov', critical: 0, high: 7, medium: 18, low: 12, total: 37 },
      { month: 'Oct', critical: 3, high: 4, medium: 14, low: 9, total: 30 }
    ],
    alertFrequency: [
      { type: 'Memory Usage High', count: 15, trend: 'up' },
      { type: 'Connection Pool Full', count: 8, trend: 'down' },
      { type: 'Slow Response Time', count: 12, trend: 'stable' },
      { type: 'Cache Miss Rate High', count: 6, trend: 'down' }
    ]
  },
  {
    database: 'mysql',
    name: 'MySQL RDS',
    metrics: {
      avgResponseTime: 45.6,
      throughput: 35000,
      errorRate: 0.002,
      availability: 99.95
    },
    monthlyAlerts: [
      { month: 'Jan', critical: 5, high: 8, medium: 22, low: 15, total: 50 },
      { month: 'Dec', critical: 3, high: 12, medium: 18, low: 20, total: 53 },
      { month: 'Nov', critical: 7, high: 15, medium: 25, low: 18, total: 65 },
      { month: 'Oct', critical: 4, high: 10, medium: 20, low: 16, total: 50 }
    ],
    alertFrequency: [
      { type: 'Connection Limit Reached', count: 25, trend: 'up' },
      { type: 'Lock Wait Timeout', count: 18, trend: 'stable' },
      { type: 'Slow Query Detected', count: 22, trend: 'down' },
      { type: 'Disk Space Low', count: 12, trend: 'up' }
    ]
  },
  {
    database: 'clickhouse',
    name: 'ClickHouse',
    metrics: {
      avgResponseTime: 123.4,
      throughput: 250000,
      errorRate: 0.001,
      availability: 99.99
    },
    monthlyAlerts: [
      { month: 'Jan', critical: 0, high: 2, medium: 5, low: 8, total: 15 },
      { month: 'Dec', critical: 1, high: 1, medium: 7, low: 6, total: 15 },
      { month: 'Nov', critical: 0, high: 3, medium: 8, low: 10, total: 21 },
      { month: 'Oct', critical: 2, high: 2, medium: 6, low: 7, total: 17 }
    ],
    alertFrequency: [
      { type: 'Large Query Timeout', count: 8, trend: 'stable' },
      { type: 'Partition Merge Slow', count: 5, trend: 'down' },
      { type: 'Memory Usage Spike', count: 12, trend: 'up' },
      { type: 'Replication Lag', count: 3, trend: 'stable' }
    ]
  },
  {
    database: 'kafka',
    name: 'Kafka',
    metrics: {
      avgResponseTime: 8.9,
      throughput: 500000,
      errorRate: 0.003,
      availability: 99.92
    },
    monthlyAlerts: [
      { month: 'Jan', critical: 1, high: 4, medium: 8, low: 12, total: 25 },
      { month: 'Dec', critical: 2, high: 6, medium: 10, low: 15, total: 33 },
      { month: 'Nov', critical: 3, high: 5, medium: 12, low: 18, total: 38 },
      { month: 'Oct', critical: 1, high: 7, medium: 9, low: 14, total: 31 }
    ],
    alertFrequency: [
      { type: 'Consumer Lag High', count: 20, trend: 'down' },
      { type: 'Broker Disk Full', count: 8, trend: 'stable' },
      { type: 'Replication Factor Low', count: 5, trend: 'up' },
      { type: 'Topic Partition Count', count: 12, trend: 'stable' }
    ]
  },
  {
    database: 'scylla',
    name: 'ScyllaDB',
    metrics: {
      avgResponseTime: 15.2,
      throughput: 120000,
      errorRate: 0.001,
      availability: 99.94
    },
    monthlyAlerts: [
      { month: 'Jan', critical: 0, high: 3, medium: 7, low: 10, total: 20 },
      { month: 'Dec', critical: 1, high: 2, medium: 9, low: 8, total: 20 },
      { month: 'Nov', critical: 2, high: 4, medium: 11, low: 12, total: 29 },
      { month: 'Oct', critical: 0, high: 5, medium: 8, low: 11, total: 24 }
    ],
    alertFrequency: [
      { type: 'Compaction Queue Long', count: 15, trend: 'down' },
      { type: 'Node Overload', count: 8, trend: 'stable' },
      { type: 'Read Timeout', count: 6, trend: 'up' },
      { type: 'Gossip State Sync', count: 4, trend: 'stable' }
    ]
  },
  {
    database: 'mongodb',
    name: 'MongoDB',
    metrics: {
      avgResponseTime: 0,
      throughput: 0,
      errorRate: 0,
      availability: 0
    },
    monthlyAlerts: [],
    alertFrequency: []
  }
];

export default function Analytics() {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('redis');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExportGrafana = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    
    // Create and download a mock CSV file
    const data = getCurrentDatabaseData();
    const csvContent = generateCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name}_metrics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getCurrentDatabaseData = () => {
    return mockAnalyticsData.find(db => db.database === selectedDatabase) || mockAnalyticsData[0];
  };

  const generateCSVContent = (data: AnalyticsData) => {
    const headers = ['Metric', 'Value', 'Unit'];
    const metrics = [
      ['Average Response Time', data.metrics.avgResponseTime.toString(), 'ms'],
      ['Throughput', data.metrics.throughput.toString(), 'ops/sec'],
      ['Error Rate', data.metrics.errorRate.toString(), '%'],
      ['Availability', data.metrics.availability.toString(), '%']
    ];

    const csvRows = [headers, ...metrics];
    return csvRows.map(row => row.join(',')).join('\n');
  };

  const currentData = getCurrentDatabaseData();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-muted-foreground bg-muted border-muted';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Analytics Dashboard"
          subtitle="Database performance metrics and alert analytics"
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <Button
          onClick={handleExportGrafana}
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Metrics'}
        </Button>
      </div>

      {/* Database Selection */}
      <Tabs value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseType)}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-gradient-to-r from-primary/5 to-purple-500/5 p-1 rounded-xl border border-primary/20 shadow-lg backdrop-blur-sm">
          <TabsTrigger value="redis" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/15 data-[state=active]:to-red-600/15 data-[state=active]:text-red-700 data-[state=active]:shadow-md hover:bg-red-50/50 hover:text-red-600 hover:scale-105 animate-scale-in">Redis</TabsTrigger>
          <TabsTrigger value="mysql" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/15 data-[state=active]:to-blue-600/15 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:bg-blue-50/50 hover:text-blue-600 hover:scale-105 animate-scale-in">MySQL RDS</TabsTrigger>
          <TabsTrigger value="clickhouse" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/15 data-[state=active]:to-yellow-600/15 data-[state=active]:text-yellow-700 data-[state=active]:shadow-md hover:bg-yellow-50/50 hover:text-yellow-600 hover:scale-105 animate-scale-in">ClickHouse</TabsTrigger>
          <TabsTrigger value="kafka" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500/15 data-[state=active]:to-gray-600/15 data-[state=active]:text-gray-700 data-[state=active]:shadow-md hover:bg-gray-50/50 hover:text-gray-600 hover:scale-105 animate-scale-in">Kafka</TabsTrigger>
          <TabsTrigger value="scylla" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/15 data-[state=active]:to-purple-600/15 data-[state=active]:text-purple-700 data-[state=active]:shadow-md hover:bg-purple-50/50 hover:text-purple-600 hover:scale-105 animate-scale-in">ScyllaDB</TabsTrigger>
          <TabsTrigger value="mongodb" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/15 data-[state=active]:to-green-600/15 data-[state=active]:text-green-700 data-[state=active]:shadow-md hover:bg-green-50/50 hover:text-green-600 hover:scale-105 animate-scale-in">MongoDB</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedDatabase} className="space-y-6">
          {currentData.database === 'mongodb' ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                MongoDB is not currently active. No analytics data available.
              </div>
            </Card>
          ) : (
            <>
              {/* Performance Metrics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentData.metrics.avgResponseTime}ms</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingDown className="inline h-3 w-3 text-green-500 mr-1" />
                      12% better than last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentData.metrics.throughput.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">operations/sec</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentData.metrics.errorRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingDown className="inline h-3 w-3 text-green-500 mr-1" />
                      5% improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentData.metrics.availability}%</div>
                    <p className="text-xs text-muted-foreground">
                      <CheckCircle className="inline h-3 w-3 text-green-500 mr-1" />
                      Target: 99.9%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Alert Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.monthlyAlerts.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="font-medium">{month.month} 2024</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              Critical: {month.critical}
                            </Badge>
                            <Badge variant="outline" className={getSeverityColor('high')}>
                              High: {month.high}
                            </Badge>
                            <Badge variant="outline" className={getSeverityColor('medium')}>
                              Medium: {month.medium}
                            </Badge>
                            <Badge variant="outline" className={getSeverityColor('low')}>
                              Low: {month.low}
                            </Badge>
                          </div>
                          <div className="font-semibold text-lg">
                            Total: {month.total}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert Frequency Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert Frequency by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.alertFrequency.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{alert.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {alert.count} occurrences
                          </span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(alert.trend)}
                            <span className="text-xs capitalize">{alert.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}