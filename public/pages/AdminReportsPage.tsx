import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Calendar, 
  Search,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ReportSubscription {
  id: number;
  email: string;
  businessName: string | null;
  isAdvertiser: boolean;
  lastReportSent: string | null;
  createdAt: string;
}

interface EmailLog {
  id: number;
  subject: string;
  status: string;
  errorMessage: string | null;
  sentAt: string;
}

interface WeeklyReport {
  id: number;
  weekStart: string;
  weekEnd: string;
  searchAppearances: number;
  nationalSearches: number;
  localSearches: number;
  downloadPercentage: number;
  impressions: number;
  clickThroughRate: string;
  leadGeneration: number;
  emailSent: boolean;
  sentAt: string | null;
  createdAt: string;
}

interface SubscriptionDetail {
  subscription: {
    email: string;
    businessName: string | null;
    isAdvertiser: boolean;
    createdAt: string;
  };
  reports: WeeklyReport[];
}

export default function AdminReportsPage() {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all subscriptions
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['/api/admin/reports/subscriptions'],
    queryFn: () => apiRequest("GET", "/api/admin/reports/subscriptions").then(res => res.json())
  });

  // Fetch subscription details
  const { data: subscriptionDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['/api/admin/reports/subscription', selectedEmail],
    queryFn: () => apiRequest("GET", `/api/admin/reports/subscription/${selectedEmail}`).then(res => res.json()),
    enabled: !!selectedEmail
  });

  // Fetch email logs
  const { data: emailLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/admin/reports/email-logs', selectedEmail],
    queryFn: () => apiRequest("GET", `/api/admin/reports/email-logs?email=${selectedEmail}`).then(res => res.json()),
    enabled: !!selectedEmail
  });

  // Mark as advertiser mutation
  const markAdvertiserMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest("POST", "/api/admin/reports/mark-advertiser", { email }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User marked as advertiser successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports/subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports/subscription', selectedEmail] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark user as advertiser",
        variant: "destructive"
      });
    }
  });

  const filteredSubscriptions = subscriptionsData?.subscriptions?.filter((sub: ReportSubscription) =>
    searchEmail === "" || (sub.email || '').toLowerCase().includes(searchEmail.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (subscriptionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Weekly Reports Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage weekly report subscriptions and view analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold">{subscriptionsData?.total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Advertisers</p>
                <p className="text-2xl font-bold">{subscriptionsData?.advertisers || 0}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Free Users</p>
                <p className="text-2xl font-bold">{subscriptionsData?.freeUsers || 0}</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {subscriptionsData?.total > 0 
                    ? `${Math.round((subscriptionsData.advertisers / subscriptionsData.total) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subscriptions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Report Subscriptions
            </CardTitle>
            <CardDescription>
              Manage and view all weekly report subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSubscriptions.map((subscription: ReportSubscription) => (
                <div
                  key={subscription.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedEmail === subscription.email
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedEmail(subscription.email)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{subscription.email}</p>
                        {subscription.isAdvertiser && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Advertiser
                          </Badge>
                        )}
                      </div>
                      {subscription.businessName && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {subscription.businessName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Joined {formatDate(subscription.createdAt)}
                      </p>
                      {subscription.lastReportSent && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Last report: {formatDate(subscription.lastReportSent)}
                        </p>
                      )}
                    </div>
                    {!subscription.isAdvertiser && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAdvertiserMutation.mutate(subscription.email);
                        }}
                        disabled={markAdvertiserMutation.isLoading}
                      >
                        Mark as Advertiser
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No subscriptions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <div className="space-y-6">
          {selectedEmail ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Subscription Details
                  </CardTitle>
                  <CardDescription>
                    Details and reports for {selectedEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {detailLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ) : subscriptionDetail ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Business Name</p>
                          <p className="font-medium">
                            {subscriptionDetail.subscription.businessName || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Account Type</p>
                          <p className="font-medium">
                            {subscriptionDetail.subscription.isAdvertiser ? 'Advertiser' : 'Free User'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Subscribed</p>
                          <p className="font-medium">
                            {formatDate(subscriptionDetail.subscription.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Total Reports</p>
                          <p className="font-medium">{subscriptionDetail.reports.length}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Tabs defaultValue="reports" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reports">Weekly Reports</TabsTrigger>
                  <TabsTrigger value="emails">Email Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="reports">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Weekly Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {detailLoading ? (
                        <div className="animate-pulse space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      ) : subscriptionDetail?.reports.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {subscriptionDetail.reports.map((report: WeeklyReport) => (
                            <div key={report.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    Week of {formatDate(report.weekStart)}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {report.emailSent ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-yellow-600" />
                                  )}
                                  <span className="text-xs">
                                    {report.emailSent ? 'Sent' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">Appearances</p>
                                  <p className="font-medium">{report.searchAppearances}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">Downloads</p>
                                  <p className="font-medium">{report.downloadPercentage}%</p>
                                </div>
                                {subscriptionDetail.subscription.isAdvertiser && (
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400">Leads</p>
                                    <p className="font-medium">{report.leadGeneration}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No reports generated yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emails">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Delivery Logs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {logsLoading ? (
                        <div className="animate-pulse space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      ) : emailLogs?.logs?.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {emailLogs.logs.map((log: EmailLog) => (
                            <div key={log.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{log.subject}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatDateTime(log.sentAt)}
                                  </p>
                                  {log.errorMessage && (
                                    <p className="text-xs text-red-600 mt-1">{log.errorMessage}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {log.status === 'sent' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : log.status === 'failed' ? (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  )}
                                  <Badge 
                                    variant={log.status === 'sent' ? 'default' : 'destructive'}
                                    className="text-xs"
                                  >
                                    {log.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No email logs found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Select a Subscription</p>
                  <p className="text-sm">Choose a subscription from the list to view details and reports</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}