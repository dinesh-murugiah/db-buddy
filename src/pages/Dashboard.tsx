import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign,
  TrendingUp, 
  Server,
  Sparkles,
  Download
} from 'lucide-react';
import { DatabaseLandingCard } from '@/components/DatabaseLandingCard';
import { WorkflowCard } from '@/components/WorkflowCard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { mockDatabaseOverviews, mockWorkflows } from '@/data/mockData';
import { Workflow, DatabaseType } from '@/types/database';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Dashboard() {
  const [databases] = useState(mockDatabaseOverviews);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('redis');

  // Calculate overall stats
  const totalWeeklyCost = databases.reduce((sum, db) => sum + db.weeklyCost, 0);
  const totalInstances = databases.reduce((sum, db) => sum + db.activeCount, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleWorkflowExecute = (workflow: Workflow) => {
    console.log('Executing workflow:', workflow.name);
    // TODO: Implement workflow execution
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    const routes = [
      { path: '/', name: 'Dashboard' },
      { path: '/workflows', name: 'Manual Workflows' },
      { path: '/agentic-sre', name: 'Agentic SRE' },
      { path: '/analytics', name: 'Analytics' },
      { path: '/alerts', name: 'Alerts' },
      { path: '/knowledge-base', name: 'Knowledge Base' }
    ];

    setIsRefreshing(true);
    
    try {
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        
        // Navigate to route
        if (route.path !== '/') {
          window.history.pushState({}, '', route.path);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for page to load
        }

        // Capture screenshot
        const element = document.body;
        const canvas = await html2canvas(element, {
          height: window.innerHeight,
          width: window.innerWidth,
          scale: 0.5 // Reduce scale for better PDF size
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        
        // Add page title
        pdf.setFontSize(16);
        pdf.text(route.name, 20, 20);
        
        // Add image
        pdf.addImage(imgData, 'PNG', 10, 30, imgWidth - 20, imgHeight - 40);
      }

      // Navigate back to dashboard
      window.history.pushState({}, '', '/');
      
      // Download PDF
      pdf.save('db-buddy-pages.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <DashboardHeader
        title="Database Infrastructure Overview"
        subtitle="Comprehensive view of your database landscape and weekly costs"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* PDF Export Button */}
      <div className="flex justify-end">
        <Button 
          onClick={exportToPDF}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export All Pages to PDF
        </Button>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              Total Weekly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalWeeklyCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              8% reduction from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-success">
              <Server className="h-5 w-5" />
              Total Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInstances.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Across {databases.filter(db => db.activeCount > 0).length} database types
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.8%</div>
            <p className="text-sm text-muted-foreground">
              Overall system uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {databases.map((database) => (
          <DatabaseLandingCard key={database.type} database={database} />
        ))}
      </div>
    </div>
  );
}