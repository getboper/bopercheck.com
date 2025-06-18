import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { BarChart3, Users, Search, MapPin, TrendingUp, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

interface AnalyticsData {
  totalSearches: number;
  recentSearchesCount: number;
  popularItems: Array<{ item: string; count: number }>;
  locationStats: Array<{ category: string; count: number }>;
  recentSearches: Array<{ item: string; category: string; createdAt: string }>;
  visitorStats: {
    totalUniqueVisitors: number;
    dailyVisitors: number;
    weeklyVisitors: number;
  };
  generatedAt: string;
}

interface VisitorAnalytics {
  totalVisitors: number;
  registeredVisitors: number;
  conversionRate: number;
  topReferrers: Array<{ referrer: string; count: number }>;
  deviceBreakdown: Array<{ deviceType: string; count: number }>;
  dailyVisitors: Array<{ date: string; visitors: number; conversions: number }>;
}

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, userLoading, userError] = useAuthState(auth);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is authorized admin
  const isAuthorizedAdmin = user?.email === "njpards1@gmail.com";

  useEffect(() => {
    if (!userLoading) {
      if (!user || !isAuthorizedAdmin) {
        // Redirect unauthorized users to admin login
        setLocation("/admin/login");
        return;
      }
      // Auto-fetch analytics for authorized users
      fetchAnalytics();
      fetchVisitorAnalytics();
    }
  }, [user, userLoading, isAuthorizedAdmin, setLocation]);

  const fetchVisitorAnalytics = async () => {
    if (!user || !isAuthorizedAdmin) return;
    
    try {
      const idToken = await user.getIdToken();
      const credentials = btoa(JSON.stringify({ 
        email: user.email, 
        password: 'admin123' 
      }));
      
      const response = await fetch('/api/admin/visitor-analytics', {
        headers: {
          'Authorization': `Bearer ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVisitorAnalytics(data.analytics);
      } else {
        console.error('Failed to fetch visitor analytics');
      }
    } catch (error) {
      console.error('Error fetching visitor analytics:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!user || !isAuthorizedAdmin) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/admin/analytics");
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorizedAdmin) {
    // This will trigger the useEffect redirect, but render nothing
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Analytics | BoperCheck</title>
        <meta name="description" content="BoperCheck admin analytics dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Analytics</h1>
          <p className="text-gray-600 mt-2">BoperCheck platform insights and metrics</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchAnalytics} disabled={loading} variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
          <Button onClick={handleSignOut} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {analyticsData && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Search className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{analyticsData.totalSearches}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Recent Searches (30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{analyticsData.recentSearchesCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">{analyticsData.popularItems.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">{analyticsData.locationStats.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Visitor Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.visitorStats.totalUniqueVisitors}</div>
                  <div className="text-sm text-gray-600">Total Unique Visitors</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.visitorStats.weeklyVisitors}</div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.visitorStats.dailyVisitors}</div>
                  <div className="text-sm text-gray-600">Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Items */}
          <Card>
            <CardHeader>
              <CardTitle>Most Searched Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.popularItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{item.item}</span>
                    <span className="text-sm text-gray-600">{item.count} searches</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Top Search Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.locationStats.map((category, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{category.category || 'Uncategorized'}</span>
                    <span className="text-sm text-gray-600">{category.count} searches</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visitor Conversion Analytics */}
          {visitorAnalytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Visitor Conversion Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{visitorAnalytics.totalVisitors}</div>
                    <div className="text-sm text-gray-600">Total Visitors</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{visitorAnalytics.registeredVisitors}</div>
                    <div className="text-sm text-gray-600">Registered Users</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{visitorAnalytics.conversionRate}%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {visitorAnalytics.dailyVisitors.reduce((sum, day) => sum + day.conversions, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Conversions</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Top Referrers */}
                  <div>
                    <h4 className="font-semibold mb-3">Top Traffic Sources</h4>
                    <div className="space-y-2">
                      {visitorAnalytics.topReferrers.map((referrer, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{referrer.referrer}</span>
                          <span className="text-sm text-gray-600">{referrer.count} visitors</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-3">Device Types</h4>
                    <div className="space-y-2">
                      {visitorAnalytics.deviceBreakdown.map((device, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{device.deviceType}</span>
                          <span className="text-sm text-gray-600">{device.count} visitors</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Daily Visitor Chart */}
                {visitorAnalytics.dailyVisitors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">7-Day Visitor & Conversion Trend</h4>
                    <div className="space-y-2">
                      {visitorAnalytics.dailyVisitors.map((day, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                          <div className="flex gap-4">
                            <span className="text-sm text-blue-600">{day.visitors} visitors</span>
                            <span className="text-sm text-green-600">{day.conversions} conversions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Search Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.recentSearches.map((search, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <div>
                      <span className="font-medium">{search.item}</span>
                      {search.category && (
                        <span className="text-sm text-gray-600 ml-2">in {search.category}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            Data generated at: {new Date(analyticsData.generatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;