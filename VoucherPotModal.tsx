import React from 'react'

interface VoucherPotModalProps {
  isOpen: boolean
  onClose: () => void
}

const VoucherPotModal: React.FC<VoucherPotModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#64748b',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '0.5rem'
          }}>
            💰 What Is the Voucher Pot?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            The BoperCheck Voucher Pot is your personal savings stash, filled with real, usable discount vouchers that grow every time you search! Whether you're hunting for the best price on a new sofa or comparing quotes for a plumber, our AI automatically adds valuable vouchers to your pot along the way.
          </p>
        </div>

        {/* Why It's Awesome */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid #22c55e'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#15803d',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔥 Why It's Awesome
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💸</span>
              <div>
                <div style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>
                  Get Free Vouchers Just for Searching!
                </div>
                <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                  Some vouchers are straight-up freebies – no strings attached. Others are exclusive discounts at top UK retailers and service providers.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
              <div>
                <div style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>
                  Build a Pot Worth £100s – Even £1,000+
                </div>
                <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                  The more you use BoperCheck, the bigger your pot grows. Serious savers can rack up £1,000+ in potential savings over time.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👑</span>
              <div>
                <div style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>
                  Spend, Save, or Share
                </div>
                <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                  Use your vouchers yourself, gift them to friends and family, or even compete with your mates to see who can build the biggest pot!
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
              <div>
                <div style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>
                  Bonus Incentives & Surprise Offers
                </div>
                <div style={{ color: '#374151', fontSize: '0.95rem' }}>
                  From mystery deals to limited-time reward boosters – expect the unexpected. Keep checking in to unlock new rewards.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Claim & Use */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{
            fontSize: '1.6rem',
            fontWeight: '700',
            color: '#92400e',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🛎️ How to Claim & Use Vouchers
          </h3>
          
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '0.75rem'
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#374151'
            }}>
              <span style={{ color: '#f59e0b', fontWeight: '600' }}>•</span>
              You must register or log in to access and use your Voucher Pot
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#374151'
            }}>
              <span style={{ color: '#f59e0b', fontWeight: '600' }}>•</span>
              All vouchers will show their value, retailer, terms, and expiry date
            </li>
          </ul>
        </div>

        {/* Important Warning */}
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '2px solid #ef4444'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚠️ Important to Know
          </h3>
          <p style={{
            color: '#374151',
            fontSize: '0.95rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Voucher availability depends on retailer partnerships and current offers. Terms and conditions apply to all vouchers. Some vouchers may have minimum spend requirements or be limited to specific product categories.
          </p>
        </div>

        {/* Action Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Start Building Your Pot →
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoucherPotModal