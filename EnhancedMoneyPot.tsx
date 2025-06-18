import React, { useState, useEffect } from 'react'

interface VoucherData {
  id: string
  amount: number
  provider: string
  description: string
  timestamp: Date
  category: string
}

interface EnhancedMoneyPotProps {
  onKeepSaving?: () => void
  onReferAndEarn?: () => void
}

const EnhancedMoneyPot: React.FC<EnhancedMoneyPotProps> = ({ onKeepSaving, onReferAndEarn }) => {
  const [currentSavings, setCurrentSavings] = useState(0)
  const [recentSave, setRecentSave] = useState(0)
  const [showNewVoucher, setShowNewVoucher] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [milestoneProgress, setMilestoneProgress] = useState(0)
  const [savingsHistory, setSavingsHistory] = useState<VoucherData[]>([])
  const [loading, setLoading] = useState(true)

  // Load real savings data from API
  useEffect(() => {
    const loadSavingsData = async () => {
      try {
        const response = await fetch('/api/user/savings-data');
        if (response.ok) {
          const data = await response.json();
          setCurrentSavings(data.totalSavings || 0);
          setRecentSave(data.recentSave || 0);
          setSavingsHistory(data.savingsHistory || []);
          setMilestoneProgress(Math.min((data.totalSavings / 50) * 100, 100));
          setShowNewVoucher(data.hasNewVouchers || false);
        }
      } catch (error) {
        console.error('Error loading savings data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavingsData();
  }, [])

  const handleCashOut = async () => {
    if (currentSavings < 50) {
      alert('Minimum cash out amount is £50')
      return
    }
    
    setIsProcessingPayment(true)
    try {
      const response = await fetch('/api/stripe/process-cashout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: currentSavings * 100, // Convert to pence
          userId: 'current-user'
        })
      })
      
      if (response.ok) {
        alert(`£${currentSavings.toFixed(2)} payout initiated via Stripe`)
        setCurrentSavings(0)
      } else {
        alert('Payout processing failed. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please check your connection.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleClaimVoucher = () => {
    setShowNewVoucher(false)
    setCurrentSavings(prev => prev + 5.25)
    alert('£5.25 voucher added to your pot!')
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      background: '#f9fafb',
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        maxWidth: '600px',
        margin: 'auto',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
      }}>
        
        {/* Header */}
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          color: '#1e40af'
        }}>
          💰 Your BoperCheck Money Pot
        </h1>
        
        {/* Recent Save */}
        <p style={{
          fontSize: '1.2rem',
          color: '#555',
          marginBottom: '1rem'
        }}>
          This search just saved you:
        </p>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#10b981',
          margin: '1rem 0'
        }}>
          £{recentSave.toFixed(2)}
        </div>

        {/* Total Pot */}
        <div style={{
          marginTop: '1rem',
          background: '#ecfdf5',
          padding: '1rem',
          borderRadius: '12px'
        }}>
          <p style={{
            margin: '0',
            color: '#065f46',
            fontSize: '1.1rem'
          }}>
            Your total savings:
          </p>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#065f46'
          }}>
            £{currentSavings.toFixed(2)}
          </div>
        </div>

        {/* Milestone Progress */}
        <div style={{
          marginTop: '1.5rem',
          background: '#eff6ff',
          padding: '1rem',
          borderRadius: '12px'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>
            Progress to £50 milestone:
          </p>
          <div style={{
            background: '#e5e7eb',
            borderRadius: '10px',
            height: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #10b981, #059669)',
              height: '100%',
              width: `${milestoneProgress}%`,
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            fontSize: '0.9rem', 
            color: '#64748b' 
          }}>
            £{((milestoneProgress / 100) * 50).toFixed(2)} of £50.00
          </p>
        </div>

        {/* New Voucher Bonus */}
        {showNewVoucher && (
          <div style={{
            marginTop: '2rem',
            background: '#fef3c7',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <p style={{
              marginBottom: '1rem',
              fontSize: '1.1rem',
              color: '#92400e'
            }}>
              🎁 You unlocked a new voucher!
            </p>
            <button 
              onClick={handleClaimVoucher}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Claim £5.25 Now
            </button>
          </div>
        )}

        {/* Cash Out Section */}
        <div style={{
          marginTop: '2rem',
          background: '#f0f9ff',
          padding: '1rem',
          borderRadius: '12px'
        }}>
          <p style={{
            margin: '0 0 1rem 0',
            color: '#0369a1',
            fontSize: '1.1rem'
          }}>
            💳 Cash Out via Stripe
          </p>
          <button 
            onClick={handleCashOut}
            disabled={isProcessingPayment || currentSavings < 50}
            style={{
              background: currentSavings >= 50 ? '#0ea5e9' : '#94a3b8',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: currentSavings >= 50 ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              opacity: isProcessingPayment ? 0.7 : 1
            }}
          >
            {isProcessingPayment ? 'Processing...' : 
             currentSavings >= 50 ? `Cash Out £${currentSavings.toFixed(2)}` : 
             'Minimum £50 required'}
          </button>
          {currentSavings < 50 && (
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0'
            }}>
              Save £{(50 - currentSavings).toFixed(2)} more to unlock cash out
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={onKeepSaving}
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔁 Keep Saving
          </button>
          <button 
            onClick={onReferAndEarn}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🎉 Refer & Earn
          </button>
        </div>

        {/* Statistics */}
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e40af'
            }}>
              47
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#64748b'
            }}>
              Searches
            </div>
          </div>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              12
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#64748b'
            }}>
              Vouchers
            </div>
          </div>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#dc2626'
            }}>
              £127
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#64748b'
            }}>
              Lifetime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedMoneyPot