import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, DollarSign, TrendingUp, Activity, AlertTriangle, 
  Search, MapPin, Bell, RefreshCw, ExternalLink, Home,
  Mail, CheckCircle, Eye, MessageSquare, BarChart3, FileText, Settings
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
    recent: Array<{ item: string; location: string; createdAt: string }>;
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
    tiktokInfluencerEmails: number;
    clickThroughRate: number;
    responseRate: number;
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
  autoHealing: {
    isActive: boolean;
    stats: {
      totalErrors: number;
      resolvedErrors: number;
      autoFixesApplied: number;
    };
    recentFixes: Array<any>;
  };
  businessOutreach: {
    totalSent: number;
    successfulSends: number;
    failedSends: number;
    responses: number;
    conversions: number;
    recentOutreach: Array<{
      business_name: string;
      email: string;
      search_query: string;
      sent_at: string;
      status: string;
    }>;
  };
}

export default function PublicAdminDashboard() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/public-admin/dashboard-data"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Safe data with fallbacks to prevent undefined errors
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
    },
    autoHealing: dashboardData?.autoHealing || {
      isActive: false,
      stats: { totalErrors: 0, resolvedErrors: 0, autoFixesApplied: 0 },
      recentFixes: []
    },
    businessOutreach: dashboardData?.businessOutreach || {
      totalSent: 0,
      successfulSends: 0,
      failedSends: 0,
      responses: 0,
      conversions: 0,
      recentOutreach: []
    },
    email: dashboardData?.email || {
      totalEmailsSent: 0,
      businessOutreachEmails: 0,
      tiktokInfluencerEmails: 0,
      clickThroughRate: 0,
      responseRate: 0
    }
  };

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  BoperCheck Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time platform monitoring and analytics
                </p>
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
              <div className="text-sm text-gray-500">
                Last updated: {format(lastRefresh, 'HH:mm:ss')}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeData.overview.totalSearches}</div>
              <p className="text-xs text-muted-foreground">
                {safeData.overview.todaySearches} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeData.overview.totalUsers + safeData.overview.totalGuestUsers}</div>
              <p className="text-xs text-muted-foreground">
                {safeData.overview.totalGuestUsers} guests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Outreach</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeData.businessOutreach.totalSent}</div>
              <p className="text-xs text-muted-foreground">
                {safeData.businessOutreach.successfulSends} successful
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Healing</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeData.autoHealing.isActive ? "Active" : "Inactive"}
              </div>
              <p className="text-xs text-muted-foreground">
                {safeData.autoHealing.stats.totalErrors} errors tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="searches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="searches">Search Analytics</TabsTrigger>
            <TabsTrigger value="outreach">Business Outreach</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="searches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Top Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safeData.searches.topProducts.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {product.item}
                        </span>
                        <Badge variant="secondary">
                          {product.count} searches
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Recent Searches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safeData.searches.recent.slice(0, 5).map((search, index) => (
                      <div key={index} className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-r-lg">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {search.item}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {search.location} • {format(new Date(search.createdAt), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outreach" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <span>Outreach Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {safeData.businessOutreach.totalSent}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Sent
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {safeData.businessOutreach.successfulSends}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Successful
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {safeData.businessOutreach.responses}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Responses
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {safeData.businessOutreach.conversions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Conversions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span>Recent Outreach</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safeData.businessOutreach.recentOutreach.slice(0, 5).map((outreach, index) => (
                      <div key={index} className="border-l-4 border-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-r-lg">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {outreach.business_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {outreach.search_query}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(new Date(outreach.sent_at), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="font-medium">Overall Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {safeData.system.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="font-medium">Uptime</span>
                      <span className="text-blue-600 font-bold">{safeData.system.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="font-medium">Auto-Healing</span>
                      <Badge variant={safeData.autoHealing.isActive ? "default" : "secondary"}>
                        {safeData.autoHealing.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span>Auto-Healing Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {safeData.autoHealing.stats.totalErrors}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Errors
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {safeData.autoHealing.stats.resolvedErrors}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Resolved
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {safeData.autoHealing.stats.autoFixesApplied}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Auto-Fixes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>Search Locations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeData.searches.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {location.location || "Unknown Location"}
                      </span>
                      <Badge variant="secondary">
                        {location.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}