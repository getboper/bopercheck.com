import React from 'react'

interface VoucherPreviewProps {
  onSignInClick: () => void
}

const VoucherPreview: React.FC<VoucherPreviewProps> = ({ onSignInClick }) => {
  const previewVouchers = [
    {
      id: '1',
      brand: 'Amazon',
      value: '£15.00',
      description: '10% off electronics',
      blurred: true
    },
    {
      id: '2', 
      brand: 'Argos',
      value: '£8.50',
      description: 'Free delivery',
      blurred: true
    },
    {
      id: '3',
      brand: 'Tesco',
      value: '£12.25', 
      description: '£5 off weekly shop',
      blurred: true
    }
  ]

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      color: '#334155',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
            Your Voucher Collection
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Sign in to unlock your personalized vouchers and savings
          </div>
        </div>

        {/* Blurred Voucher Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {previewVouchers.map((voucher) => (
            <div
              key={voucher.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                filter: 'blur(2px)',
                opacity: 0.7,
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e40af'
                }}>
                  {voucher.brand}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {voucher.value}
                </div>
              </div>
              
              <div style={{
                color: '#64748b',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                {voucher.description}
              </div>
              
              <div style={{
                background: '#f1f5f9',
                padding: '0.75rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                textAlign: 'center',
                color: '#475569'
              }}>
                ****-****-****
              </div>
            </div>
          ))}
        </div>

        {/* Sign In CTA */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '1rem'
          }}>
            Unlock Your Full Voucher Collection
          </div>
          
          <div style={{
            color: '#64748b',
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            Sign in to access your personalized voucher codes, track your savings, and discover new deals tailored just for you.
          </div>
          
          <button
            onClick={onSignInClick}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
          >
            Sign In to Unlock Vouchers
          </button>
          
          <div style={{
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: '#64748b'
          }}>
            Free account • Instant access • Over 1,000 partner retailers
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoucherPreview