import React from 'react'

interface BusinessSuccessProps {
  onNavigate: (page: 'landing' | 'price-checker' | 'advertiser' | 'money-pot' | 'voucher-jar' | 'dashboard' | 'voucher-drop' | 'weekly-report' | 'subscription-plans' | 'admin-dashboard' | 'email-templates' | 'gamified-pot' | 'ai-onboarding' | 'business-dashboard' | 'reward-centre' | 'voucher-wallet' | 'download-locker' | 'search-history' | 'email-confirmation' | 'premium-advertiser-signup' | 'business' | 'business-success') => void
}

const BusinessSuccess: React.FC<BusinessSuccessProps> = ({ onNavigate }) => {
  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          ✓
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome to BoperCheck Business!
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#cbd5e1',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Your payment has been processed successfully. You'll receive a confirmation email shortly with your account details and setup instructions.
        </p>
        
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#60a5fa',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            What happens next?
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#e2e8f0'
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                color: '#10b981',
                marginRight: '0.75rem',
                fontSize: '1.1rem'
              }}>
                1.
              </span>
              Account activation within 2 hours
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                color: '#10b981',
                marginRight: '0.75rem',
                fontSize: '1.1rem'
              }}>
                2.
              </span>
              Business profile setup assistance
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                color: '#10b981',
                marginRight: '0.75rem',
                fontSize: '1.1rem'
              }}>
                3.
              </span>
              Category optimization recommendations
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                color: '#10b981',
                marginRight: '0.75rem',
                fontSize: '1.1rem'
              }}>
                4.
              </span>
              First weekly performance report
            </li>
          </ul>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onNavigate('landing')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Back to BoperCheck
          </button>
          
          <button
            onClick={() => window.open('mailto:support@bopercheck.com')}
            style={{
              background: 'transparent',
              color: '#cbd5e1',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#cbd5e1'
            }}
          >
            Contact Support
          </button>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#a7f3d0'
        }}>
          Need to pause your listing temporarily? Contact us anytime - we understand business can get overwhelming.
        </div>
      </div>
    </div>
  )
}

export default BusinessSuccess