import React, { useState, useEffect } from 'react'
import SEOHead from './SEOHead'

import { useQuery } from '@tanstack/react-query'

interface ComprehensiveHomePageProps {
  onPriceCheck?: () => void
  onAdvertise?: () => void
  onVoucherPot?: () => void
}

interface PlatformStats {
  userCount: number
  totalSavings: number
  searchesToday: number
  averageRating: number
}

const ComprehensiveHomePage: React.FC<ComprehensiveHomePageProps> = ({
  onPriceCheck,
  onAdvertise,
  onVoucherPot
}) => {
  // Fetch platform statistics from API
  const { data: platformStats } = useQuery<PlatformStats>({
    queryKey: ['/api/platform/stats'],
    retry: false,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('UK')
  const [customLocation, setCustomLocation] = useState('')
  const [useCustomLocation, setUseCustomLocation] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    const searchLocation = useCustomLocation ? customLocation : location
    if (!searchLocation.trim()) return
    
    setIsSearching(true)
    try {
      const response = await fetch('/api/check-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, location: searchLocation })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Store search results in localStorage for live mode
        localStorage.setItem('lastSearchResults', JSON.stringify(data))
        localStorage.setItem('lastSearchQuery', searchQuery)
        localStorage.setItem('lastSearchLocation', searchLocation)
        onPriceCheck?.()
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      <SEOHead
        title="BoperCheck - AI-Powered Price Comparison & Voucher Discovery Platform"
        description="Save money on everything you buy with BoperCheck. Our Claude AI finds the best prices across thousands of UK retailers and automatically discovers vouchers. Free unlimited searches."
        keywords="price comparison UK, voucher codes, discount finder, save money shopping, Claude AI deals, best prices, UK retailers, shopping comparison, money saving app"
      />
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        color: '#334155'
      }}>
        
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '900',
              marginBottom: '1rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              BoperCheck
            </h1>
            <p style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              AI-Powered Price Comparison & Voucher Discovery
            </p>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto 3rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                opacity: 0.9,
                lineHeight: '1.6'
              }}>
                Save money on everything you buy. Our Claude AI finds the best prices across thousands of UK retailers and automatically discovers vouchers.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                <div>📍 <strong>Step 1:</strong> Enter any product and your location</div>
                <div>🔍 <strong>Step 2:</strong> AI searches 1000+ retailers instantly</div>
                <div>💰 <strong>Step 3:</strong> Get best prices + automatic vouchers</div>
                <div>🎯 <strong>Step 4:</strong> Cash out savings via Stripe</div>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr auto',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Search for products or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    color: '#334155'
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter your location (e.g. Newcastle, London, Manchester)"
                  value={useCustomLocation ? customLocation : location}
                  onChange={(e) => {
                    if (useCustomLocation) {
                      setCustomLocation(e.target.value)
                    } else {
                      setUseCustomLocation(true)
                      setCustomLocation(e.target.value)
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    color: '#334155'
                  }}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSearching ? 'not-allowed' : 'pointer',
                    opacity: isSearching ? 0.7 : 1
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
          
          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            
            {/* Price Checker */}
            <div
              onClick={onPriceCheck}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(30, 64, 175, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.12)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '1rem'
              }}>
                AI Price Checker
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Get instant AI-powered price analysis across thousands of UK retailers. Find the best deals automatically.
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                Start Searching →
              </div>
            </div>

            {/* Voucher Pot */}
            <div
              onClick={onVoucherPot}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(30, 64, 175, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.12)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💰</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '1rem'
              }}>
                Voucher Savings Pot
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Collect vouchers automatically with every search. Build your savings pot and unlock milestone rewards.
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                View Your Pot →
              </div>
            </div>

            {/* Business Advertising */}
            <div
              onClick={onAdvertise}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(30, 64, 175, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.12)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📈</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '1rem'
              }}>
                Business Advertising
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Reach customers actively searching for your products. Get featured in AI-powered recommendations.
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                Advertise Now →
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            marginBottom: '4rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1e40af',
              marginBottom: '3rem'
            }}>
              Platform Statistics
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  {platformStats?.userCount || '---'}
                </div>
                <div style={{ color: '#64748b', fontWeight: '600' }}>
                  Registered Users
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  £{platformStats?.totalSavings ? (platformStats.totalSavings / 1000).toFixed(1) + 'K' : '---'}
                </div>
                <div style={{ color: '#64748b', fontWeight: '600' }}>
                  Total Saved
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  {platformStats?.searchesToday || '---'}
                </div>
                <div style={{ color: '#64748b', fontWeight: '600' }}>
                  Searches Today
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  {platformStats?.averageRating ? platformStats.averageRating.toFixed(1) + '★' : '---'}
                </div>
                <div style={{ color: '#64748b', fontWeight: '600' }}>
                  User Rating
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '24px',
            padding: '3rem',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1e40af',
              marginBottom: '3rem'
            }}>
              How BoperCheck Works
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 1rem'
                }}>
                  1
                </div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  Search
                </h4>
                <p style={{ color: '#64748b' }}>
                  Enter any product or service you're looking for
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 1rem'
                }}>
                  2
                </div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  AI Analysis
                </h4>
                <p style={{ color: '#64748b' }}>
                  Claude AI analyzes prices and finds vouchers automatically
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 1rem'
                }}>
                  3
                </div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  Save Money
                </h4>
                <p style={{ color: '#64748b' }}>
                  Get the best deals and collect vouchers in your savings pot
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComprehensiveHomePage