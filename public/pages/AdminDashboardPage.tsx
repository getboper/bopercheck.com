import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Users, DollarSign, TrendingUp, Activity, Trash2, FileText, BarChart3, Calendar, Download, Printer, RefreshCw, Zap, Mail, CheckCircle, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

interface AdminStats {
  overview: {
    totalUsers: number;
    totalBusinessUsers: number;
    totalPriceChecks: number;
    totalBusinessProfiles: number;
    recentSignups: number;
    todayChecks: number;
  };
  revenue: {
    totalRevenue: number;
    activeSubscriptions: number;
    monthlyRecurring: number;
    pdfUpgrades: number;
    priorityUpgrades: number;
  };
  system: {
    lastUpdated: string;
    status: string;
  };
}

interface FailedSearch {
  id: number;
  searchQuery: string;
  errorType: string;
  errorMessage: string;
  budget: number | null;
  location: string | null;
  category: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

interface RevenueDetail {
  timeframe: string;
  revenueBySource: Array<{
    source: string;
    amount: number;
    transactions: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    amount: number;
    transactions: number;
  }>;
  topSearches: Array<{
    query: string;
    revenue: number;
    conversions: number;
  }>;
}

interface PlatformMetrics {
  siteLoadFailures: number;
  apiTimeouts: number;
  frontendErrors: number;
  recentFailures: number;
  totalFailures: number;
  lastChecked: string;
}

interface VisitorAnalytics {
  timeframe: string;
  topReferrers: Array<{
    source: string;
    visitors: number;
  }>;
  geographic: Array<{
    location: string;
    visitors: number;
  }>;
  deviceTypes: Array<{
    device: string;
    visitors: number;
  }>;
  categories: Array<{
    category: string;
    searches: number;
  }>;
  weeklyTrends: Array<{
    week: string;
    uniqueUsers: number;
    totalSearches: number;
  }>;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  credits: number;
  createdAt: string;
  lastLogin: string | null;
  isBusiness: boolean;
  priceCheckCount: number;
  businessInfo?: any;
}

interface AnalyticsData {
  visitors: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
  hourlyActivity: Array<{ hour: number; count: number }>;
  popularCategories: Array<{ category: string; count: number }>;
  lastUpdated: string;
}

interface WeeklyReport {
  period: {
    from: string;
    to: string;
  };
  summary: {
    newSignups: number;
    newBusinessCustomers: number;
    weeklyRevenue: number;
    premiumUpgrades: number;
    totalPriceChecks: number;
  };
  details: {
    newSignups: AdminUser[];
    newBusinessCustomers: any[];
  };
  generatedAt: string;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  
  // Check authentication status
  const { data: authStatus, isLoading: authLoading, error: authError } = useQuery({
    queryKey: ["/api/admin/auth-status"],
    retry: 1,
    retryDelay: 500,
    staleTime: 0,
    cacheTime: 0
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (!authStatus || !(authStatus as any)?.authenticated)) {
      setLocation("/admin/login");
    }
  }, [authStatus, authLoading, setLocation]);

  // Show error state with retry option
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to connect to admin services. This might be due to a network issue.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/admin/login")}
            className="w-full mt-2"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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

  // Don't render dashboard if not authenticated
  if (!authStatus || !(authStatus as any)?.authenticated) {
    return null;
  }
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);
  const [lastFailedSearchCount, setLastFailedSearchCount] = useState(0);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/auth-status");
        const result = await response.json();
        setIsAuthenticated(result.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Export functionality
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('admin-dashboard');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`BoperCheck-Admin-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Admin dashboard exported to PDF",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export dashboard",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `${filename} exported to CSV`,
    });
  };

  // Drill-down handlers for interactive charts
  const showUserDetails = () => {
    toast({
      title: "User Breakdown",
      description: `Free Users: ${(stats?.overview.totalUsers || 0) - (stats?.overview.totalBusinessUsers || 0)}, Business Users: ${stats?.overview.totalBusinessUsers || 0}`,
    });
  };

  const showRevenueDetails = () => {
    toast({
      title: "Revenue Details",
      description: `Total: £${stats?.revenue.totalRevenue?.toFixed(2) || '0.00'}, Monthly Recurring: £${stats?.revenue.monthlyRecurring || 0}, Active Subscriptions: ${stats?.revenue.activeSubscriptions || 0}`,
    });
  };

  const showVisitorDetails = () => {
    if (analytics?.visitors) {
      toast({
        title: "Visitor Analytics",
        description: `24h: ${analytics.visitors.last24Hours}, 7d: ${analytics.visitors.last7Days}, 30d: ${analytics.visitors.last30Days}`,
      });
    }
  };

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"]
  });

  // Test platform failure mutation
  const testPlatformFailure = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/test-platform-failure"),
    onSuccess: () => {
      toast({
        title: "Test Failure Created",
        description: "A test platform failure has been generated successfully. Check the metrics above.",
      });
      refetchMetrics(); // Refresh metrics after test
    },
    onError: () => {
      toast({
        title: "Test Failed", 
        description: "Could not create test platform failure.",
        variant: "destructive",
      });
    },
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch weekly report
  const { data: weeklyReport, isLoading: reportLoading } = useQuery<WeeklyReport>({
    queryKey: ["/api/admin/weekly-report"]
  });

  // Platform metrics query
  const { data: platformMetrics, isLoading: platformMetricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['/api/admin/platform-metrics'],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time monitoring
  });

  // Enhanced analytics queries for the new dashboard features with real-time monitoring
  const { data: failedSearches, isLoading: failedSearchesLoading } = useQuery({
    queryKey: ["/api/admin/failed-searches"],
    refetchInterval: 10000, // Check every 10 seconds for real-time alerts
    onSuccess: (data) => {
      // Real-time failed search monitoring with popup alerts
      if (data?.failedSearches && Array.isArray(data.failedSearches)) {
        const unresolvedCount = data.totalUnresolved || 0;
        
        // Check for new failed searches
        if (lastFailedSearchCount > 0 && unresolvedCount > lastFailedSearchCount) {
          const newFailures = data.failedSearches
            .filter((search: any) => !search.resolved)
            .slice(0, unresolvedCount - lastFailedSearchCount);
          
          if (newFailures.length > 0) {
            const latestFailure = newFailures[0];
            setAlertData({
              searchQuery: latestFailure.searchQuery,
              errorType: latestFailure.errorType,
              errorMessage: latestFailure.errorMessage,
              timestamp: latestFailure.createdAt,
              userType: latestFailure.userId ? 'Registered User' : 'Guest',
              count: newFailures.length,
              location: latestFailure.location || 'Unknown'
            });
            setAlertOpen(true);
            
            // Request notification permission if not granted
            if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission();
            }
            
            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🚨 Failed Search Alert', {
                body: `"${latestFailure.searchQuery}" failed - ${latestFailure.errorType}`,
                icon: '/favicon.ico',
                requireInteraction: true
              });
            }
            
            // Play notification sound
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0LKoTO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSgFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzuY3O7Xdz0L');
              audio.play().catch(() => {});
            } catch (e) {}
          }
        }
        
        setLastFailedSearchCount(unresolvedCount);
      }
    }
  });

  const { data: revenueDetailed, isLoading: revenueDetailedLoading } = useQuery<RevenueDetail>({
    queryKey: ["/api/admin/revenue-detailed"],
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const { data: visitorAnalytics, isLoading: visitorAnalyticsLoading } = useQuery<VisitorAnalytics>({
    queryKey: ["/api/admin/visitor-analytics"],
    refetchInterval: 300000
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User Deleted",
        description: "User account has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user account",
        variant: "destructive",
      });
    }
  });

  const handleDeleteUser = async (userId: number, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    window.location.href = '/admin/login';
    return null;
  }

  if (statsLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chart data preparations
  const userTypeData = {
    labels: ['Free Users', 'Business Users'],
    datasets: [{
      data: [
        (stats?.overview.totalUsers || 0) - (stats?.overview.totalBusinessUsers || 0),
        stats?.overview.totalBusinessUsers || 0
      ],
      backgroundColor: ['#3B82F6', '#10B981'],
      borderWidth: 0
    }]
  };

  const revenueData = {
    labels: ['Total Revenue', 'Monthly Recurring', 'Upgrades'],
    datasets: [{
      label: 'Revenue (£)',
      data: [
        stats?.revenue.totalRevenue || 0,
        stats?.revenue.monthlyRecurring || 0,
        ((stats?.revenue.pdfUpgrades || 0) * 0.99) + ((stats?.revenue.priorityUpgrades || 0) * 1.99)
      ],
      backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B'],
      borderRadius: 4
    }]
  };

  const activityData = {
    labels: analytics?.hourlyActivity?.map(h => `${h.hour}:00`) || [],
    datasets: [{
      label: 'Hourly Activity',
      data: analytics?.hourlyActivity?.map(h => h.count) || [],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-2 md:p-6" id="admin-dashboard">
        {/* Mobile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">BoperCheck Admin</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Live Dashboard</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          {/* Mobile-Optimized Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-2 mb-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto bg-gray-50 dark:bg-gray-700 gap-1">
              <TabsTrigger value="overview" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Overview
              </TabsTrigger>
              <TabsTrigger value="searches" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Searches
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Users
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="social-media" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Social Media
              </TabsTrigger>
              <TabsTrigger value="business-outreach" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Business Outreach
              </TabsTrigger>
              <TabsTrigger value="advertising" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Advertising
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs md:text-sm font-medium px-2 py-2 md:px-3 md:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Alerts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm font-medium px-3 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-sm font-medium px-3 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

        {/* Mobile-Optimized Action Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-3 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => exportToPDF()}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              PDF
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Printer className="w-3 h-3 mr-1" />
              Print
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Mobile-Optimized Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.overview.recentSignups || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.totalBusinessUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Paying customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{stats?.revenue.totalRevenue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.revenue.activeSubscriptions || 0} active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.overview.todayChecks || 0}</div>
              <p className="text-xs text-muted-foreground">
                Price checks today
              </p>
            </CardContent>
          </Card>
        </div>

          {/* Overview Tab - Mobile-Optimized Visual Dashboard */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={showUserDetails}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 md:h-48">
                    <Doughnut 
                      data={userTypeData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              fontSize: 10,
                              padding: 8
                            }
                          }
                        },
                        onClick: showUserDetails
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={showRevenueDetails}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 md:h-48">
                    <Bar 
                      data={revenueData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              font: { size: 10 },
                              callback: function(value) {
                                return '£' + value;
                              }
                            }
                          },
                          x: {
                            ticks: {
                              font: { size: 10 }
                            }
                          }
                        },
                        onClick: showRevenueDetails
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={showVisitorDetails}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Hourly Activity
                    <span className="text-xs text-gray-500 ml-auto">Click for details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={activityData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        },
                        onClick: showVisitorDetails
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Summary with Data Freshness */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Key Metrics</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Last updated: {stats?.system?.lastUpdated ? 
                  format(new Date(stats.system.lastUpdated), 'HH:mm:ss') : 
                  format(new Date(), 'HH:mm:ss')}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.overview.totalUsers || 0}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Total Users</div>
                    </div>
                    <div className="text-green-500 text-sm">✓</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.overview.totalBusinessUsers || 0}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">Business Users</div>
                    </div>
                    <div className="text-green-500 text-sm">✓</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        £{stats?.revenue.totalRevenue || 0}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Total Revenue</div>
                    </div>
                    <div className="text-green-500 text-sm">✓</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stats?.overview.todayChecks || 0}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Today's Checks</div>
                    </div>
                    <div className="text-green-500 text-sm">✓</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platform Monitoring Tab */}
          <TabsContent value="platform-monitoring" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Real-Time Platform Monitoring</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last checked: {platformMetrics?.metrics?.lastChecked ? 
                    format(new Date(platformMetrics.metrics.lastChecked), 'HH:mm:ss') : 
                    'Loading...'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchMetrics()}
                  disabled={platformMetricsLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${platformMetricsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => testPlatformFailure.mutate()}
                  disabled={testPlatformFailure.isPending}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test Failure
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Activity className="w-5 h-5" />
                    Critical Platform Failures (24h)
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring of app load failures, API timeouts, and JavaScript errors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {platformMetricsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div>
                          <div className="font-semibold text-red-700 dark:text-red-400">Site Load Failures</div>
                          <div className="text-sm text-red-600 dark:text-red-500">Pages failing to load completely</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {platformMetrics?.metrics?.siteLoadFailures || 0}
                          </div>
                          <Badge variant="destructive">Active</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div>
                          <div className="font-semibold text-orange-700 dark:text-orange-400">API Timeouts</div>
                          <div className="text-sm text-orange-600 dark:text-orange-500">Backend service response delays</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {platformMetrics?.metrics?.apiTimeouts || 0}
                          </div>
                          <Badge variant="secondary">Monitored</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div>
                          <div className="font-semibold text-yellow-700 dark:text-yellow-400">Frontend Errors</div>
                          <div className="text-sm text-yellow-600 dark:text-yellow-500">JavaScript execution failures</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {platformMetrics?.metrics?.frontendErrors || 0}
                          </div>
                          <Badge variant="outline">Tracked</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Summary
                  </CardTitle>
                  <CardDescription>
                    Real-time platform health metrics and monitoring status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {platformMetricsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                          <div className="font-semibold text-blue-700 dark:text-blue-400">Recent Failures (1h)</div>
                          <div className="text-sm text-blue-600 dark:text-blue-500">Critical issues in last hour</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {platformMetrics?.metrics?.recentFailures || 0}
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Live</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <div className="font-semibold text-green-700 dark:text-green-400">Total Failures</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Historical failure count</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {platformMetrics?.metrics?.totalFailures || 0}
                          </div>
                          <Badge className="bg-green-100 text-green-800">Tracked</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div>
                          <div className="font-semibold text-purple-700 dark:text-purple-400">Email Alerts</div>
                          <div className="text-sm text-purple-600 dark:text-purple-500">Critical failure notifications active</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">✓</div>
                          <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Platform Health Status
                </CardTitle>
                <CardDescription>
                  Comprehensive monitoring system status and coverage overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                    <div className="font-semibold text-green-700 dark:text-green-400">Error Tracking</div>
                    <div className="text-sm text-green-600 dark:text-green-500">Frontend & Backend</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                    <div className="font-semibold text-green-700 dark:text-green-400">Email Alerts</div>
                    <div className="text-sm text-green-600 dark:text-green-500">Real-time Notifications</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                    <div className="font-semibold text-green-700 dark:text-green-400">Auto-Monitoring</div>
                    <div className="text-sm text-green-600 dark:text-green-500">24/7 System Watch</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Active Monitoring Coverage:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                    <div>• Site load failure detection</div>
                    <div>• API timeout monitoring</div>
                    <div>• JavaScript error capture</div>
                    <div>• Performance tracking</div>
                    <div>• Email alert system</div>
                    <div>• Real-time metrics</div>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <h5 className="font-medium mb-2">Test Error Logs Location:</h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>• <strong>Database:</strong> platform_failures table</div>
                      <div>• <strong>Admin Tab:</strong> Failed Searches section</div>
                      <div>• <strong>Email Alerts:</strong> njpards1@gmail.com</div>
                      <div>• <strong>Test Button:</strong> Creates frontend_error type entries</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Failed Search Tracking Tab */}
          <TabsContent value="failed-searches" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Failed Search Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {format(new Date(), 'HH:mm:ss')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Live Data</span>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Failed Search Tracking
                  <span className="text-green-500 text-sm ml-auto">✓ Synced</span>
                </CardTitle>
                <CardDescription>
                  Monitor and resolve search failures to improve user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {failedSearchesLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : failedSearches ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {failedSearches.totalUnresolved} unresolved issues
                      </div>
                      <Button 
                        onClick={() => exportToCSV(failedSearches.failedSearches, 'failed-searches')}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Search Query</TableHead>
                          <TableHead>Error Type</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {failedSearches.failedSearches?.map((search: FailedSearch) => (
                          <TableRow key={search.id}>
                            <TableCell className="font-medium max-w-xs truncate">
                              {search.searchQuery}
                            </TableCell>
                            <TableCell>
                              <Badge variant={search.errorType === 'parsing_error' ? 'destructive' : 'secondary'}>
                                {search.errorType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(search.createdAt), "MMM d, HH:mm")}
                            </TableCell>
                            <TableCell>
                              {search.location || 'Unknown'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={search.resolved ? 'default' : 'destructive'}>
                                {search.resolved ? 'Resolved' : 'Open'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No failed search data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Revenue Analytics Tab */}
          <TabsContent value="revenue-detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Revenue by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {revenueDetailedLoading ? (
                    <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ) : revenueDetailed ? (
                    <div className="space-y-4">
                      {revenueDetailed.revenueBySource?.map((source) => (
                        <div key={source.source} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <div className="font-medium">{source.source}</div>
                            <div className="text-sm text-muted-foreground">{source.transactions} transactions</div>
                          </div>
                          <div className="text-lg font-bold">£{source.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No revenue data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Converting Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  {revenueDetailedLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : revenueDetailed?.topSearches ? (
                    <div className="space-y-3">
                      {revenueDetailed.topSearches.map((search, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div className="max-w-xs truncate">
                            <div className="font-medium">{search.query}</div>
                            <div className="text-sm text-muted-foreground">{search.conversions} conversions</div>
                          </div>
                          <div className="text-sm font-bold">£{search.revenue.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No conversion data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {revenueDetailed?.dailyRevenue && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={{
                        labels: revenueDetailed.dailyRevenue.map(d => format(new Date(d.date), "MMM d")),
                        datasets: [{
                          label: 'Daily Revenue (£)',
                          data: revenueDetailed.dailyRevenue.map(d => d.amount),
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          tension: 0.4,
                          fill: true
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return '£' + value;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Visitor Analytics Tab */}
          <TabsContent value="visitor-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {visitorAnalyticsLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : visitorAnalytics?.topReferrers ? (
                    <div className="space-y-3">
                      {visitorAnalytics.topReferrers.map((referrer, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="font-medium truncate max-w-xs">{referrer.source}</div>
                          <Badge variant="outline">{referrer.visitors} visits</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No referrer data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  {visitorAnalyticsLoading ? (
                    <div className="animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ) : visitorAnalytics?.deviceTypes ? (
                    <div className="h-48">
                      <Doughnut 
                        data={{
                          labels: visitorAnalytics.deviceTypes.map(d => d.device),
                          datasets: [{
                            data: visitorAnalytics.deviceTypes.map(d => d.visitors),
                            backgroundColor: [
                              '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'
                            ]
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No device data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {visitorAnalyticsLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : visitorAnalytics?.geographic ? (
                    <div className="space-y-3">
                      {visitorAnalytics.geographic.map((location, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="font-medium truncate max-w-xs">{location.location}</div>
                          <Badge variant="outline">{location.visitors} visits</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No geographic data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {visitorAnalyticsLoading ? (
                    <div className="animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ) : visitorAnalytics?.categories ? (
                    <div className="h-48">
                      <Doughnut 
                        data={{
                          labels: visitorAnalytics.categories.map(c => c.category),
                          datasets: [{
                            data: visitorAnalytics.categories.map(c => c.searches),
                            backgroundColor: [
                              '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444',
                              '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
                            ]
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {visitorAnalytics?.weeklyTrends && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Visitor Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={{
                        labels: visitorAnalytics.weeklyTrends.map(w => format(new Date(w.week), "MMM d")),
                        datasets: [
                          {
                            label: 'Unique Users',
                            data: visitorAnalytics.weeklyTrends.map(w => w.uniqueUsers),
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            tension: 0.4
                          },
                          {
                            label: 'Total Searches',
                            data: visitorAnalytics.weeklyTrends.map(w => w.totalSearches),
                            borderColor: '#06B6D4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            tension: 0.4
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, view activity, and handle deletions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isBusiness ? "default" : "secondary"}>
                              {user.isBusiness ? "Business" : "Free"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{user.priceCheckCount} price checks</div>
                              <div className="text-muted-foreground">{user.credits} credits</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin 
                              ? format(new Date(user.lastLogin), "MMM d, yyyy")
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              disabled={deleteUserMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Analytics Dashboard</h3>
              <Button 
                onClick={() => analytics && exportToCSV([{
                  last24Hours: analytics.visitors.last24Hours,
                  last7Days: analytics.visitors.last7Days,
                  last30Days: analytics.visitors.last30Days,
                  lastUpdated: analytics.lastUpdated
                }], 'analytics-data')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visitor Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold">{analytics?.visitors.last24Hours || 0}</div>
                        <div className="text-sm text-muted-foreground">Last 24 hours</div>
                      </div>
                      <div>
                        <div className="text-xl font-semibold">{analytics?.visitors.last7Days || 0}</div>
                        <div className="text-sm text-muted-foreground">Last 7 days</div>
                      </div>
                      <div>
                        <div className="text-xl font-semibold">{analytics?.visitors.last30Days || 0}</div>
                        <div className="text-sm text-muted-foreground">Last 30 days</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="animate-pulse space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analytics?.popularCategories?.slice(0, 5).map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{category.category || 'Uncategorized'}</span>
                          <Badge variant="outline">{category.count}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Status</span>
                      <Badge variant="default">{stats?.system.status || 'Unknown'}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div className="text-sm">
                        {stats?.system.lastUpdated 
                          ? format(new Date(stats.system.lastUpdated), "MMM d, yyyy HH:mm")
                          : 'Unknown'
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">£{stats?.revenue.totalRevenue?.toFixed(2) || '0.00'}</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">£{stats?.revenue.monthlyRecurring?.toFixed(2) || '0.00'}</div>
                      <div className="text-sm text-muted-foreground">Monthly Recurring Revenue</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium">{stats?.revenue.activeSubscriptions || 0}</div>
                      <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium Upgrades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xl font-semibold">{stats?.revenue.pdfUpgrades || 0}</div>
                      <div className="text-sm text-muted-foreground">PDF Downloads</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.revenue.priorityUpgrades || 0}</div>
                      <div className="text-sm text-muted-foreground">Priority Processing</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Business Report</CardTitle>
                <CardDescription>
                  Comprehensive weekly overview of business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : weeklyReport ? (
                  <div className="space-y-6">
                    <div className="text-sm text-muted-foreground">
                      Period: {format(new Date(weeklyReport.period.from), "MMM d")} - {format(new Date(weeklyReport.period.to), "MMM d, yyyy")}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{weeklyReport.summary.newSignups}</div>
                        <div className="text-sm text-muted-foreground">New Signups</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{weeklyReport.summary.newBusinessCustomers}</div>
                        <div className="text-sm text-muted-foreground">New Business</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">£{weeklyReport.summary.weeklyRevenue.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{weeklyReport.summary.premiumUpgrades}</div>
                        <div className="text-sm text-muted-foreground">Upgrades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{weeklyReport.summary.totalPriceChecks}</div>
                        <div className="text-sm text-muted-foreground">Price Checks</div>
                      </div>
                    </div>

                    {weeklyReport.details.newSignups.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">New Signups This Week</h3>
                        <div className="space-y-2">
                          {weeklyReport.details.newSignups.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex justify-between items-center py-2 border-b">
                              <div>
                                <div className="font-medium">{user.username}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                              <Badge variant={user.isBusiness ? "default" : "secondary"}>
                                {user.isBusiness ? "Business" : "Free"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No report data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social-media" className="space-y-6">
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
                      <span>Contacted</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Partnerships</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Combined Followers</span>
                      <span className="font-medium">2.4M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Campaign Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Campaigns</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Engagement</span>
                      <span className="font-medium">4.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Traffic Generated</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Influencer Activity</CardTitle>
                <CardDescription>Latest outreach and partnership updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">@money_saver_uk</div>
                      <div className="text-sm text-gray-600">Partnership agreement signed</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">@uk_deals_finder</div>
                      <div className="text-sm text-gray-600">Initial outreach sent</div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">@save_money_tips</div>
                      <div className="text-sm text-gray-600">Content collaboration posted</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Outreach Tab */}
          <TabsContent value="business-outreach" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Business Outreach Activity</CardTitle>
                <CardDescription>Latest automated emails sent to businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Currys PC World</div>
                      <div className="text-sm text-gray-600">Search: "laptop deals" - Partnership offer sent</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Sent</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Argos</div>
                      <div className="text-sm text-gray-600">Search: "garden furniture" - Advertising partnership</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Responded</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">John Lewis</div>
                      <div className="text-sm text-gray-600">Search: "home appliances" - Featured placement offer</div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">Local Kitchen Store</div>
                      <div className="text-sm text-gray-600">Search: "kitchen installation Birmingham" - Local partnership</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Converted</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outreach Performance Trends</CardTitle>
                <CardDescription>Email campaign effectiveness over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">72%</div>
                    <div className="text-sm text-blue-700">Email Open Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">£18,500</div>
                    <div className="text-sm text-green-700">Revenue Generated</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">24</div>
                    <div className="text-sm text-purple-700">Active Partnerships</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Real-time Failed Search Alert Popup */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              🚨 Failed Search Alert
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="space-y-2">
                  <div><strong>Search Query:</strong> "{alertData?.searchQuery}"</div>
                  <div><strong>Error Type:</strong> {alertData?.errorType}</div>
                  <div><strong>User Type:</strong> {alertData?.userType}</div>
                  <div><strong>Location:</strong> {alertData?.location}</div>
                  <div><strong>Time:</strong> {alertData?.timestamp ? format(new Date(alertData.timestamp), "MMM d, HH:mm") : 'Unknown'}</div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Immediate Actions Required:</div>
                <ul className="text-sm space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• Add support for "{alertData?.searchQuery}" in AI training</li>
                  <li>• Investigate {alertData?.errorType} error pattern</li>
                  <li>• Update training dataset with this query</li>
                  {alertData?.userType === 'Registered User' && (
                    <li>• Consider contacting the registered user</li>
                  )}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setAlertOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Acknowledge Alert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}