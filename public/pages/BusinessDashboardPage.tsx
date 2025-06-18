import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  LineChart, 
  Users, 
  ArrowUpRight, 
  Share2, 
  Download, 
  BarChart3, 
  FileText, 
  Camera, 
  Upload, 
  Edit, 
  LayoutDashboard, 
  Settings, 
  Building, 
  MapPin
} from "lucide-react";

// Sample data for charts
const performanceData = [
  { name: "Mon", views: 42, clicks: 24, downloads: 5 },
  { name: "Tue", views: 58, clicks: 32, downloads: 8 },
  { name: "Wed", views: 45, clicks: 28, downloads: 6 },
  { name: "Thu", views: 65, clicks: 40, downloads: 10 },
  { name: "Fri", views: 78, clicks: 52, downloads: 14 },
  { name: "Sat", views: 42, clicks: 28, downloads: 9 },
  { name: "Sun", views: 35, clicks: 22, downloads: 7 },
];

const categoryData = [
  { name: "Garden & Outdoor", value: 35 },
  { name: "Home Improvement", value: 42 },
  { name: "Furniture", value: 23 },
];

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function BusinessDashboardPage() {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "Premium Outdoor Living",
    tagline: "Quality garden furniture & decking solutions",
    description: "We specialize in high-quality outdoor living solutions, from custom decking to premium garden furniture. All our products come with a 15-year guarantee and professional installation.",
    phone: "07700 900000",
    email: "info@premiumoutdoorliving.co.uk",
    website: "premiumoutdoorliving.co.uk",
    address: "15 Garden Way, Plymouth, PL1 1AA"
  });
  
  // Sample images
  const businessImages = [
    "/placeholder-business-1.jpg",
    "/placeholder-business-2.jpg",
    "",
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="bg-green-500 p-3 rounded-full">
          <Building className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Business Dashboard</h1>
          <p className="text-gray-600 text-lg mt-2">
            Monitor your performance and manage your business profile
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full bg-gray-50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="flex-1 p-3 data-[state=active]:bg-white">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 p-3 data-[state=active]:bg-white">
            <Building className="h-4 w-4 mr-2" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 p-3 data-[state=active]:bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 p-3 data-[state=active]:bg-white">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Views</p>
                    <p className="text-3xl font-bold">365</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12% from last week
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Website Clicks</p>
                    <p className="text-3xl font-bold">226</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8% from last week
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Share2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">PDF Downloads</p>
                    <p className="text-3xl font-bold">59</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      15% from last week
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold">62%</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      5% from last week
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <LineChart className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Views, clicks and downloads over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#viewsGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#clicksGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="downloads"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#downloadsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Business Summary */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Your Business Summary</CardTitle>
              <CardDescription>
                Quick overview of your business profile and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-gray-100 rounded-lg h-32 w-32 flex items-center justify-center border border-gray-200">
                  {/* Placeholder for company logo */}
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-1">{companyInfo.companyName}</h3>
                  <p className="text-gray-500 mb-4">{companyInfo.tagline}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Advertising Plan</h4>
                      <p className="font-medium">Professional Plan</p>
                      <p className="text-sm text-gray-600">3 product categories, Regional coverage</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Subscription Status</h4>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Active
                        </span>
                        <span className="text-sm text-gray-600">Renews on June 23, 2025</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Featured Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Garden & Outdoor
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Home Improvement
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Furniture
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Location</h4>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">Plymouth, England (50 mile radius)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-end gap-4">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Business Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Keep your business information up to date to attract more customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline (50 characters max)</Label>
                    <Input 
                      id="tagline" 
                      value={companyInfo.tagline}
                      onChange={(e) => setCompanyInfo({...companyInfo, tagline: e.target.value})}
                      maxLength={50}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Business Description (250 characters max)</Label>
                  <Textarea 
                    id="description" 
                    value={companyInfo.description}
                    onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
                    maxLength={250}
                    className="mt-1 h-24"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Input 
                      id="address" 
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                {/* Logo Upload */}
                <div>
                  <Label className="block mb-2">Company Logo</Label>
                  <div className="flex items-center gap-6">
                    <div className="bg-gray-100 rounded-lg h-24 w-24 flex items-center justify-center border border-gray-200">
                      <Building className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 200x200px. Max file size: 2MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Business Images */}
                <div>
                  <Label className="block mb-2">Business Images (up to 3)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {businessImages.map((image, index) => (
                      <div 
                        key={index}
                        className="border rounded-lg overflow-hidden relative h-48"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`Business image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                          <Button 
                            className="opacity-0 hover:opacity-100"
                            onClick={() => setActiveImage(index)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended size: 800x600px. Max file size: 5MB per image.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-green-500 hover:bg-green-600">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance by Day */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
                <CardDescription>
                  Views, clicks and downloads by day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#10B981" name="Views" />
                      <Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
                      <Bar dataKey="downloads" fill="#8B5CF6" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Category Distribution */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Distribution of interest across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Analytics */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Comprehensive view of your business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left font-medium text-gray-600">Date</th>
                      <th className="p-4 text-left font-medium text-gray-600">Page Views</th>
                      <th className="p-4 text-left font-medium text-gray-600">Website Clicks</th>
                      <th className="p-4 text-left font-medium text-gray-600">PDF Downloads</th>
                      <th className="p-4 text-left font-medium text-gray-600">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 16, 2025</td>
                      <td className="p-4">42</td>
                      <td className="p-4">24</td>
                      <td className="p-4">5</td>
                      <td className="p-4">57%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 17, 2025</td>
                      <td className="p-4">58</td>
                      <td className="p-4">32</td>
                      <td className="p-4">8</td>
                      <td className="p-4">55%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 18, 2025</td>
                      <td className="p-4">45</td>
                      <td className="p-4">28</td>
                      <td className="p-4">6</td>
                      <td className="p-4">62%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 19, 2025</td>
                      <td className="p-4">65</td>
                      <td className="p-4">40</td>
                      <td className="p-4">10</td>
                      <td className="p-4">62%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 20, 2025</td>
                      <td className="p-4">78</td>
                      <td className="p-4">52</td>
                      <td className="p-4">14</td>
                      <td className="p-4">67%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 21, 2025</td>
                      <td className="p-4">42</td>
                      <td className="p-4">28</td>
                      <td className="p-4">9</td>
                      <td className="p-4">67%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4">May 22, 2025</td>
                      <td className="p-4">35</td>
                      <td className="p-4">22</td>
                      <td className="p-4">7</td>
                      <td className="p-4">63%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Subscription Plan</h3>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Professional Plan</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        £99/month • Next billing date: June 23, 2025
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Upgrade Plan</Button>
                      <Button variant="outline" size="sm">Manage Payment</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Performance Reports</p>
                        <p className="text-gray-600 text-sm">Receive weekly analytics about your listing</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Performance Alerts</p>
                        <p className="text-gray-600 text-sm">Get notified about significant changes in performance</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Feature Announcements</p>
                        <p className="text-gray-600 text-sm">Stay updated about new BoperCheck features</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-green-500 hover:bg-green-600">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}