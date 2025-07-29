import { DatabaseOverview, Alert, Workflow, DatabaseType } from '@/types/database';

export const mockDatabaseOverviews: DatabaseOverview[] = [
  {
    type: 'redis',
    name: 'Redis',
    activeCount: 700,
    healthyCount: 700,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [
      {
        id: '1',
        severity: 'medium',
        message: 'High memory usage detected on redis-cluster-03',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        database: 'redis',
        resolved: false
      },
      {
        id: '1-resolved',
        severity: 'low',
        message: 'Connection pool optimization completed',
        timestamp: new Date('2024-01-14T14:20:00Z'),
        database: 'redis',
        resolved: true
      }
    ],
    metrics: {
      connections: 15470,
      memoryUsage: 68.5,
      diskUsage: 45.2,
      responseTime: 2.3,
      throughput: 150000,
      errorRate: 0.01
    },
    icon: 'Database',
    color: 'hsl(var(--db-redis))',
    weeklyCost: 15420
  },
  {
    type: 'postgres',
    name: 'RDS (PostgreSQL)',
    activeCount: 2500,
    healthyCount: 2498,
    unhealthyCount: 2,
    warningCount: 0,
    alerts: [
      {
        id: '2',
        severity: 'critical',
        message: 'Database connection limit reached on rds-prod-02',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        database: 'postgres',
        resolved: false
      },
      {
        id: '2-critical',
        severity: 'critical',
        message: 'High CPU usage on rds-analytics-01',
        timestamp: new Date('2024-01-15T11:30:00Z'),
        database: 'postgres',
        resolved: false
      },
      {
        id: '2-resolved',
        severity: 'medium',
        message: 'Slow query optimization completed',
        timestamp: new Date('2024-01-14T16:45:00Z'),
        database: 'postgres',
        resolved: true
      }
    ],
    metrics: {
      connections: 89200,
      memoryUsage: 75.3,
      diskUsage: 82.1,
      responseTime: 45.6,
      throughput: 35000,
      errorRate: 0.002
    },
    icon: 'Database',
    color: 'hsl(var(--db-postgres))',
    weeklyCost: 89500
  },
  {
    type: 'clickhouse',
    name: 'ClickHouse',
    activeCount: 20,
    healthyCount: 20,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [
      {
        id: '3-resolved',
        severity: 'low',
        message: 'Table optimization completed for events table',
        timestamp: new Date('2024-01-14T22:00:00Z'),
        database: 'clickhouse',
        resolved: true
      }
    ],
    metrics: {
      connections: 2340,
      memoryUsage: 52.7,
      diskUsage: 67.8,
      responseTime: 123.4,
      throughput: 250000,
      errorRate: 0.001
    },
    icon: 'BarChart3',
    color: 'hsl(var(--db-clickhouse))',
    weeklyCost: 8900
  },
  {
    type: 'kafka',
    name: 'Apache Kafka',
    activeCount: 5,
    healthyCount: 5,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [
      {
        id: '4',
        severity: 'medium',
        message: 'Consumer lag detected on user-events topic',
        timestamp: new Date('2024-01-15T11:45:00Z'),
        database: 'kafka',
        resolved: false
      },
      {
        id: '4-resolved',
        severity: 'high',
        message: 'Broker restart completed successfully',
        timestamp: new Date('2024-01-14T18:30:00Z'),
        database: 'kafka',
        resolved: true
      }
    ],
    metrics: {
      connections: 4560,
      memoryUsage: 71.2,
      diskUsage: 34.5,
      responseTime: 8.9,
      throughput: 500000,
      errorRate: 0.003
    },
    icon: 'Workflow',
    color: 'hsl(var(--db-kafka))',
    weeklyCost: 3200
  },
  {
    type: 'scylla',
    name: 'ScyllaDB',
    activeCount: 15,
    healthyCount: 15,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [
      {
        id: '5-resolved',
        severity: 'medium',
        message: 'Compaction process completed successfully',
        timestamp: new Date('2024-01-14T20:15:00Z'),
        database: 'scylla',
        resolved: true
      }
    ],
    metrics: {
      connections: 1780,
      memoryUsage: 58.9,
      diskUsage: 76.3,
      responseTime: 15.2,
      throughput: 120000,
      errorRate: 0.001
    },
    icon: 'Zap',
    color: 'hsl(var(--db-scylla))',
    weeklyCost: 7800
  },
  {
    type: 'mongodb',
    name: 'MongoDB',
    activeCount: 0,
    healthyCount: 0,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [],
    metrics: {
      connections: 0,
      memoryUsage: 0,
      diskUsage: 0,
      responseTime: 0,
      throughput: 0,
      errorRate: 0
    },
    icon: 'Leaf',
    color: 'hsl(var(--db-mongo))',
    weeklyCost: 0
  }
];

export const mockWorkflows: Record<DatabaseType, Workflow[]> = {
  redis: [
    {
      id: 'redis-1',
      name: 'Cache Cleanup',
      database: 'redis',
      description: 'Remove expired keys and optimize memory usage',
      category: 'Maintenance',
      estimatedDuration: '5-10 minutes',
      parameters: [
        {
          name: 'instance',
          type: 'select',
          required: true,
          description: 'Redis instance to clean',
          options: ['redis-cluster-01', 'redis-cluster-02', 'redis-cluster-03']
        },
        {
          name: 'dryRun',
          type: 'boolean',
          required: false,
          description: 'Preview changes without executing',
          defaultValue: true
        }
      ],
      lastRun: new Date('2024-01-14T15:30:00Z'),
      successRate: 98.5
    },
    {
      id: 'redis-2',
      name: 'Backup Creation',
      database: 'redis',
      description: 'Create a point-in-time backup of Redis data',
      category: 'Backup',
      estimatedDuration: '2-5 minutes',
      parameters: [
        {
          name: 'instances',
          type: 'select',
          required: true,
          description: 'Select instances to backup',
          options: ['All', 'redis-cluster-01', 'redis-cluster-02', 'redis-cluster-03']
        },
        {
          name: 'compression',
          type: 'boolean',
          required: false,
          description: 'Compress backup files',
          defaultValue: true
        }
      ],
      lastRun: new Date('2024-01-15T02:00:00Z'),
      successRate: 99.2
    }
  ],
  postgres: [
    {
      id: 'postgres-1',
      name: 'Index Maintenance',
      database: 'postgres',
      description: 'Rebuild and optimize database indexes',
      category: 'Performance',
      estimatedDuration: '15-30 minutes',
      parameters: [
        {
          name: 'database',
          type: 'select',
          required: true,
          description: 'Target database',
          options: ['users', 'analytics', 'orders', 'inventory']
        },
        {
          name: 'reindexConcurrently',
          type: 'boolean',
          required: false,
          description: 'Use concurrent reindexing',
          defaultValue: true
        }
      ],
      lastRun: new Date('2024-01-13T03:00:00Z'),
      successRate: 94.7
    }
  ],
  clickhouse: [
    {
      id: 'clickhouse-1',
      name: 'Table Optimization',
      database: 'clickhouse',
      description: 'Optimize table partitions and remove outdated data',
      category: 'Maintenance',
      estimatedDuration: '10-20 minutes',
      parameters: [
        {
          name: 'table',
          type: 'select',
          required: true,
          description: 'Table to optimize',
          options: ['events', 'metrics', 'logs', 'user_analytics']
        },
        {
          name: 'retentionDays',
          type: 'number',
          required: true,
          description: 'Data retention period in days',
          defaultValue: 90,
          min: 1,
          max: 365
        }
      ],
      lastRun: new Date('2024-01-12T04:00:00Z'),
      successRate: 96.8
    }
  ],
  kafka: [
    {
      id: 'kafka-1',
      name: 'Topic Cleanup',
      database: 'kafka',
      description: 'Clean up old messages and optimize topic partitions',
      category: 'Maintenance',
      estimatedDuration: '5-15 minutes',
      parameters: [
        {
          name: 'topic',
          type: 'select',
          required: true,
          description: 'Topic to clean',
          options: ['user-events', 'system-logs', 'metrics', 'notifications']
        },
        {
          name: 'retentionHours',
          type: 'number',
          required: true,
          description: 'Message retention in hours',
          defaultValue: 168,
          min: 1,
          max: 8760
        }
      ],
      lastRun: new Date('2024-01-14T12:00:00Z'),
      successRate: 97.3
    }
  ],
  scylla: [
    {
      id: 'scylla-1',
      name: 'Compaction',
      database: 'scylla',
      description: 'Run major compaction to optimize storage',
      category: 'Performance',
      estimatedDuration: '20-45 minutes',
      parameters: [
        {
          name: 'keyspace',
          type: 'select',
          required: true,
          description: 'Keyspace to compact',
          options: ['user_data', 'session_store', 'time_series']
        },
        {
          name: 'parallelCompaction',
          type: 'boolean',
          required: false,
          description: 'Enable parallel compaction',
          defaultValue: true
        }
      ],
      lastRun: new Date('2024-01-11T01:00:00Z'),
      successRate: 92.1
    }
  ],
  mongodb: [
    {
      id: 'mongodb-1',
      name: 'Index Analysis',
      database: 'mongodb',
      description: 'Analyze and suggest index optimizations',
      category: 'Performance',
      estimatedDuration: '5-10 minutes',
      parameters: [
        {
          name: 'collection',
          type: 'select',
          required: true,
          description: 'Collection to analyze',
          options: ['users', 'products', 'orders', 'reviews']
        },
        {
          name: 'sampleSize',
          type: 'number',
          required: false,
          description: 'Sample size for analysis',
          defaultValue: 1000,
          min: 100,
          max: 10000
        }
      ],
      lastRun: new Date('2024-01-14T06:30:00Z'),
      successRate: 99.1
    }
  ]
};