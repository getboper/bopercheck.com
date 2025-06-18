import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { TestTube, Download, Share, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import BrowserCompatibilityTest from "@/components/BrowserCompatibilityTest";

export default function CacheTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    
    const results = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      tests: {}
    };

    try {
      // Test cache headers
      const response = await fetch(window.location.origin, { 
        method: 'HEAD',
        cache: 'no-store'
      });
      
      results.tests.cacheHeaders = {
        cacheControl: response.headers.get('cache-control'),
        pragma: response.headers.get('pragma'),
        expires: response.headers.get('expires'),
        status: response.status
      };

      // Test service worker clearing
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        results.tests.serviceWorkers = {
          count: registrations.length,
          supported: true
        };
      } else {
        results.tests.serviceWorkers = {
          count: 0,
          supported: false
        };
      }

      // Test cache API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        results.tests.cacheAPI = {
          cacheCount: cacheNames.length,
          supported: true,
          cacheNames: cacheNames
        };
      } else {
        results.tests.cacheAPI = {
          cacheCount: 0,
          supported: false,
          cacheNames: []
        };
      }

      // Test storage
      try {
        localStorage.setItem('cache-test', 'test');
        const retrieved = localStorage.getItem('cache-test');
        localStorage.removeItem('cache-test');
        results.tests.localStorage = {
          supported: true,
          working: retrieved === 'test'
        };
      } catch (error) {
        results.tests.localStorage = {
          supported: false,
          working: false,
          error: error.message
        };
      }

      // Test network conditions
      results.tests.network = {
        online: navigator.onLine,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };

      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      results.tests.error = error.message;
      setTestResults(results);
    }
    
    setIsRunningTests(false);
  };

  const exportResults = () => {
    if (!testResults) return;
    
    const blob = new Blob([JSON.stringify(testResults, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bopercheck-cache-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!testResults) return;
    
    const summary = `BoperCheck Cache Test Results:
• Browser: ${testResults.userAgent}
• Cache Headers: ${testResults.tests.cacheHeaders?.cacheControl || 'Not tested'}
• Service Workers: ${testResults.tests.serviceWorkers?.supported ? 'Supported' : 'Not supported'}
• Cache API: ${testResults.tests.cacheAPI?.supported ? 'Supported' : 'Not supported'}
• Local Storage: ${testResults.tests.localStorage?.working ? 'Working' : 'Not working'}
• Network: ${testResults.tests.network?.online ? 'Online' : 'Offline'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BoperCheck Cache Test Results',
          text: summary,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
        navigator.clipboard.writeText(summary);
      }
    } else {
      navigator.clipboard.writeText(summary);
      alert('Results copied to clipboard!');
    }
  };

  useEffect(() => {
    // Run initial test
    runComprehensiveTests();
  }, []);

  return (
    <>
      <Helmet>
        <title>Cache Test - BoperCheck</title>
        <meta name="description" content="Test and diagnose cache clearing functionality for BoperCheck." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <TestTube className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Cache Clearing Test Suite
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive testing of cache clearing functionality across browsers and devices
              </p>
            </div>

            {/* Browser Compatibility Test */}
            <div className="mb-8">
              <BrowserCompatibilityTest />
            </div>

            {/* Comprehensive Test Results */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comprehensive Cache Tests</span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={runComprehensiveTests}
                      disabled={isRunningTests}
                      size="sm"
                    >
                      {isRunningTests ? 'Testing...' : 'Run Tests'}
                    </Button>
                    {testResults && (
                      <>
                        <Button 
                          onClick={exportResults}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button 
                          onClick={shareResults}
                          variant="outline"
                          size="sm"
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults ? (
                  <div className="space-y-6">
                    {/* Environment Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Test Environment</h3>
                      <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                        <div><strong>Browser:</strong> {testResults.userAgent}</div>
                        <div><strong>Platform:</strong> {testResults.platform}</div>
                        <div><strong>Viewport:</strong> {testResults.viewport}</div>
                        <div><strong>Test Time:</strong> {new Date(testResults.timestamp).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Cache Headers Test */}
                    {testResults.tests.cacheHeaders && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Cache Headers</h3>
                        <div className="bg-green-50 p-3 rounded text-sm space-y-1">
                          <div><strong>Cache-Control:</strong> {testResults.tests.cacheHeaders.cacheControl}</div>
                          <div><strong>Pragma:</strong> {testResults.tests.cacheHeaders.pragma}</div>
                          <div><strong>Expires:</strong> {testResults.tests.cacheHeaders.expires}</div>
                          <div><strong>Status:</strong> {testResults.tests.cacheHeaders.status}</div>
                        </div>
                      </div>
                    )}

                    {/* Service Workers Test */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Service Workers</h3>
                      <div className={`p-3 rounded text-sm ${testResults.tests.serviceWorkers.supported ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div><strong>Supported:</strong> {testResults.tests.serviceWorkers.supported ? 'Yes' : 'No'}</div>
                        <div><strong>Active Workers:</strong> {testResults.tests.serviceWorkers.count}</div>
                      </div>
                    </div>

                    {/* Cache API Test */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Cache API</h3>
                      <div className={`p-3 rounded text-sm ${testResults.tests.cacheAPI.supported ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div><strong>Supported:</strong> {testResults.tests.cacheAPI.supported ? 'Yes' : 'No'}</div>
                        <div><strong>Active Caches:</strong> {testResults.tests.cacheAPI.cacheCount}</div>
                        {testResults.tests.cacheAPI.cacheNames.length > 0 && (
                          <div><strong>Cache Names:</strong> {testResults.tests.cacheAPI.cacheNames.join(', ')}</div>
                        )}
                      </div>
                    </div>

                    {/* Local Storage Test */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Local Storage</h3>
                      <div className={`p-3 rounded text-sm ${testResults.tests.localStorage.working ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div><strong>Supported:</strong> {testResults.tests.localStorage.supported ? 'Yes' : 'No'}</div>
                        <div><strong>Working:</strong> {testResults.tests.localStorage.working ? 'Yes' : 'No'}</div>
                        {testResults.tests.localStorage.error && (
                          <div><strong>Error:</strong> {testResults.tests.localStorage.error}</div>
                        )}
                      </div>
                    </div>

                    {/* Network Test */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Network Status</h3>
                      <div className={`p-3 rounded text-sm ${testResults.tests.network.online ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div><strong>Online:</strong> {testResults.tests.network.online ? 'Yes' : 'No'}</div>
                        {testResults.tests.network.connection && (
                          <>
                            <div><strong>Connection Type:</strong> {testResults.tests.network.connection.effectiveType}</div>
                            <div><strong>Downlink:</strong> {testResults.tests.network.connection.downlink} Mbps</div>
                            <div><strong>RTT:</strong> {testResults.tests.network.connection.rtt} ms</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isRunningTests ? 'Running comprehensive tests...' : 'Click "Run Tests" to start comprehensive testing'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="text-center space-x-4">
              <Link href="/clear-cache">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Test Cache Clearing
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline">
                  Help & Support
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}