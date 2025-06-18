import React, { useState, useEffect } from 'react'
import { Building2, Globe, Edit3, Check, ArrowLeft, Sparkles, Gift, Zap, Target, Users, Upload, Image } from 'lucide-react'

interface StreamlinedAdBuilderProps {
  onNavigate: (page: 'landing' | 'price-checker' | 'advertiser' | 'money-pot' | 'voucher-jar' | 'dashboard' | 'voucher-drop' | 'weekly-report' | 'subscription-plans' | 'admin-dashboard' | 'email-templates' | 'gamified-pot' | 'ai-onboarding' | 'business-dashboard' | 'reward-centre' | 'voucher-wallet' | 'download-locker' | 'search-history' | 'email-confirmation' | 'premium-advertiser-signup' | 'business' | 'business-success' | 'ad-builder') => void
}

const StreamlinedAdBuilder: React.FC<StreamlinedAdBuilderProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [website, setWebsite] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [businessDetails, setBusinessDetails] = useState({
    companyName: '',
    industry: '',
    location: '',
    services: '',
    targetAudience: '',
    uniqueSelling: '',
    specialOffers: '',
    contactInfo: '',
    website: ''
  })
  const [generatedAd, setGeneratedAd] = useState({
    headline: '',
    description: '',
    callToAction: '',
    keyFeatures: [] as string[],
    targetKeywords: [] as string[]
  })
  const [includeVoucher, setIncludeVoucher] = useState(false)
  const [voucherDetails, setVoucherDetails] = useState({
    discount: '10%',
    description: 'New customer discount',
    validDays: 30
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Load selected plan from sessionStorage
  useEffect(() => {
    const storedPlan = sessionStorage.getItem('selectedPlan')
    const storedBillingCycle = sessionStorage.getItem('billingCycle')
    
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan))
    }
    if (storedBillingCycle) {
      setBillingCycle(storedBillingCycle as 'monthly' | 'annual')
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  const extractWebsiteInfo = async () => {
    if (!website) return

    setIsExtracting(true)
    try {
      const response = await fetch('/api/extract-website-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website })
      })

      if (response.ok) {
        const extractedInfo = await response.json()
        setBusinessDetails({
          ...extractedInfo,
          website
        })
        setStep(2)
      } else {
        console.error('Failed to extract website info')
        setStep(2) // Continue to manual entry
      }
    } catch (error) {
      console.error('Error extracting website info:', error)
      setStep(2) // Continue to manual entry
    } finally {
      setIsExtracting(false)
    }
  }

  const generateAdDraft = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-ad-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDetails,
          planType: selectedPlan?.name || 'Basic'
        })
      })

      if (response.ok) {
        const adDraft = await response.json()
        setGeneratedAd(adDraft)
        setStep(3)
        window.scrollTo(0, 0)
      } else {
        console.error('Failed to generate ad draft')
      }
    } catch (error) {
      console.error('Error generating ad draft:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const proceedToPayment = () => {
    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/create-stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: selectedPlan?.id,
            planName: selectedPlan?.name,
            price: selectedPlan?.price,
            billingCycle,
            businessDetails,
            adContent: generatedAd,
            voucherDetails: includeVoucher ? voucherDetails : null,
            successUrl: window.location.origin + '/business/success',
            cancelUrl: window.location.origin + '/business'
          })
        })

        if (response.ok) {
          const { url } = await response.json()
          // Open Stripe Checkout in new tab to avoid iframe restrictions
          window.open(url, '_blank')
        } else {
          console.error('Failed to create checkout session')
        }
      } catch (error) {
        console.error('Checkout error:', error)
      }
    }

    createCheckoutSession()
  }

  // Step 1: Website or Manual Entry Choice
  if (step === 1) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <button
            onClick={() => onNavigate('business')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              marginBottom: '2rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Back to Plans
          </button>

          <Building2 size={48} style={{ color: '#4f46e5', margin: '0 auto 1rem' }} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Create Your Advertisement
          </h1>
          
          {selectedPlan && (
            <div style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '12px',
              margin: '1.5rem 0',
              display: 'inline-block'
            }}>
              <strong>{selectedPlan.name} Plan</strong> - £{selectedPlan.price}/{billingCycle === 'monthly' ? 'month' : 'year'}
            </div>
          )}

          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '3rem'
          }}>
            Do you have a website? We can extract your business details automatically.
          </p>

          <div style={{
            background: '#f9fafb',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '2rem'
          }}>
            <Globe size={32} style={{ color: '#4f46e5', margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Website URL (Recommended)
            </h3>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.yourbusiness.com"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={extractWebsiteInfo}
              disabled={!website || isExtracting}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: (!website || isExtracting) ? '#d1d5db' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: (!website || isExtracting) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isExtracting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Extracting Information...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Extract Business Details
                </>
              )}
            </button>
          </div>

          <div style={{
            textAlign: 'center',
            margin: '2rem 0',
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            — or —
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Enter Details Manually
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Step 2: Business Details Form
  if (step === 2) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setStep(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Building2 size={48} style={{ color: '#4f46e5', margin: '0 auto 1rem' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Business Details
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280'
            }}>
              {website ? 'Review and complete your extracted business information' : 'Tell us about your business'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={businessDetails.companyName}
                onChange={(e) => setBusinessDetails({...businessDetails, companyName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
                placeholder="Your Business Name"
              />

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Industry *
              </label>
              <select
                value={businessDetails.industry}
                onChange={(e) => setBusinessDetails({...businessDetails, industry: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <option value="">Select Industry</option>
                <option value="restaurant">Restaurant & Food</option>
                <option value="retail">Retail & Shopping</option>
                <option value="automotive">Automotive</option>
                <option value="health">Health & Beauty</option>
                <option value="home">Home & Garden</option>
                <option value="fitness">Fitness & Wellness</option>
                <option value="technology">Technology</option>
                <option value="professional">Professional Services</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Location *
              </label>
              <input
                type="text"
                value={businessDetails.location}
                onChange={(e) => setBusinessDetails({...businessDetails, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
                placeholder="City, Region"
              />

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Contact Information
              </label>
              <input
                type="text"
                value={businessDetails.contactInfo}
                onChange={(e) => setBusinessDetails({...businessDetails, contactInfo: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
                placeholder="Phone number or email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Services/Products *
              </label>
              <textarea
                value={businessDetails.services}
                onChange={(e) => setBusinessDetails({...businessDetails, services: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                  resize: 'vertical'
                }}
                placeholder="What do you offer?"
              />

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                What Makes You Unique?
              </label>
              <textarea
                value={businessDetails.uniqueSelling}
                onChange={(e) => setBusinessDetails({...businessDetails, uniqueSelling: e.target.value})}
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                  resize: 'vertical'
                }}
                placeholder="Your competitive advantage"
              />

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Special Offers
              </label>
              <textarea
                value={businessDetails.specialOffers}
                onChange={(e) => setBusinessDetails({...businessDetails, specialOffers: e.target.value})}
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                  resize: 'vertical'
                }}
                placeholder="Current promotions or discounts"
              />

              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Target Audience
              </label>
              <input
                type="text"
                value={businessDetails.targetAudience}
                onChange={(e) => setBusinessDetails({...businessDetails, targetAudience: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
                placeholder="Who are your ideal customers?"
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '16px',
            marginTop: '2rem',
            border: '2px dashed #cbd5e1'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Image size={32} style={{ color: '#4f46e5', margin: '0 auto 1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Business Logo (Optional)
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Upload your logo to make your advertisement stand out
              </p>
            </div>

            {logoPreview ? (
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{
                    maxWidth: '120px',
                    maxHeight: '120px',
                    objectFit: 'contain',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    background: 'white'
                  }}
                />
                <button
                  onClick={() => {
                    setLogoFile(null)
                    setLogoPreview('')
                  }}
                  style={{
                    display: 'block',
                    margin: '0.5rem auto 0',
                    padding: '0.25rem 0.75rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'white'
              }}>
                <Upload size={24} style={{ color: '#9ca3af', marginBottom: '0.5rem' }} />
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Click to upload logo (PNG, JPG, GIF)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <button
            onClick={generateAdDraft}
            disabled={!businessDetails.companyName || !businessDetails.industry || !businessDetails.location || !businessDetails.services || isGenerating}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: (!businessDetails.companyName || !businessDetails.industry || !businessDetails.location || !businessDetails.services || isGenerating) 
                ? '#d1d5db' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: (!businessDetails.companyName || !businessDetails.industry || !businessDetails.location || !businessDetails.services || isGenerating) 
                ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}
          >
            {isGenerating ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Generating Your Advertisement...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Ad with AI
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // Step 3: Ad Preview & Voucher Options
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setStep(2)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={16} />
          Edit Details
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Check size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Review Your Advertisement
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            Review your ad and choose voucher options before payment
          </p>
        </div>

        {/* Enhanced Ad Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🎯 Your Advertisement Preview
          </h2>
          
          {/* Professional Ad Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '3px solid #fbbf24'
          }}>
            {/* Header with Logo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f3f4f6'
            }}>
              {logoPreview && (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  flexShrink: 0
                }}>
                  <img
                    src={logoPreview}
                    alt="Business logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  background: '#fbbf24',
                  color: '#92400e',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  ⭐ FEATURED BUSINESS
                </div>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#1f2937',
                  margin: 0,
                  lineHeight: '1.2'
                }}>
                  {generatedAd.headline}
                </h3>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                fontSize: '1.125rem',
                color: '#4b5563',
                lineHeight: '1.7',
                margin: 0,
                fontWeight: '500'
              }}>
                {generatedAd.description}
              </p>
            </div>

            {/* Features Grid */}
            {generatedAd.keyFeatures.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sparkles size={20} style={{ color: '#fbbf24' }} />
                  Why Choose Us:
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem' 
                }}>
                  {generatedAd.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                        color: '#3730a3',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '2px solid #a5b4fc'
                      }}
                    >
                      <Check size={16} style={{ color: '#3730a3' }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voucher Offer */}
            {includeVoucher && (
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '2px solid #fbbf24'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'white'
                }}>
                  <Gift size={24} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.25rem' }}>
                      SPECIAL OFFER: {voucherDetails.discount} OFF
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Valid for {voucherDetails.validDays} days • New customers only
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '1.125rem',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                border: '2px solid #34d399'
              }}>
                📞 {generatedAd.callToAction}
              </div>
              
              {businessDetails.contactInfo && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {businessDetails.contactInfo}
                </div>
              )}
              
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                📍 {businessDetails.location}
              </div>
            </div>

            {/* Trust Indicators */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '2px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                <Check size={16} />
                Verified Business
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                <Users size={16} />
                Local Customers
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                <Target size={16} />
                High Quality Service
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Options */}
        <div style={{
          background: '#f0f9ff',
          border: '2px solid #bae6fd',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Gift size={24} style={{ color: '#0284c7' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Include Voucher Offer (Optional)
            </h3>
          </div>
          
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={includeVoucher}
              onChange={(e) => setIncludeVoucher(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontSize: '1rem', color: '#374151' }}>
              Add a special offer voucher to attract more customers
            </span>
          </label>

          {includeVoucher && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Discount
                </label>
                <select
                  value={voucherDetails.discount}
                  onChange={(e) => setVoucherDetails({...voucherDetails, discount: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                >
                  <option value="10%">10% Off</option>
                  <option value="15%">15% Off</option>
                  <option value="20%">20% Off</option>
                  <option value="£5">£5 Off</option>
                  <option value="£10">£10 Off</option>
                  <option value="£15">£15 Off</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Valid For (Days)
                </label>
                <select
                  value={voucherDetails.validDays}
                  onChange={(e) => setVoucherDetails({...voucherDetails, validDays: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Performance Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#f3f4f6',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <Target size={24} style={{ color: '#4f46e5', margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem' }}>
              Targeted Reach
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              High-intent customers in {businessDetails.location}
            </p>
          </div>
          
          <div style={{
            background: '#f3f4f6',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <Users size={24} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem' }}>
              85% User Demand
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Actively seeking vouchers & discounts
            </p>
          </div>
        </div>

        <button
          onClick={proceedToPayment}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Check size={20} />
          Approve & Proceed to Payment
        </button>
      </div>
    </div>
  )
}

export default StreamlinedAdBuilder