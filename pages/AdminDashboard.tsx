import { useState, useEffect } from 'react';
import { AlertCircle, Mail, Users, TrendingUp, Activity, Lock, Eye, EyeOff, Settings, Plus, Check } from 'lucide-react';

interface OutreachConfig {
  dailyBatchSize: number;
  maxDailyEmails: number;
  delayBetweenEmails: number;
  cooldownDays: number;
  categoriesPerDay: number;
  locationsPerDay: number;
}

// Simple inline OutreachConfigPanel component
const OutreachConfigPanel = () => {
  const [config, setConfig] = useState<OutreachConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/outreach-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setSaveMessage('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setIsSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch('/api/admin/outreach-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveMessage('Configuration saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Error: ${error.error || 'Failed to save configuration'}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveMessage('Error: Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetMode = (mode: 'conservative' | 'moderate' | 'aggressive') => {
    if (!config) return;

    const presets = {
      conservative: { dailyBatchSize: 25, categoriesPerDay: 5, locationsPerDay: 8, delayBetweenEmails: 3000 },
      moderate: { dailyBatchSize: 75, categoriesPerDay: 8, locationsPerDay: 12, delayBetweenEmails: 2000 },
      aggressive: { dailyBatchSize: 150, categoriesPerDay: 12, locationsPerDay: 16, delayBetweenEmails: 1000 }
    };

    setConfig({ ...config, ...presets[mode] });
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #f3f3f3', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '16px' }}>Error loading configuration</p>
        <button onClick={fetchConfig} style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
        Outreach Configuration
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Configure automated business outreach settings with GDPR compliance
      </p>

      {/* Quick Presets */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Quick Presets</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={() => setPresetMode('conservative')} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            Conservative (25/day)
          </button>
          <button onClick={() => setPresetMode('moderate')} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            Moderate (75/day)
          </button>
          <button onClick={() => setPresetMode('aggressive')} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            Aggressive (150/day)
          </button>
        </div>
      </div>

      {/* Batch Configuration */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          <Mail style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
          Email Volume Settings
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Daily Target Emails</label>
            <input
              type="number"
              value={config.dailyBatchSize}
              onChange={(e) => setConfig({ ...config, dailyBatchSize: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              min="1"
              max="250"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Safety Limit (Max)</label>
            <input
              type="number"
              value={config.maxDailyEmails}
              onChange={(e) => setConfig({ ...config, maxDailyEmails: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              min="1"
              max="500"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Email Delay (ms)</label>
            <input
              type="number"
              value={config.delayBetweenEmails}
              onChange={(e) => setConfig({ ...config, delayBetweenEmails: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              min="500"
              max="10000"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Cooldown Period (days)</label>
            <input
              type="number"
              value={config.cooldownDays}
              onChange={(e) => setConfig({ ...config, cooldownDays: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              min="1"
              max="90"
            />
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div style={{ marginBottom: '24px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Current Configuration Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <div>Daily Target: <strong>{config.dailyBatchSize} emails</strong></div>
          <div>Safety Limit: <strong>{config.maxDailyEmails} emails</strong></div>
          <div>Email Delay: <strong>{config.delayBetweenEmails}ms</strong></div>
          <div>Cooldown: <strong>{config.cooldownDays} days</strong></div>
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={saveConfig} 
        disabled={isSaving}
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '12px 24px',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          width: '100%',
          opacity: isSaving ? 0.7 : 1
        }}
      >
        {isSaving ? 'Saving Configuration...' : 'Save Configuration'}
      </button>

      {saveMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: saveMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
          color: saveMessage.includes('Error') ? '#dc2626' : '#16a34a',
          fontSize: '14px'
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

// Manual Advertiser Form Component
const ManualAdvertiserForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    packageType: 'basic'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactEmail) {
      setSubmitMessage('Company name and email are required');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/admin/manual-advertiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage(`✓ ${formData.companyName} added successfully with ID: ${result.advertiserId}`);
        setFormData({
          companyName: '',
          contactEmail: '',
          contactPhone: '',
          packageType: 'basic'
        });
      } else {
        const error = await response.json();
        setSubmitMessage(`Error: ${error.message || 'Failed to add advertiser'}`);
      }
    } catch (error) {
      setSubmitMessage('Error: Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Company Name *</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          placeholder="e.g. Glass Act Window Cleaning"
          style={inputStyle}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Contact Email *</label>
        <input
          type="email"
          value={formData.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          placeholder="info@example.com"
          style={inputStyle}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Contact Phone</label>
        <input
          type="text"
          value={formData.contactPhone}
          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
          placeholder="01752 123456"
          style={inputStyle}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Package Type</label>
        <select
          value={formData.packageType}
          onChange={(e) => handleInputChange('packageType', e.target.value)}
          style={inputStyle}
          disabled={isSubmitting}
        >
          <option value="basic">Basic (Admin Override)</option>
          <option value="premium">Premium (Admin Override)</option>
          <option value="enterprise">Enterprise (Admin Override)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '12px 16px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting ? (
          <>Processing...</>
        ) : (
          <>
            <Plus size={16} />
            Add Advertiser
          </>
        )}
      </button>

      {submitMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: submitMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
          color: submitMessage.includes('Error') ? '#dc2626' : '#16a34a',
          fontSize: '14px'
        }}>
          {submitMessage}
        </div>
      )}
    </form>
  );
};


interface AdminData {
  success: boolean;
  adminEmail: string;
  businessOutreach: {
    totalEmailsSent: number;
    emailsLast30Days: number;
    responseRate: string;
    recentOutreach: Array<{
      businessName: string;
      businessEmail: string;
      searchQuery: string;
      dateContacted: string;
      emailStatus: string;
      outreachType: string;
      unsubscribed: boolean;
      bounceReason: string | null;
      errorMessage: string;
      url: string;
      createdAt: string;
      isResolved: boolean;
    }>;
  };
  weeklyReports: {
    totalSignups: number;
    signupsLast7Days: number;
    pendingReports: number;
    recentSignups: Array<{
      email: string;
      reportType: string;
      requestedAt: string;
      status: string;
      sentAt: string | null;
    }>;
  };
  advertisers: {
    totalMonthlyRevenue: number;
    totalClicks: number;
    activeAdvertisers: number;
    advertiserDetails: Array<{
      companyName: string;
      packageType: string;
      monthlyFee: string;
      totalClicks: number;
      totalRevenue: string;
      startDate: string;
      contactEmail: string;
      isActive: boolean;
    }>;
  };
  platform: {
    totalSearches: number;
    searchesLast7Days: number;
    totalUsers: number;
    topSearchQueries: Array<{
      item: string;
      location: string;
      searchCount: number;
    }>;
  };
  timestamp: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('outreach');
  const [outreachTrackerData, setOutreachTrackerData] = useState<any>(null);
  const [outreachTrackerLoading, setOutreachTrackerLoading] = useState(false);
  const [trackerFilters, setTrackerFilters] = useState({
    status: '',
    search: '',
    limit: 50,
    offset: 0
  });
  const [isRunningOutreach, setIsRunningOutreach] = useState(false);
  const [outreachResult, setOutreachResult] = useState<{contacted: number, skipped: number, failed: number} | null>(null);
  const [transparencyData, setTransparencyData] = useState<any>(null);
  const [transparencyLoading, setTransparencyLoading] = useState(false);
  const [reportRequests, setReportRequests] = useState<any[]>([]);
  const [reportRequestsLoading, setReportRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email: email.trim(), passwordLength: password.trim().length });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        }),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (result.success) {
        setToken(result.token);
        setIsAuthenticated(true);
        // No localStorage persistence for security
        await fetchAdminData(result.token);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/live-dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(data);
      } else {
        setError('Failed to fetch admin data');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    }
  };

  const fetchTransparencyData = async (authToken: string) => {
    setTransparencyLoading(true);
    try {
      const response = await fetch('/api/admin/outreach-transparency', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransparencyData(data);
      } else {
        console.error('Failed to fetch transparency data');
      }
    } catch (error) {
      console.error('Error fetching transparency data:', error);
    } finally {
      setTransparencyLoading(false);
    }
  };

  const fetchOutreachTrackerData = async (authToken: string) => {
    setOutreachTrackerLoading(true);
    try {
      const params = new URLSearchParams({
        limit: trackerFilters.limit.toString(),
        offset: trackerFilters.offset.toString(),
        ...(trackerFilters.status && { status: trackerFilters.status }),
        ...(trackerFilters.search && { search: trackerFilters.search })
      });

      const response = await fetch(`/api/admin/outreach-tracker?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOutreachTrackerData(data);
      } else {
        console.error('Failed to fetch outreach tracker data');
      }
    } catch (error) {
      console.error('Error fetching outreach tracker data:', error);
    } finally {
      setOutreachTrackerLoading(false);
    }
  };

  const fetchReportRequests = async (authToken: string) => {
    setReportRequestsLoading(true);
    try {
      const response = await fetch('/api/admin/business-report-requests', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportRequests(data.requests || []);
      } else {
        console.error('Failed to fetch report requests');
      }
    } catch (error) {
      console.error('Error fetching report requests:', error);
    } finally {
      setReportRequestsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminData(null);
    setToken('');
    setEmail('');
    setPassword('');
    // Clear any cached data for security
    localStorage.clear();
  };

  const handleManualOutreach = async () => {
    setIsRunningOutreach(true);
    setOutreachResult(null);
    
    try {
      const response = await fetch('/api/admin/trigger-manual-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setOutreachResult(result);
        // Refresh admin data to update stats
        fetchAdminData(token);
      } else {
        console.error('Manual outreach failed');
      }
    } catch (error) {
      console.error('Error triggering manual outreach:', error);
    } finally {
      setIsRunningOutreach(false);
    }
  };

  useEffect(() => {
    // Always require fresh login for security - no persistent sessions
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setToken('');
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      const interval = setInterval(() => {
        fetchAdminData(token);
        // Auto-refresh outreach tracker data every 60 seconds if tab is active
        if (activeTab === 'outreach-tracker' && outreachTrackerData) {
          fetchOutreachTrackerData(token);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, activeTab, outreachTrackerData]);

  // Separate 60-second refresh for outreach tracker
  useEffect(() => {
    if (isAuthenticated && token && activeTab === 'outreach-tracker' && outreachTrackerData) {
      const outreachInterval = setInterval(() => {
        fetchOutreachTrackerData(token);
      }, 60000); // 60 second refresh

      return () => clearInterval(outreachInterval);
    }
  }, [isAuthenticated, token, activeTab, outreachTrackerData]);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const buttonStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const tabStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? '#4f46e5' : '#f3f4f6',
    color: isActive ? 'white' : '#374151',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '8px'
  });

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{ ...cardStyle, width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={24} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
              Admin Access
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Secure dashboard access
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="#dc2626" />
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogin} 
            disabled={loading}
            style={{
              ...buttonStyle,
              width: '100%',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Live data dashboard • Last updated: {adminData?.timestamp ? new Date(adminData.timestamp).toLocaleString() : 'Never'}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              ...buttonStyle,
              backgroundColor: '#6b7280'
            }}
          >
            Logout
          </button>
        </div>

        {adminData && (
          <>
            {/* Overview Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>Platform Searches</h3>
                  <Activity size={16} color="#6b7280" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                  {adminData.platform.totalSearches.toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {adminData.platform.searchesLast7Days} in last 7 days
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>Business Outreach</h3>
                  <Mail size={16} color="#6b7280" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                  {adminData.businessOutreach.totalEmailsSent}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {adminData.businessOutreach.emailsLast30Days} in last 30 days
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>Weekly Reports</h3>
                  <Users size={16} color="#6b7280" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                  {adminData.weeklyReports.totalSignups}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {adminData.weeklyReports.pendingReports} pending
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>Advertiser Revenue</h3>
                  <TrendingUp size={16} color="#6b7280" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                  £{adminData.advertisers.totalMonthlyRevenue}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {adminData.advertisers.activeAdvertisers} active advertisers
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '16px' }}>
              <button onClick={() => setActiveTab('outreach')} style={tabStyle(activeTab === 'outreach')}>
                Business Outreach
              </button>
              <button onClick={() => {
                setActiveTab('transparency');
                if (token && !transparencyData) {
                  fetchTransparencyData(token);
                }
              }} style={tabStyle(activeTab === 'transparency')}>
                📊 Outreach Transparency
              </button>
              <button onClick={() => setActiveTab('config')} style={tabStyle(activeTab === 'config')}>
                <Settings size={14} style={{ marginRight: '4px' }} />
                Outreach Config
              </button>
              <button onClick={() => {
                setActiveTab('reports');
                if (token && reportRequests.length === 0) {
                  fetchReportRequests(token);
                }
              }} style={tabStyle(activeTab === 'reports')}>
                📋 Business Report Requests
              </button>
              <button onClick={() => setActiveTab('advertisers')} style={tabStyle(activeTab === 'advertisers')}>
                Advertisers
              </button>
              <button onClick={() => setActiveTab('manual-approval')} style={tabStyle(activeTab === 'manual-approval')}>
                Manual Approval
              </button>
              <button onClick={() => setActiveTab('platform')} style={tabStyle(activeTab === 'platform')}>
                Platform Analytics
              </button>
              <button onClick={() => setActiveTab('outreach-tracker')} style={tabStyle(activeTab === 'outreach-tracker')}>
                📬 Outreach Tracker
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'outreach' && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                  SendGrid Business Outreach
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Automated email campaigns to businesses in search results
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.businessOutreach.totalEmailsSent}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Emails</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.businessOutreach.emailsLast30Days}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Last 30 Days</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.businessOutreach.responseRate}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Response Rate</p>
                  </div>
                </div>

                {/* Manual Trigger Button */}
                <div style={{ marginBottom: '24px' }}>
                  <button
                    onClick={handleManualOutreach}
                    disabled={isRunningOutreach}
                    style={{
                      backgroundColor: isRunningOutreach ? '#d1d5db' : '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: isRunningOutreach ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Mail size={16} />
                    {isRunningOutreach ? 'Running Outreach...' : 'Trigger Manual Outreach'}
                  </button>
                  {outreachResult && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #0ea5e9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      Manual outreach complete: {outreachResult.contacted} contacted, {outreachResult.skipped} skipped, {outreachResult.failed} failed
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#111827' }}>
                  Recent Activity
                </h3>
                {adminData.businessOutreach.recentOutreach.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {adminData.businessOutreach.recentOutreach.slice(0, 5).map((activity, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px'
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px', color: '#111827' }}>
                            {activity.businessName}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {activity.businessEmail} • {activity.outreachType}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            backgroundColor: activity.emailStatus === 'delivered' ? '#d1fae5' : 
                                            activity.emailStatus === 'sent' ? '#dbeafe' : 
                                            activity.emailStatus === 'bounced' ? '#fee2e2' : '#fef3c7',
                            color: activity.emailStatus === 'delivered' ? '#065f46' : 
                                  activity.emailStatus === 'sent' ? '#1e40af' : 
                                  activity.emailStatus === 'bounced' ? '#991b1b' : '#92400e',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {activity.emailStatus.charAt(0).toUpperCase() + activity.emailStatus.slice(1)}
                          </span>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>
                            {new Date(activity.dateContacted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>No recent outreach activity</p>
                )}
              </div>
            )}

            {activeTab === 'transparency' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                      Outreach Transparency Dashboard
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Complete tracking of all business outreach with SendGrid delivery data
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      ...buttonStyle,
                      backgroundColor: '#059669',
                      fontSize: '12px',
                      padding: '8px 16px'
                    }}>
                      📊 Export CSV
                    </button>
                    <button style={{
                      ...buttonStyle,
                      backgroundColor: '#7c3aed',
                      fontSize: '12px',
                      padding: '8px 16px'
                    }}>
                      📋 Export JSON
                    </button>
                  </div>
                </div>

                {/* Company Engagement Highlights */}
                {transparencyData && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Companies that Opened Emails */}
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          👁 Companies that Opened Emails ({transparencyData.records.filter((r: any) => r.tracking?.opened).length})
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '12px' }}>
                          {transparencyData.records
                            .filter((record: any) => record.tracking?.opened)
                            .sort((a: any, b: any) => new Date(b.tracking.opened).getTime() - new Date(a.tracking.opened).getTime())
                            .map((record: any, index: number) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                marginBottom: '4px',
                                border: '1px solid #e0f2fe'
                              }}>
                                <div>
                                  <div style={{ fontWeight: '500', color: '#111827' }}>{record.businessName}</div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{record.businessEmail}</div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '10px', color: '#3b82f6' }}>
                                  {new Date(record.tracking.opened).toLocaleDateString('en-GB')}
                                </div>
                              </div>
                            ))
                          }
                          {transparencyData.records.filter((r: any) => r.tracking?.opened).length === 0 && (
                            <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>No email opens recorded yet</div>
                          )}
                        </div>
                      </div>

                      {/* Companies that Clicked Links */}
                      <div style={{
                        backgroundColor: '#fef7ff',
                        border: '1px solid #8b5cf6',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🔗 Companies that Clicked Links ({transparencyData.records.filter((r: any) => r.tracking?.clicked).length})
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '12px' }}>
                          {transparencyData.records
                            .filter((record: any) => record.tracking?.clicked)
                            .sort((a: any, b: any) => new Date(b.tracking.clicked).getTime() - new Date(a.tracking.clicked).getTime())
                            .map((record: any, index: number) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                marginBottom: '4px',
                                border: '1px solid #f3e8ff'
                              }}>
                                <div>
                                  <div style={{ fontWeight: '500', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {record.businessName}
                                    <span style={{ fontSize: '10px', color: '#8b5cf6', backgroundColor: '#f3e8ff', padding: '2px 4px', borderRadius: '2px' }}>HIGH INTEREST</span>
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{record.businessEmail}</div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '10px', color: '#8b5cf6' }}>
                                  {new Date(record.tracking.clicked).toLocaleDateString('en-GB')}
                                </div>
                              </div>
                            ))
                          }
                          {transparencyData.records.filter((r: any) => r.tracking?.clicked).length === 0 && (
                            <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>No link clicks recorded yet</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Database Statistics */}
                {transparencyLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Loading real outreach data from database...</div>
                  </div>
                ) : transparencyData ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                        {transparencyData.statistics.totalContacted}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Total Contacted</p>
                      <p style={{ fontSize: '10px', color: '#059669', margin: 0 }}>
                        {transparencyData.statistics.deliveryRate}% delivery rate
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                        {Math.round(transparencyData.statistics.totalContacted * (transparencyData.statistics.openRate / 100))}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Email Opens</p>
                      <p style={{ fontSize: '10px', color: '#3b82f6', margin: 0 }}>
                        {transparencyData.statistics.openRate}% open rate
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fdf4ff', borderRadius: '8px' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                        {Math.round(transparencyData.statistics.totalContacted * (transparencyData.statistics.clickRate / 100))}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Link Clicks</p>
                      <p style={{ fontSize: '10px', color: '#8b5cf6', margin: 0 }}>
                        {transparencyData.statistics.clickRate}% click rate
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                        {transparencyData.statistics.siteVisits}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Site Visits</p>
                      <p style={{ fontSize: '10px', color: '#10b981', margin: 0 }}>From outreach clicks</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Click "📊 Outreach Transparency" to load real data</div>
                  </div>
                )}

                {/* Search and Filters */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <input 
                    type="text" 
                    placeholder="Search by business name, email, or location..."
                    style={{
                      ...inputStyle,
                      flex: 1,
                      fontSize: '12px'
                    }}
                  />
                  <select style={{
                    ...inputStyle,
                    width: '150px',
                    fontSize: '12px'
                  }}>
                    <option>All Records</option>
                    <option>Delivered</option>
                    <option>Opened</option>
                    <option>Clicked</option>
                    <option>Responded</option>
                    <option>Failed</option>
                  </select>
                  <select style={{
                    ...inputStyle,
                    width: '120px',
                    fontSize: '12px'
                  }}>
                    <option>50 per page</option>
                    <option>25 per page</option>
                    <option>100 per page</option>
                  </select>
                </div>

                {/* Real Database Records Table */}
                {transparencyData && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px', color: '#111827' }}>
                      All Outreach Records ({transparencyData.records.length} total)
                    </h3>
                    
                    <div style={{ overflowX: 'auto', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                          <tr>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Business Name</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Email Address</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Location</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Contacted</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>📧 Delivered</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>👁 Opened</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>🔗 Clicked</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>SendGrid ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transparencyData.records.map((record: any, index: number) => {
                            const hasOpened = record.tracking && record.tracking.opened;
                            const hasClicked = record.tracking && record.tracking.clicked;
                            const wasDelivered = record.emailStatus === 'delivered';
                            
                            return (
                              <tr key={index} style={{ 
                                borderBottom: index < transparencyData.records.length - 1 ? '1px solid #f3f4f6' : 'none',
                                backgroundColor: hasClicked ? '#fef7ff' : hasOpened ? '#f0f9ff' : wasDelivered ? '#f0fdf4' : 'white'
                              }}>
                                <td style={{ padding: '10px 8px', fontSize: '12px', fontWeight: '500', color: '#111827' }}>
                                  {record.businessName}
                                  {hasClicked && <span style={{ color: '#8b5cf6', fontSize: '10px', marginLeft: '4px' }}>⭐ HIGH INTEREST</span>}
                                </td>
                                <td style={{ padding: '10px 8px', fontSize: '11px', color: '#6b7280' }}>
                                  {record.businessEmail}
                                </td>
                                <td style={{ padding: '10px 8px', fontSize: '11px', color: '#374151' }}>
                                  {record.location || 'UK'}
                                </td>
                                <td style={{ padding: '10px 8px', fontSize: '11px', color: '#374151' }}>
                                  {new Date(record.dateContacted).toLocaleDateString('en-GB')}
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {wasDelivered ? (
                                    <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
                                  ) : record.emailStatus === 'bounced' ? (
                                    <span style={{ color: '#dc2626', fontSize: '16px' }}>✗</span>
                                  ) : (
                                    <span style={{ color: '#f59e0b', fontSize: '16px' }}>⏳</span>
                                  )}
                                  <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>
                                    {record.tracking && record.tracking.delivered 
                                      ? new Date(record.tracking.delivered).toLocaleDateString('en-GB')
                                      : record.emailStatus
                                    }
                                  </div>
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {hasOpened ? (
                                    <div>
                                      <span style={{ color: '#3b82f6', fontSize: '16px' }}>👁</span>
                                      <div style={{ fontSize: '9px', color: '#3b82f6', marginTop: '2px' }}>
                                        {new Date(record.tracking.opened).toLocaleDateString('en-GB')}
                                      </div>
                                    </div>
                                  ) : wasDelivered ? (
                                    <span style={{ color: '#d1d5db', fontSize: '16px' }}>👁</span>
                                  ) : (
                                    <span style={{ color: '#f3f4f6', fontSize: '16px' }}>-</span>
                                  )}
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {hasClicked ? (
                                    <div>
                                      <span style={{ color: '#8b5cf6', fontSize: '16px' }}>🔗</span>
                                      <div style={{ fontSize: '9px', color: '#8b5cf6', marginTop: '2px' }}>
                                        {new Date(record.tracking.clicked).toLocaleDateString('en-GB')}
                                      </div>
                                    </div>
                                  ) : hasOpened ? (
                                    <span style={{ color: '#d1d5db', fontSize: '16px' }}>🔗</span>
                                  ) : (
                                    <span style={{ color: '#f3f4f6', fontSize: '16px' }}>-</span>
                                  )}
                                </td>
                                <td style={{ padding: '10px 8px', fontSize: '9px', color: '#6b7280' }}>
                                  {record.sendgridMessageId ? record.sendgridMessageId.substring(0, 12) + '...' : 'N/A'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Real Database Pagination */}
                {transparencyData && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
                    <span>Showing {transparencyData.records.length} of {transparencyData.statistics.totalContacted} records</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        ...buttonStyle,
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}>
                        Previous
                      </button>
                      <span style={{ padding: '6px 12px', fontSize: '12px' }}>Page 1 of {Math.ceil(transparencyData.statistics.totalContacted / 50)}</span>
                      <button style={{
                        ...buttonStyle,
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}>
                        Next
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: '#6b7280' }}>
                  Real-time data • Auto-refreshing every 30 seconds • Full SendGrid webhook integration
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <OutreachConfigPanel />
            )}

            {activeTab === 'reports' && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                  📋 Business Report Requests
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Businesses that clicked outreach emails and requested free reports
                </p>

                {reportRequestsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #4f46e5',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 16px'
                    }}></div>
                    <p style={{ color: '#6b7280' }}>Loading business report requests...</p>
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        textAlign: 'center',
                        flex: 1
                      }}>
                        <div>
                          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                            {reportRequests.length}
                          </p>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Requests</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#16a34a' }}>
                            {reportRequests.filter(r => r.status === 'sent').length}
                          </p>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Reports Sent</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#dc2626' }}>
                            {reportRequests.filter(r => r.status === 'pending').length}
                          </p>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Pending</p>
                        </div>
                      </div>
                      
                      <div style={{ marginLeft: '24px' }}>
                        <select 
                          value={statusFilter} 
                          onChange={(e) => setStatusFilter(e.target.value)}
                          style={{
                            ...inputStyle,
                            width: '150px',
                            fontSize: '12px'
                          }}
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="sent">Sent</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>

                    {reportRequests.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <p>No business report requests found</p>
                        <p style={{ fontSize: '12px' }}>Requests will appear here when businesses click outreach emails</p>
                      </div>
                    ) : (
                      <div style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '16px',
                        maxHeight: '500px',
                        overflowY: 'auto'
                      }}>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Business Name</th>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Location</th>
                              <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                              <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Report Sent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportRequests
                              .filter(request => statusFilter === 'all' || request.status === statusFilter)
                              .map((request, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '8px', color: '#374151' }}>
                                    {new Date(request.requestedAt).toLocaleDateString('en-GB')}
                                  </td>
                                  <td style={{ padding: '8px', color: '#111827', fontWeight: '500' }}>
                                    {request.businessName}
                                  </td>
                                  <td style={{ padding: '8px', color: '#374151' }}>
                                    {request.email}
                                  </td>
                                  <td style={{ padding: '8px', color: '#374151' }}>
                                    {request.location}
                                  </td>
                                  <td style={{ padding: '8px', textAlign: 'center' }}>
                                    <span style={{
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '10px',
                                      fontWeight: '500',
                                      backgroundColor: request.status === 'sent' ? '#dcfce7' : 
                                                     request.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                      color: request.status === 'sent' ? '#16a34a' :
                                             request.status === 'pending' ? '#d97706' : '#dc2626'
                                    }}>
                                      {request.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px', textAlign: 'center', color: '#6b7280' }}>
                                    {request.sentAt ? new Date(request.sentAt).toLocaleDateString('en-GB') : '-'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'advertisers' && adminData && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                  Advertiser Performance
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Revenue and click metrics from active advertisers
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      £{adminData.advertisers.totalMonthlyRevenue}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Monthly Revenue</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.advertisers.totalClicks.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Clicks</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.advertisers.activeAdvertisers}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Active Advertisers</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#111827' }}>
                  Advertiser Details
                </h3>
                {adminData.advertisers.advertiserDetails.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {adminData.advertisers.advertiserDetails.map((advertiser, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px'
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px', color: '#111827' }}>
                            {advertiser.companyName}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {advertiser.packageType} • {advertiser.contactEmail}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px', color: '#111827' }}>
                            £{advertiser.monthlyFee}/mo
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {advertiser.totalClicks} clicks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>No active advertisers</p>
                )}
              </div>
            )}

            {activeTab === 'manual-approval' && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                  Manual Advertiser Approval
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Add businesses directly to the advertiser system without requiring Stripe payment
                </p>

                <ManualAdvertiserForm />
              </div>
            )}

            {activeTab === 'platform' && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                  Platform Analytics
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  User engagement and search patterns
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.platform.totalSearches.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Searches</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.platform.searchesLast7Days}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Last 7 Days</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
                      {adminData.platform.totalUsers}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Users</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#111827' }}>
                  Top Search Queries
                </h3>
                {adminData.platform.topSearchQueries.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {adminData.platform.topSearchQueries.map((query, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px'
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px', color: '#111827' }}>
                            {query.item}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {query.location}
                          </p>
                        </div>
                        <span style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {query.searchCount} searches
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>No search data available</p>
                )}
              </div>
            )}

            {/* Outreach Tracker Tab */}
            {activeTab === 'outreach-tracker' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827' }}>
                      📬 Outreach & Business Signup Tracker
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Complete visibility into email outreach and business signups for audit and investor reporting
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => window.open('/api/admin/export-outreach/csv', '_blank')}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#059669',
                        fontSize: '12px',
                        padding: '8px 16px'
                      }}
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => window.open('/api/admin/export-outreach/json', '_blank')}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#7c3aed',
                        fontSize: '12px',
                        padding: '8px 16px'
                      }}
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px', 
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      Search Business/Email
                    </label>
                    <input
                      type="text"
                      value={trackerFilters.search}
                      onChange={(e) => setTrackerFilters({ ...trackerFilters, search: e.target.value })}
                      placeholder="Search businesses..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      Delivery Status
                    </label>
                    <select
                      value={trackerFilters.status}
                      onChange={(e) => setTrackerFilters({ ...trackerFilters, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">All Status</option>
                      <option value="delivered">Delivered</option>
                      <option value="bounced">Bounced</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      Records Per Page
                    </label>
                    <select
                      value={trackerFilters.limit}
                      onChange={(e) => setTrackerFilters({ ...trackerFilters, limit: parseInt(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                    <button
                      onClick={() => {
                        setTrackerFilters({ ...trackerFilters, offset: 0 });
                        if (token) fetchOutreachTrackerData(token);
                      }}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#6b7280',
                        fontSize: '12px',
                        padding: '8px 16px',
                        width: '100%'
                      }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>

                {/* Load Data Button */}
                {!outreachTrackerData && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <button
                      onClick={() => token && fetchOutreachTrackerData(token)}
                      disabled={outreachTrackerLoading}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#4f46e5',
                        opacity: outreachTrackerLoading ? 0.6 : 1
                      }}
                    >
                      {outreachTrackerLoading ? 'Loading Tracker Data...' : 'Load Outreach Tracker Data'}
                    </button>
                  </div>
                )}

                {/* Outreach Data Table */}
                {outreachTrackerData && (
                  <div>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                        Email Outreach Log ({outreachTrackerData.pagination.total} total records)
                      </h3>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Auto-refresh: 60s • Last updated: {new Date().toLocaleTimeString()}
                      </div>
                    </div>

                    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Business</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Email</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Location</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Search Term</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Date Contacted</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Delivered</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Opened</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Clicked</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Signed Up</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Signup Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outreachTrackerData.data.map((record: any, index: number) => (
                            <tr key={record.id} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                              <td style={{ padding: '10px 8px', fontSize: '13px' }}>
                                <div style={{ fontWeight: '500', color: '#111827' }}>{record.business_name}</div>
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {record.business_email}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {record.location}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {record.search_term}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {new Date(record.date_contacted).toLocaleDateString('en-GB')}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                {record.delivery_status === 'delivered' ? (
                                  <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
                                ) : record.delivery_status === 'bounced' ? (
                                  <span style={{ color: '#dc2626', fontSize: '16px' }}>✗</span>
                                ) : (
                                  <span style={{ color: '#d1d5db', fontSize: '16px' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                {record.has_opened ? (
                                  <span style={{ color: '#2563eb', fontSize: '16px' }}>👁</span>
                                ) : (
                                  <span style={{ color: '#d1d5db', fontSize: '16px' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                {record.has_clicked ? (
                                  <span style={{ color: '#8b5cf6', fontSize: '16px' }}>🔗</span>
                                ) : (
                                  <span style={{ color: '#d1d5db', fontSize: '16px' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                {record.has_signed_up ? (
                                  <span style={{ color: '#059669', fontSize: '16px' }}>🎯</span>
                                ) : (
                                  <span style={{ color: '#d1d5db', fontSize: '16px' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {record.signup_date ? new Date(record.signup_date).toLocaleDateString('en-GB') : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginTop: '16px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <span>
                        Showing {outreachTrackerData.pagination.offset + 1} to {Math.min(outreachTrackerData.pagination.offset + outreachTrackerData.pagination.limit, outreachTrackerData.pagination.total)} of {outreachTrackerData.pagination.total} records
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const newOffset = Math.max(0, trackerFilters.offset - trackerFilters.limit);
                            setTrackerFilters({ ...trackerFilters, offset: newOffset });
                            if (token) fetchOutreachTrackerData(token);
                          }}
                          disabled={trackerFilters.offset === 0}
                          style={{
                            ...buttonStyle,
                            backgroundColor: trackerFilters.offset === 0 ? '#f3f4f6' : '#6b7280',
                            color: trackerFilters.offset === 0 ? '#9ca3af' : 'white',
                            fontSize: '12px',
                            padding: '6px 12px'
                          }}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            const newOffset = trackerFilters.offset + trackerFilters.limit;
                            setTrackerFilters({ ...trackerFilters, offset: newOffset });
                            if (token) fetchOutreachTrackerData(token);
                          }}
                          disabled={!outreachTrackerData.pagination.hasMore}
                          style={{
                            ...buttonStyle,
                            backgroundColor: !outreachTrackerData.pagination.hasMore ? '#f3f4f6' : '#6b7280',
                            color: !outreachTrackerData.pagination.hasMore ? '#9ca3af' : 'white',
                            fontSize: '12px',
                            padding: '6px 12px'
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Report Signups Section */}
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    Weekly Report Signups
                  </h3>
                  
                  {reportRequests.length > 0 ? (
                    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Business Name</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Email</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Location</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Category</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Timestamp</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Origin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportRequests.map((request: any, index: number) => (
                            <tr key={request.id} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                              <td style={{ padding: '10px 8px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                                {request.businessName}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {request.email}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {request.location}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {request.category || 'N/A'}
                              </td>
                              <td style={{ padding: '10px 8px', fontSize: '12px', color: '#6b7280' }}>
                                {new Date(request.requestedAt).toLocaleDateString('en-GB')}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                <span style={{
                                  backgroundColor: request.status === 'pending' ? '#fef3c7' : request.status === 'active' ? '#dcfce7' : '#fee2e2',
                                  color: request.status === 'pending' ? '#92400e' : request.status === 'active' ? '#166534' : '#991b1b',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}>
                                  {request.status}
                                </span>
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                <span style={{
                                  backgroundColor: request.reportType === 'test_signup' ? '#fde68a' : '#dbeafe',
                                  color: request.reportType === 'test_signup' ? '#92400e' : '#1e40af',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}>
                                  {request.reportType === 'test_signup' ? 'TEST' : request.reportType?.replace('_', ' ') || 'organic'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '24px' }}>
                      No business report signups found
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}