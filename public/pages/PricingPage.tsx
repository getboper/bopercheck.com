import { Helmet } from "react-helmet";
import Pricing from "@/components/home/Pricing";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { trackPageView } from "@/lib/tiktokPixel";

const PricingPage = () => {
  useEffect(() => {
    // Track pricing page view in TikTok Pixel
    trackPageView('pricing');
  }, []);

  return (
    <>
      <Helmet>
        <title>Pricing - BoperCheck</title>
        <meta name="description" content="Simple, transparent pricing for BoperCheck. Purchase credits for PDF downloads, vouchers, and premium features. All price searches are completely free." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            All price searches are free forever. Credits are only for PDF downloads, vouchers, and premium features.
          </p>
        </div>
        
        <Pricing />
        
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions About Pricing</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground">
                Yes. Credits from our Starter Pack (5 credits) are valid for 6 months. Credits from our Value Pack (10 credits) and Bulk Pack (25 credits) are valid for 12 months from purchase date.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">How many credits do I need?</h3>
              <p className="text-muted-foreground">
                Price searches are completely free! Credits are only needed for PDF downloads (1 credit each) and voucher generation. Most users find 5-10 credits sufficient for occasional premium features.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Can I buy a single credit?</h3>
              <p className="text-muted-foreground">
                You can use BoperCheck completely free without any credits - all price searches are unlimited at no cost. Credits are only for PDF downloads and vouchers. Our minimum purchase is the 5-credit Starter Pack.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Is there a subscription option?</h3>
              <p className="text-muted-foreground">
                No subscriptions needed! All core price checking features are completely free forever. Credits are optional and only for premium add-ons like PDF reports and vouchers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and Apple Pay for secure, convenient payments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer refunds for unused credits within 30 days of purchase. Please contact our support team if you need assistance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-20 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What's Included in Every Price Check</h2>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Comprehensive market analysis across multiple retailers</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Current price range showing lowest to highest available</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Deal quality rating with star-based visualization</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Top 3 places to buy with direct retailer links</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Downloadable PDF report for your records</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Easy sharing options to send results to others</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Historical price context when available</span>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span>Saved in your dashboard for future reference</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Start Saving?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of smart shoppers who use BoperCheck to make informed purchase decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Using Free
              </Button>
            </Link>
            <Link href="/price-check">
              <Button size="lg" variant="outline" className="px-8">
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
