import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface Visitor {
  email: string;
  firstName?: string;
  lastVisit?: string;
  searchQuery?: string;
  experiencedError?: boolean;
}

const EmailOutreachPage = () => {
  const [singleEmail, setSingleEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const sendSingleApology = async () => {
    if (!singleEmail) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/send-apology-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: singleEmail,
          firstName,
          searchQuery,
          lastVisit: new Date().toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Apology email sent successfully!');
        setSingleEmail('');
        setFirstName('');
        setSearchQuery('');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send email');
    }
    setLoading(false);
  };

  const sendBulkApologies = async () => {
    const emailList = visitors.filter(v => v.email && v.experiencedError);
    
    if (emailList.length === 0) {
      setMessage('❌ No visitors with errors found to email');
      return;
    }
    
    setBulkLoading(true);
    try {
      const response = await fetch('/api/admin/bulk-apology-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: emailList })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Bulk emails sent! ${data.results.sent} successful, ${data.results.failed} failed`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send bulk emails');
    }
    setBulkLoading(false);
  };

  const loadRecentVisitors = async () => {
    try {
      const response = await fetch('/api/admin/recent-visitors');
      const data = await response.json();
      setVisitors(data.visitors || []);
    } catch (error) {
      setMessage('❌ Failed to load visitor data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Mail className="h-8 w-8 mr-3 text-blue-600" />
          Email Outreach - Cache Error Apology
        </h1>
        <p className="text-gray-600">
          Reach out to visitors who experienced cache errors and invite them back to try the fixed platform.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Email Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Send Individual Apology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="user@example.com"
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
              <label className="block text-sm font-medium mb-2">Search Query They Used (Optional)</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="mountain bike"
              />
            </div>
            
            <Button 
              onClick={sendSingleApology}
              disabled={!singleEmail || loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Apology Email'}
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Email Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Bulk Visitor Outreach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              <p>Target visitors who experienced cache errors and invite them back to try the improved platform.</p>
            </div>
            
            <Button 
              onClick={loadRecentVisitors}
              variant="outline"
              className="w-full"
            >
              Load Recent Visitors
            </Button>
            
            {visitors.length > 0 && (
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                <h4 className="font-medium mb-2">Recent Visitors ({visitors.length})</h4>
                {visitors.map((visitor, index) => (
                  <div key={index} className="text-xs py-1 flex items-center">
                    {visitor.experiencedError ? (
                      <AlertCircle className="h-3 w-3 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    )}
                    <span>{visitor.email} - {visitor.searchQuery || 'No search'}</span>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              onClick={sendBulkApologies}
              disabled={bulkLoading || visitors.filter(v => v.experiencedError).length === 0}
              className="w-full"
            >
              {bulkLoading ? 'Sending Bulk Emails...' : 
               `Send Apologies to ${visitors.filter(v => v.experiencedError).length} Affected Users`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Email Preview Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg text-center">
              <h2 className="text-xl font-bold">🙏 We Owe You an Apology</h2>
              <p className="text-sm opacity-90">BoperCheck Team</p>
            </div>
            <div className="bg-white p-4 rounded-b-lg">
              <p className="mb-3">Dear [Customer Name],</p>
              <p className="mb-3">We noticed you visited BoperCheck recently and may have experienced some technical difficulties with our cache system. We sincerely apologize for any frustration this caused.</p>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-3">
                <h4 className="font-semibold">🔧 What We've Fixed:</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Enhanced voucher detection - Now properly extracts discount codes</li>
                  <li>• Improved search reliability - Cache issues completely resolved</li>
                  <li>• Better error handling - Smoother experience for all users</li>
                  <li>• Faster response times - Optimized performance</li>
                </ul>
              </div>
              
              <div className="text-center my-4">
                <div className="inline-block bg-green-600 text-white px-6 py-2 rounded">
                  Try BoperCheck Again - It's Fixed!
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Best regards,<br/>
                The BoperCheck Team
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailOutreachPage;