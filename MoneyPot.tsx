import React, { useState, useEffect } from 'react'

interface MoneyPotProps {
  onKeepSaving?: () => void
  onReferAndEarn?: () => void
}

interface VoucherData {
  id: string
  amount: number
  provider: string
  description: string
  timestamp: Date
  category: string
}

const MoneyPot: React.FC<MoneyPotProps> = ({ onKeepSaving, onReferAndEarn }) => {
  const [totalSaved, setTotalSaved] = useState(47.85)
  const [recentVouchers, setRecentVouchers] = useState<VoucherData[]>([
    {
      id: '1',
      amount: 12.50,
      provider: 'Tesco',
      description: '10% off groceries',
      timestamp: new Date(),
      category: 'groceries'
    },
    {
      id: '2',
      amount: 15.99,
      provider: 'ASOS',
      description: '20% off fashion',
      timestamp: new Date(Date.now() - 86400000),
      category: 'fashion'
    }
  ])
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing(true)
      setTimeout(() => setIsGlowing(false), 1000)
    }, 5000)

    return () => clearInterval(glowInterval)
  }, [])

  const getMilestoneProgress = () => {
    const milestones = [25, 50, 100, 175, 200, 500]
    const currentMilestone = milestones.find(m => totalSaved < m) || 1000
    const previousMilestone = milestones[milestones.indexOf(currentMilestone) - 1] || 0
    const progress = ((totalSaved - previousMilestone) / (currentMilestone - previousMilestone)) * 100
    
    return { currentMilestone, progress }
  }

  const { currentMilestone, progress } = getMilestoneProgress()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#1e40af',
            marginBottom: '0.5rem',
            fontWeight: '800'
          }}>
            Your Money Pot 💰
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem'
          }}>
            Track your savings and earn rewards with every search
          </p>
        </div>

        {/* Main Money Pot Display */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(30, 64, 175, 0.1)',
          marginBottom: '2rem',
          border: isGlowing ? '3px solid #fbbf24' : '1px solid rgba(30, 64, 175, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            filter: isGlowing ? 'drop-shadow(0 0 10px #fbbf24)' : 'none'
          }}>
            £{totalSaved.toFixed(2)}
          </div>
          
          <p style={{
            color: '#64748b',
            fontSize: '1.2rem',
            marginBottom: '2rem'
          }}>
            Total saved from vouchers and deals
          </p>

          {/* Milestone Progress */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Next milestone: £{currentMilestone}
              </span>
              <span style={{ color: '#1e40af', fontWeight: '600' }}>
                {progress.toFixed(0)}%
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <button
              onClick={onKeepSaving}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
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
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Keep Saving 🔍
            </button>
            
            <button
              onClick={onReferAndEarn}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Refer & Earn 👥
            </button>
          </div>
        </div>

        {/* Recent Vouchers */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            color: '#1e40af',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Recent Vouchers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentVouchers.map(voucher => (
              <div key={voucher.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '0.25rem'
                  }}>
                    {voucher.provider}
                  </div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '0.9rem'
                  }}>
                    {voucher.description}
                  </div>
                </div>
                <div style={{
                  fontWeight: '700',
                  color: '#059669',
                  fontSize: '1.1rem'
                }}>
                  £{voucher.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoneyPot