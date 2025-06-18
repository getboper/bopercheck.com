import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Settings, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const AdminDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      // Check authentication status
      const authResponse = await fetch('/api/admin/auth-status', {
        credentials: 'include'
      });
      const authData = await authResponse.json();

      // Check browser capabilities
      const browserInfo = {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        platform: navigator.platform,
        language: navigator.language,
        cookieSupport: document.cookie !== undefined,
        localStorageSupport: typeof(Storage) !== "undefined",
        sessionStorageSupport: typeof(sessionStorage) !== "undefined"
      };

      // Check network connectivity
      const startTime = Date.now();
      const pingResponse = await fetch('/api/admin/auth-status');
      const pingTime = Date.now() - startTime;

      setDiagnostics({
        auth: authData,
        browser: browserInfo,
        network: {
          pingTime: pingTime,
          status: pingResponse.ok ? 'Connected' : 'Error'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      toast({
        title: "Diagnostics Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      toast({
        title: "Session Cleared",
        description: "All session data has been cleared"
      });
      
      // Refresh diagnostics
      await runDiagnostics();
    } catch (error: any) {
      toast({
        title: "Clear Session Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true || status === 'Connected') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (status === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Helmet>
        <title>Admin Diagnostics | BoperCheck</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Admin Diagnostics
            </CardTitle>
            <p className="text-sm text-gray-600">
              Troubleshoot admin dashboard access issues
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={runDiagnostics}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Running...' : 'Run Diagnostics'}
              </Button>
              <Button 
                onClick={clearSession}
                variant="outline"
              >
                Clear Session
              </Button>
              <Button 
                onClick={() => setLocation("/admin/login")}
                variant="outline"
              >
                Login Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {diagnostics && (
          <>
            {/* Authentication Status */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Authentication Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Authenticated</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.auth.authenticated} />
                    <Badge variant={diagnostics.auth.authenticated ? "default" : "destructive"}>
                      {diagnostics.auth.authenticated ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                
                {diagnostics.auth.debug && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Session ID</span>
                      <Badge variant="outline">{diagnostics.auth.debug.sessionId || 'None'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Session Data</span>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={diagnostics.auth.debug.sessionData === 'present'} />
                        <Badge variant="outline">{diagnostics.auth.debug.sessionData}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cookies</span>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={diagnostics.auth.debug.cookies === 'present'} />
                        <Badge variant="outline">{diagnostics.auth.debug.cookies}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mobile Device</span>
                      <Badge variant="outline">{diagnostics.auth.debug.isMobile ? 'Yes' : 'No'}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Browser Information */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Browser Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Cookies Enabled</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.browser.cookieEnabled} />
                    <Badge variant={diagnostics.browser.cookieEnabled ? "default" : "destructive"}>
                      {diagnostics.browser.cookieEnabled ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Online Status</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.browser.onLine} />
                    <Badge variant={diagnostics.browser.onLine ? "default" : "destructive"}>
                      {diagnostics.browser.onLine ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Local Storage</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.browser.localStorageSupport} />
                    <Badge variant={diagnostics.browser.localStorageSupport ? "default" : "destructive"}>
                      {diagnostics.browser.localStorageSupport ? "Supported" : "Not Supported"}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  <div><strong>Platform:</strong> {diagnostics.browser.platform}</div>
                  <div><strong>Language:</strong> {diagnostics.browser.language}</div>
                  <div className="break-all"><strong>User Agent:</strong> {diagnostics.browser.userAgent}</div>
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Network Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Server Connection</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.network.status} />
                    <Badge variant={diagnostics.network.status === 'Connected' ? "default" : "destructive"}>
                      {diagnostics.network.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <Badge variant="outline">{diagnostics.network.pingTime}ms</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {diagnostics.auth.authenticated ? (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setLocation("/admin-dashboard")}
                      className="w-full"
                    >
                      Go to Dashboard
                    </Button>
                    <p className="text-sm text-green-600">
                      Authentication is working correctly. You should be able to access the admin dashboard.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setLocation("/admin/login")}
                      className="w-full"
                    >
                      Go to Login
                    </Button>
                    <p className="text-sm text-yellow-600">
                      You need to log in to access the admin dashboard.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <div className="text-center mt-6">
          <Button 
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDiagnostics;