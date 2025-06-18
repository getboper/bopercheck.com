import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Search, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AdminStats {
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
    recent: Array<{
      id: string;
      email?: string;
      createdAt: string;
      type: 'guest' | 'registered';
    }>;
  };
  searches: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    recent: Array<{
      id: number;
      item: string;
      location?: string;
      createdAt: string;
      type: 'guest' | 'user';
    }>;
  };
  system: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    lastCheck: string;
    errors: number;
  };
}

const defaultStats: AdminStats = {
  overview: {
    totalSearches: 0,
    todaySearches: 0,
    totalUsers: 0,
    totalGuestUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  },
  users: {
    total: 0,
    guests: 0,
    active: 0,
    registered: 0,
    recent: [],
  },
  searches: {
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    recent: [],
  },
  system: {
    status: 'healthy',
    uptime: 99.9,
    lastCheck: new Date().toISOString(),
    errors: 0,
  },
};

export default function SimpleAdminDashboard() {
  const { data: stats = defaultStats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="destructive">Connection Error</Badge>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Unable to load dashboard data. Please check your connection.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getSystemStatusColor(stats.system.status)}`}></div>
          <Badge variant={stats.system.status === 'healthy' ? 'default' : 'destructive'}>
            {stats.system.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalSearches.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.todaySearches} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.system.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.system.errors} errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              £{stats.overview.monthlyRevenue} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.searches.recent.length > 0 ? (
                stats.searches.recent.slice(0, 5).map((search) => (
                  <div key={search.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{search.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {search.location || 'No location'} • {search.type}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent searches</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.users.recent.length > 0 ? (
                stats.users.recent.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.email || 'Guest User'}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.type} • {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={user.type === 'registered' ? 'default' : 'secondary'}>
                      {user.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent users</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Database: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>API: Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Search: Functional</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Last checked: {new Date(stats.system.lastCheck).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}