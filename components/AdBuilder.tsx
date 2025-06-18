import React, { useState, useEffect } from 'react'
import { Building2, Target, Edit3, Check, ArrowLeft, Sparkles, Clock, Users, TrendingUp, Globe, Gift, Zap } from 'lucide-react'

interface AdBuilderProps {
  onNavigate: (page: 'landing' | 'price-checker' | 'advertiser' | 'money-pot' | 'voucher-jar' | 'dashboard' | 'voucher-drop' | 'weekly-report' | 'subscription-plans' | 'admin-dashboard' | 'email-templates' | 'gamified-pot' | 'ai-onboarding' | 'business-dashboard' | 'reward-centre' | 'voucher-wallet' | 'download-locker' | 'search-history' | 'email-confirmation' | 'premium-advertiser-signup' | 'business' | 'business-success') => void
  selectedPlan?: {
    id: string
    name: string
    price: number
    features: string[]
  }
}

const AdBuilder: React.FC<AdBuilderProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string
    name: string
    price: number
    features: string[]
  } | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  // Load selected plan from sessionStorage on component mount
  React.useEffect(() => {
    const storedPlan = sessionStorage.getItem('selectedPlan')
    const storedBillingCycle = sessionStorage.getItem('billingCycle')
    
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan))
    }
    if (storedBillingCycle) {
      setBillingCycle(storedBillingCycle as 'monthly' | 'annual')
    }
  }, [])
  const [businessDetails, setBusinessDetails] = useState({
    companyName: '',
    industry: '',
    location: '',
    targetAudience: '',
    services: '',
    uniqueSelling: '',
    specialOffers: '',
    contactInfo: '',
    website: '',
    businessHours: ''
  })
  const [generatedAd, setGeneratedAd] = useState({
    headline: '',
    description: '',
    callToAction: '',
    keyFeatures: [] as string[],
    targetKeywords: [] as string[]
  })

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
        setStep(2)
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
    // Create Stripe checkout session with business details and ad content
    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/create-stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: selectedPlan?.id,
            planName: selectedPlan?.name,
            price: selectedPlan?.price,
            billingCycle: 'monthly',
            businessDetails,
            adContent: generatedAd,
            successUrl: window.location.origin + '/business/success',
            cancelUrl: window.location.origin + '/business'
          })
        })

        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        } else {
          console.error('Failed to create checkout session')
        }
      } catch (error) {
        console.error('Checkout error:', error)
      }
    }

    createCheckoutSession()
  }

  if (step === 1) {
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

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Building2 size={48} style={{ color: '#4f46e5', margin: '0 auto 1rem' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Build Your Advertisement
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Tell us about your business and we'll create a compelling advertisement draft using AI
            </p>
            {selectedPlan && (
              <div style={{
                background: '#f3f4f6',
                padding: '1rem',
                borderRadius: '12px',
                margin: '1.5rem 0',
                display: 'inline-block'
              }}>
                <strong>{selectedPlan.name} Plan</strong> - £{selectedPlan.price}/month
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
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

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Industry/Category *
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

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
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

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
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
                placeholder="Families, young professionals, seniors..."
              />

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Website
              </label>
              <input
                type="url"
                value={businessDetails.website}
                onChange={(e) => setBusinessDetails({...businessDetails, website: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
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
                placeholder="Describe your main services or products..."
              />

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                What Makes You Unique?
              </label>
              <textarea
                value={businessDetails.uniqueSelling}
                onChange={(e) => setBusinessDetails({...businessDetails, uniqueSelling: e.target.value})}
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
                placeholder="What sets you apart from competitors..."
              />

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Special Offers/Discounts
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
                placeholder="Current promotions, discounts, or special deals..."
              />

              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
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
                placeholder="Phone, email, or preferred contact method"
              />
            </div>
          </div>

          <div style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={20} style={{ color: '#4f46e5' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                AI-Powered Ad Generation
              </h3>
            </div>
            <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
              Our advanced AI will analyze your business details and create a compelling advertisement that highlights your unique value proposition and attracts your target customers.
            </p>
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
              transition: 'all 0.3s ease'
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
                Generating Your Ad...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Ad Draft with AI
              </>
            )}
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
          onClick={() => setStep(1)}
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
          Edit Business Details
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Check size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Your Ad Draft is Ready!
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            Review and edit your advertisement before proceeding to payment
          </p>
        </div>

        <div style={{
          background: '#f9fafb',
          border: '2px solid #e5e7eb',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Advertisement Preview
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: isEditing ? '#10b981' : '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={16} />
              {isEditing ? 'Save Changes' : 'Edit Ad'}
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Headline
            </label>
            {isEditing ? (
              <input
                type="text"
                value={generatedAd.headline}
                onChange={(e) => setGeneratedAd({...generatedAd, headline: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}
              />
            ) : (
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {generatedAd.headline}
              </h3>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            {isEditing ? (
              <textarea
                value={generatedAd.description}
                onChange={(e) => setGeneratedAd({...generatedAd, description: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            ) : (
              <p style={{
                fontSize: '1rem',
                color: '#4b5563',
                lineHeight: '1.6',
                margin: 0
              }}>
                {generatedAd.description}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Call to Action
            </label>
            {isEditing ? (
              <input
                type="text"
                value={generatedAd.callToAction}
                onChange={(e) => setGeneratedAd({...generatedAd, callToAction: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            ) : (
              <div style={{
                background: '#4f46e5',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                display: 'inline-block',
                fontWeight: '600'
              }}>
                {generatedAd.callToAction}
              </div>
            )}
          </div>

          {generatedAd.keyFeatures.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Key Features
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {generatedAd.keyFeatures.map((feature, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#e0e7ff',
                      color: '#3730a3',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

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
          <div style={{
            background: '#f3f4f6',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <TrendingUp size={24} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem' }}>
              Proven ROI
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Average 3x return on ad spend
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
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Check size={20} />
          Approve Ad & Proceed to Payment
        </button>
      </div>
    </div>
  )
}

export default AdBuilder