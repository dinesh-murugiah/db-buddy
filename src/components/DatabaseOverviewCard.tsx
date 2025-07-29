import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  BarChart3, 
  Workflow, 
  Zap, 
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  HardDrive,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DatabaseOverview, Alert } from '@/types/database';
import { cn } from '@/lib/utils';

interface DatabaseOverviewCardProps {
  database: DatabaseOverview;
}

const iconMap = {
  Database,
  BarChart3,
  Workflow,
  Zap,
  Leaf
};

const getHealthColor = (healthy: number, warning: number, unhealthy: number) => {
  if (unhealthy > 0) return 'text-destructive';
  if (warning > 0) return 'text-warning';
  return 'text-success';
};

const getHealthBadgeVariant = (severity: Alert['severity']) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function DatabaseOverviewCard({ database }: DatabaseOverviewCardProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const Icon = iconMap[database.icon as keyof typeof iconMap] || Database;
  
  const unresolved = database.alerts.filter(alert => !alert.resolved);
  const totalInstances = database.activeCount;
  const healthPercentage = (database.healthyCount / totalInstances) * 100;

  return (
    <Card className="group relative overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{database.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{totalInstances} instances</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unresolved.length > 0 && (
              <Badge 
                variant="destructive" 
                className="h-6 px-2 text-xs animate-pulse-slow"
              >
                {unresolved.length}
              </Badge>
            )}
            <div className={cn("flex items-center gap-1", getHealthColor(database.healthyCount, database.warningCount, database.unhealthyCount))}>
              {database.unhealthyCount > 0 ? (
                <XCircle className="h-4 w-4" />
              ) : database.warningCount > 0 ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Health Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Health Status</span>
            <span className="font-medium">{Math.round(healthPercentage)}%</span>
          </div>
          <Progress value={healthPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" />
              {database.healthyCount} healthy
            </span>
            {database.warningCount > 0 && (
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                {database.warningCount} warning
              </span>
            )}
            {database.unhealthyCount > 0 && (
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-destructive" />
                {database.unhealthyCount} error
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              Connections
            </div>
            <p className="text-sm font-medium">{database.metrics.connections.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Response Time
            </div>
            <p className="text-sm font-medium">{database.metrics.responseTime}ms</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cpu className="h-3 w-3" />
              Memory
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{database.metrics.memoryUsage.toFixed(1)}%</p>
              <Progress value={database.metrics.memoryUsage} className="h-1 flex-1" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              Disk
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{database.metrics.diskUsage.toFixed(1)}%</p>
              <Progress value={database.metrics.diskUsage} className="h-1 flex-1" />
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {unresolved.length > 0 && (
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlerts(!showAlerts)}
              className="w-full justify-between p-0 h-auto"
            >
              <span className="text-xs text-muted-foreground">
                {unresolved.length} active alert{unresolved.length !== 1 ? 's' : ''}
              </span>
              {showAlerts ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            
            {showAlerts && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {unresolved.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2 rounded-md bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-start gap-2">
                      <Badge
                        variant={getHealthBadgeVariant(alert.severity)}
                        className="text-xs h-4 px-1"
                      >
                        {alert.severity}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {unresolved.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{unresolved.length - 3} more alerts
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}