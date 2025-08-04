import { DatabaseType } from '@/types/database';

export interface MaintenanceWorkflow {
  id: string;
  name: string;
  type: 'migration' | 'upstep' | 'creation' | 'modification';
  database: DatabaseType;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  steps: WorkflowStep[];
  description: string;
  estimatedDuration: string;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  description: string;
  duration?: number;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  logs: LogEntry[];
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

export const mockMaintenanceWorkflows: MaintenanceWorkflow[] = [
  // Redis Workflows
  {
    id: 'redis-migration-001',
    name: 'Redis 6.x to 7.x Migration',
    type: 'migration',
    database: 'redis',
    status: 'running',
    progress: 65,
    description: 'Migrate Redis cluster from version 6.x to 7.x with zero downtime',
    estimatedDuration: '2h 30m',
    startedAt: new Date(Date.now() - 90 * 60000),
    steps: [
      {
        id: 'step-1',
        name: 'Pre-migration Validation',
        status: 'completed',
        description: 'Validate cluster health and backup status',
        duration: 300,
        startedAt: new Date(Date.now() - 90 * 60000),
        completedAt: new Date(Date.now() - 85 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 90 * 60000), level: 'info', message: 'Starting pre-migration validation' },
          { timestamp: new Date(Date.now() - 87 * 60000), level: 'info', message: 'Cluster health check: PASSED' },
          { timestamp: new Date(Date.now() - 85 * 60000), level: 'info', message: 'Backup verification: PASSED' }
        ]
      },
      {
        id: 'step-2',
        name: 'Create Backup',
        status: 'completed',
        description: 'Create full cluster backup',
        duration: 1200,
        startedAt: new Date(Date.now() - 85 * 60000),
        completedAt: new Date(Date.now() - 65 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 85 * 60000), level: 'info', message: 'Initiating cluster backup' },
          { timestamp: new Date(Date.now() - 75 * 60000), level: 'info', message: 'Backup progress: 50%' },
          { timestamp: new Date(Date.now() - 65 * 60000), level: 'info', message: 'Backup completed successfully' }
        ]
      },
      {
        id: 'step-3',
        name: 'Update Redis Nodes',
        status: 'running',
        description: 'Rolling update of Redis nodes',
        startedAt: new Date(Date.now() - 65 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 65 * 60000), level: 'info', message: 'Starting rolling update' },
          { timestamp: new Date(Date.now() - 50 * 60000), level: 'info', message: 'Updated node 1/6' },
          { timestamp: new Date(Date.now() - 35 * 60000), level: 'info', message: 'Updated node 2/6' },
          { timestamp: new Date(Date.now() - 20 * 60000), level: 'info', message: 'Updated node 3/6' },
          { timestamp: new Date(Date.now() - 5 * 60000), level: 'info', message: 'Updating node 4/6...' }
        ]
      },
      {
        id: 'step-4',
        name: 'Post-migration Validation',
        status: 'pending',
        description: 'Validate cluster functionality after migration',
        logs: []
      }
    ]
  },
  {
    id: 'redis-upstep-001',
    name: 'Redis Memory Optimization',
    type: 'upstep',
    database: 'redis',
    status: 'completed',
    progress: 100,
    description: 'Optimize Redis memory usage and configuration',
    estimatedDuration: '45m',
    startedAt: new Date(Date.now() - 120 * 60000),
    completedAt: new Date(Date.now() - 75 * 60000),
    steps: [
      {
        id: 'step-1',
        name: 'Memory Analysis',
        status: 'completed',
        description: 'Analyze current memory usage patterns',
        duration: 900,
        startedAt: new Date(Date.now() - 120 * 60000),
        completedAt: new Date(Date.now() - 105 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 120 * 60000), level: 'info', message: 'Starting memory analysis' },
          { timestamp: new Date(Date.now() - 105 * 60000), level: 'info', message: 'Memory analysis completed' }
        ]
      },
      {
        id: 'step-2',
        name: 'Apply Optimizations',
        status: 'completed',
        description: 'Apply memory optimization configurations',
        duration: 1800,
        startedAt: new Date(Date.now() - 105 * 60000),
        completedAt: new Date(Date.now() - 75 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 105 * 60000), level: 'info', message: 'Applying memory optimizations' },
          { timestamp: new Date(Date.now() - 75 * 60000), level: 'info', message: 'Optimizations applied successfully' }
        ]
      }
    ]
  },
  // MySQL RDS Workflows
  {
    id: 'mysql-migration-001',
    name: 'MySQL RDS 8.0 to 8.4 Migration',
    type: 'migration',
    database: 'mysql',
    status: 'failed',
    progress: 30,
    description: 'Migrate MySQL RDS from version 8.0 to 8.4',
    estimatedDuration: '3h 0m',
    startedAt: new Date(Date.now() - 180 * 60000),
    errorMessage: 'Extension compatibility check failed',
    steps: [
      {
        id: 'step-1',
        name: 'Pre-migration Checks',
        status: 'completed',
        description: 'Run pre-migration compatibility checks',
        duration: 600,
        startedAt: new Date(Date.now() - 180 * 60000),
        completedAt: new Date(Date.now() - 170 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 180 * 60000), level: 'info', message: 'Starting pre-migration checks' },
          { timestamp: new Date(Date.now() - 170 * 60000), level: 'info', message: 'Pre-migration checks completed' }
        ]
      },
      {
        id: 'step-2',
        name: 'Extension Compatibility',
        status: 'failed',
        description: 'Check extension compatibility with PostgreSQL 15',
        startedAt: new Date(Date.now() - 170 * 60000),
        errorMessage: 'Extension "custom_analytics" is not compatible with PostgreSQL 15',
        logs: [
          { timestamp: new Date(Date.now() - 170 * 60000), level: 'info', message: 'Checking extension compatibility' },
          { timestamp: new Date(Date.now() - 160 * 60000), level: 'warning', message: 'Found potentially incompatible extensions' },
          { timestamp: new Date(Date.now() - 150 * 60000), level: 'error', message: 'Extension "custom_analytics" is not compatible with PostgreSQL 15' }
        ]
      },
      {
        id: 'step-3',
        name: 'Database Migration',
        status: 'pending',
        description: 'Perform the actual database migration',
        logs: []
      }
    ]
  },
  // ClickHouse Workflows
  {
    id: 'clickhouse-creation-001',
    name: 'Analytics Cluster Setup',
    type: 'creation',
    database: 'clickhouse',
    status: 'running',
    progress: 40,
    description: 'Create new ClickHouse cluster for analytics workload',
    estimatedDuration: '1h 45m',
    startedAt: new Date(Date.now() - 60 * 60000),
    steps: [
      {
        id: 'step-1',
        name: 'Infrastructure Provisioning',
        status: 'completed',
        description: 'Provision compute and storage infrastructure',
        duration: 1800,
        startedAt: new Date(Date.now() - 60 * 60000),
        completedAt: new Date(Date.now() - 30 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 60 * 60000), level: 'info', message: 'Starting infrastructure provisioning' },
          { timestamp: new Date(Date.now() - 30 * 60000), level: 'info', message: 'Infrastructure provisioned successfully' }
        ]
      },
      {
        id: 'step-2',
        name: 'ClickHouse Installation',
        status: 'running',
        description: 'Install and configure ClickHouse nodes',
        startedAt: new Date(Date.now() - 30 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 30 * 60000), level: 'info', message: 'Starting ClickHouse installation' },
          { timestamp: new Date(Date.now() - 15 * 60000), level: 'info', message: 'Installed ClickHouse on node 1/3' },
          { timestamp: new Date(Date.now() - 5 * 60000), level: 'info', message: 'Installing ClickHouse on node 2/3...' }
        ]
      },
      {
        id: 'step-3',
        name: 'Cluster Configuration',
        status: 'pending',
        description: 'Configure cluster settings and replication',
        logs: []
      }
    ]
  },
  // MongoDB Workflows
  {
    id: 'mongodb-modification-001',
    name: 'Sharding Configuration Update',
    type: 'modification',
    database: 'mongodb',
    status: 'completed',
    progress: 100,
    description: 'Update MongoDB sharding configuration for better performance',
    estimatedDuration: '2h 15m',
    startedAt: new Date(Date.now() - 180 * 60000),
    completedAt: new Date(Date.now() - 45 * 60000),
    steps: [
      {
        id: 'step-1',
        name: 'Shard Analysis',
        status: 'completed',
        description: 'Analyze current shard distribution',
        duration: 1200,
        startedAt: new Date(Date.now() - 180 * 60000),
        completedAt: new Date(Date.now() - 160 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 180 * 60000), level: 'info', message: 'Starting shard analysis' },
          { timestamp: new Date(Date.now() - 160 * 60000), level: 'info', message: 'Shard analysis completed' }
        ]
      },
      {
        id: 'step-2',
        name: 'Rebalance Shards',
        status: 'completed',
        description: 'Rebalance data across shards',
        duration: 6300,
        startedAt: new Date(Date.now() - 160 * 60000),
        completedAt: new Date(Date.now() - 55 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 160 * 60000), level: 'info', message: 'Starting shard rebalancing' },
          { timestamp: new Date(Date.now() - 120 * 60000), level: 'info', message: 'Rebalancing progress: 25%' },
          { timestamp: new Date(Date.now() - 90 * 60000), level: 'info', message: 'Rebalancing progress: 50%' },
          { timestamp: new Date(Date.now() - 70 * 60000), level: 'info', message: 'Rebalancing progress: 75%' },
          { timestamp: new Date(Date.now() - 55 * 60000), level: 'info', message: 'Shard rebalancing completed' }
        ]
      },
      {
        id: 'step-3',
        name: 'Configuration Update',
        status: 'completed',
        description: 'Update shard configuration settings',
        duration: 600,
        startedAt: new Date(Date.now() - 55 * 60000),
        completedAt: new Date(Date.now() - 45 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 55 * 60000), level: 'info', message: 'Updating shard configuration' },
          { timestamp: new Date(Date.now() - 45 * 60000), level: 'info', message: 'Configuration updated successfully' }
        ]
      }
    ]
  },
  // Kafka Workflows
  {
    id: 'kafka-upstep-001',
    name: 'Topic Partition Optimization',
    type: 'upstep',
    database: 'kafka',
    status: 'idle',
    progress: 0,
    description: 'Optimize Kafka topic partitions for better throughput',
    estimatedDuration: '1h 30m',
    steps: [
      {
        id: 'step-1',
        name: 'Partition Analysis',
        status: 'pending',
        description: 'Analyze current partition distribution and usage',
        logs: []
      },
      {
        id: 'step-2',
        name: 'Rebalance Topics',
        status: 'pending',
        description: 'Rebalance topic partitions across brokers',
        logs: []
      },
      {
        id: 'step-3',
        name: 'Validation',
        status: 'pending',
        description: 'Validate partition optimization results',
        logs: []
      }
    ]
  },
  // ScyllaDB Workflows
  {
    id: 'scylla-migration-001',
    name: 'Cassandra to ScyllaDB Migration',
    type: 'migration',
    database: 'scylla',
    status: 'running',
    progress: 75,
    description: 'Migrate data from Cassandra to ScyllaDB cluster',
    estimatedDuration: '4h 0m',
    startedAt: new Date(Date.now() - 210 * 60000),
    steps: [
      {
        id: 'step-1',
        name: 'Schema Migration',
        status: 'completed',
        description: 'Migrate database schema to ScyllaDB',
        duration: 900,
        startedAt: new Date(Date.now() - 210 * 60000),
        completedAt: new Date(Date.now() - 195 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 210 * 60000), level: 'info', message: 'Starting schema migration' },
          { timestamp: new Date(Date.now() - 195 * 60000), level: 'info', message: 'Schema migration completed' }
        ]
      },
      {
        id: 'step-2',
        name: 'Data Migration',
        status: 'running',
        description: 'Migrate data from Cassandra to ScyllaDB',
        startedAt: new Date(Date.now() - 195 * 60000),
        logs: [
          { timestamp: new Date(Date.now() - 195 * 60000), level: 'info', message: 'Starting data migration' },
          { timestamp: new Date(Date.now() - 150 * 60000), level: 'info', message: 'Data migration progress: 25%' },
          { timestamp: new Date(Date.now() - 120 * 60000), level: 'info', message: 'Data migration progress: 50%' },
          { timestamp: new Date(Date.now() - 60 * 60000), level: 'info', message: 'Data migration progress: 75%' },
          { timestamp: new Date(Date.now() - 10 * 60000), level: 'info', message: 'Data migration progress: 85%' }
        ]
      },
      {
        id: 'step-3',
        name: 'Data Validation',
        status: 'pending',
        description: 'Validate migrated data integrity',
        logs: []
      }
    ]
  }
];