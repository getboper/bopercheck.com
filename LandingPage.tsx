import React, { useState } from 'react'
import SEOHead from './SEOHead'
import LiveReviewTicker from './LiveReviewTicker'
import QuickReviewForm from './QuickReviewForm'
import PriceChecker from './PriceChecker'
import VoucherPotModal from './VoucherPotModal'

interface LandingPageProps {
  onShopperClick?: () => void
  onBusinessClick?: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({
  onShopperClick,
  onBusinessClick
}) => {
  const [showPriceChecker, setShowPriceChecker] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)

  if (showPriceChecker) {
    return (
      <PriceChecker 
        onBackToHome={() => setShowPriceChecker(false)}
        onViewVouchers={() => {}}
      />
    )
  }

  return (
    <>
      <SEOHead
        title="BoperCheck - AI Price Comparison & Voucher Discovery | Save Money Shopping"
        description="Save money on everything you buy with BoperCheck. Our Claude AI finds the best prices across thousands of UK retailers and automatically discovers vouchers. Free unlimited searches, instant savings pot."
        keywords="price comparison UK, voucher codes, discount finder, save money shopping, Claude AI deals, best prices, UK retailers, shopping comparison"
        canonicalUrl="/"
      />
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        color: '#334155'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {/* Hero Section with Central Search CTA */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: 'white',
            padding: '3rem 2rem',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(30, 64, 175, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
              BoperCheck
            </div>
            <div style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
              Search anything and compare prices, local suppliers, and vouchers in one go
            </div>
            
            {/* Central Full-Width Search CTA */}
            <div 
              onClick={() => setShowPriceChecker(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                margin: '2rem auto',
                maxWidth: '600px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
              <span>Search anything & compare - laptops, services, local businesses...</span>
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </div>

            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem' }}>
              Free unlimited searches • Instant voucher discovery • Local supplier alerts
            </div>
          </div>

          {/* Voucher Pot Features */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '1rem' 
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                💰 Your Voucher Pot
              </div>
              <button
                onClick={() => setShowVoucherModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                title="Learn more about the Voucher Pot"
              >
                ?
              </button>
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Earn vouchers with every search and review
            </div>
            <div style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1.5rem' }}>
              Real discount vouchers that grow every time you search - from freebies to £1,000+ savings pots!
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Free Searches</div>
                <div style={{ opacity: 0.8 }}>No limits, ever</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Auto Vouchers</div>
                <div style={{ opacity: 0.8 }}>Found instantly</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Surprise Rewards</div>
                <div style={{ opacity: 0.8 }}>Win with reviews</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div 
                onClick={() => setShowPriceChecker(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Start Earning →
              </div>
              <button
                onClick={() => setShowVoucherModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Business Sign-up Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '1rem' }}>
              Business Owner?
            </div>
            <div style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Get featured in local search results and reach customers actively looking for your services
            </div>
            <div 
              onClick={onBusinessClick}
              style={{
                background: 'linear-gradient(145deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              List Your Business →
            </div>
          </div>

          {/* User Review System */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            marginTop: '3rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e40af',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              What Our Users Say
            </h2>
            
            <LiveReviewTicker />
            
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '0.5rem'
              }}>
                Share Your Experience & Win Instant Voucher
              </h3>
              <p style={{
                color: '#64748b',
                marginBottom: '1rem'
              }}>
                Tell us how BoperCheck helped you save money and win surprise vouchers from top UK retailers.
              </p>
              
              <QuickReviewForm />
            </div>
          </div>
        </div>
      </div>

      <VoucherPotModal 
        isOpen={showVoucherModal} 
        onClose={() => setShowVoucherModal(false)} 
      />
    </>
  )
}

export default LandingPage