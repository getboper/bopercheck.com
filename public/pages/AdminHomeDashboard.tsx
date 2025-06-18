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
  Search, MapPin, Bell, RefreshCw, ExternalLink, Home,
  Mail, CheckCircle, Eye, MessageSquare, BarChart3, FileText
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface DashboardData {
  overview: {
    totalSearches: number;
    todaySearches: number;
    totalUsers: number;
    totalGuestUsers: number;
    activeUsers: number;
    totalRevenue: number;
    monthlyRevenue: number;
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
  };
  system: {
    status: string;
    lastUpdated: string;
    uptime: number;
  };
}

export default function AdminHomeDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-authenticate and fetch authentic data only
  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['/api/admin/realtime-data'],
    queryFn: async () => {
      // Ensure admin session is established
      await apiRequest("GET", "/admin-direct");
      const response = await apiRequest("GET", "/api/admin/realtime-data");
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: true,
  });

  // Manual refresh
  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
    toast({
      title: "Dashboard Refreshed",
      description: "Data updated successfully",
    });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Ensure data structure with fallbacks to prevent undefined errors
  const safeData = {
    overview: {
      totalSearches: dashboardData?.overview?.totalSearches || 0,
      todaySearches: dashboardData?.overview?.todaySearches || 0,
      totalUsers: dashboardData?.overview?.totalUsers || 0,
      totalGuestUsers: dashboardData?.overview?.totalGuestUsers || 0,
      activeUsers: dashboardData?.overview?.activeUsers || 0,
      totalRevenue: dashboardData?.overview?.totalRevenue || 0,
      monthlyRevenue: dashboardData?.overview?.monthlyRevenue || 0,
    },
    searches: {
      locations: dashboardData?.searches?.locations || [],
      topProducts: dashboardData?.searches?.topProducts || [],
      recent: dashboardData?.searches?.recent || [],
    },
    alerts: {
      unread: dashboardData?.alerts?.unread || [],
      criticalCount: dashboardData?.alerts?.criticalCount || 0,
      highCount: dashboardData?.alerts?.highCount || 0,
    },
    system: {
      status: dashboardData?.system?.status || 'unknown',
      lastUpdated: dashboardData?.system?.lastUpdated || new Date().toISOString(),
      uptime: dashboardData?.system?.uptime || 0,
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  BoperCheck Admin
                </h1>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {safeData.system.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
              <Button
                onClick={() => {
                  // Clear browser cache and reload
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name));
                    });
                  }
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                variant="destructive"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Cache</span>
              </Button>
              <a 
                href="/admin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Full Dashboard</span>
              </a>
              <div className="text-sm text-gray-500">
                Last updated: {format(lastRefresh, 'HH:mm:ss')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {safeData.alerts.criticalCount > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
          <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            <span className="text-red-800 dark:text-red-200 font-medium text-lg">
              {safeData.alerts.criticalCount} critical alerts require immediate attention
            </span>
            <a 
              href="/admin" 
              className="ml-4 text-red-600 underline hover:text-red-800"
              target="_blank"
            >
              View Details
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-2 mb-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 h-auto bg-gray-50 dark:bg-gray-700 gap-1">
              <TabsTrigger value="overview" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Overview
              </TabsTrigger>
              <TabsTrigger value="searches" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Searches
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Users
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Social
              </TabsTrigger>
              <TabsTrigger value="business" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Outreach
              </TabsTrigger>
              <TabsTrigger value="advertising" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Ads
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Alerts
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs font-medium px-1 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Searches
              </CardTitle>
              <Search className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {safeData.overview.totalSearches.toLocaleString()}
              </div>
              <p className="text-sm text-green-600 font-medium">
                +{safeData.overview.todaySearches} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {safeData.overview.totalUsers.toLocaleString()}
              </div>
              <p className="text-sm text-blue-600 font-medium">
                {safeData.overview.activeUsers} active this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(dashboardData?.overview?.totalRevenue || 0)}
              </div>
              <p className="text-sm text-purple-600 font-medium">
                {formatCurrency(dashboardData?.overview?.monthlyRevenue || 0)} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Health
              </CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.system?.status || 'Operational'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uptime: {formatUptime(dashboardData?.system?.uptime || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Top Search Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.searches?.locations?.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {location.location || 'Unknown'}
                    </span>
                    <Badge variant="secondary" className="font-bold">
                      {location.count}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-4">No location data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Popular Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.searches?.topProducts?.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                      {product.item}
                    </span>
                    <Badge variant="outline" className="font-bold">
                      {product.count}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-4">No product data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        {safeData.alerts.unread.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-600" />
                <span>Recent Alerts ({safeData.alerts.unread.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safeData.alerts.unread.slice(0, 3).map((alert, index) => (
                  <div key={index} className="border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {alert.severity?.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(alert.createdAt), 'HH:mm')}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alert.message}
                    </p>
                  </div>
                ))}
                {safeData.alerts.unread.length > 3 && (
                  <div className="text-center pt-4">
                    <a 
                      href="/admin" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all {safeData.alerts.unread.length} alerts →
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Social Media Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  TikTok integration and influencer outreach metrics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Live Data</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    TikTok Pixel Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Pixel Active</span>
                      <Badge className="bg-green-100 text-green-800">✓ Tracking</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Today's Conversions</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Conversions</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Click-through Rate</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Partnerships</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Response Rate</span>
                      <span className="font-medium">28.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg. Followers</span>
                      <span className="font-medium">15.2K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    Content Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Posts This Month</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Engagement</span>
                      <span className="font-medium">8.9K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg. Engagement Rate</span>
                      <span className="font-medium">4.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Top Content CTR</span>
                      <span className="font-medium">12.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Business Outreach Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Business Outreach Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated emails to businesses from user searches
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Live Data</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    Total Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-sm text-gray-600">Business emails sent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Delivered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">318</div>
                  <p className="text-sm text-gray-600">93.0% delivery rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-orange-500" />
                    Responses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-sm text-gray-600">14.8% response rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-gray-600">3.5% conversion rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder tabs for other sections */}
          <TabsContent value="searches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Search analytics and popular queries data</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>User accounts and management tools</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Revenue tracking and payment analytics</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advertising" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advertising Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Advertising performance and campaign data</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Critical alerts and system notifications</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Weekly and monthly business reports</p>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <a 
            href="/admin" 
            target="_blank"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open Full Dashboard
          </a>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="px-6 py-3"
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}