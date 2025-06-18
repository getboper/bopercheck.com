import React, { useState } from 'react'

interface LoginModalProps {
  onLogin: (email: string, password: string) => void
  onSignup: (email: string, password: string, name: string) => void
  onClose: () => void
  voucherTitle?: string
}

function LoginModal({ onLogin, onSignup, onClose, voucherTitle }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      onLogin(email, password)
    } else {
      onSignup(email, password, name)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          ×
        </button>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1e40af',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {isLogin ? 'Login to Add Voucher' : 'Sign Up to Add Voucher'}
        </h2>

        {voucherTitle && (
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            Add "{voucherTitle}" to your voucher pot
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLogin ? 'Login & Add Voucher' : 'Sign Up & Add Voucher'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1e40af',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}

interface PriceResult {
  query: string
  productName: string
  bestPrice: string
  dealRating: string
  installationCost: string
  installationDifficulty: string
  totalCost: string
  vouchers: Array<{
    id: string
    title: string
    description: string
    discount: string
    code: string
    validUntil: string
    terms: string
    provider: string
    category: string
    value: number
    requiresLogin: boolean
  }>
  retailers: Array<{
    name: string
    price: number
    availability: string
  }>
  suppliers?: Array<{
    name: string
    type: string
    price: number
    rating: number
    experience: string
    contact: string
    address: string
    notes: string
    services: string[]
    availability: string
    link: string
  }>
  localSuppliers?: Array<{
    name: string
    type: string
    price: number
    rating: number
    experience: string
    contact: string
    address: string
    notes: string
    services: string[]
    availability: string
    link: string
  }>
  secondHandOptions?: Array<{
    name: string
    type: string
    price: number
    condition: string
    location: string
    notes: string
    link: string
  }>
  advertiseHereCTA?: {
    show: boolean
    message: string
    action: string
    targetService: string
    targetLocation: string
  }
  analysisNotes: string
  timestamp: string
}

interface PriceCheckerProps {
  onBackToHome?: () => void
  onViewVouchers?: () => void
}

function PriceChecker({ onBackToHome, onViewVouchers }: PriceCheckerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<PriceResult | null>(null)
  const [error, setError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchProgress, setSearchProgress] = useState(0)

  const handleAddToVoucherPot = async (voucher: any) => {
    setSelectedVoucher(voucher)
    setShowLoginModal(true)
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      // Simple login simulation - in production this would use proper authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        // Add voucher to user's pot
        await fetch('/api/voucher-pot/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            voucherId: selectedVoucher.id,
            voucher: selectedVoucher
          })
        })
        
        setShowLoginModal(false)
        alert(`Voucher "${selectedVoucher.title}" added to your voucher pot!`)
      } else {
        alert('Login failed. Please check your credentials.')
      }
    } catch (error) {
      alert('Login error. Please try again.')
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      if (response.ok) {
        // Auto-add voucher after signup
        await fetch('/api/voucher-pot/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            voucherId: selectedVoucher.id,
            voucher: selectedVoucher
          })
        })
        
        setShowLoginModal(false)
        alert(`Welcome! Voucher "${selectedVoucher.title}" added to your voucher pot!`)
      } else {
        alert('Signup failed. Please try again.')
      }
    } catch (error) {
      alert('Signup error. Please try again.')
    }
  }

  // Engaging search content slides
  const searchSlides = [
    {
      title: "Scanning Business Directory",
      description: "Analyzing 250,000+ UK businesses for the best prices",
      icon: "🔍",
      tip: "We compare both materials and installation services"
    },
    {
      title: "AI Price Analysis",
      description: "Our intelligent system compares pricing across suppliers",
      icon: "🤖",
      tip: "Advanced algorithms ensure you get authentic pricing"
    },
    {
      title: "Checking Premium Offers",
      description: "Finding exclusive deals and voucher codes",
      icon: "🎯",
      tip: "Premium advertisers offer special discounts"
    },
    {
      title: "Location Matching",
      description: "Filtering suppliers by your location",
      icon: "📍",
      tip: "Only showing businesses that serve your area"
    },
    {
      title: "Verifying Credentials",
      description: "Checking business ratings and authenticity",
      icon: "✅",
      tip: "All suppliers are verified with real contact details"
    },
    {
      title: "Final Results Ready",
      description: "Preparing your personalized comparison",
      icon: "🎉",
      tip: "Complete with contact details and special offers"
    }
  ]

  // Progress animation effect
  const startSearchAnimation = () => {
    setCurrentSlide(0)
    setSearchProgress(0)
    
    const totalDuration = 18000 // 18 seconds
    const slideInterval = totalDuration / searchSlides.length // 3 seconds per slide
    const progressInterval = 100 // Update progress every 100ms
    
    // Slide progression
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => {
        const next = prev + 1
        if (next >= searchSlides.length) {
          clearInterval(slideTimer)
          return prev
        }
        return next
      })
    }, slideInterval)
    
    // Progress bar animation
    const progressTimer = setInterval(() => {
      setSearchProgress(prev => {
        const increment = (100 / (totalDuration / progressInterval))
        const next = prev + increment
        if (next >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return next
      })
    }, progressInterval)
  }

  const handleSearch = async () => {
    // Step 6: Frontend error handling validation
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }
    
    if (searchQuery.trim().length < 2) {
      setError('Search term too short - please enter at least 2 characters')
      return
    }

    // Allow both area names and postcodes for location
    if (location && location.trim()) {
      const trimmedLocation = location.trim()
      if (trimmedLocation.length < 2) {
        setError('Location too short - please enter a city or area name')
        return
      }
      if (trimmedLocation.length > 50) {
        setError('Location too long - please use a shorter area name')
        return
      }
    }
    
    setIsSearching(true)
    startSearchAnimation()
    setError('')
    setResults(null)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, location })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Check if we received valid results
        if (!data || (!data.suppliers && !data.localSuppliers)) {
          setError('No results found - try a different search term or location')
          return
        }
        
        setResults(data)
      } else {
        const errorData = await response.json()
        
        // Step 6: Enhanced error handling for different failure types
        if (errorData.errorType === 'timeout') {
          setError('Search timed out - please try again in a moment')
        } else if (errorData.errorType === 'claude_fallback') {
          setError('AI service temporarily unavailable - using backup results')
        } else if (errorData.errorType === 'invalid_postcode') {
          setError('Invalid postcode format - please check and try again')
        } else if (errorData.errorType === 'invalid_term') {
          setError('Search term too short - please be more specific')
        } else {
          setError(errorData.error || 'Search failed - please try again')
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Connection error - please check your internet and try again')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            BoperCheck Price Comparison
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Compare prices and find local suppliers
          </p>
        </div>

        {/* Search Form */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search for products or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1e40af'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <input
              type="text"
              placeholder="Location (e.g., Plymouth, Newcastle, London)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1e40af'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            style={{
              background: isSearching ? '#94a3b8' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {isSearching ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem 0'
              }}>
                {/* Current Search Slide */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {searchSlides[currentSlide]?.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '0.25rem'
                  }}>
                    {searchSlides[currentSlide]?.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '0.5rem'
                  }}>
                    {searchSlides[currentSlide]?.description}
                  </p>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'inline-block'
                  }}>
                    💡 {searchSlides[currentSlide]?.tip}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${searchProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
                    borderRadius: '3px',
                    transition: 'width 0.1s ease'
                  }} />
                </div>
                
                {/* Search Progress Text */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <span>Step {currentSlide + 1} of {searchSlides.length}</span>
                  <span>{Math.round(searchProgress)}% Complete</span>
                </div>
              </div>
            ) : (
              'Search Suppliers'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626'
          }}>
            <p style={{ color: '#64748b' }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Price Summary */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              border: '2px solid #10b981'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '1rem'
              }}>
                Price Analysis: {results.productName}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    Best Price: <span style={{ fontWeight: '700', color: '#10b981' }}>{results.bestPrice}</span>
                  </p>
                  <p style={{ color: '#64748b', fontSize: '1rem' }}>
                    Rating: {results.dealRating}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', color: '#64748b' }}>
                    Total Cost: {results.totalCost}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Installation: {results.installationCost}
                  </div>
                </div>
              </div>
            </div>

            {/* Vouchers Section */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              border: '2px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  💰 Available Vouchers & Discounts
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {results.vouchers?.length || 0} offers available
                </div>
              </div>
              
              {results.vouchers && results.vouchers.length > 0 ? (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {results.vouchers.map((voucher, index) => (
                    <div key={index} style={{
                      border: '2px solid #10b981',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>
                            {voucher.title}
                          </h4>
                          <p style={{ color: '#047857', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            {voucher.description}
                          </p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#064e3b' }}>
                            <span>📅 Valid until: {new Date(voucher.validUntil).toLocaleDateString()}</span>
                            <span>🏢 {voucher.provider}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: '800', 
                            color: '#10b981',
                            textShadow: '0 2px 4px rgba(16,185,129,0.3)'
                          }}>
                            {voucher.discount}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                            Save {voucher.value > 0 ? `£${voucher.value}` : 'Money'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: '#f3f4f6',
                        border: '1px dashed #10b981',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '0.25rem' }}>
                          Voucher Code:
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#065f46' }}>
                          {voucher.code}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '1rem' }}>
                        📋 {voucher.terms}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#047857' }}>
                          📂 Category: {voucher.category}
                        </div>
                        {voucher.requiresLogin ? (
                          <button 
                            onClick={() => handleAddToVoucherPot(voucher)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Add to Voucher Pot
                          </button>
                        ) : (
                          <div style={{
                            background: '#f3f4f6',
                            color: '#6b7280',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}>
                            Use Code at Checkout
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  borderRadius: '16px',
                  border: '2px dashed #f59e0b'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                  <h4 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#92400e', 
                    marginBottom: '1rem' 
                  }}>
                    Sorry, no current vouchers found this time...
                  </h4>
                  <p style={{ 
                    color: '#b45309', 
                    fontSize: '1.1rem', 
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}>
                    Keep searching and adding to your pot!
                  </p>
                  <p style={{ 
                    color: '#a16207', 
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    We only show verified vouchers from real business partnerships. 
                    New offers appear regularly, so keep checking back as you search for more products and services.
                  </p>
                </div>
              )}
            </div>

            {/* Local Suppliers Section */}
            {results.suppliers && results.suppliers.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1e40af'
                  }}>
                    Local Suppliers & Service Providers
                  </h3>
                  {results.advertiseHereCTA?.show && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      {results.advertiseHereCTA.action}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {results.suppliers.map((supplier, index) => (
                    <div key={index} style={{
                      border: supplier.isPremium 
                        ? '3px solid #d97706' 
                        : supplier.isAdvertiser 
                          ? '2px solid #f59e0b' 
                          : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      background: supplier.isPremium 
                        ? 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)' 
                        : supplier.isAdvertiser 
                          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
                          : '#f8fafc',
                      position: 'relative',
                      boxShadow: supplier.isPremium 
                        ? '0 12px 35px rgba(217, 119, 6, 0.25)' 
                        : supplier.isAdvertiser 
                          ? '0 8px 25px rgba(245, 158, 11, 0.2)' 
                          : 'none',
                      transform: supplier.isPremium 
                        ? 'scale(1.03)' 
                        : supplier.isAdvertiser 
                          ? 'scale(1.015)' 
                          : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}>
                      {/* Premium Partner Badge */}
                      {supplier.isPremium && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '16px',
                          background: 'linear-gradient(135deg, #d97706, #92400e)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                        }}>
                          ⭐ PREMIUM PARTNER
                        </div>
                      )}
                      
                      {/* Special Offer Badge */}
                      {supplier.specialOffer && (
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                        }}>
                          🎯 {supplier.specialOffer}
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem', marginTop: supplier.specialOffer ? '2rem' : '0' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: supplier.isPremium ? '#92400e' : '#1e40af', marginBottom: '0.5rem' }}>
                            {supplier.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#64748b' }}>⭐ {typeof supplier.rating === "number" ? supplier.rating.toFixed(1) : "N/A"}</span>
                            <span style={{ color: '#64748b' }}>📍 {supplier.address}</span>
                          </div>
                          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{supplier.notes}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                            £{supplier.price}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {supplier.experience}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {supplier.services && supplier.services.map((service, serviceIndex) => (
                          <span key={serviceIndex} style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem'
                          }}>
                            ✓ {service}
                          </span>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          📞 {supplier.contact?.phone || supplier.contact || "Contact available"} | ⏰ {supplier.availability || "Standard hours"}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {/* Premium Voucher Display */}
                          {supplier.premiumVoucher && (
                            <div style={{
                              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '2px solid #fff',
                              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(supplier.premiumVoucher.code);
                              alert(`Voucher code "${supplier.premiumVoucher.code}" copied! ${supplier.premiumVoucher.terms}`);
                            }}>
                              🎫 {supplier.premiumVoucher.discount}<br/>
                              <span style={{ fontSize: '0.7rem' }}>Code: {supplier.premiumVoucher.code}</span>
                            </div>
                          )}
                          
                          <a href={supplier.link} target="_blank" rel="noopener noreferrer" style={{
                            background: supplier.isPremium ? 'linear-gradient(135deg, #d97706, #92400e)' : '#1e40af',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'background 0.3s ease',
                            boxShadow: supplier.isPremium ? '0 4px 12px rgba(217, 119, 6, 0.3)' : 'none'
                          }}>
                            {supplier.isPremium ? 'Contact Premium Partner' : 'Contact Now'}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Second Hand Options */}
            {results.secondHandOptions && results.secondHandOptions.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '1.5rem'
                }}>
                  Used & Second-Hand Options
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {results.secondHandOptions.map((option, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{option.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          {option.condition} • {option.location}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', color: '#059669', fontSize: '1.2rem' }}>
                        £{option.price}
                      </div>
                      <a href={option.link} target="_blank" rel="noopener noreferrer" style={{
                        background: '#059669',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        marginLeft: '1rem'
                      }}>
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advertise Here CTA Pop-up */}
            {results.advertiseHereCTA?.show && (
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(245,158,11,0.3)',
                textAlign: 'center',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                  {results.advertiseHereCTA.message}
                </h3>
                <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
                  Get featured in local search results and reach customers actively looking for your services
                </p>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {results.advertiseHereCTA.action} →
                </div>
              </div>
            )}

            {/* Online Retailers */}
            {results.retailers && results.retailers.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '1.5rem'
                }}>
                  Online Retailers
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {results.retailers.map((retailer, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontWeight: '600' }}>{retailer.name}</div>
                      <div style={{ color: '#64748b' }}>{retailer.availability}</div>
                      <div style={{ fontWeight: '700', color: '#1e40af' }}>£{retailer.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Vouchers */}
            {results.vouchers && results.vouchers.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '2px solid #fbbf24'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '1.5rem'
                }}>
                  Available Vouchers
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {results.vouchers.map((voucher, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: '800', 
                          marginBottom: '0.25rem',
                          color: '#fbbf24'
                        }}>
                          {voucher.retailer || voucher.store || 'Retailer'}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                          Code: {voucher.code}
                        </div>
                        <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>
                          {voucher.description || voucher.discount}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800'
                      }}>
                        £{voucher.value}
                      </div>
                    </div>
                  ))}
                </div>
                {onViewVouchers && (
                  <button
                    onClick={onViewVouchers}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      marginTop: '1rem'
                    }}
                  >
                    View All Vouchers
                  </button>
                )}
              </div>
            )}

            {/* Advertiser CTA Popup */}
            {results && (
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
                border: '2px solid rgba(255,255,255,0.2)',
                animation: 'slideIn 0.5s ease-out',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '1rem'
                  }}>
                    Get your business shown here — from just £35/month
                  </h3>
                  
                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '1.5rem',
                    fontWeight: '500'
                  }}>
                    No contracts. Cancel anytime.
                  </p>
                  
                  <button
                    onClick={() => window.location.href = '/business'}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '1.2rem 3rem',
                      fontSize: '1.2rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(251, 191, 36, 0.6)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)'
                    }}
                  >
                    Advertise Here
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'linear-gradient(135deg, #64748b, #475569)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Login/Signup Modal */}
        {showLoginModal && (
          <LoginModal
            onLogin={handleLogin}
            onSignup={handleSignup}
            onClose={() => setShowLoginModal(false)}
            voucherTitle={selectedVoucher?.title}
          />
        )}
      </div>
    </div>
  );
}

export default PriceChecker;