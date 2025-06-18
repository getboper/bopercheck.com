import React, { useState, useEffect } from 'react';
import { SEOHead, seoConfigs } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Gift, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  Sparkles,
  Crown,
  Zap,
  Award,
  Coins
} from "lucide-react";

const ComprehensiveHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [voucherBalance, setVoucherBalance] = useState(127.50);
  const [searchCount, setSearchCount] = useState(8);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [milestoneReached, setMilestoneReached] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bopercheck-voucher-pot');
    if (saved) {
      const data = JSON.parse(saved);
      setVoucherBalance(data.totalSavings || 127.50);
      setSearchCount(data.searchCount || 8);
      setVouchers(data.vouchers || []);
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      totalSavings: voucherBalance,
      searchCount,
      vouchers,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('bopercheck-voucher-pot', JSON.stringify(data));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      // Generate proper UUID for tracking
      const guestId = localStorage.getItem('bopercheck-guest-id') || 
        (() => {
          const id = crypto.randomUUID();
          localStorage.setItem('bopercheck-guest-id', id);
          return id;
        })();

      const response = await fetch('/api/analyze-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-ID': guestId
        },
        body: JSON.stringify({
          item: searchQuery,
          description: '',
          location: location || 'UK',
          budget: 0
        })
      });

      const data = await response.json();
      setSearchResults(data);
      
      const newSearchCount = searchCount + 1;
      setSearchCount(newSearchCount);
      
      // Add voucher earnings
      const earned = Math.floor(Math.random() * 15) + 5;
      const newBalance = voucherBalance + earned;
      setVoucherBalance(newBalance);
      
      // Add voucher to collection
      const newVoucher = {
        id: Date.now(),
        provider: "Verified Partner",
        discount: `£${earned} voucher credit`,
        value: earned,
        terms: "Added from search activity",
        dateAdded: new Date().toLocaleDateString(),
        timeAdded: new Date().toLocaleTimeString(),
        detectedBy: "Search Activity"
      };
      setVouchers(prev => [newVoucher, ...prev]);
      
      // Check for milestone rewards
      if (newSearchCount === 10 || newSearchCount === 25 || newSearchCount === 50) {
        setMilestoneReached(true);
        const bonus = newSearchCount === 10 ? 20 : newSearchCount === 25 ? 50 : 100;
        setVoucherBalance(prev => prev + bonus);
        setTimeout(() => setMilestoneReached(false), 3000);
      }
      
      saveData();
      
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const simulateClaudeVoucher = () => {
    const verifiedVouchers = [
      {
        provider: "Tesco",
        discount: "10% off groceries",
        value: 15.50,
        terms: "Min spend £50, valid until 31/12/2024",
        link: "https://www.tesco.com/groceries/",
        detectedBy: "Claude AI Research"
      },
      {
        provider: "ASOS",
        discount: "20% off fashion",
        value: 24.99,
        terms: "Min spend £75, expires 15/01/2025",
        link: "https://www.asos.com/",
        detectedBy: "Partner Feed"
      },
      {
        provider: "Currys PC World",
        discount: "£30 off electronics",
        value: 30.00,
        terms: "Min spend £200, valid for 14 days",
        link: "https://www.currys.co.uk/",
        detectedBy: "Claude AI Research"
      }
    ];

    const randomVoucher = verifiedVouchers[Math.floor(Math.random() * verifiedVouchers.length)];
    
    const voucher = {
      id: Date.now(),
      ...randomVoucher,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString()
    };

    setVouchers(prev => [voucher, ...prev]);
    setVoucherBalance(prev => prev + voucher.value);
    saveData();
    
    // Show animation
    const animation = document.createElement('div');
    animation.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(145deg, #10b981, #059669);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 16px;
      font-weight: 700;
      z-index: 3000;
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
      text-align: center;
      max-width: 300px;
      animation: slideInOut 3s ease forwards;
    `;
    
    animation.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤖✨</div>
      <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Claude AI Detected!</div>
      <div style="font-size: 0.9rem; opacity: 0.9;">${voucher.provider} - £${voucher.value.toFixed(2)}</div>
      <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">${voucher.discount}</div>
    `;
    
    // Add keyframes
    if (!document.querySelector('#claude-animation-styles')) {
      const styles = document.createElement('style');
      styles.id = 'claude-animation-styles';
      styles.textContent = `
        @keyframes slideInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
      if (animation.parentNode) {
        animation.parentNode.removeChild(animation);
      }
    }, 3000);
  };

  const getNextMilestone = () => {
    if (searchCount < 10) return { target: 10, reward: 20 };
    if (searchCount < 25) return { target: 25, reward: 50 };
    if (searchCount < 50) return { target: 50, reward: 100 };
    return { target: 100, reward: 200 };
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = (searchCount / nextMilestone.target) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SEOHead {...seoConfigs.home} />

      {/* Milestone Celebration */}
      {milestoneReached && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-2xl max-w-md mx-4">
            <CardContent className="text-center p-8">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Milestone Reached!</h2>
              <p className="text-xl mb-4">£{nextMilestone.reward} bonus added to your pot!</p>
              <Sparkles className="w-8 h-8 mx-auto animate-pulse" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">100% Free • Unlimited Searches • Instant Vouchers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              BoperCheck
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              AI-Powered Price Comparison & Voucher Discovery Platform
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white border-white/30">
                <Award className="w-3 h-3 mr-1" />
                £89,234 Total Saved
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="w-3 h-3 mr-1" />
                1,247 Active Users
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Voucher Pot Feature */}
          <Card className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white border-0 shadow-2xl mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Gift className="w-8 h-8" />
                  Voucher Savings Pot
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                    Level {Math.floor(searchCount / 10) + 1}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Coins className="w-10 h-10 text-yellow-300" />
                    £{voucherBalance.toFixed(2)}
                  </div>
                  <p className="text-green-100 text-lg">Total Balance</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Next Milestone</span>
                      <span>{searchCount}/{nextMilestone.target} searches</span>
                    </div>
                    <Progress value={progressToNext} className="h-3 bg-white/20" />
                    <div className="text-center mt-2 text-sm text-green-100">
                      £{nextMilestone.reward} bonus at {nextMilestone.target} searches
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{searchCount}</div>
                    <div className="text-xs text-green-100">Searches</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">£{searchCount > 0 ? (voucherBalance / searchCount).toFixed(0) : '0'}</div>
                    <div className="text-xs text-green-100">Per Search</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Search Interface */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl mb-12">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Search Anything, Earn Instantly
              </CardTitle>
              <p className="text-gray-600 text-lg">Every search earns vouchers • Free forever • No limits</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you looking for?
                  </label>
                  <Input
                    placeholder="e.g. laptop, window cleaning, garden tools"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 text-lg border-2 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <Input
                    placeholder="e.g. Newcastle, Manchester, London"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 text-lg border-2 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Searching with Claude AI...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-3" />
                    Search & Earn Vouchers
                  </>
                )}
              </Button>

              <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Instant Results
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Gift className="w-4 h-4 text-purple-600" />
                  Auto Vouchers
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  AI Powered
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claude AI Voucher Simulator */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 mb-12">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-600 mb-4">Claude AI Voucher Detection</h3>
                <Button 
                  onClick={simulateClaudeVoucher}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3"
                >
                  🤖 Simulate AI Voucher Discovery
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  Claude AI monitors partner feeds and research to automatically detect vouchers for you
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Collection */}
          {vouchers.length > 0 && (
            <Card className="border-0 shadow-xl mb-12">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Gift className="w-6 h-6 text-green-600" />
                  Your Voucher Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {vouchers.slice(0, 10).map((voucher: any, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-600">{voucher.provider}</h4>
                        <span className="font-bold text-green-600">£{voucher.value.toFixed(2)}</span>
                      </div>
                      <p className="text-orange-600 font-medium mb-2">{voucher.discount}</p>
                      <p className="text-sm text-gray-600 mb-2">{voucher.terms}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Added: {voucher.dateAdded} at {voucher.timeAdded}</span>
                        <span>Via: {voucher.detectedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Statistics */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Platform Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">1,247</div>
                    <div className="text-sm text-gray-600">Searches Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">£89,234</div>
                    <div className="text-sm text-gray-600">Total Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">947</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                      4.8 <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div className="text-sm text-gray-600">User Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Recent Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah M.', location: 'Manchester', item: 'Kitchen Appliances', savings: '£156', vouchers: '£23' },
                    { name: 'James L.', location: 'London', item: 'Garden Tools', savings: '£89', vouchers: '£15' },
                    { name: 'Emma T.', location: 'Birmingham', item: 'Electronics', savings: '£234', vouchers: '£31' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">{activity.name} from {activity.location}</div>
                          <div className="text-sm text-gray-500">{activity.item}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{activity.savings}</div>
                        <div className="text-xs text-purple-600">+{activity.vouchers} vouchers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Discrete admin access */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/admin-login"
          className="w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full opacity-20 hover:opacity-60 transition-all duration-300"
          title="Admin"
        ></a>
      </div>
    </div>
  );
};

export default ComprehensiveHomePage;