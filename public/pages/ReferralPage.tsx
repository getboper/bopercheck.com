import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Share2, Copy, Gift, Award, Users, Facebook } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReferralPage = () => {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate social-specific referral links with UTM parameters
  const baseReferralLink = user && userData 
    ? `${window.location.origin}/signup?ref=${userData.referralCode}` 
    : "";
    
  const referralLink = baseReferralLink;
  
  // Social-specific links with UTM parameters for tracking
  const facebookReferralLink = user && userData
    ? `${baseReferralLink}&utm_source=facebook&utm_medium=social&utm_campaign=user_share`
    : "";
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Referral link has been copied to your clipboard"
        });
        
        setTimeout(() => setCopied(false), 2000);
        
        // Track referral sharing in TikTok Pixel
        import('@/lib/tiktokPixel').then(({ trackReferralShare }) => {
          trackReferralShare('copy_link');
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy the link manually",
          variant: "destructive"
        });
      });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join BoperCheck for free unlimited price searches!",
        text: "I'm using BoperCheck to analyze prices with AI. All searches are free forever, plus you'll get bonus credits for premium features when you sign up!",
        url: referralLink,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyLink();
    }
  };
  
  // Facebook specific sharing function
  const handleFacebookShare = () => {
    // Facebook page ID from the screenshot
    const facebookPageId = "646369458563380";
    
    // Facebook sharer URL with the referral link and page ID
    const shareUrl = `https://www.facebook.com/${facebookPageId}/posts/?u=${encodeURIComponent(facebookReferralLink)}`;
    
    // Track this share attempt
    try {
      // Create an API request to track this share
      if (user && userData) {
        fetch('/api/social/track-share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: 'facebook',
            url: facebookReferralLink,
            utmSource: 'facebook',
            utmMedium: 'social',
            utmCampaign: 'user_share'
          }),
        }).catch(err => console.error('Error tracking share:', err));
      }
      
      // Open Facebook share dialog in a popup window
      window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
      
      // Show success message
      toast({
        title: "Facebook share initiated",
        description: "Thank you for sharing BoperCheck on Facebook!",
      });
      
      // Track social sharing in TikTok Pixel
      import('@/lib/tiktokPixel').then(({ trackReferralShare }) => {
        trackReferralShare('facebook');
      });
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      toast({
        title: "Sharing failed",
        description: "Please try again or copy the link manually",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Referral Program - BoperCheck</title>
        <meta name="description" content="Refer friends to BoperCheck and earn free credits. Our referral program rewards you and your friends with free AI price checks." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Referral Program</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share BoperCheck with friends and both of you get credits for premium features
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
            <div className="gradient-bg h-3"></div>
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Share Your Link</h3>
                  <p className="text-muted-foreground">
                    Invite friends using your unique referral link
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Friends Sign Up</h3>
                  <p className="text-muted-foreground">
                    They get free unlimited searches plus 1 bonus credit for premium features
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">You Get Rewarded</h3>
                  <p className="text-muted-foreground">
                    Receive 1 credit for premium features for each friend who joins
                  </p>
                </div>
              </div>
              
              {user && userData ? (
                <>
                  {/* Facebook Promo Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-blue-800">Facebook Promotion</h3>
                        <p className="text-blue-700">
                          Share BoperCheck on our Facebook page and get an additional credit for premium features! 
                          Use the Facebook share button below to post directly to the BoperCheck page.
                        </p>
                      </div>
                    </div>
                  </div>
                
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
                    
                    <Tabs defaultValue="standard">
                      <TabsList className="mb-4">
                        <TabsTrigger value="standard">Standard Share</TabsTrigger>
                        <TabsTrigger value="facebook">Facebook Share</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="standard">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input 
                            value={referralLink}
                            readOnly 
                            className="flex-grow" 
                          />
                          <Button 
                            onClick={handleCopyLink}
                            variant="outline"
                            className="flex-shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            {copied ? "Copied!" : "Copy"}
                          </Button>
                          <Button
                            onClick={handleShare}
                            className="flex-shrink-0"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="facebook">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input 
                            value={facebookReferralLink}
                            readOnly 
                            className="flex-grow" 
                          />
                          <Button 
                            onClick={() => navigator.clipboard.writeText(facebookReferralLink)}
                            variant="outline"
                            className="flex-shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            onClick={handleFacebookShare}
                            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Facebook className="h-4 w-4 mr-2" />
                            Share on BoperCheck Page
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Share this link on Facebook to get an additional credit for premium features as part of our promotion!
                        </p>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Your referral code:</p>
                          <p className="text-lg font-bold">{userData.referralCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Successful referrals:</p>
                          <p className="text-lg font-bold">{userData.referrals?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 bg-muted rounded-lg">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Login to get your referral link</h3>
                  <p className="text-muted-foreground mb-4">You need to be logged in to access your unique referral link and start earning credits for premium features.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/login">
                      <Button variant="outline">Log In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How many friends can I refer?</h3>
                  <p className="text-muted-foreground">
                    There's no limit! You can refer as many friends as you want and earn a credit for premium features for each successful referral.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">When do I get my credit?</h3>
                  <p className="text-muted-foreground">
                    You'll receive your credit for premium features as soon as your friend signs up using your referral link and completes their account creation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">How long are referral credits valid?</h3>
                  <p className="text-muted-foreground">
                    Referral credits are valid for 12 months from the date they are added to your account. Remember, all price searches are always free regardless of credits.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can my friends refer other people too?</h3>
                  <p className="text-muted-foreground">
                    Yes! Once your friends create their accounts, they'll get their own unique referral links to share with others.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Start Sharing?</h2>
            <p className="text-muted-foreground mb-6">
              Spread the word about BoperCheck and help your friends save money while earning credits for premium features.
            </p>
            {user ? (
              <Button size="lg" onClick={handleShare} className="px-8">
                <Share2 className="h-5 w-5 mr-2" /> Share Your Referral Link
              </Button>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Sign Up to Get Your Link
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
