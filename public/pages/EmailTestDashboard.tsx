import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EmailTestDashboard() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmailSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/test-email-setup', {
        method: 'POST'
      });
      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({ 
        success: false, 
        message: 'Failed to connect to email service',
        error: String(error)
      });
    }
    setLoading(false);
  };

  const testApologyEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/test-apology-email', {
        method: 'POST'
      });
      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({ 
        success: false, 
        message: 'Failed to send apology email',
        error: String(error)
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Email System Testing</h1>
        <p className="text-gray-600 mt-2">Test your automatic email outreach system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Email Setup Test
              <Badge variant="outline">Configuration</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Tests if SendGrid is properly configured and can send basic emails.
            </p>
            <Button 
              onClick={testEmailSetup}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Email Configuration'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Apology Email Test
              <Badge variant="outline">Template</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Sends a sample apology email to test the automatic outreach template.
            </p>
            <Button 
              onClick={testApologyEmail}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? 'Sending...' : 'Send Test Apology Email'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Test Results
              <Badge variant={testResults.success ? "default" : "destructive"}>
                {testResults.success ? 'Success' : 'Failed'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium">{testResults.message}</p>
              
              {testResults.details && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Details:</h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(testResults.details, null, 2)}
                  </pre>
                </div>
              )}

              {!testResults.success && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-blue-800">Next Steps:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Go to SendGrid Dashboard → Settings → Sender Authentication</li>
                    <li>• Verify your email address: support@bopercheck.com</li>
                    <li>• Or set up domain authentication for bopercheck.com</li>
                    <li>• Once verified, the automatic email system will work</li>
                  </ul>
                </div>
              )}

              {testResults.success && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-green-800">System Status:</h4>
                  <p className="text-sm text-green-700">
                    Automatic email outreach is now active and will send professional 
                    apology emails when users experience technical issues.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Email System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automatic Triggers:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cache errors (after 3 occurrences)</li>
                <li>• API failures (after 2 occurrences)</li>
                <li>• Timeout errors (immediate)</li>
                <li>• 24-hour cooldown to prevent spam</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Email Content:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional apology message</li>
                <li>• BoperCheck branding</li>
                <li>• Call-to-action to return to site</li>
                <li>• Money-saving tips as goodwill gesture</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}