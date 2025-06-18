import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CreditCard, 
  Search, 
  Clock, 
  Users, 
  Award, 
  Download, 
  Share2,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Building2,
  DollarSign,
  Target,
  BarChart3,
  TrendingUp,
  Plus,
  Settings,
  Activity,
  Eye,
  MessageSquare
} from "lucide-react";

interface PriceCheckHistory {
  item: string;
  timestamp: { seconds: number; nanoseconds: number };
  result: {
    marketValue: number;
    dealRating: number;
    lowestPrice: number;
    currency: string;
  };
}

const DashboardPage = () => {
  const { user, userData, loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !userData) {
    return null; // Will redirect to login via useEffect
  }
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    // Handle different timestamp formats
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };
  
  const priceChecks: PriceCheckHistory[] = userData.priceChecks || [];
  const referrals = userData.referrals || [];
  const referralCode = userData.referralCode || '';
  const credits = userData.credits || 0;

  // Fetch admin stats for the owner
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats').then(res => res.json()),
    enabled: !!user // Only fetch when user is logged in
  });

  // Fetch users data for admin section
  const { data: allUsers } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('GET', '/api/admin/users').then(res => res.json()),
    enabled: !!user
  });

  // Fetch businesses data for admin section
  const { data: businesses } = useQuery({
    queryKey: ['/api/admin/businesses'],
    queryFn: () => apiRequest('GET', '/api/admin/businesses').then(res => res.json()),
    enabled: !!user
  });

  // Add credits mutation
  const addCreditsMutation = useMutation({
    mutationFn: (data: { userId: number; amount: number }) =>
      apiRequest('POST', '/api/admin/add-credits', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Credits added successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUserId(null);
      setCreditAmount('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add credits', variant: 'destructive' });
    },
  });

  // Export data mutation
  const exportDataMutation = useMutation({
    mutationFn: (type: string) =>
      apiRequest('GET', `/api/admin/export/${type}`).then(res => res.blob()),
    onSuccess: (blob: Blob, type: string) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bopercheck-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: 'Success', description: `${type} data exported successfully` });
    },
  });

  const handleAddCredits = () => {
    if (selectedUserId && creditAmount) {
      addCreditsMutation.mutate({ 
        userId: selectedUserId, 
        amount: parseInt(creditAmount) 
      });
    }
  };

  const filteredUsers = allUsers?.filter((user: any) =>
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const getDealBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-100 text-green-800">Excellent Deal</Badge>;
    if (rating >= 3.5) return <Badge className="bg-blue-100 text-blue-800">Good Deal</Badge>;
    if (rating >= 2.5) return <Badge className="bg-yellow-100 text-yellow-800">Fair Deal</Badge>;
    return <Badge className="bg-red-100 text-red-800">Below Average</Badge>;
  };
  
  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - BoperCheck</title>
        <meta name="description" content="View your BoperCheck dashboard. Manage your price checks, credits, and referrals in one place." />
        <link rel="canonical" href="https://bopercheck.com/dashboard" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome, {userData.username}</h1>
          <p className="text-muted-foreground mb-8">Manage your price checks, credits, and referrals</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  Available Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{credits}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  For PDF downloads & vouchers
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/pricing")}
                >
                  Buy Credits
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  Price Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{priceChecks.length}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {priceChecks.length > 0 
                    ? `Last check: ${formatDate(priceChecks[0].timestamp)}` 
                    : 'No price checks yet'}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/price-check")}
                >
                  New Price Check
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{referrals.length}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Earn 1 credit per referral
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={copyReferralLink}
                >
                  Copy Referral Link
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Tabs defaultValue="price-checks">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="price-checks">My Activity</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="platform-overview">Platform Stats</TabsTrigger>
              <TabsTrigger value="user-management">User Management</TabsTrigger>
              <TabsTrigger value="business-tools">Business Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price-checks">
              <Card>
                <CardHeader>
                  <CardTitle>Price Check History</CardTitle>
                  <CardDescription>
                    View all your previous price analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {priceChecks.length > 0 ? (
                    <div className="space-y-4">
                      {priceChecks.map((check, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:border-primary transition cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{check.item}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(check.timestamp)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">
                                {formatCurrency(check.result.marketValue, check.result.currency)}
                              </p>
                              {getDealBadge(check.result.dealRating)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              Best price: <span className="font-medium">{formatCurrency(check.result.lowestPrice, check.result.currency)}</span>
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" /> PDF
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4 mr-1" /> Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No price checks yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't performed any price checks yet. All searches are completely free!
                      </p>
                      <Button
                        onClick={() => navigate("/price-check")}
                      >
                        Start Your Free Search
                      </Button>
                    </div>
                  )}
                </CardContent>
                {priceChecks.length > 5 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Price Checks
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                  <CardDescription>
                    Share BoperCheck and earn free credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Your Referral Code</h3>
                    <div className="flex items-center">
                      <span className="bg-white px-4 py-2 rounded border font-mono text-lg flex-grow">{referralCode}</span>
                      <Button 
                        variant="outline" 
                        className="ml-3"
                        onClick={copyReferralLink}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Share this code or link with friends. When they sign up, you both get 1 credit for premium features!
                    </p>
                  </div>
                  
                  <h3 className="font-semibold mb-4">Your Referrals</h3>
                  {referrals.length > 0 ? (
                    <div className="space-y-3">
                      {referrals.map((referral, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">User {truncateText(referral, 10)}</p>
                              <p className="text-xs text-muted-foreground">Joined via your referral</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">+1 Credit</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Share your referral code with friends and earn free credits when they sign up.
                      </p>
                      <Button
                        onClick={() => navigate("/referral")}
                      >
                        Learn More About Referrals
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/referral")}
                  >
                    Manage Referrals
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Platform Overview Tab */}
            <TabsContent value="platform-overview" className="space-y-6">
              {/* Platform Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.newUsersThisWeek || 0} this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalBusinesses || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.activeBusinessPlans?.basic || 0} Basic, {stats?.activeBusinessPlans?.pro || 0} Pro, {stats?.activeBusinessPlans?.featured || 0} Featured
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£{stats?.totalRevenue?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      All time earnings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Price Checks</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalPriceChecks || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Total analyses performed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan Type</CardTitle>
                  <CardDescription>Monthly recurring revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        £{((stats?.activeBusinessPlans?.basic || 0) * 49).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Basic Plans MRR</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        £{((stats?.activeBusinessPlans?.pro || 0) * 149).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Pro Plans MRR</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">
                        £{((stats?.activeBusinessPlans?.featured || 0) * 299).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Featured Plans MRR</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="user-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={() => exportDataMutation.mutate('users')}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="secondary">{user.credits} credits</Badge>
                          <div className="text-xs text-muted-foreground">
                            {user.totalReferrals} referrals • {user.totalPriceChecks} checks
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Tools Tab */}
            <TabsContent value="business-tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Credits to User</CardTitle>
                    <CardDescription>Manually add credits to any user account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select User</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                      >
                        <option value="">Choose a user...</option>
                        {allUsers?.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.email}) - {user.credits} credits
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Credits to Add</label>
                      <Input
                        type="number"
                        placeholder="Enter amount..."
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleAddCredits}
                      disabled={!selectedUserId || !creditAmount || addCreditsMutation.isLoading}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Credits
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download platform data as CSV files</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => exportDataMutation.mutate('users')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Users Data
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('businesses')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Business Data
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('price-checks')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Price Checks
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('revenue')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Revenue Data
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('guests')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Guest Users
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('platform-failures')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Platform Errors
                    </Button>
                    <Button 
                      onClick={() => exportDataMutation.mutate('analytics-summary')}
                      variant="outline" 
                      className="w-full"
                      disabled={exportDataMutation.isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Analytics Summary
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Business Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Advertisers</CardTitle>
                  <CardDescription>Monitor business subscriptions and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businesses?.map((business: any) => (
                      <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{business.businessName || 'Business'}</div>
                          <div className="text-sm text-muted-foreground">{business.email || 'No email'}</div>
                          <div className="flex gap-2">
                            {business.categories?.map((category: string) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge 
                            variant={business.plan === 'featured' ? 'default' : business.plan === 'pro' ? 'secondary' : 'outline'}
                          >
                            {business.plan} plan
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            £{business.monthlyRevenue}/month
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {business.impressions} views • {business.clicks} clicks
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account details and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Details</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Username</p>
                          <p className="font-medium">{userData.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Member Since</p>
                          <p className="font-medium">
                            {new Date(userData.createdAt).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Credits</p>
                          <p className="font-medium">{credits} credits available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Credit Usage</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Used Credits</span>
                            <span className="text-sm font-medium">{priceChecks.length}</span>
                          </div>
                          <Progress value={(priceChecks.length / (priceChecks.length + credits)) * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Remaining Credits</span>
                            <span className="text-sm font-medium">{credits}</span>
                          </div>
                          <Progress value={(credits / (priceChecks.length + credits)) * 100} className="bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Options</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-between">
                        Change Password <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full justify-between">
                        Update Email <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full justify-between text-red-500 hover:text-red-700 hover:bg-red-50">
                        Delete Account <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-center border-b">
              <Sparkles className="h-6 w-6 text-yellow-500 mr-3" />
              <h2 className="text-xl font-semibold">Special Offers</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 hover:border-primary transition cursor-pointer">
                <h3 className="font-semibold mb-2">Bulk Credit Discount</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get 40% off when you purchase our 25-credit pack!
                </p>
                <Button variant="outline" size="sm">
                  View Offer
                </Button>
              </div>
              <div className="border rounded-lg p-4 hover:border-primary transition cursor-pointer">
                <h3 className="font-semibold mb-2">Refer 5 Friends, Get 5 Bonus Credits</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Limited time offer! Refer 5 friends and get 5 extra credits.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { User, Copy } from "lucide-react";

export default DashboardPage;
