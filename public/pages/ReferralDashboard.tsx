import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Copy, Users, Gift, TrendingUp, Share2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShareTools from "@/components/ShareTools";

export default function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({
    totalReferrals: 0,
    creditsEarned: 0,
    clickThroughs: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user's referral data
    const loadReferralData = async () => {
      try {
        // For now, generate a sample referral code
        // In a real implementation, this would come from user authentication
        const userCode = "SAVE" + Math.random().toString(36).substring(2, 6).toUpperCase();
        setReferralCode(userCode);
        
        // Sample stats - replace with real API call
        setStats({
          totalReferrals: 12,
          creditsEarned: 18,
          clickThroughs: 45,
          conversionRate: 26.7
        });
      } catch (error) {
        console.error("Failed to load referral data:", error);
      }
      setIsLoading(false);
    };

    loadReferralData();
  }, []);

  const referralLink = `https://bopercheck.com?ref=${referralCode}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const recentReferrals = [
    { name: "Sarah M.", joinDate: "2 days ago", status: "Active", credits: 1 },
    { name: "James L.", joinDate: "5 days ago", status: "Active", credits: 1 },
    { name: "Emma T.", joinDate: "1 week ago", status: "Active", credits: 1 },
    { name: "David R.", joinDate: "1 week ago", status: "Pending", credits: 0 },
    { name: "Lisa K.", joinDate: "2 weeks ago", status: "Active", credits: 1 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Referral Dashboard - BoperCheck</title>
        <meta name="description" content="Track your referrals and earnings with BoperCheck's rewards program." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Referral Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Track your earnings and share the savings
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.creditsEarned}</div>
                  <div className="text-sm text-gray-600">Credits Earned</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{stats.clickThroughs}</div>
                  <div className="text-sm text-gray-600">Link Clicks</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Crown className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{stats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button onClick={copyReferralLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share your link with friends and family</li>
                      <li>• They use BoperCheck to save money</li>
                      <li>• You earn 1 credit for each new user</li>
                      <li>• Use credits for premium features</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Tools */}
            <div className="mb-8">
              <ShareTools 
                showIncentive={true}
              />
            </div>

            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReferrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{referral.name}</div>
                          <div className="text-sm text-gray-500">{referral.joinDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={referral.status === 'Active' ? 'default' : 'secondary'}
                          className={referral.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {referral.status}
                        </Badge>
                        {referral.credits > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                            +{referral.credits} credit
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {recentReferrals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No referrals yet. Start sharing to earn credits!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}