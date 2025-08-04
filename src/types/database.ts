export interface DatabaseOverview {
  type: DatabaseType;
  name: string;
  activeCount: number;
  healthyCount: number;
  unhealthyCount: number;
  warningCount: number;
  alerts: Alert[];
  metrics: DatabaseMetrics;
  icon: string;
  color: string;
  weeklyCost: number;
}

export interface DatabaseMetrics {
  connections: number;
  memoryUsage: number;
  diskUsage: number;
  responseTime: number;
  throughput?: number;
  errorRate?: number;
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  database: string;
  resolved: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  database: DatabaseType;
  description: string;
  category: string;
  parameters: Parameter[];
  estimatedDuration: string;
  lastRun?: Date;
  successRate?: number;
}

export interface Parameter {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'file';
  required: boolean;
  description: string;
  options?: string[];
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  startTime: Date;
  endTime?: Date;
  progress: number;
  logs: ExecutionLog[];
  parameters: Record<string, any>;
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

export type DatabaseType = 'redis' | 'mysql' | 'clickhouse' | 'kafka' | 'scylla' | 'mongodb';

export type HealthStatus = 'healthy' | 'warning' | 'error' | 'unknown';