import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HowItWorksPage = () => {
  return (
    <>
      <Helmet>
        <title>How It Works - BoperCheck</title>
        <meta name="description" content="Learn how BoperCheck uses AI to analyze prices and find you the best deals on any product or service." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">How BoperCheck Works</h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            <div className="gradient-bg h-3"></div>
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6">It's As Easy As 1-2-3</h2>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-secondary text-2xl font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Enter Your Item</h3>
                    <p className="text-muted-foreground mb-4">
                      Simply enter the product or service you want to price check. The more detailed your description, the more accurate our analysis will be. You can also optionally select a category and upload an image for even more precise results.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                      <li>Product name and model</li>
                      <li>Specific features or variations</li>
                      <li>Condition (new, used, refurbished)</li>
                      <li>Other relevant details</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="italic text-muted-foreground">Example: "iPhone 14 Pro Max 256GB Space Black, unlocked, new"</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-primary text-2xl font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our AI Goes to Work</h3>
                    <p className="text-muted-foreground mb-4">
                      Our advanced AI analyzes thousands of data points from multiple sources to provide you with comprehensive price intelligence:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                      <li>Current pricing from major retailers</li>
                      <li>Historical price trends</li>
                      <li>Regional price variations</li>
                      <li>Deal quality assessment</li>
                      <li>Price comparison with alternatives</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="italic text-muted-foreground">The AI even considers factors like seasonal pricing, discounts, and shipping costs.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-accent text-2xl font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Get Instant Results</h3>
                    <p className="text-muted-foreground mb-4">
                      Within seconds, you'll receive a detailed price analysis that helps you make an informed purchasing decision:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                      <li>Current market value</li>
                      <li>Price range (lowest to highest available)</li>
                      <li>Deal rating (excellent, good, fair, etc.)</li>
                      <li>Top 3 places to buy with direct links</li>
                      <li>Downloadable PDF report</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="italic text-muted-foreground">Save, share, or download your results for later reference.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Why Choose BoperCheck?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Save Time</h3>
                  <p className="text-muted-foreground">
                    Stop wasting hours comparing prices across dozens of websites. Get comprehensive price analysis in seconds.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Save Money</h3>
                  <p className="text-muted-foreground">
                    Our users save an average of 15-20% on their purchases by finding the best deals and avoiding overpriced items.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Make Better Decisions</h3>
                  <p className="text-muted-foreground">
                    Know exactly what a fair price is for any item or service, so you can negotiate with confidence.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
                  <p className="text-muted-foreground">
                    Our AI constantly updates its database to ensure you're getting the most current price information.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Ready to Try It?</h2>
            <p className="text-muted-foreground mb-8">
              New users get 1 free price check. Sign up now to claim yours!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/price-check">
                <Button size="lg" className="px-8">
                  Check a Price Now
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;
