import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VoucherSuccess() {
  const [, setLocation] = useLocation();
  const [voucherData, setVoucherData] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const store = urlParams.get('store');
    const code = urlParams.get('code');

    if (store && code) {
      setVoucherData({
        store: decodeURIComponent(store),
        code: decodeURIComponent(code),
      });
    }
  }, []);

  const handleDownloadVoucher = async () => {
    if (!voucherData) return;

    setIsDownloading(true);
    try {
      const response = await apiRequest("POST", "/api/download-voucher", {
        voucherCode: voucherData.code,
        store: voucherData.store,
        discount: "25% OFF",
        itemName: "Selected item",
        paidUser: true // User has completed payment
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.pdfData) {
          // Generate and download PDF voucher
          const voucherPDF = document.createElement('a');
          voucherPDF.href = `data:application/pdf;base64,${result.pdfData}`;
          voucherPDF.download = `${voucherData.store}_voucher_${voucherData.code}.pdf`;
          document.body.appendChild(voucherPDF);
          voucherPDF.click();
          document.body.removeChild(voucherPDF);
          
          toast({
            title: "Voucher Downloaded",
            description: `${voucherData.store} voucher saved successfully!`,
          });
        }
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download voucher. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-lg mx-auto pt-16">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Your voucher purchase has been completed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {voucherData && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{voucherData.store}</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    25% OFF
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Code: <span className="font-mono font-bold">{voucherData.code}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Button 
                onClick={handleDownloadVoucher}
                disabled={isDownloading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download Your Voucher'}
              </Button>

              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Search
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="flex-1"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate Us
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Download your voucher PDF above</li>
                <li>• Use the code at {voucherData?.store || 'checkout'}</li>
                <li>• Save 25% on your purchase</li>
                <li>• Contact support if you need help</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receipt has been sent to your email. Keep your voucher code safe!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}