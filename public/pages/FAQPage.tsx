import { Helmet } from "react-helmet";
import FAQ from "@/components/home/FAQ";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FAQPage = () => {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - BoperCheck</title>
        <meta name="description" content="Find answers to frequently asked questions about BoperCheck's AI price analysis tool, credits, account management, and more." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about BoperCheck
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">General Questions</h2>
              <FAQ />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">Account & Credits</h2>
              
              <div className="divide-y">
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">How do I create an account?</h3>
                  <p className="text-muted-foreground">
                    Click the "Sign Up" button in the top right corner of the page. You'll need to provide a username, email address, and password. All price searches are completely free forever - no credits needed!
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">How do I check my remaining credits?</h3>
                  <p className="text-muted-foreground">
                    Your available credits are displayed in your dashboard after logging in. Credits are only for premium features like PDF downloads and vouchers - all price searches remain free forever.
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">What are credits used for?</h3>
                  <p className="text-muted-foreground">
                    Credits are only needed for premium add-ons like PDF report downloads (1 credit each) and voucher generation. All core price searching and comparison features are completely free with unlimited usage.
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">Can I get a refund for unused credits?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer refunds for unused credits within 30 days of purchase. Please contact our support team with your request and order information.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">Using The Service</h2>
              
              <div className="divide-y">
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">What types of items can I check prices for?</h3>
                  <p className="text-muted-foreground">
                    BoperCheck works for both products and services across virtually any category. This includes electronics, furniture, travel, professional services, vehicles, clothing, and much more.
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">How accurate are the results?</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes thousands of data points to provide highly accurate price insights. However, market prices can change rapidly, so we always link directly to retailers where you can verify current pricing.
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">Can I use BoperCheck on my mobile device?</h3>
                  <p className="text-muted-foreground">
                    Yes! BoperCheck is fully responsive and works on smartphones, tablets, and desktop computers. You can check prices anytime, anywhere.
                  </p>
                </div>
                
                <div className="py-5">
                  <h3 className="text-lg font-semibold mb-2">Can I see my past price checks?</h3>
                  <p className="text-muted-foreground">
                    Yes, all your price checks are saved in your dashboard for future reference. You can access, download, or share them at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-6">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is ready to help! Reach out to us and we'll get back to you as soon as possible.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
