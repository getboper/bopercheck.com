import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

import { stripePromise } from '@/lib/stripe';

// Credit pack options
const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter Pack', credits: 5, price: 399 },
  { id: 'value', name: 'Value Pack', credits: 10, price: 699 },
  { id: 'premium', name: 'Premium Pack', credits: 25, price: 1699 }
];

const CheckoutForm = ({ packId }: { packId: string }) => {
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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard?payment=success',
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Something went wrong with your payment');
      toast({
        title: "Payment failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  // Get selected pack
  const selectedPack = CREDIT_PACKS.find(pack => pack.id === packId) || CREDIT_PACKS[0];

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Details</h3>
        <PaymentElement />

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
          <div className="mt-0.5">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your full card details.</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span>£{(selectedPack.price / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>£{(selectedPack.price / 100).toFixed(2)}</span>
        </div>
      </div>

      <Button 
        disabled={!stripe || isLoading} 
        className="w-full py-6 text-base"
        type="submit"
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Pay £{(selectedPack.price / 100).toFixed(2)}
          </>
        )}
      </Button>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default function CheckoutPage() {
  const [packId, setPackId] = useState<string>('value');
  const [clientSecret, setClientSecret] = useState<string>("");
  const [location] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get the package from URL query params
    const params = new URLSearchParams(location.split('?')[1]);
    const pack = params.get('pack');
    if (pack && CREDIT_PACKS.some(p => p.id === pack)) {
      setPackId(pack);
    }

    const createPaymentIntent = async () => {
      const selectedPack = CREDIT_PACKS.find(p => p.id === packId) || CREDIT_PACKS[0];
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: selectedPack.price,
          credits: selectedPack.credits
        });
        
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

    createPaymentIntent();
  }, [location, packId, toast]);

  // Get selected pack
  const selectedPack = CREDIT_PACKS.find(pack => pack.id === packId) || CREDIT_PACKS[0];

  return (
    <div className="container max-w-5xl py-10">
      <Link to="/pricing" className="flex items-center mb-6 text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to pricing</span>
      </Link>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left section: Order summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div>
                  <h3 className="font-medium">{selectedPack.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPack.credits} Credits</p>
                </div>
                <div className="text-lg font-bold">
                  £{(selectedPack.price / 100).toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Choose a different package:</h4>
                <div className="flex flex-col gap-2">
                  {CREDIT_PACKS.map((pack) => (
                    <Button
                      key={pack.id}
                      variant={packId === pack.id ? "default" : "outline"}
                      className="justify-between"
                      onClick={() => setPackId(pack.id)}
                    >
                      <span>{pack.name} ({pack.credits} Credits)</span>
                      <span>£{(pack.price / 100).toFixed(2)}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start bg-gray-50 border-t">
              <div className="text-sm text-gray-500 mb-2">
                <CreditCard className="h-4 w-4 inline mr-1" />
                <span>We accept all major credit cards</span>
              </div>
              <div className="flex gap-2">
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns/svg/visa.svg" alt="Visa" className="h-6" />
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns/svg/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns/svg/amex.svg" alt="American Express" className="h-6" />
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right section: Payment form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
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
                  <CheckoutForm packId={packId} />
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
  );
}