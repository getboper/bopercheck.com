import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Monitor, Smartphone, RefreshCw, HelpCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function HelpPage() {
  return (
    <>
      <Helmet>
        <title>Help & Support | BoperCheck</title>
        <meta name="description" content="Get help with BoperCheck. Troubleshoot loading issues, clear cache, and find solutions to common problems." />
        <link rel="canonical" href="https://bopercheck.com/help" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Help & Support
              </h1>
              <p className="text-xl text-gray-600">
                Find solutions to common issues and get the most out of BoperCheck
              </p>
            </div>

            {/* Quick Fixes */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-900 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Site Not Loading?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If BoperCheck isn't loading properly, try these quick fixes:
                  </p>
                  <div className="space-y-3">
                    <Link href="/clear-cache">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Clear Cache & Reload
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open('https://bopercheck.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Alternative: Try incognito/private browsing mode
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Search Not Working?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Having trouble with price searches? Here's what to try:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• Be specific with your search terms</li>
                    <li>• Include brand names when possible</li>
                    <li>• Try different product variations</li>
                    <li>• Check your internet connection</li>
                  </ul>
                  <Link href="/price-check">
                    <Button variant="outline" className="w-full">
                      Try Price Check
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Device-Specific Help */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    Desktop Browsers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Clear Cache Manually:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Chrome/Edge:</strong> Ctrl+Shift+Delete</li>
                      <li>• <strong>Firefox:</strong> Ctrl+Shift+Delete</li>
                      <li>• <strong>Safari:</strong> Cmd+Option+E</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Hard Refresh:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Windows:</strong> Ctrl+F5</li>
                      <li>• <strong>Mac:</strong> Cmd+Shift+R</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    Mobile Devices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Quick Solutions:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use incognito/private browsing</li>
                      <li>• Clear browser data in settings</li>
                      <li>• Try a different browser app</li>
                      <li>• Restart your browser app</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Clear Data:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>iPhone:</strong> Settings &gt; Safari &gt; Clear History</li>
                      <li>• <strong>Android:</strong> Browser Settings &gt; Clear Data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Common Issues */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Page appears blank or broken</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      This usually indicates cached error pages. Try our automatic cache clearing tool.
                    </p>
                    <Link href="/clear-cache">
                      <Button size="sm" variant="outline">Fix Automatically</Button>
                    </Link>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Search results not showing</h3>
                    <p className="text-gray-600 text-sm">
                      Ensure you have a stable internet connection and try refreshing the page. If the problem persists, clear your cache.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Vouchers not displaying</h3>
                    <p className="text-gray-600 text-sm">
                      Voucher availability depends on current promotions. Try different search terms or check back later for new deals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-600 mb-6">
                If you're still experiencing issues, we're here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}