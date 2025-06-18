import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

interface OutreachStats {
  total_sent: number;
  successful_sends: number;
  failed_sends: number;
  responses: number;
  conversions: number;
}

interface RecentOutreach {
  business_name: string;
  email: string;
  search_query: string;
  sent_at: string;
  status: string;
}

export default function BusinessOutreachPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [businessEmails, setBusinessEmails] = useState('');

  // Fetch outreach statistics
  const { data: outreachData, isLoading } = useQuery({
    queryKey: ['/api/admin/outreach-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Manual trigger mutation
  const triggerOutreachMutation = useMutation({
    mutationFn: async (data: { searchQuery: string; businessEmails: string[] }) => {
      const response = await apiRequest('/api/admin/trigger-business-outreach', 'POST', data);
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Outreach Triggered",
        description: data.message || "Business outreach emails sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outreach-stats'] });
      setSearchQuery('');
      setBusinessEmails('');
    },
    onError: (error: any) => {
      toast({
        title: "Outreach Failed",
        description: error.message || "Failed to send outreach emails",
        variant: "destructive",
      });
    },
  });

  const handleTriggerOutreach = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    const emails = businessEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    if (emails.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one valid email address",
        variant: "destructive",
      });
      return;
    }

    triggerOutreachMutation.mutate({
      searchQuery: searchQuery.trim(),
      businessEmails: emails,
    });
  };

  const stats: OutreachStats = (outreachData as any)?.stats || {
    total_sent: 0,
    successful_sends: 0,
    failed_sends: 0,
    responses: 0,
    conversions: 0,
  };

  const recentOutreach: RecentOutreach[] = (outreachData as any)?.recentOutreach || [];

  const conversionRate = stats.total_sent > 0 ? 
    ((stats.conversions / stats.total_sent) * 100).toFixed(1) : '0.0';

  const responseRate = stats.total_sent > 0 ? 
    ((stats.responses / stats.total_sent) * 100).toFixed(1) : '0.0';

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Outreach</h1>
          <p className="text-muted-foreground">
            Automated emails to businesses appearing in BoperCheck searches
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Auto-Active
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sent}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.total_sent > 0 ? 
                Math.round((stats.successful_sends / stats.total_sent) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.successful_sends} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.responses} responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.conversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed_sends}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manual">Manual Trigger</TabsTrigger>
          <TabsTrigger value="template">Email Template</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Automated business outreach system sends personalized emails to local businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">1. Search Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    When users search for products, the system identifies local businesses in results
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">2. Email Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Personalized emails are automatically created with search context
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">3. Gentle CTA</h4>
                  <p className="text-sm text-muted-foreground">
                    Emails include subtle call-to-action for guaranteed visibility packages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Outreach Activity</CardTitle>
              <CardDescription>
                Latest business emails sent automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading outreach data...</p>
                  </div>
                ) : recentOutreach.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No outreach emails sent yet</p>
                    <p className="text-sm text-muted-foreground">
                      Emails will be sent automatically when businesses appear in searches
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOutreach.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{item.business_name}</p>
                          <p className="text-sm text-muted-foreground">{item.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Search: "{item.search_query}"
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={item.status === 'sent' ? 'default' : 'destructive'}>
                            {item.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.sent_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Outreach Trigger</CardTitle>
              <CardDescription>
                Send personalized emails to specific businesses for a search query
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Query</label>
                <Input
                  placeholder="e.g., iPhone 15 Pro electronics store London"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The product/service that was searched for
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Business Email Addresses</label>
                <Textarea
                  placeholder="Enter one email per line:&#10;info@localtechstore.co.uk&#10;sales@electronicsshop.com&#10;contact@gadgetstore.co.uk"
                  value={businessEmails}
                  onChange={(e) => setBusinessEmails(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  One email address per line
                </p>
              </div>

              <Button 
                onClick={handleTriggerOutreach}
                disabled={triggerOutreachMutation.status === 'loading'}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {triggerOutreachMutation.status === 'loading' ? 'Sending...' : 'Send Outreach Emails'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Template Preview</CardTitle>
              <CardDescription>
                The automated email template sent to businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="text-center bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded">
                  <h2 className="text-xl font-bold">🎉 Great News, [Business Name]!</h2>
                  <p>Your business is gaining visibility</p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <h3 className="font-semibold">A bit of good news...</h3>
                  <p>Your business details have recently shown up in this search request on BoperCheck.com:</p>
                  <p className="font-semibold">"[Search Query]" in the [Location] area</p>
                </div>

                <p>This means customers are actively looking for products and services like yours, and your business is being discovered through our AI-powered search engine!</p>
                
                <p>We hope this keeps happening for you and that our search engine continues to help connect you with potential customers. Keep up the good work!</p>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded text-center">
                  <h3 className="font-semibold">Want to guarantee being seen every time?</h3>
                  <p>While organic appearances are great, you can ensure your business appears in <strong>every relevant search</strong> with our advertising packages.</p>
                  <p className="font-semibold">Starting from just £35/month</p>
                  <Button className="mt-2" variant="outline">Learn More About Guaranteed Visibility</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}