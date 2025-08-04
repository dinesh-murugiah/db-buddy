import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatabaseType } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface DynamicWorkflowFormProps {
  database: DatabaseType;
  operationType: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const DynamicWorkflowForm = ({ database, operationType, onSubmit, isLoading }: DynamicWorkflowFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(formData).length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      database,
      operationType,
      ...formData
    });
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderFormFields = () => {
    if (operationType === 'migration') {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceHost">Source Host</Label>
              <Input
                id="sourceHost"
                placeholder="source.database.com"
                value={formData.sourceHost || ''}
                onChange={(e) => updateFormData('sourceHost', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourcePort">Source Port</Label>
              <Input
                id="sourcePort"
                type="number"
                placeholder="5432"
                value={formData.sourcePort || ''}
                onChange={(e) => updateFormData('sourcePort', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetHost">Target Host</Label>
              <Input
                id="targetHost"
                placeholder="target.database.com"
                value={formData.targetHost || ''}
                onChange={(e) => updateFormData('targetHost', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPort">Target Port</Label>
              <Input
                id="targetPort"
                type="number"
                placeholder="5432"
                value={formData.targetPort || ''}
                onChange={(e) => updateFormData('targetPort', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="migrationStrategy">Migration Strategy</Label>
            <Select value={formData.migrationStrategy || ''} onValueChange={(value) => updateFormData('migrationStrategy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select migration strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Migration</SelectItem>
                <SelectItem value="incremental">Incremental Migration</SelectItem>
                <SelectItem value="snapshot">Snapshot Migration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    if (operationType === 'upstep') {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentVersion">Current Version</Label>
              <Input
                id="currentVersion"
                placeholder="14.9"
                value={formData.currentVersion || ''}
                onChange={(e) => updateFormData('currentVersion', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetVersion">Target Version</Label>
              <Input
                id="targetVersion"
                placeholder="15.4"
                value={formData.targetVersion || ''}
                onChange={(e) => updateFormData('targetVersion', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="upgradeType">Upgrade Type</Label>
            <Select value={formData.upgradeType || ''} onValueChange={(value) => updateFormData('upgradeType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select upgrade type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major Version Upgrade</SelectItem>
                <SelectItem value="minor">Minor Version Upgrade</SelectItem>
                <SelectItem value="patch">Patch Upgrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="downtime">Maintenance Window (hours)</Label>
            <Input
              id="downtime"
              type="number"
              placeholder="2"
              value={formData.downtime || ''}
              onChange={(e) => updateFormData('downtime', e.target.value)}
            />
          </div>
        </>
      );
    }

    if (operationType === 'creation') {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instanceName">Instance Name</Label>
              <Input
                id="instanceName"
                placeholder="my-database-instance"
                value={formData.instanceName || ''}
                onChange={(e) => updateFormData('instanceName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instanceSize">Instance Size</Label>
              <Select value={formData.instanceSize || ''} onValueChange={(value) => updateFormData('instanceSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instance size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (2 vCPU, 4GB RAM)</SelectItem>
                  <SelectItem value="medium">Medium (4 vCPU, 8GB RAM)</SelectItem>
                  <SelectItem value="large">Large (8 vCPU, 16GB RAM)</SelectItem>
                  <SelectItem value="xlarge">X-Large (16 vCPU, 32GB RAM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storageSize">Storage Size (GB)</Label>
              <Input
                id="storageSize"
                type="number"
                placeholder="100"
                value={formData.storageSize || ''}
                onChange={(e) => updateFormData('storageSize', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select value={formData.environment || ''} onValueChange={(value) => updateFormData('environment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      );
    }

    if (operationType === 'modification') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="modificationType">Modification Type</Label>
            <Select value={formData.modificationType || ''} onValueChange={(value) => updateFormData('modificationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select modification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scaling">Scale Resources</SelectItem>
                <SelectItem value="configuration">Update Configuration</SelectItem>
                <SelectItem value="security">Security Updates</SelectItem>
                <SelectItem value="performance">Performance Tuning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Modification Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the modifications to be made..."
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="impact">Expected Impact</Label>
            <Select value={formData.impact || ''} onValueChange={(value) => updateFormData('impact', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select expected impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - No downtime expected</SelectItem>
                <SelectItem value="medium">Medium - Brief downtime possible</SelectItem>
                <SelectItem value="high">High - Extended downtime required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    return null;
  };

  const getDatabaseIcon = (db: DatabaseType) => {
    const icons = {
      redis: '🔴',
      postgres: '🐘',
      clickhouse: '⚡',
      kafka: '🔄',
      scylla: '⚛️',
      mongodb: '🍃'
    };
    return icons[db] || '💾';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getDatabaseIcon(database)}</span>
          Start {operationType.charAt(0).toUpperCase() + operationType.slice(1)} - {database.charAt(0).toUpperCase() + database.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Starting...' : `Start ${operationType}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};