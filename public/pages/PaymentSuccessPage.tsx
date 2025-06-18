import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, ExternalLink, Settings, ArrowRight } from 'lucide-react';

const BUSINESS_PLANS = [
  { 
    id: 'basic', 
    name: 'Basic Plan', 
    price: 35,
    features: ['1 service category', 'Basic listing', 'Contact button', 'Analytics dashboard']
  },
  { 
    id: 'pro', 
    name: 'Pro Plan', 
    price: 85,
    features: ['Up to 5 categories', 'Priority listing', 'Full business profile', 'Enhanced analytics', 'AI-suggested categories']
  },
  { 
    id: 'featured', 
    name: 'Featured Partner Plan', 
    price: 175,
    features: ['Unlimited categories', 'Featured placement', 'Premium business profile', 'Advanced analytics', 'Priority support', 'Custom branding']
  }
];

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  useEffect(() => {
    // Get payment details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('plan');
    const businessName = urlParams.get('business');
    const paymentIntentId = urlParams.get('payment_intent');
    
    const selectedPlan = BUSINESS_PLANS.find(p => p.id === planId) || BUSINESS_PLANS[0];
    
    const details = {
      planId,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      features: selectedPlan.features,
      businessName: businessName ? decodeURIComponent(businessName) : 'Your Business',
      paymentIntentId
    };
    
    setPaymentDetails(details);
    
    // Send confirmation email automatically
    if (details.businessName && details.planName && !emailSent) {
      sendConfirmationEmail(details);
    }
  }, [emailSent]);

  const sendConfirmationEmail = async (details: any) => {
    try {
      const response = await fetch('/api/send-payment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'customer@example.com', // TODO: Get actual customer email
          businessName: details.businessName,
          planName: details.planName,
          planPrice: details.price / 100, // Convert pence to pounds
          paymentIntentId: details.paymentIntentId
        })
      });
      
      if (response.ok) {
        setEmailSent(true);
        console.log('Confirmation email sent successfully');
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your {paymentDetails.planName} is now active
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Payment Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Payment Confirmation
              </CardTitle>
              <CardDescription>
                Your advertising plan is now live and active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Business Name:</span>
                <span>{paymentDetails.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <Badge variant="secondary">{paymentDetails.planName}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount Paid:</span>
                <span className="font-semibold">£{paymentDetails.price}/month</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Confirmation email sent to your registered address
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ Your listing will appear in search results within 5 minutes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>
                Your {paymentDetails.planName} features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {paymentDetails.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Business Listing Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Business Listing Preview</CardTitle>
            <CardDescription>
              This is how your business will appear to customers searching on BoperCheck
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{paymentDetails.businessName}</h3>
                {paymentDetails.planId !== 'basic' && (
                  <Badge variant="outline" className="text-blue-600">
                    {paymentDetails.planId === 'featured' ? 'Featured' : 'Priority'}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Business advertising plan • Active since today
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Contact Business
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/business">
              <Settings className="w-4 h-4 mr-2" />
              Manage Listing
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/business/upgrade">
              <ArrowRight className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Link>
          </Button>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@bopercheck.com" className="text-blue-600 hover:underline">
              support@bopercheck.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}