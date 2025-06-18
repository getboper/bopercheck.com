import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Lock, Shield, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

import { stripePromise } from '@/lib/stripe';

// Business plan options with updated pricing
const BUSINESS_PLANS = [
  { 
    id: 'basic', 
    name: 'Basic Plan', 
    price: 3500, // £35.00 in pence
    monthlyPrice: 35,
    features: ['1 service category', 'Basic listing', 'Contact button', 'Analytics dashboard']
  },
  { 
    id: 'pro', 
    name: 'Pro Plan', 
    price: 8500, // £85.00 in pence
    monthlyPrice: 85,
    features: ['Up to 5 categories', 'Priority listing', 'Full business profile', 'Enhanced analytics', 'AI-suggested categories']
  },
  { 
    id: 'featured', 
    name: 'Featured Partner Plan', 
    price: 17500, // £175.00 in pence
    monthlyPrice: 175,
    features: ['Unlimited categories', 'Premium placement', 'Advanced analytics', 'Dedicated support', 'Custom integrations']
  }
];

const BusinessCheckoutForm = ({ planId, businessName }: { planId: string; businessName: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Something went wrong with your payment');
      toast({
        title: "Payment failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast({
        title: "Payment successful!",
        description: "Your business listing is now active. Welcome to BoperCheck!",
      });
      
      // Redirect to success page with payment details
      setTimeout(() => {
        window.location.href = `/payment-success?plan=${planId}&business=${encodeURIComponent(businessName)}&payment_intent=${paymentIntent.id}`;
      }, 2000);
    }

    setIsLoading(false);
  };

  const selectedPlan = BUSINESS_PLANS.find(plan => plan.id === planId) || BUSINESS_PLANS[1]; // Default to Pro

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Details</h3>
        <PaymentElement />
        
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full h-12 bg-green-600 hover:bg-green-700"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment - £{selectedPlan.monthlyPrice}/month
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Secured by Stripe • 30-day money-back guarantee</span>
      </div>
    </form>
  );
};

export default function BusinessCheckoutPage() {
  const [planId, setPlanId] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>("");
  const [location] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get parameters from URL using window.location.search instead of wouter location
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const business = urlParams.get('business');
    
    if (plan && BUSINESS_PLANS.some(p => p.id === plan)) {
      setPlanId(plan);
    }
    
    if (business) {
      setBusinessName(decodeURIComponent(business));
    }
  }, []);

  useEffect(() => {
    // Only create payment intent if planId is properly set
    if (!planId) return;
    
    const createPaymentIntent = async () => {
      const selectedPlan = BUSINESS_PLANS.find(p => p.id === planId);
      if (!selectedPlan) return;
      
      try {
        const requestBody = { 
          planId: selectedPlan.id,
          amount: selectedPlan.price,
          businessName: businessName || 'Business Listing'
        };
        console.log('Payment request:', requestBody);
        
        const response = await apiRequest("POST", "/api/create-business-payment-intent", requestBody);
        
        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive"
        });
      }
    };

    // Only create payment intent if we have a valid planId
    if (planId && BUSINESS_PLANS.some(p => p.id === planId)) {
      createPaymentIntent();
    }
  }, [planId, businessName, toast]);

  const selectedPlan = BUSINESS_PLANS.find(plan => plan.id === planId) || BUSINESS_PLANS[1];

  return (
    <>
      <Helmet>
        <title>Complete Your Business Listing Payment | BoperCheck</title>
        <meta name="description" content="Complete your business listing payment securely with Stripe. Start reaching customers who are actively searching for your services." />
      </Helmet>

      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/business/signup">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Business Signup
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">
            Secure your business listing and start reaching customers today
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left section: Order summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Your business advertising plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {businessName && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Business Name</h4>
                    <p className="font-semibold">{businessName}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Selected Plan</h4>
                  <p className="font-semibold text-lg">{selectedPlan.name}</p>
                  <p className="text-3xl font-bold text-green-600">£{selectedPlan.monthlyPrice}<span className="text-sm text-gray-500">/month</span></p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monthly Total</span>
                    <span className="text-xl font-bold">£{selectedPlan.monthlyPrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Billed monthly • Cancel anytime</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Why choose BoperCheck?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Only pay when customers search for your services</li>
                <li>• No wasted advertising spend on uninterested users</li>
                <li>• Reach customers with high purchase intent</li>
                <li>• Built-in analytics to track your ROI</li>
              </ul>
            </div>
          </div>

          {/* Right section: Payment form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Secure Payment
                </CardTitle>
                <CardDescription>
                  Complete your business listing payment securely with Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#10b981',
                        },
                      },
                    }}
                  >
                    <BusinessCheckoutForm planId={planId} businessName={businessName} />
                  </Elements>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
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