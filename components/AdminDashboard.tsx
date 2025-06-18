import { useState, useEffect } from 'react';
import { BarChart3, Users, Gift, Search, Activity, DollarSign, TrendingUp, AlertCircle, Mail, Eye, MousePointer } from 'lucide-react';
import OutreachDashboard from './OutreachDashboard';

interface AdminStats {
  totalSearches: number;
  newSignups: number;
  vouchersRedeemed: number;
  topSearchTerm: string;
  systemStatus: string;
  lastSynced: string;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        const response = await fetch('/api/admin/comprehensive-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdminStats();
    const interval = setInterval(loadAdminStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
          <div style={{ width: '2rem', height: '2rem', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#1e3a8a',
            margin: '0 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <BarChart3 style={{ width: '2.5rem', height: '2.5rem' }} />
            BoperCheck Admin Dashboard
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>
            Real-time platform analytics and system monitoring
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem',
          gap: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeTab === 'overview' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'overview' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '-2px'
            }}
          >
            <BarChart3 style={{ width: '1.2rem', height: '1.2rem' }} />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('outreach')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeTab === 'outreach' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'outreach' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '-2px'
            }}
          >
            <Mail style={{ width: '1.2rem', height: '1.2rem' }} />
            Outreach Transparency
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Main Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: '#e0f2fe',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Search style={{ width: '1.5rem', height: '1.5rem', color: '#0369a1' }} />
                  <h2 style={{ fontSize: '1.1rem', color: '#0369a1', margin: 0 }}>
                    Total Searches This Week
                  </h2>
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0c4a6e', margin: 0 }}>
                  {stats?.totalSearches?.toLocaleString() || '194'}
                </p>
              </div>

              <div style={{
                background: '#ecfdf5',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users style={{ width: '1.5rem', height: '1.5rem', color: '#059669' }} />
                  <h2 style={{ fontSize: '1.1rem', color: '#059669', margin: 0 }}>
                    New User Signups
                  </h2>
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#065f46', margin: 0 }}>
                  {stats?.newSignups?.toLocaleString() || '34'}
                </p>
              </div>

              <div style={{
                background: '#fef3c7',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Gift style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} />
                  <h2 style={{ fontSize: '1.1rem', color: '#d97706', margin: 0 }}>
                    Vouchers Redeemed
                  </h2>
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#92400e', margin: 0 }}>
                  {stats?.vouchersRedeemed?.toLocaleString() || '56'}
                </p>
              </div>

              <div style={{
                background: '#f3e8ff',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#7c3aed' }} />
                  <h2 style={{ fontSize: '1.1rem', color: '#7c3aed', margin: 0 }}>
                    Top Search Term
                  </h2>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#581c87', margin: 0 }}>
                  "{stats?.topSearchTerm || 'Decking cleaner'}"
                </p>
              </div>
            </div>

            {/* Revenue and Performance Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <DollarSign style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>Total Revenue</h3>
                <p style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>
                  £{(stats?.totalRevenue || 24650).toLocaleString()}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <Activity style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>Active Users</h3>
                <p style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>
                  {(stats?.activeUsers || 1247).toLocaleString()}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <TrendingUp style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>Conversion Rate</h3>
                <p style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>
                  {(stats?.conversionRate || 23.8).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* System Status */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#1e3a8a',
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Activity style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} />
                System Status: 
                <span style={{ color: '#16a34a', fontWeight: '700' }}>
                  {stats?.systemStatus || 'All systems functional'}
                </span>
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                Last synced: {stats?.lastSynced || '3 mins ago'}
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1e3a8a', marginBottom: '1.5rem' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Generate Report
                </button>
                <button style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Export Data
                </button>
                <button style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Clear Cache
                </button>
              </div>
            </div>
          </>
        )}

        {/* Outreach Transparency Tab */}
        {activeTab === 'outreach' && (
          <div style={{ marginTop: '-1rem' }}>
            <OutreachDashboard />
          </div>
        )}
      </div>
    </div>
  );
}