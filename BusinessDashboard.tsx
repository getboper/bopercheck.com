import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, MousePointer, Mail, CreditCard, Plus } from 'lucide-react';

export default function BusinessDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    serviceArea: '',
    adHeadline: '',
    website: ''
  });

  useEffect(() => {
    fetchBusinessStats();
  }, []);

  const fetchBusinessStats = async () => {
    try {
      const response = await fetch('/api/business/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const submitCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/business/submit-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Campaign submitted successfully!');
        setFormData({ businessName: '', serviceArea: '', adHeadline: '', website: '' });
        fetchBusinessStats();
      }
    } catch (error) {
      console.error('Campaign submission error:', error);
    }
  };

  const upgradeToPremiume = () => {
    window.location.href = '/api/stripe/business-premium-checkout';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <BarChart3 style={{ width: '2.5rem', height: '2.5rem', color: '#4f46e5' }} />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e3a8a', margin: 0 }}>
                Business Dashboard
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Submit campaigns, view performance stats, and manage your local advertising
              </p>
            </div>
          </div>
          
          <button
            onClick={upgradeToPremiume}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
            Upgrade to Premium Business
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Campaign Submission */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Plus style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                Submit New Campaign
              </h3>
            </div>
            
            <form onSubmit={submitCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                required
                style={{
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Service Area (e.g., Plymouth, Devon)"
                value={formData.serviceArea}
                onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                required
                style={{
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <textarea
                placeholder="Ad Headline & Special Offer"
                value={formData.adHeadline}
                onChange={(e) => setFormData({...formData, adHeadline: e.target.value})}
                required
                rows={3}
                style={{
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <input
                type="url"
                placeholder="Website or Booking Link"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                style={{
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Submit Campaign
              </button>
            </form>
          </div>

          {/* Performance Stats */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                Performance Stats
              </h3>
            </div>
            
            {stats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    <span style={{ color: '#374151', fontWeight: '600' }}>Views</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e3a8a' }}>
                    {stats.views}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MousePointer style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    <span style={{ color: '#374151', fontWeight: '600' }}>Clicks</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>
                    {stats.clicks}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    <span style={{ color: '#374151', fontWeight: '600' }}>Enquiries</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>
                    {stats.enquiries}
                  </span>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: '600' }}>
                    Conversion Rate
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669' }}>
                    {stats.conversionRate}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                Loading performance data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}