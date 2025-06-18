import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const EmailTestPage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('❌ Email is required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/send-apology-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || 'Valued Customer',
          searchQuery: searchQuery || 'recent search',
          lastVisit: new Date().toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Apology email sent successfully! Check the recipient inbox.');
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to send email'}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send email - check server logs');
    }
    setLoading(false);
  };

  const triggerBulkApologies = async () => {
    setBulkLoading(true);
    try {
      const response = await fetch('/api/admin/trigger-bulk-apologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorType: 'cache_error' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Bulk apologies sent! ${data.sent} emails sent to ${data.total} users.`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to trigger bulk apologies');
    }
    setBulkLoading(false);
  };

  const loadErrorStats = async () => {
    try {
      const response = await fetch('/api/admin/error-stats');
      const data = await response.json();
      setErrorStats(data);
    } catch (error) {
      console.error('Failed to load error stats:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Mail className="h-8 w-8 mr-3 text-blue-600" />
          Email Outreach Test
        </h1>
        <p className="text-gray-600">
          Send cache error apology emails to visitors.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.includes('✅') ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Send Apology Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">First Name (Optional)</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Their Search Query (Optional)</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="mountain bike"
            />
          </div>
          
          <Button 
            onClick={sendTestEmail}
            disabled={!email || loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Apology Email'}
          </Button>
          
          <div className="space-y-4 mt-6">
            <Button 
              onClick={triggerBulkApologies}
              disabled={bulkLoading}
              variant="outline"
              className="w-full"
            >
              {bulkLoading ? 'Sending Bulk Apologies...' : 'Send Bulk Apologies to Recent Users'}
            </Button>
            
            <Button 
              onClick={loadErrorStats}
              variant="outline"
              className="w-full"
            >
              Load Error Statistics
            </Button>
            
            {errorStats && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Error Monitoring:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Cache Errors: {errorStats.cacheErrors}</div>
                  <div>API Errors: {errorStats.apiErrors}</div>
                  <div>Timeout Errors: {errorStats.timeoutErrors}</div>
                  <div>Total Active: {errorStats.totalErrors}</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Monitoring: {errorStats.monitoring} | Updated: {new Date(errorStats.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p><strong>Automatic Email Features:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Automatic emails sent when errors occur</li>
              <li>24-hour cooldown to prevent spam</li>
              <li>Professional apology templates</li>
              <li>Real-time error monitoring</li>
              <li>Bulk outreach capabilities</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestPage;