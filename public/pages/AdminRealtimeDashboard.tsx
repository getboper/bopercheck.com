import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, DollarSign, TrendingUp, Activity, AlertTriangle, 
  Search, MapPin, ShoppingCart, Eye, RefreshCw, Bell,
  TrendingDown, Calendar, Clock, CheckCircle, XCircle,
  BarChart3, PieChart, LineChart, Globe, Smartphone
} from "lucide-react";
import { format } from "date-fns";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RealtimeData {
  overview: {
    totalSearches: number;
    todaySearches: number;
    totalUsers: number;
    totalGuestUsers: number;
    activeUsers: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  users: {
    total: number;
    guests: number;
    active: number;
    registered: number;
    recent: Array<any>;
  };
  socialMedia: {
    tiktok: {
      pixelActive: boolean;
      conversions: number;
      todayConversions: number;
      clickThrough: number;
    };
    influencers: {
      totalInfluencers: number;
      activePartnerships: number;
      totalReach: number;
      monthlyEngagement: number;
      conversionRate: number;
    };
  };
  business: {
    totalBusinesses: number;
    activeSubscriptions: number;
    totalInfluencers: number;
    activePartnerships: number;
    totalReach: number;
  };
  email: {
    totalEmailsSent: number;
    businessOutreachEmails: number;
    weeklyReportEmails: number;
    deliveredEmails: number;
    failedEmails: number;
    deliveryRate: string;
    clickThroughRate: number;
    responseRate: number;
    sendgridIntegrated: boolean;
  };
  analytics: {
    searchTrends: Array<any>;
    userGrowth: Array<any>;
    conversionRates: Array<any>;
  };
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    transactions: Array<any>;
    breakdown: {
      subscriptions: number;
      oneTime: number;
      vouchers: number;
    };
    recentPayments: Array<any>;
    projected: {
      monthly: number;
      annual: number;
    };
  };
  businessOutreach: {
    totalOutreach: number;
    emailsSent: number;
    responseRate: number;
    averageResponseTime: number;
    recentOutreach: Array<any>;
  };
  advertising: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    monthlySpend: number;
    clickThroughRate: number;
    conversionRate: number;
    campaignPackages: Array<any>;
  };
  searches: {
    locations: Array<{ location: string; count: number }>;
    topProducts: Array<{ item: string; count: number }>;
    recent: Array<any>;
  };
  alerts: {
    unread: Array<any>;
    criticalCount: number;
    highCount: number;
    recentErrors: Array<any>;
  };
  notifications: {
    unread: Array<any>;
    criticalCount: number;
    highCount: number;
    recentErrors: Array<any>;
  };
  system: {
    metrics: Array<any>;
    status: string;
    lastUpdated: string;
    uptime: number;
  };
  weeklyReports: Array<any>;
}

export default function AdminRealtimeDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Check authentication
  const { data: authStatus, isLoading: authLoading } = useQuery({
    queryKey: ['/api/admin/auth-status'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/auth-status");
      return response.json();
    },
    retry: false,
  });

  // Real-time dashboard data
  const { data: realtimeData, isLoading, error, refetch } = useQuery<RealtimeData>({
    queryKey: ['/api/admin/realtime-data'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/realtime-data");
      return response.json();
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: true,
    enabled: authStatus?.authenticated === true,
  });

  // Integration status data
  const { data: integrationStatus } = useQuery({
    queryKey: ['/api/admin/integration-status'],
    refetchInterval: 60000, // Check integrations every minute
    enabled: authStatus?.authenticated === true,
  });

  // Safe data with comprehensive fallbacks to prevent undefined errors
  const safeData = {
    overview: {
      totalSearches: realtimeData?.overview?.totalSearches || 0,
      todaySearches: realtimeData?.overview?.todaySearches || 0,
      totalUsers: realtimeData?.overview?.totalUsers || 0,
      totalGuestUsers: realtimeData?.overview?.totalGuestUsers || 0,
      activeUsers: realtimeData?.overview?.activeUsers || 0,
      totalRevenue: realtimeData?.overview?.totalRevenue || 0,
      monthlyRevenue: realtimeData?.overview?.monthlyRevenue || 0,
    },
    users: {
      total: (realtimeData?.overview?.totalUsers || 0) + (realtimeData?.overview?.totalGuestUsers || 0),
      guests: realtimeData?.overview?.totalGuestUsers || 0,
      active: realtimeData?.overview?.activeUsers || 0,
      registered: realtimeData?.overview?.totalUsers || 0,
      recent: realtimeData?.users?.recent || [],
    },
    searches: {
      locations: realtimeData?.searches?.locations || [],
      topProducts: realtimeData?.searches?.topProducts || [],
      recent: realtimeData?.searches?.recent || [],
    },
    alerts: {
      unread: realtimeData?.alerts?.unread || [],
      criticalCount: realtimeData?.alerts?.criticalCount || 0,
      highCount: realtimeData?.alerts?.highCount || 0,
    },
    system: {
      status: realtimeData?.system?.status || 'unknown',
      lastUpdated: realtimeData?.system?.lastUpdated || new Date().toISOString(),
      uptime: realtimeData?.system?.uptime || 0,
      metrics: realtimeData?.system?.metrics || [],
    },
    socialMedia: {
      tiktok: {
        pixelActive: realtimeData?.socialMedia?.tiktok?.pixelActive || false,
        conversions: realtimeData?.socialMedia?.tiktok?.conversions || 0,
        todayConversions: realtimeData?.socialMedia?.tiktok?.todayConversions || 0,
        clickThrough: realtimeData?.socialMedia?.tiktok?.clickThrough || 0,
      },
      influencers: {
        totalInfluencers: realtimeData?.socialMedia?.influencers?.totalInfluencers || 0,
        activePartnerships: realtimeData?.socialMedia?.influencers?.activePartnerships || 0,
        totalReach: realtimeData?.socialMedia?.influencers?.totalReach || 0,
        monthlyEngagement: realtimeData?.socialMedia?.influencers?.monthlyEngagement || 0,
        conversionRate: realtimeData?.socialMedia?.influencers?.conversionRate || 0,
      }
    },
    business: realtimeData?.business || {
      totalBusinesses: 0,
      activeSubscriptions: 0,
      totalInfluencers: 0,
      activePartnerships: 0,
      totalReach: 0,
    },
    email: realtimeData?.email || {
      totalEmailsSent: 0,
      businessOutreachEmails: 0,
      tiktokInfluencerEmails: 0,
      clickThroughRate: 0,
      responseRate: 0,
    },
    analytics: realtimeData?.analytics || {
      searchTrends: [],
      userGrowth: [],
      conversionRates: [],
    },
    revenue: realtimeData?.revenue || {
      total: 0,
      monthly: 0,
      weekly: 0,
      transactions: [],
      breakdown: {
        subscriptions: 0,
        oneTime: 0,
        vouchers: 0,
      }
    }
  };

  // Mark alert as read mutation
  const markAlertRead = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("POST", `/api/admin/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/realtime-data'] });
    },
  });

  // Resolve error mutation
  const resolveError = useMutation({
    mutationFn: async (errorId: number) => {
      await apiRequest("POST", `/api/admin/errors/${errorId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/realtime-data'] });
      toast({
        title: "Error Resolved",
        description: "System error has been marked as resolved",
      });
    },
  });

  // Auto-refresh controls
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refetch]);

  // Handle authentication redirect in useEffect to prevent render warnings
  useEffect(() => {
    if (!authLoading && (!authStatus || !authStatus.authenticated)) {
      setLocation("/admin/login");
    }
  }, [authStatus, authLoading, setLocation]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting to prevent flash of content
  if (!authStatus || !authStatus.authenticated) {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load admin dashboard data</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !realtimeData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading real-time dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                BoperCheck Admin - Real-time Dashboard
              </h1>
              <Badge variant="outline" className="ml-3">
                {safeData.system.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto' : 'Manual'}
                </Button>
                <select 
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value={10000}>10s</option>
                  <option value={30000}>30s</option>
                  <option value={60000}>1m</option>
                  <option value={300000}>5m</option>
                </select>
              </div>
              <Badge variant="secondary">
                Last updated: {format(new Date(safeData.system.lastUpdated), 'HH:mm:ss')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {safeData.alerts.criticalCount > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
          <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              {safeData.alerts.criticalCount} critical alerts require immediate attention
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeData.overview.totalSearches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {safeData.overview.todaySearches} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {safeData.overview.activeUsers} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(safeData.overview.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(safeData.overview.monthlyRevenue)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-muted-foreground" />
                {integrationStatus?.integrations?.ai?.isValid ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                {integrationStatus?.integrations?.sendgrid?.isValid ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operational</div>
              <p className="text-xs text-muted-foreground">
                AI: {integrationStatus?.integrations?.ai?.isValid ? 'Active' : 'Issues'} • Email: {integrationStatus?.integrations?.sendgrid?.isValid ? 'Active' : 'Issues'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="searches">Searches</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="business">Business Outreach</TabsTrigger>
            <TabsTrigger value="advertising">Advertising</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search Locations Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Locations</CardTitle>
                  <CardDescription>Top locations for price checks</CardDescription>
                </CardHeader>
                <CardContent>
                  {safeData.searches.locations.length > 0 ? (
                    <Doughnut 
                      data={{
                        labels: safeData.searches.locations.slice(0, 5).map(l => l.location || 'Unknown'),
                        datasets: [{
                          data: safeData.searches.locations.slice(0, 5).map(l => l.count),
                          backgroundColor: [
                            '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'
                          ],
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-center text-gray-500 py-8">No location data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Searched Products</CardTitle>
                  <CardDescription>Popular items and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safeData.searches.topProducts.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{product.item}</span>
                        <Badge variant="secondary">{product.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Searches Tab */}
          <TabsContent value="searches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Searches</CardTitle>
                  <CardDescription>Latest price check requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeData.searches.recent.slice(0, 10).map((search, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium truncate max-w-[150px]">
                            {search.item}
                          </TableCell>
                          <TableCell>{search.location || 'N/A'}</TableCell>
                          <TableCell>
                            {format(new Date(search.createdAt), 'HH:mm')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Search Statistics</CardTitle>
                  <CardDescription>Real-time search metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Searches</span>
                      <Badge variant="outline">{safeData.overview.totalSearches}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Today's Searches</span>
                      <Badge variant="outline">{safeData.overview.todaySearches}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Unique Locations</span>
                      <Badge variant="outline">{safeData.searches.locations.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Popular Products</span>
                      <Badge variant="outline">{safeData.searches.topProducts.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Registered Users</span>
                      <Badge>{safeData.users.registered}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Guest Users</span>
                      <Badge variant="secondary">{safeData.users.guests}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active This Week</span>
                      <Badge variant="outline">{safeData.users.active}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(safeData.users.recent || []).slice(0, 8).map((user: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{user?.email || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant={user?.isBusiness ? "default" : "secondary"}>
                              {user?.isBusiness ? "Business" : "Personal"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-bold text-lg">{formatCurrency(safeData.revenue.total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="font-medium">{formatCurrency(safeData.revenue.monthly)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Projected Monthly</span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency((safeData.revenue as any).projected?.monthly || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Projected Annual</span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency((safeData.revenue as any).projected?.annual || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {((safeData.revenue as any).recentPayments || []).slice(0, 5).map((payment: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'completed' || payment.status === 'succeeded' ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(payment.createdAt), 'MMM dd')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TikTok Integration Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-pink-500" />
                    TikTok Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Pixel Status</span>
                      <Badge variant={safeData.socialMedia?.tiktok?.pixelActive ? "default" : "secondary"}>
                        {safeData.socialMedia?.tiktok?.pixelActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Conversions</span>
                      <span className="font-medium">{safeData.socialMedia?.tiktok?.conversions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Today's Conversions</span>
                      <Badge variant="outline">{safeData.socialMedia?.tiktok?.todayConversions || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Click Through Rate</span>
                      <span className="text-green-600 font-medium">
                        {safeData.socialMedia?.tiktok?.clickThrough || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Influencer Outreach Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Influencer Outreach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Influencers</span>
                      <Badge>{((safeData as any).influencers?.total || (safeData as any).influencers?.totalInfluencers || 0)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Contacted</span>
                      <Badge variant="secondary">{((safeData as any).influencers?.contacted || 0)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Partners</span>
                      <Badge variant="default">{((safeData as any).influencers?.partnered || (safeData as any).influencers?.activePartnerships || 0)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Responses</span>
                      <Badge variant="outline">{((safeData as any).influencers?.pending || 0)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Reach</span>
                      <span className="font-bold text-lg">
                        {(((safeData as any).influencers?.totalFollowers || (safeData as any).influencers?.totalReach || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Performance</CardTitle>
                <CardDescription>TikTok conversion tracking and influencer campaign results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{safeData.socialMedia?.tiktok?.conversions || 0}</div>
                    <div className="text-sm text-pink-600">TikTok Conversions</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{((safeData as any).socialMedia?.influencers?.partnered || 0)}</div>
                    <div className="text-sm text-blue-600">Active Partnerships</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(((safeData as any).socialMedia?.influencers?.totalFollowers || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-green-600">Total Reach</div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/influencers', '_blank')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Influencers
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/admin/analytics', '_blank')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Outreach Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Outreach Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Automated Business Outreach
                  </CardTitle>
                  <CardDescription>Emails sent to businesses that appeared in user searches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Emails Sent</span>
                      <Badge>{(safeData as any).businessOutreach?.totalSent || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Successful Deliveries</span>
                      <Badge variant="default">{(safeData as any).businessOutreach?.successful || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Failed Sends</span>
                      <Badge variant="destructive">{(safeData as any).businessOutreach?.failed || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Business Responses</span>
                      <Badge variant="secondary">{(safeData as any).businessOutreach?.pending || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Converted to Customers</span>
                      <span className="font-bold text-green-600">
                        {(safeData as any).businessOutreach?.successful || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Outreach Performance</CardTitle>
                  <CardDescription>Business email campaign effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {((safeData as any).businessOutreach?.totalSent || 0) > 0 
                          ? ((((safeData as any).businessOutreach?.successful || 0) / ((safeData as any).businessOutreach?.totalSent || 1)) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <div className="text-sm text-blue-600">Delivery Rate</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {((safeData as any).businessOutreach?.successful || 0) > 0 
                          ? ((((safeData as any).businessOutreach?.pending || 0) / ((safeData as any).businessOutreach?.successful || 1)) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <div className="text-sm text-green-600">Response Rate</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {((safeData as any).businessOutreach?.pending || 0) > 0 
                          ? ((((safeData as any).businessOutreach?.successful || 0) / ((safeData as any).businessOutreach?.pending || 1)) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <div className="text-sm text-purple-600">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Business Outreach Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Business Outreach</CardTitle>
                <CardDescription>Latest automated emails sent to businesses from user searches</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Search Query</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {((safeData as any).businessOutreach?.recentEmails || []).slice(0, 10).map((outreach: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{outreach.business_name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{outreach.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{outreach.search_query}</TableCell>
                        <TableCell>
                          {format(new Date(outreach.sent_at), 'MMM dd, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={outreach.status === 'sent' ? 'default' : 'destructive'}>
                            {outreach.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/business-outreach', '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Manage Business Outreach
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advertising Tab */}
          <TabsContent value="advertising" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advertising Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Clicks</span>
                      <Badge>{((safeData as any).advertising?.totalClicks || 0)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Click Revenue</span>
                      <span className="font-medium">{formatCurrency((safeData as any).advertising?.totalRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Packages</span>
                      <Badge variant="outline">{((safeData as any).advertising?.packages?.length || 0)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advertiser Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Monthly Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {((safeData as any).advertising?.packages || []).slice(0, 5).map((pkg: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{pkg.companyName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{pkg.packageType}</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(Number(pkg.monthlyFee))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Unread Alerts ({safeData.alerts.unread.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safeData.alerts.unread.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No unread alerts</p>
                    ) : (
                      safeData.alerts.unread.map((alert, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={
                                alert.severity === 'critical' ? 'destructive' : 
                                alert.severity === 'high' ? 'default' : 'secondary'
                              }
                            >
                              {alert.severity}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAlertRead.mutate(alert.id)}
                            >
                              Mark Read
                            </Button>
                          </div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(alert.createdAt), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {((safeData as any).alerts?.unread || []).length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No recent errors</p>
                    ) : (
                      ((safeData as any).alerts?.unread || []).slice(0, 5).map((error: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{error.errorType}</Badge>
                            {!error.isResolved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resolveError.mutate(error.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                          <p className="text-sm font-medium">{error.errorMessage}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(error.createdAt), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Report Requests</CardTitle>
                <CardDescription>User requests for weekly reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {((safeData as any)?.weeklyReports || []).slice(0, 10).map((report: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{report.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.reportType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'sent' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(report.requestedAt), 'MMM dd, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}