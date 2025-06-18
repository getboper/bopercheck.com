import React from "react";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  CreditCard, 
  Briefcase,
  CheckCircle, 
  ArrowRight,
  Layers,
  PieChart,
  MapPin,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";

export default function BusinessPage() {
  return (
    <>
      <Helmet>
        <title>Advertise Your Business | Reach Local Customers - BoperCheck</title>
        <meta name="description" content="Grow your business with BoperCheck's advertising platform. Connect with customers actively searching for your products and services in your local area." />
        <link rel="canonical" href="https://bopercheck.com/business" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bopercheck.com/business" />
        <meta property="og:title" content="Advertise Your Business | Reach Local Customers - BoperCheck" />
        <meta property="og:description" content="Grow your business with BoperCheck's advertising platform. Connect with customers actively searching for your products and services in your local area." />
        <meta property="og:image" content="https://bopercheck.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advertise Your Business | Reach Local Customers - BoperCheck" />
        <meta name="twitter:description" content="Grow your business with BoperCheck's advertising platform. Connect with customers actively searching for your products and services in your local area." />
        <meta name="twitter:image" content="https://bopercheck.com/og-image.jpg" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-green-500 to-blue-500 text-transparent bg-clip-text">
          Grow Your Business with BoperCheck
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Reach high-intent customers exactly when they're looking for products and services like yours
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/business/signup">
            <Button className="bg-green-500 hover:bg-green-600 py-6 px-8 text-lg">
              Start Advertising Today
            </Button>
          </Link>
          <Button variant="outline" className="py-6 px-8 text-lg" onClick={() => {
            document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            View Pricing Plans
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why BoperCheck Advertising Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Target className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Pinpoint Targeting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Unlike broad social media ads, your business appears exactly when users are searching for your specific products or services.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-md bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-orange-600 h-6 w-6" />
              </div>
              <CardTitle className="text-orange-700">🔥 Massive Voucher Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-medium">
                <strong>85%+ of our searchers</strong> actively look for discount codes and vouchers. Your business can tap into this high-intent audience ready to buy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Higher Conversion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our users are actively looking to make purchases, with 75% completing a transaction within 48 hours of a price check.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Local Customer Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our location-aware technology ensures your business is shown to nearby customers, driving foot traffic and local sales.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Ultra-Fast Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create your business listing in minutes. Your business will start appearing in relevant search results immediately.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Cost-Effective</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pay only for the categories relevant to your business. Plans start at just £35/month with transparent pricing.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <PieChart className="text-green-600 h-6 w-6" />
              </div>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track impressions, clicks, and conversions with our detailed analytics dashboard to measure your ROI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Versus Social Media */}
      <div className="mb-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-bold text-center mb-8">BoperCheck vs. General Social Media Advertising</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-100">
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">BoperCheck</th>
                <th className="p-4 text-center">Social Media Ads</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Customer Intent</td>
                <td className="p-4 text-center text-green-600 font-semibold">High - actively looking to buy</td>
                <td className="p-4 text-center text-gray-500">Low to medium - browsing content</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Targeting Precision</td>
                <td className="p-4 text-center text-green-600 font-semibold">Exact product/service match</td>
                <td className="p-4 text-center text-gray-500">Demographic approximation</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Ad Fatigue</td>
                <td className="p-4 text-center text-green-600 font-semibold">Minimal - shown only when relevant</td>
                <td className="p-4 text-center text-gray-500">High - frequent exposure</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Conversion Rate</td>
                <td className="p-4 text-center text-green-600 font-semibold">Up to 38% higher</td>
                <td className="p-4 text-center text-gray-500">Industry average</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Local Business Focus</td>
                <td className="p-4 text-center text-green-600 font-semibold">Strong location-based matching</td>
                <td className="p-4 text-center text-gray-500">Limited geographic targeting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Demand Statistics */}
      <div className="mb-20 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8 border-2 border-orange-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-800">Voucher Demand Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">85%+</div>
            <p className="text-gray-700">of searchers actively look for vouchers and discount codes</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">65%</div>
            <p className="text-gray-700">more likely to complete purchase with available voucher</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">3x</div>
            <p className="text-gray-700">higher engagement rate for businesses offering vouchers</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-lg font-medium text-orange-800">Your business can tap into this massive voucher-seeking audience</p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div id="pricing-plans" className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-4">Business Advertising Plans</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Choose the plan that works for your business. All plans include real-time analytics and customer insights.
        </p>
        
        {/* Annual Discount Banner */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-8 text-center max-w-lg mx-auto">
          <p className="text-green-800 font-medium">💰 Save 15% with annual billing on all plans!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <Card className="border-2 border-gray-200 hover:border-green-300 transition-all">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl">Basic Plan</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">£35</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                £357/year (save £63)
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>1 active category</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Business logo + contact link</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Displayed on relevant result pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Weekly performance email reports</span>
                </li>
              </ul>
              
              {/* Add-ons dropdown */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Add-ons Available:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Extra category</span>
                    <span className="font-medium">+£10/month</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Priority positioning</span>
                    <span className="font-medium">+£15/month</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Extended description</span>
                    <span className="font-medium">+£8/month</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => window.location.href = '/business/signup?plan=basic'}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-2 border-green-500 shadow-lg relative transition-all">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">MOST POPULAR</span>
            </div>
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">£85</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                £867/year (save £153)
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Priority listing on result pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Full business profile (photos, description, social links)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Detailed weekly performance reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI-suggested category add-ons</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">🎯 AI-Suggested Categories for Your Business</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Example: If you select "Decking," our AI will suggest related categories:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white rounded-md p-2 text-sm">
                      <span className="font-medium">Kitchen Fitting</span>
                      <div className="text-xs text-gray-600">+£10/month</div>
                    </div>
                    <div className="bg-white rounded-md p-2 text-sm">
                      <span className="font-medium">Staircase Builds</span>
                      <div className="text-xs text-gray-600">+£10/month</div>
                    </div>
                    <div className="bg-white rounded-md p-2 text-sm">
                      <span className="font-medium">Bespoke Carpentry</span>
                      <div className="text-xs text-gray-600">+£10/month</div>
                    </div>
                    <div className="bg-white rounded-md p-2 text-sm">
                      <span className="font-medium">Garden Structures</span>
                      <div className="text-xs text-gray-600">+£10/month</div>
                    </div>
                  </div>
                  <div className="bg-green-100 border border-green-300 rounded-md p-2">
                    <p className="text-xs text-green-700">
                      💡 <strong>Smart Upgrade:</strong> Add individual categories for £10/month each or upgrade to Featured Partner for full access to all 10 categories!
                    </p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        <span className="font-medium">Pro tip:</span> Businesses with related categories see an average <span className="font-semibold">58% increase</span> in customer engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => window.location.href = '/business/signup?plan=pro'}
              >
                Select Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Featured Partner Plan */}
          <Card className="border-2 border-amber-300 hover:border-amber-400 transition-all bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Featured Partner Plan</CardTitle>
                <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">PREMIUM</div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">£175</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                £1,785/year (save £315)
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Up to 10 categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Homepage featured placement (rotating spot)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>"Featured Business" badge in result listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>AI-powered marketing prompts (improve reach)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Social media shoutout on our platforms (1/month)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Concierge setup support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Weekly detailed performance analytics via email</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => window.location.href = '/business/signup?plan=featured'}
              >
                Get Featured
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need a custom solution for your business?</p>
          <Button variant="outline">Contact Our Sales Team</Button>
        </div>
      </div>
      
      {/* Listing Management */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Easy Business Listing Management</h2>
        
        <Tabs defaultValue="setup" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="setup">Quick Setup</TabsTrigger>
            <TabsTrigger value="customize">Customize Your Listing</TabsTrigger>
            <TabsTrigger value="track">Track Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-4">Set Up in Minutes</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5 font-bold">1</div>
                    <div>
                      <p className="font-medium">Create your business account</p>
                      <p className="text-gray-600 text-sm">Enter your basic business information and select your industry</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5 font-bold">2</div>
                    <div>
                      <p className="font-medium">Select your product categories</p>
                      <p className="text-gray-600 text-sm">Choose the product types where you want your business to appear</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5 font-bold">3</div>
                    <div>
                      <p className="font-medium">Define your service area</p>
                      <p className="text-gray-600 text-sm">Set your location and radius to target customers in your service area</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5 font-bold">4</div>
                    <div>
                      <p className="font-medium">Choose your plan and go live</p>
                      <p className="text-gray-600 text-sm">Select a subscription plan that fits your business needs</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 w-full max-w-xs h-64 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-4">Customization Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Business profile customization</p>
                      <p className="text-gray-600 text-sm">Add your logo, business hours, services offered, and business description</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Layers className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Product showcase</p>
                      <p className="text-gray-600 text-sm">Highlight your products or services with images and detailed descriptions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Location targeting</p>
                      <p className="text-gray-600 text-sm">Fine-tune your geographic targeting to reach your ideal customers</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button>Learn More About Customization</Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 w-full max-w-xs h-64 rounded-lg flex items-center justify-center">
                  <Settings className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="track" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <PieChart className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Weekly performance email reports</p>
                      <p className="text-gray-600 text-sm">Receive detailed analytics on impressions, clicks, and conversions every Monday</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Customer insights</p>
                      <p className="text-gray-600 text-sm">Understand who's viewing your listing and what they're searching for</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">ROI reporting</p>
                      <p className="text-gray-600 text-sm">Measure the value of your investment with detailed ROI metrics</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button>Request Instant Report</Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 w-full max-w-xs h-64 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow your business?</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of businesses reaching new customers through targeted, high-intent advertising on BoperCheck
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-white text-green-600 hover:bg-gray-100 py-6 px-8 text-lg"
            onClick={() => window.location.href = '/business-dashboard'}
          >
            Create Your Business Listing <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-green-400 py-6 px-8 text-lg"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Sales Team
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}