import React, { useState, useEffect } from 'react'

interface GDPRComplianceProps {
  onAccept: () => void
  onDecline: () => void
}

const GDPRCompliance: React.FC<GDPRComplianceProps> = ({ onAccept, onDecline }) => {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('bopercheck-gdpr-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('bopercheck-gdpr-consent', 'accepted')
    localStorage.setItem('bopercheck-gdpr-date', new Date().toISOString())
    setShowBanner(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('bopercheck-gdpr-consent', 'declined')
    localStorage.setItem('bopercheck-gdpr-date', new Date().toISOString())
    setShowBanner(false)
    onDecline()
  }

  if (!showBanner) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: '1.5rem',
      zIndex: 10000,
      borderTop: '3px solid #3b82f6'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '2rem'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              🍪 Cookie & Privacy Notice (GDPR Compliance)
            </div>
            
            <div style={{
              fontSize: '0.95rem',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              We use essential cookies for site functionality and analytics cookies to improve your experience. 
              We process your data in accordance with UK GDPR regulations. You can manage your preferences anytime.
            </div>

            {showDetails && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                <strong>Data we collect:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Search queries for price comparison</li>
                  <li>Usage analytics (anonymized)</li>
                  <li>Authentication data (if you sign in)</li>
                  <li>Voucher redemption tracking</li>
                </ul>
                
                <strong>Your rights under UK GDPR:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Right to access your data</li>
                  <li>Right to rectification</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Contact:</strong> privacy@bopercheck.com for data requests
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginRight: '1rem'
              }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minWidth: '200px'
          }}>
            <button
              onClick={handleAccept}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Accept All Cookies
            </button>
            
            <button
              onClick={handleDecline}
              style={{
                background: 'none',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GDPRCompliance