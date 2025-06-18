import { Helmet } from "react-helmet";
import { SEOHead, seoConfigs } from "@/components/SEOHead";
import Hero from "@/components/home/Hero";
import SimplePriceCheckForm from "@/components/price-checker/SimplePriceCheckForm";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, CheckCircle } from "lucide-react";
import SEOContent from "@/components/seo/SEOContent";
import { BusinessSignupCTA } from "@/components/business/BusinessSignupCTA";

// Simple HomePage without complex viral features to ensure it loads
const SimpleHomePage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead {...seoConfigs.home} />

      <Hero />
      <SimplePriceCheckForm />
      
      {/* Discrete admin access - only visible as small dot in footer */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/admin-login"
          className="w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full opacity-20 hover:opacity-60 transition-all duration-300"
          title="Admin"
        ></a>
      </div>
      
      {/* Simple Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Thousands of Smart Savers
            </h2>
            <p className="text-xl text-gray-600">
              Real people, real savings, real results
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">1,960</div>
              <div className="text-sm text-gray-600">Price Checks</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">£47,000+</div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-purple-600">947</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-orange-600">£24</div>
              <div className="text-sm text-gray-600">Avg. Savings</div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Savings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Sarah M. from Manchester</div>
                      <div className="text-xs text-gray-500">Kitchen Appliances</div>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">£156</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">James L. from London</div>
                      <div className="text-xs text-gray-500">Garden Tools</div>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">£89</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Emma T. from Birmingham</div>
                      <div className="text-xs text-gray-500">Home Electronics</div>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">£234</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Viral Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Earn While You Save
            </h2>
            <p className="text-xl text-gray-600">
              Share your savings and earn rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Refer Friends</h3>
              <p className="text-sm text-gray-600">Earn 1 credit for each friend who uses BoperCheck</p>
              <div className="mt-4">
                <a href="/referrals" className="text-blue-600 font-medium hover:underline">
                  Start Referring →
                </a>
              </div>
            </Card>
            
            <Card className="text-center p-6">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Share Savings</h3>
              <p className="text-sm text-gray-600">Show off your deals on social media</p>
              <div className="mt-4">
                <span className="text-green-600 font-medium">Share & Earn</span>
              </div>
            </Card>
            
            <Card className="text-center p-6">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your savings and achievements</p>
              <div className="mt-4">
                <span className="text-purple-600 font-medium">View Dashboard</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHomePage;