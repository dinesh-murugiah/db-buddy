import { DatabaseOverview, Alert, Workflow, DatabaseType } from '@/types/database';

export const mockDatabaseOverviews: DatabaseOverview[] = [
  {
    type: 'redis',
    name: 'Redis',
    activeCount: 12,
    healthyCount: 10,
    unhealthyCount: 1,
    warningCount: 1,
    alerts: [
      {
        id: '1',
        severity: 'medium',
        message: 'High memory usage detected on redis-cluster-03',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        database: 'redis',
        resolved: false
      }
    ],
    metrics: {
      connections: 1547,
      memoryUsage: 78.5,
      diskUsage: 45.2,
      responseTime: 2.3,
      throughput: 15000,
      errorRate: 0.01
    },
    icon: 'Database',
    color: 'hsl(var(--db-redis))'
  },
  {
    type: 'postgres',
    name: 'PostgreSQL',
    activeCount: 8,
    healthyCount: 7,
    unhealthyCount: 0,
    warningCount: 1,
    alerts: [
      {
        id: '2',
        severity: 'low',
        message: 'Slow query detected in analytics database',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        database: 'postgres',
        resolved: false
      }
    ],
    metrics: {
      connections: 892,
      memoryUsage: 65.3,
      diskUsage: 82.1,
      responseTime: 45.6,
      throughput: 3500,
      errorRate: 0.002
    },
    icon: 'Database',
    color: 'hsl(var(--db-postgres))'
  },
  {
    type: 'clickhouse',
    name: 'ClickHouse',
    activeCount: 6,
    healthyCount: 6,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [],
    metrics: {
      connections: 234,
      memoryUsage: 52.7,
      diskUsage: 67.8,
      responseTime: 123.4,
      throughput: 25000,
      errorRate: 0.001
    },
    icon: 'BarChart3',
    color: 'hsl(var(--db-clickhouse))'
  },
  {
    type: 'kafka',
    name: 'Apache Kafka',
    activeCount: 9,
    healthyCount: 8,
    unhealthyCount: 1,
    warningCount: 0,
    alerts: [
      {
        id: '3',
        severity: 'high',
        message: 'Consumer lag increasing on topic user-events',
        timestamp: new Date('2024-01-15T11:45:00Z'),
        database: 'kafka',
        resolved: false
      }
    ],
    metrics: {
      connections: 456,
      memoryUsage: 71.2,
      diskUsage: 34.5,
      responseTime: 8.9,
      throughput: 50000,
      errorRate: 0.003
    },
    icon: 'Workflow',
    color: 'hsl(var(--db-kafka))'
  },
  {
    type: 'scylla',
    name: 'ScyllaDB',
    activeCount: 4,
    healthyCount: 4,
    unhealthyCount: 0,
    warningCount: 0,
    alerts: [],
    metrics: {
      connections: 178,
      memoryUsage: 58.9,
      diskUsage: 76.3,
      responseTime: 15.2,
      throughput: 12000,
      errorRate: 0.001
    },
    icon: 'Zap',
    color: 'hsl(var(--db-scylla))'
  },
  {
    type: 'mongodb',
    name: 'MongoDB',
    activeCount: 7,
    healthyCount: 6,
    unhealthyCount: 0,
    warningCount: 1,
    alerts: [
      {
        id: '4',
        severity: 'medium',
        message: 'Index optimization needed for products collection',
        timestamp: new Date('2024-01-15T08:20:00Z'),
        database: 'mongodb',
        resolved: false
      }
    ],
    metrics: {
      connections: 623,
      memoryUsage: 69.4,
      diskUsage: 89.1,
      responseTime: 32.1,
      throughput: 8500,
      errorRate: 0.004
    },
    icon: 'Leaf',
    color: 'hsl(var(--db-mongo))'
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