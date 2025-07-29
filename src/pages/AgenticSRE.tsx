import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Brain,
  TrendingUp,
  TrendingDown,
  Database,
  Send,
  Loader2,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockDatabaseOverviews } from '@/data/mockData';

interface AgenticWorkflow {
  id: string;
  name: string;
  database: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  description: string;
}

interface Anomaly {
  id: string;
  database: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  confidence: number;
}

const mockWorkflows: AgenticWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Auto-Scale Redis Cluster',
    database: 'Redis',
    status: 'running',
    progress: 65,
    startTime: new Date('2024-01-15T10:30:00Z'),
    estimatedCompletion: new Date('2024-01-15T10:45:00Z'),
    description: 'Automatically scaling Redis cluster based on CPU utilization metrics'
  },
  {
    id: 'wf-2',
    name: 'PostgreSQL Index Optimization',
    database: 'PostgreSQL',
    status: 'completed',
    progress: 100,
    startTime: new Date('2024-01-15T09:15:00Z'),
    description: 'Optimized slow-performing indexes on analytics database'
  },
  {
    id: 'wf-3',
    name: 'Kafka Topic Rebalancing',
    database: 'Kafka',
    status: 'queued',
    progress: 0,
    startTime: new Date('2024-01-15T11:00:00Z'),
    description: 'Rebalancing consumer groups for optimal partition distribution'
  }
];

const mockAnomalies: Anomaly[] = [
  {
    id: 'an-1',
    database: 'Redis',
    type: 'Memory Usage Spike',
    severity: 'high',
    description: 'Unusual memory consumption pattern detected in cluster redis-prod-03',
    detectedAt: new Date('2024-01-15T10:45:00Z'),
    confidence: 89
  },
  {
    id: 'an-2',
    database: 'PostgreSQL',
    type: 'Query Performance Degradation',
    severity: 'medium',
    description: 'SELECT queries on analytics table showing 300% slower response times',
    detectedAt: new Date('2024-01-15T09:30:00Z'),
    confidence: 76
  },
  {
    id: 'an-3',
    database: 'ClickHouse',
    type: 'Unusual Network Traffic',
    severity: 'low',
    description: 'Higher than normal cross-datacenter replication traffic',
    detectedAt: new Date('2024-01-15T08:20:00Z'),
    confidence: 65
  }
];

export default function AgenticSRE() {
  const [chatMessages, setChatMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Agentic SRE assistant. I can help you with database operations, anomaly analysis, and workflow automation. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState('All');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I understand you want to "${inputMessage}". Let me analyze the current state of your databases and provide recommendations. Based on the current metrics, I suggest running an optimization workflow for better performance.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const getStatusIcon = (status: AgenticWorkflow['status']) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-primary" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'queued': return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadgeVariant = (status: AgenticWorkflow['status']) => {
    switch (status) {
      case 'running': return 'default';
      case 'completed': return 'outline';
      case 'failed': return 'destructive';
      case 'queued': return 'secondary';
    }
  };

  const getSeverityColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-warning';
      case 'low': return 'text-blue-500';
    }
  };

  const filteredWorkflows = selectedDatabase === 'All' 
    ? mockWorkflows 
    : mockWorkflows.filter(w => w.database === selectedDatabase);

  const filteredAnomalies = selectedDatabase === 'All'
    ? mockAnomalies
    : mockAnomalies.filter(a => a.database === selectedDatabase);

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader
        title="Agentic SRE Console"
        subtitle="AI-powered Site Reliability Engineering automation and insights"
      />

      {/* Database Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...mockDatabaseOverviews.filter(db => db.activeCount > 0).map(db => db.name)].map((db) => (
          <Button
            key={db}
            variant={selectedDatabase === db ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDatabase(db)}
          >
            {db}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agentic Workflows Status */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Agentic Workflows Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredWorkflows.map((workflow) => (
              <div key={workflow.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <h4 className="font-medium">{workflow.name}</h4>
                  </div>
                  <Badge variant={getStatusBadgeVariant(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database: {workflow.database}</span>
                    <span>Progress: {workflow.progress}%</span>
                  </div>
                  
                  {workflow.status === 'running' && (
                    <Progress value={workflow.progress} className="h-2" />
                  )}
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Started: {workflow.startTime.toLocaleTimeString()}</span>
                    {workflow.estimatedCompletion && (
                      <span>ETA: {workflow.estimatedCompletion.toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredWorkflows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active workflows for selected database</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chatbot Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me about database operations, anomalies, or automation..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agentic Analytics Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Anomaly Detection & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAnomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-3 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-medium ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.type}
                    </h4>
                    <p className="text-xs text-muted-foreground">{anomaly.database}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {anomaly.confidence}% confidence
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{anomaly.description}</p>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Detected: {anomaly.detectedAt.toLocaleString()}</span>
                  <span className={`font-medium ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredAnomalies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No anomalies detected for selected database</p>
                <p className="text-xs">All systems operating normally</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}