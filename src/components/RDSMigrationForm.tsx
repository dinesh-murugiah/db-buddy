import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

interface RDSMigrationData {
  S_DBIdentifier: string;
  T_DBIdentifier: string;
  SR_DBIdentifier: string;
  DBSubnetGroupName: string;
  AvailabilityZone: string;
  isTargetMaster: boolean;
  isTargetMultiAZOnly: boolean;
  Perf_Insights: boolean;
  dbuser: string;
  S_Paramfile: string;
  dbpassword: string;
  port: number;
  T_EngineVersion: string;
  replica_user: string;
  DBInstanceClass: string;
  replica_password: string;
  Major_Upgrade: boolean;
  Major_param_file: string;
  UpgradeStorageConfig: boolean;
  S_option_grp: string;
  S_emailId: string;
  fun1: string;
  fun2: string;
  fun3: string;
  fun4: string;
  fun5: string;
  fun6: string;
  fun7: string;
  fun8: string;
  index_create_flag: boolean;
  jump_ec2_instance_id: string;
  db_list: string[];
  Input_Indexes: string[];
  warmup_flag: boolean;
  warmup_limits: Array<{ min_tbl_size: number; tab_limit: number }>;
  ignore_tables_warmup: string[];
  S3_bucket_warmup: string;
  ARN_SM_warmup: string;
  secret_warmup: Record<string, any>;
}

interface RDSMigrationFormProps {
  onSubmit: (data: RDSMigrationData) => void;
  isLoading?: boolean;
}

export const RDSMigrationForm = ({ onSubmit, isLoading }: RDSMigrationFormProps) => {
  const [formData, setFormData] = useState<RDSMigrationData>({
    S_DBIdentifier: 'loadtesting-delight-green-84-test-dnd',
    T_DBIdentifier: 'loadtesting-delight-green-84-test-dnd-new',
    SR_DBIdentifier: '',
    DBSubnetGroupName: 'freshdesk-staging-main',
    AvailabilityZone: 'us-east-1d',
    isTargetMaster: true,
    isTargetMultiAZOnly: false,
    Perf_Insights: true,
    dbuser: 'root',
    S_Paramfile: '',
    dbpassword: '7co7WB22',
    port: 3306,
    T_EngineVersion: '8.4.5',
    replica_user: 'repl_user',
    DBInstanceClass: 'db.r6g.large',
    replica_password: 'GVHojahU',
    Major_Upgrade: true,
    Major_param_file: 'version84',
    UpgradeStorageConfig: false,
    S_option_grp: 'default:mysql-8-4',
    S_emailId: 'dhanasekar.ravindran@freshworks.com',
    fun1: 'UpgradePhase1-06052024',
    fun2: 'UpgradePhase2-06052024',
    fun3: 'UpgradePhase3-06052024',
    fun4: 'UpgradePhase4-06052024',
    fun5: 'UpgradePhase5-06052024',
    fun6: 'UpgradePhase6-06052024',
    fun7: 'UpgradePhase7-06052024',
    fun8: 'UpgradePhase8-06052024',
    index_create_flag: false,
    jump_ec2_instance_id: '',
    db_list: [],
    Input_Indexes: [],
    warmup_flag: false,
    warmup_limits: [{ min_tbl_size: 6, tab_limit: 1 }],
    ignore_tables_warmup: [],
    S3_bucket_warmup: '',
    ARN_SM_warmup: '',
    secret_warmup: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast({
      title: "Migration Started",
      description: "RDS migration workflow has been initiated successfully.",
    });
  };

  const updateField = (field: keyof RDSMigrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RDS Migration Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Config</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="functions">Functions</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="s_db">Source DB Identifier</Label>
                  <Input
                    id="s_db"
                    value={formData.S_DBIdentifier}
                    onChange={(e) => updateField('S_DBIdentifier', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t_db">Target DB Identifier</Label>
                  <Input
                    id="t_db"
                    value={formData.T_DBIdentifier}
                    onChange={(e) => updateField('T_DBIdentifier', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subnet">DB Subnet Group</Label>
                  <Input
                    id="subnet"
                    value={formData.DBSubnetGroupName}
                    onChange={(e) => updateField('DBSubnetGroupName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="az">Availability Zone</Label>
                  <Select value={formData.AvailabilityZone} onValueChange={(value) => updateField('AvailabilityZone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1a">us-east-1a</SelectItem>
                      <SelectItem value="us-east-1b">us-east-1b</SelectItem>
                      <SelectItem value="us-east-1c">us-east-1c</SelectItem>
                      <SelectItem value="us-east-1d">us-east-1d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="target-master"
                    checked={formData.isTargetMaster}
                    onCheckedChange={(checked) => updateField('isTargetMaster', checked)}
                  />
                  <Label htmlFor="target-master">Target Master</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="multi-az"
                    checked={formData.isTargetMultiAZOnly}
                    onCheckedChange={(checked) => updateField('isTargetMultiAZOnly', checked)}
                  />
                  <Label htmlFor="multi-az">Multi-AZ Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perf-insights"
                    checked={formData.Perf_Insights}
                    onCheckedChange={(checked) => updateField('Perf_Insights', checked)}
                  />
                  <Label htmlFor="perf-insights">Performance Insights</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dbuser">DB User</Label>
                  <Input
                    id="dbuser"
                    value={formData.dbuser}
                    onChange={(e) => updateField('dbuser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbpassword">DB Password</Label>
                  <Input
                    id="dbpassword"
                    type="password"
                    value={formData.dbpassword}
                    onChange={(e) => updateField('dbpassword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => updateField('port', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engine">Engine Version</Label>
                  <Input
                    id="engine"
                    value={formData.T_EngineVersion}
                    onChange={(e) => updateField('T_EngineVersion', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replica-user">Replica User</Label>
                  <Input
                    id="replica-user"
                    value={formData.replica_user}
                    onChange={(e) => updateField('replica_user', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replica-password">Replica Password</Label>
                  <Input
                    id="replica-password"
                    type="password"
                    value={formData.replica_password}
                    onChange={(e) => updateField('replica_password', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instance-class">DB Instance Class</Label>
                <Select value={formData.DBInstanceClass} onValueChange={(value) => updateField('DBInstanceClass', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="db.r6g.large">db.r6g.large</SelectItem>
                    <SelectItem value="db.r6g.xlarge">db.r6g.xlarge</SelectItem>
                    <SelectItem value="db.r6g.2xlarge">db.r6g.2xlarge</SelectItem>
                    <SelectItem value="db.r6g.4xlarge">db.r6g.4xlarge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="functions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`fun${num}`}>Function {num}</Label>
                    <Input
                      id={`fun${num}`}
                      value={formData[`fun${num}` as keyof RDSMigrationData] as string}
                      onChange={(e) => updateField(`fun${num}` as keyof RDSMigrationData, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.S_emailId}
                  onChange={(e) => updateField('S_emailId', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="major-upgrade"
                    checked={formData.Major_Upgrade}
                    onCheckedChange={(checked) => updateField('Major_Upgrade', checked)}
                  />
                  <Label htmlFor="major-upgrade">Major Upgrade</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="upgrade-storage"
                    checked={formData.UpgradeStorageConfig}
                    onCheckedChange={(checked) => updateField('UpgradeStorageConfig', checked)}
                  />
                  <Label htmlFor="upgrade-storage">Upgrade Storage Config</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="index-create"
                    checked={formData.index_create_flag}
                    onCheckedChange={(checked) => updateField('index_create_flag', checked)}
                  />
                  <Label htmlFor="index-create">Index Create Flag</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="warmup"
                    checked={formData.warmup_flag}
                    onCheckedChange={(checked) => updateField('warmup_flag', checked)}
                  />
                  <Label htmlFor="warmup">Warmup Flag</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Starting Migration..." : "Start RDS Migration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};