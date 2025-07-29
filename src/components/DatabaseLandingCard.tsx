import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  BarChart3, 
  Workflow, 
  Zap, 
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  MapPin,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DatabaseOverview, Alert } from '@/types/database';
import { cn } from '@/lib/utils';

interface DatabaseLandingCardProps {
  database: DatabaseOverview;
}

const iconMap = {
  Database,
  BarChart3,
  Workflow,
  Zap,
  Leaf
};

const regionData = {
  'us-east-1': { count: 120, alerts: 0 },
  'us-west-2': { count: 95, alerts: 1 },
  'eu-west-1': { count: 80, alerts: 0 },
  'ap-south-1': { count: 45, alerts: 0 }
};

export function DatabaseLandingCard({ database }: DatabaseLandingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = iconMap[database.icon as keyof typeof iconMap] || Database;
  
  const activeAlerts = database.alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = database.alerts.filter(alert => alert.resolved);

  const getStatusIcon = () => {
    if (database.unhealthyCount > 0) return <XCircle className="h-5 w-5 text-destructive" />;
    if (database.warningCount > 0) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <CheckCircle className="h-5 w-5 text-success" />;
  };

  const getStatusColor = () => {
    if (database.unhealthyCount > 0) return 'border-destructive/20 bg-destructive/5';
    if (database.warningCount > 0) return 'border-warning/20 bg-warning/5';
    return 'border-success/20 bg-success/5';
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-lg cursor-pointer",
        "bg-gradient-to-br from-card via-card to-muted/30",
        getStatusColor()
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "transition-transform duration-500 preserve-3d",
        isFlipped && "rotate-y-180"
      )}>
        {/* Front Side */}
        <div className={cn("backface-hidden", isFlipped && "absolute inset-0")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{database.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {database.activeCount === 0 ? 'Not deployed yet' : `${database.activeCount} instances`}
                  </p>
                </div>
              </div>
              {getStatusIcon()}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {database.activeCount > 0 ? (
              <>
                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Instances</p>
                    <p className="text-2xl font-bold">{database.activeCount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Healthy</p>
                    <p className="text-2xl font-bold text-success">{database.healthyCount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Alerts & Cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{activeAlerts.length}</p>
                      {activeAlerts.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {activeAlerts.filter(a => a.severity === 'critical').length} critical
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Weekly Cost
                    </p>
                    <p className="text-xl font-bold">${database.weeklyCost.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quick Health Indicator */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Health Status</span>
                    <span className="flex items-center gap-1">
                      {Math.round((database.healthyCount / database.activeCount) * 100)}%
                      {getStatusIcon()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No instances deployed</p>
                <p className="text-sm text-muted-foreground/70">Ready for deployment</p>
              </div>
            )}

            {/* Flip Indicator */}
            <div className="flex items-center justify-center pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                Click for regional view
                <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          </CardContent>
        </div>

        {/* Back Side - Regional Data */}
        <div className={cn(
          "backface-hidden rotate-y-180 absolute inset-0",
          !isFlipped && "hidden"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {database.name} - Regional View
                </CardTitle>
                <p className="text-sm text-muted-foreground">Distribution across regions</p>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {database.activeCount > 0 ? (
              <>
                {/* Regional Distribution */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Regional Distribution</h4>
                  {Object.entries(regionData).map(([region, data]) => (
                    <div key={region} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{region}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(data.count / database.activeCount * 100 * 100) / 100}% of total</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Math.round(data.count / 100 * database.activeCount)}</p>
                        {data.alerts > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {data.alerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resolved Alerts */}
                {resolvedAlerts.length > 0 && (
                  <div className="space-y-3 pt-2 border-t">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recently Resolved ({resolvedAlerts.length})
                    </h4>
                    {resolvedAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-2 rounded-lg bg-success/5 border border-success/20">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">
                              Resolved: {alert.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No regional data available</p>
                <p className="text-sm text-muted-foreground/70">Deploy instances to see regional distribution</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}