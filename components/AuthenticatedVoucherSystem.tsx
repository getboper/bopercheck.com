import React, { useState, useEffect } from 'react'
import VoucherPreview from './VoucherPreview'
import VoucherJar from './VoucherJar'

interface AuthenticatedVoucherSystemProps {
  onBackToHome?: () => void
}

const AuthenticatedVoucherSystem: React.FC<AuthenticatedVoucherSystemProps> = ({ onBackToHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      // Redirect to authentication flow
      window.location.href = '/api/auth/signin'
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <div style={{
            fontSize: '1.1rem',
            color: '#64748b'
          }}>
            Checking authentication status...
          </div>
        </div>
      </div>
    )
  }

  // Show voucher preview for non-authenticated users
  if (!isAuthenticated) {
    return <VoucherPreview onSignInClick={handleSignIn} />
  }

  // Show full voucher system for authenticated users
  return <VoucherJar onBackToDemo={onBackToHome} />
}

export default AuthenticatedVoucherSystem