import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertTriangle, Monitor, Smartphone } from "lucide-react";
import { Helmet } from "react-helmet";

export default function CacheClearPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [step, setStep] = useState(0);

  const clearSteps = [
    "Clearing browser cache...",
    "Removing stored data...",
    "Refreshing service workers...",
    "Preparing fresh content...",
    "Almost ready..."
  ];

  useEffect(() => {
    // Auto-start clearing process if user came here directly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto') === 'true') {
      handleClearCache();
    }
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    setStep(0);
    
    try {
      // Step 1: Browser cache
      setStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Storage
      setStep(2);
      localStorage.clear();
      sessionStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Service workers
      setStep(3);
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: IndexedDB
      setStep(4);
      if ('indexedDB' in window) {
        try {
          const dbs = await indexedDB.databases();
          await Promise.all(
            dbs.map(db => {
              if (db.name) {
                return new Promise((resolve, reject) => {
                  const deleteReq = indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => resolve(undefined);
                  deleteReq.onerror = () => reject(deleteReq.error);
                  setTimeout(() => resolve(undefined), 2000); // Timeout fallback
                });
              }
            })
          );
        } catch (e) {
          console.log('IndexedDB clear skipped');
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Final preparation
      setStep(5);
      localStorage.setItem('bopercheck_cache_cleared', Date.now().toString());
      await new Promise(resolve => setTimeout(resolve, 800));

      // Redirect to home with cache-busting parameter
      window.location.href = '/?fresh=' + Date.now();
      
    } catch (error) {
      console.error('Cache clear failed:', error);
      // Fallback: force reload anyway
      window.location.href = '/?fallback=' + Date.now();
    }
  };

  return (
    <>
      <Helmet>
        <title>Clear Cache - BoperCheck</title>
        <meta name="description" content="Clear your browser cache to ensure BoperCheck loads properly." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              {isClearing ? (
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              ) : (
                <Monitor className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {isClearing ? "Clearing Cache..." : "Fix Loading Issues"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isClearing ? (
              <>
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Having trouble accessing BoperCheck? Clear your browser cache to resolve loading issues.
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Common symptoms:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Pages not loading properly</li>
                          <li>• Blank or broken layouts</li>
                          <li>• Old cached content showing</li>
                          <li>• Search functionality not working</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleClearCache}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Clear Cache & Reload BoperCheck
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Manual alternatives:</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <Monitor className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Desktop browsers:</p>
                        <p className="text-xs">Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Mobile:</p>
                        <p className="text-xs">Use incognito/private browsing mode or clear browser data in settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="space-y-3">
                  {clearSteps.map((stepText, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        index < step ? 'bg-green-50 text-green-800' :
                        index === step ? 'bg-blue-50 text-blue-800' :
                        'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {index < step ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : index === step ? (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className="font-medium">{stepText}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500">
                  Please wait while we clear your cache and reload BoperCheck...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}