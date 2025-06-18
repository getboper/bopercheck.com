import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Users, TrendingUp, Calendar, Filter, RefreshCw, PlayCircle } from 'lucide-react';

interface OutreachStats {
  total_contacted: number;
  successful_sends: number;
  failed_sends: number;
  responses: number;
  conversions: number;
  this_week: number;
  this_month: number;
}

interface OutreachRecord {
  id: string;
  business_name: string;
  business_email: string;
  location: string;
  outreach_type: string;
  date_contacted: string;
  responded: boolean;
  converted: boolean;
  email_status: string;
  cooldown_until?: string;
  notes?: string;
}

export default function OutreachTracker() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch outreach statistics
  const { data: outreachData, isLoading } = useQuery({
    queryKey: ['/api/admin/outreach-stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch outreach records with pagination
  const { data: outreachRecords } = useQuery({
    queryKey: ['/api/admin/outreach-records', page, filter, searchTerm],
    queryFn: () => apiRequest('GET', `/api/admin/outreach-records?page=${page}&filter=${filter}&search=${searchTerm}`)
  });

  // Trigger public outreach campaign
  const runOutreachMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/trigger-public-outreach'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outreach-stats'] });
    }
  });

  // Update business response status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, field, value }: { id: string; field: string; value: boolean }) =>
      apiRequest('PATCH', `/api/admin/outreach-records/${id}`, { [field]: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outreach-records'] });
    }
  });

  const stats: OutreachStats = outreachData?.stats || {};
  const records: OutreachRecord[] = outreachRecords?.records || [];

  const calculateResponseRate = () => {
    if (stats.total_contacted === 0) return 0;
    return ((stats.responses / stats.total_contacted) * 100).toFixed(1);
  };

  const calculateConversionRate = () => {
    if (stats.responses === 0) return 0;
    return ((stats.conversions / stats.responses) * 100).toFixed(1);
  };

  const getDaysRemaining = (cooldownUntil: string) => {
    if (!cooldownUntil) return 0;
    const now = new Date();
    const cooldown = new Date(cooldownUntil);
    const diffTime = cooldown.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      sent: "default",
      delivered: "default", 
      failed: "destructive",
      bounced: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outreach Tracker</h1>
          <p className="text-muted-foreground">Monitor and manage business outreach campaigns</p>
        </div>
        <Button 
          onClick={() => runOutreachMutation.mutate()}
          disabled={runOutreachMutation.isPending}
          className="flex items-center gap-2"
        >
          <PlayCircle className="h-4 w-4" />
          {runOutreachMutation.isPending ? 'Running...' : 'Run Public Outreach'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacted</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_contacted || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.this_week || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateResponseRate()}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.responses || 0} responses received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {calculateConversionRate()}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.this_month || 0}</div>
            <p className="text-xs text-muted-foreground">
              Success rate: {stats.this_month > 0 ? ((stats.successful_sends / stats.this_month) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList>
          <TabsTrigger value="records">Outreach Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="recent">Recently Contacted</SelectItem>
                  <SelectItem value="awaiting">Awaiting Response</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Search business name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          {/* Records Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date Contacted</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responded</TableHead>
                    <TableHead>Converted</TableHead>
                    <TableHead>Cooldown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.business_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.business_email}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>{new Date(record.date_contacted).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.outreach_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.email_status)}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={record.responded}
                          onCheckedChange={(checked) =>
                            updateStatusMutation.mutate({
                              id: record.id,
                              field: 'responded',
                              value: !!checked
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={record.converted}
                          onCheckedChange={(checked) =>
                            updateStatusMutation.mutate({
                              id: record.id,
                              field: 'converted',
                              value: !!checked
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {record.cooldown_until ? (
                          <Badge variant="secondary">
                            {getDaysRemaining(record.cooldown_until)} days
                          </Badge>
                        ) : (
                          <Badge variant="outline">None</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {records.length} records
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={records.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Email Delivery</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Successful Sends</span>
                      <span className="font-medium">{stats.successful_sends || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed Sends</span>
                      <span className="font-medium text-red-600">{stats.failed_sends || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {stats.total_contacted > 0 ? ((stats.successful_sends / stats.total_contacted) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Response Rate</span>
                      <span className="font-medium">{calculateResponseRate()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-medium">{calculateConversionRate()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue Impact</span>
                      <span className="font-medium">£{(stats.conversions * 29.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}