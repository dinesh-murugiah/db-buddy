import { useState } from 'react';
import { Search, Book, Database, MessageSquare, Lightbulb, ExternalLink, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DatabaseType } from '@/types/database';

interface KnowledgeBaseEntry {
  id: string;
  title: string;
  category: 'confluence' | 'incident' | 'best-practice' | 'troubleshooting';
  database: DatabaseType;
  content: string;
  tags: string[];
  lastUpdated: Date;
  author: string;
  relevanceScore: number;
  source: string;
}

interface RAGInsight {
  id: string;
  query: string;
  database: DatabaseType;
  insights: string[];
  recommendations: string[];
  relatedEntries: KnowledgeBaseEntry[];
  confidence: number;
  timestamp: Date;
}

const mockKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'kb-1',
    title: 'Redis Memory Optimization Best Practices',
    category: 'best-practice',
    database: 'redis',
    content: 'Configure memory policies appropriately: Use allkeys-lru for cache scenarios, volatile-lru for mixed workloads. Set maxmemory-samples to 10 for better eviction precision.',
    tags: ['memory', 'optimization', 'performance', 'eviction'],
    lastUpdated: new Date('2024-01-10T10:00:00Z'),
    author: 'Sarah Chen - Redis Expert',
    relevanceScore: 0.95,
    source: 'Confluence - Database Best Practices'
  },
  {
    id: 'kb-2',
    title: 'PostgreSQL Connection Pool Exhaustion Incident',
    category: 'incident',
    database: 'postgres',
    content: 'Production incident on 2024-01-08: RDS instance reached connection limit due to connection leak in application code. Resolution: Implemented connection timeout and proper connection cleanup.',
    tags: ['connections', 'incident', 'production', 'rds'],
    lastUpdated: new Date('2024-01-08T16:30:00Z'),
    author: 'DevOps Team',
    relevanceScore: 0.88,
    source: 'Incident Report #INC-2024-001'
  },
  {
    id: 'kb-3',
    title: 'ClickHouse Query Performance Troubleshooting',
    category: 'troubleshooting',
    database: 'clickhouse',
    content: 'For slow queries: Check partition pruning effectiveness, ensure proper ORDER BY clause matches query patterns, consider using SAMPLE clause for large datasets.',
    tags: ['performance', 'queries', 'optimization', 'partitions'],
    lastUpdated: new Date('2024-01-12T14:20:00Z'),
    author: 'Analytics Team',
    relevanceScore: 0.92,
    source: 'Confluence - ClickHouse Troubleshooting Guide'
  },
  {
    id: 'kb-4',
    title: 'Kafka Consumer Lag Resolution Process',
    category: 'troubleshooting',
    database: 'kafka',
    content: 'Step-by-step process: 1) Identify lagging consumers, 2) Check consumer configuration, 3) Increase partition count if needed, 4) Optimize consumer processing logic, 5) Consider parallel processing.',
    tags: ['consumer-lag', 'performance', 'troubleshooting', 'partitions'],
    lastUpdated: new Date('2024-01-14T09:15:00Z'),
    author: 'Streaming Team',
    relevanceScore: 0.90,
    source: 'Runbook - Kafka Operations'
  },
  {
    id: 'kb-5',
    title: 'ScyllaDB Compaction Strategy Configuration',
    category: 'best-practice',
    database: 'scylla',
    content: 'Choose compaction strategy based on workload: SizeTieredCompactionStrategy for write-heavy, LeveledCompactionStrategy for read-heavy, TimeWindowCompactionStrategy for time-series data.',
    tags: ['compaction', 'configuration', 'performance', 'workload'],
    lastUpdated: new Date('2024-01-11T11:45:00Z'),
    author: 'Database Team',
    relevanceScore: 0.87,
    source: 'Confluence - ScyllaDB Configuration Guide'
  }
];

const mockRAGInsights: RAGInsight[] = [
  {
    id: 'insight-1',
    query: 'Redis memory usage high',
    database: 'redis',
    insights: [
      'Current memory usage at 87% indicates approaching eviction threshold',
      'Historical incidents show memory spikes typically occur during peak traffic hours',
      'Last similar incident was resolved by implementing key expiration policies'
    ],
    recommendations: [
      'Implement allkeys-lru eviction policy for better memory management',
      'Consider scaling up memory allocation or adding more Redis instances',
      'Review key patterns and implement TTL for temporary data',
      'Monitor memory fragmentation and schedule regular defragmentation'
    ],
    relatedEntries: [mockKnowledgeBase[0]],
    confidence: 0.94,
    timestamp: new Date('2024-01-15T10:30:00Z')
  }
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType | 'all'>('all');
  const [ragQuery, setRagQuery] = useState('');
  const [ragResults, setRagResults] = useState<RAGInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleRAGQuery = async () => {
    if (!ragQuery.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate RAG processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock RAG response
    const mockInsight: RAGInsight = {
      id: `insight-${Date.now()}`,
      query: ragQuery,
      database: selectedDatabase === 'all' ? 'redis' : selectedDatabase,
      insights: [
        `Analysis of your query: "${ragQuery}"`,
        'Based on historical data and confluence documentation, here are key findings',
        'Similar issues have been encountered 3 times in the past 6 months'
      ],
      recommendations: [
        'Apply proven solution from incident #INC-2024-001',
        'Follow best practices documented in confluence',
        'Consider implementing monitoring for early detection',
        'Schedule regular maintenance based on historical patterns'
      ],
      relatedEntries: mockKnowledgeBase.filter(entry => 
        selectedDatabase === 'all' || entry.database === selectedDatabase
      ).slice(0, 2),
      confidence: 0.89,
      timestamp: new Date()
    };
    
    setRagResults([mockInsight, ...ragResults]);
    setIsProcessing(false);
    setRagQuery('');
  };

  const getFilteredEntries = () => {
    return mockKnowledgeBase.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDatabase = selectedDatabase === 'all' || entry.database === selectedDatabase;
      return matchesSearch && matchesDatabase;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'confluence': return <Book className="h-4 w-4" />;
      case 'incident': return <MessageSquare className="h-4 w-4" />;
      case 'best-practice': return <Lightbulb className="h-4 w-4" />;
      case 'troubleshooting': return <Database className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'confluence': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'incident': return 'bg-red-50 text-red-700 border-red-200';
      case 'best-practice': return 'bg-green-50 text-green-700 border-green-200';
      case 'troubleshooting': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <DashboardHeader
        title="Knowledge Base"
        subtitle="AI-powered insights from confluence documentation and incident history"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Database Filter */}
      <Tabs value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseType | 'all')}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 p-1 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg backdrop-blur-sm">
          <TabsTrigger value="all" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/15 data-[state=active]:to-purple-500/15 data-[state=active]:text-indigo-700 data-[state=active]:shadow-md hover:bg-indigo-50/50 hover:text-indigo-600 hover:scale-105 animate-scale-in">🧠 All</TabsTrigger>
          <TabsTrigger value="redis" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/15 data-[state=active]:to-red-600/15 data-[state=active]:text-red-700 data-[state=active]:shadow-md hover:bg-red-50/50 hover:text-red-600 hover:scale-105 animate-scale-in">🔴 Redis</TabsTrigger>
          <TabsTrigger value="postgres" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/15 data-[state=active]:to-blue-600/15 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:bg-blue-50/50 hover:text-blue-600 hover:scale-105 animate-scale-in">🐘 PostgreSQL</TabsTrigger>
          <TabsTrigger value="clickhouse" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/15 data-[state=active]:to-yellow-600/15 data-[state=active]:text-yellow-700 data-[state=active]:shadow-md hover:bg-yellow-50/50 hover:text-yellow-600 hover:scale-105 animate-scale-in">⚡ ClickHouse</TabsTrigger>
          <TabsTrigger value="kafka" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500/15 data-[state=active]:to-gray-600/15 data-[state=active]:text-gray-700 data-[state=active]:shadow-md hover:bg-gray-50/50 hover:text-gray-600 hover:scale-105 animate-scale-in">📊 Kafka</TabsTrigger>
          <TabsTrigger value="scylla" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/15 data-[state=active]:to-purple-600/15 data-[state=active]:text-purple-700 data-[state=active]:shadow-md hover:bg-purple-50/50 hover:text-purple-600 hover:scale-105 animate-scale-in">⚡ ScyllaDB</TabsTrigger>
          <TabsTrigger value="mongodb" className="font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/15 data-[state=active]:to-green-600/15 data-[state=active]:text-green-700 data-[state=active]:shadow-md hover:bg-green-50/50 hover:text-green-600 hover:scale-105 animate-scale-in">🍃 MongoDB</TabsTrigger>
        </TabsList>

        {/* Agentic RAG Section */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Agentic RAG Assistant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask questions about database issues and get AI-powered insights from your knowledge base
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about database issues, best practices, or troubleshooting steps..."
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="min-h-[60px]"
              />
              <Button 
                onClick={handleRAGQuery}
                disabled={isProcessing || !ragQuery.trim()}
                className="px-6"
              >
                {isProcessing ? 'Processing...' : 'Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RAG Results */}
        {ragResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Insights & Recommendations</h3>
            {ragResults.map((result) => (
              <Card key={result.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Query: "{result.query}"</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{result.database}</Badge>
                        <Badge variant="outline" className="text-green-700 bg-green-50">
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Insights:</h4>
                    <ul className="space-y-1">
                      {result.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.relatedEntries.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Related Knowledge Base Entries:</h4>
                      <div className="space-y-2">
                        {result.relatedEntries.map((entry) => (
                          <div key={entry.id} className="p-2 bg-muted/50 rounded border">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={getCategoryColor(entry.category)}>
                                {getCategoryIcon(entry.category)}
                                <span className="ml-1 capitalize">{entry.category}</span>
                              </Badge>
                              <span className="text-sm font-medium">{entry.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {entry.content.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Knowledge Base Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Knowledge Base Entries */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredEntries().map((entry) => (
              <Card key={entry.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getCategoryColor(entry.category)}>
                          {getCategoryIcon(entry.category)}
                          <span className="ml-1 capitalize">{entry.category}</span>
                        </Badge>
                        <Badge variant="outline">{entry.database}</Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {entry.title}
                      </CardTitle>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {entry.content}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{entry.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
                    <span>{entry.author}</span>
                    <span>{entry.lastUpdated.toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Relevance: {Math.round(entry.relevanceScore * 100)}%
                    </span>
                    <span className="text-muted-foreground">
                      {entry.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFilteredEntries().length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                No knowledge base entries found matching your criteria.
              </div>
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  );
}