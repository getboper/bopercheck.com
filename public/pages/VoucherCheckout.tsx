import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Download, Clock } from "lucide-react";
import { SEOHead, seoConfigs } from "@/components/SEOHead";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ voucherData }: { voucherData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/voucher-success?store=${encodeURIComponent(voucherData.store)}&code=${encodeURIComponent(voucherData.code)}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Premium Voucher Access
            </CardTitle>
            <CardDescription className="text-lg">
              Unlock exclusive {voucherData.store} discount codes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Voucher Details */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{voucherData.store}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {voucherData.discount}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Code: <span className="font-mono font-bold">{voucherData.code}</span>
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Verified Discount Codes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tested and guaranteed to work</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Download className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Instant PDF Download</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Professional voucher format</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Priority Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Fast help when you need it</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">£0.99</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">One-time payment</div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <PaymentElement />
              <Button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase - £0.99'}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
              Secure payment powered by Stripe. Your payment information is encrypted and secure.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default function VoucherCheckout() {
  const [match, params] = useRoute('/voucher-checkout');
  const [clientSecret, setClientSecret] = useState("");
  const [voucherData, setVoucherData] = useState<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!match) return;

    // Get voucher data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const store = urlParams.get('store');
    const code = urlParams.get('code');
    const discount = urlParams.get('discount');
    const itemName = urlParams.get('item');

    if (!store || !code) {
      toast({
        title: "Invalid Request",
        description: "Missing voucher information",
        variant: "destructive"
      });
      setLocation('/');
      return;
    }

    const voucher = {
      store: decodeURIComponent(store),
      code: decodeURIComponent(code),
      discount: discount ? decodeURIComponent(discount) : '25% OFF',
      itemName: itemName ? decodeURIComponent(itemName) : 'Selected item'
    };

    setVoucherData(voucher);

    // Create payment intent for £0.99
    apiRequest("POST", "/api/create-voucher-payment", {
      amount: 99, // £0.99 in pence
      voucherData: voucher
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("Failed to create payment intent");
        }
      })
      .catch((error) => {
        console.error("Payment setup error:", error);
        toast({
          title: "Payment Setup Failed",
          description: "Unable to setup payment. Please try again.",
          variant: "destructive"
        });
        setLocation('/');
      });
  }, [match, toast, setLocation]);

  if (!match || !voucherData || !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <SEOHead {...seoConfigs.voucherPot} />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm voucherData={voucherData} />
      </Elements>
    </>
  );
}