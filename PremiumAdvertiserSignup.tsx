import React, { useState } from 'react'

interface PremiumAdvertiserSignupProps {
  onBackToAdvertiser: () => void
}

interface PricingTier {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  recommended?: boolean
  maxCampaigns: number
  maxBudget: number
  analytics: boolean
  support: string
}

const PremiumAdvertiserSignup: React.FC<PremiumAdvertiserSignupProps> = ({
  onBackToAdvertiser
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessType: '',
    targetLocation: '',
    monthlyBudget: '',
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 35,
      period: 'month',
      maxCampaigns: 1,
      maxBudget: 0,
      analytics: true,
      support: 'Email reports',
      features: [
        '1 active category',
        'Business logo + contact link',
        'Displayed on relevant result pages',
        'Weekly performance email reports',
        'Add-ons available:',
        '• Extra category +£10/month',
        '• Priority positioning +£15/month',
        '• Extended description +£8/month'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 85,
      period: 'month',
      maxCampaigns: 5,
      maxBudget: 0,
      analytics: true,
      support: 'Detailed reports',
      recommended: true,
      features: [
        'Up to 5 categories',
        'Priority listing on result pages',
        'Full business profile (photos, description, social links)',
        'Detailed weekly performance reports',
        'AI-suggested category add-ons',
        'Average 58% increase in customer engagement',
        'Most popular choice for growing businesses'
      ]
    },
    {
      id: 'featured',
      name: 'Featured Partner Plan',
      price: 175,
      period: 'month',
      maxCampaigns: 10,
      maxBudget: 0,
      analytics: true,
      support: 'Concierge setup support',
      features: [
        'Up to 10 categories',
        'Homepage featured placement (rotating spot)',
        '"Featured Business" badge in result listings',
        'AI-powered marketing prompts (improve reach)',
        'Social media shoutout on our platforms (1/month)',
        'Concierge setup support',
        'Weekly detailed performance analytics via email',
        'Premium visibility across all search results'
      ]
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const selectedPlan = pricingTiers.find(tier => tier.id === selectedTier)
      const response = await fetch('/api/premium-advertiser-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          selectedPlan: selectedPlan?.name || 'Not selected',
          monthlyBudget: selectedPlan ? `£${selectedPlan.price}/month` : formData.monthlyBudget,
          signupDate: new Date().toISOString(),
          source: 'premium_advertising_page'
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setCurrentStep(3)
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          businessType: '',
          targetLocation: '',
          monthlyBudget: '',
          additionalInfo: ''
        })
        setSelectedTier('')
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Premium advertiser signup error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderPricingTiers = () => (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '1rem'
          }}>
            Business Advertising Plans
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: '1rem'
          }}>
            Choose the plan that works for your business. All plans include real-time analytics and customer insights.
          </p>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#92400e',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Save 15% with annual billing on all plans!
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {pricingTiers.map(tier => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                cursor: 'pointer',
                border: selectedTier === tier.id ? '3px solid #1e40af' : '2px solid #e2e8f0',
                boxShadow: selectedTier === tier.id ? '0 20px 40px rgba(30, 64, 175, 0.1)' : '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                transform: selectedTier === tier.id ? 'translateY(-5px)' : 'translateY(0)'
              }}
            >
              {tier.recommended && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e40af',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  MOST POPULAR
                </div>
              )}
              
              {tier.id === 'featured' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '1rem',
                  background: '#7c3aed',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  PREMIUM
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  {tier.name}
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  £{tier.price}
                  <span style={{
                    fontSize: '1.2rem',
                    color: '#64748b',
                    fontWeight: '400'
                  }}>
                    /{tier.period}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  £{Math.round(tier.price * 0.85 * 12)}/year (save £{Math.round(tier.price * 0.15 * 12)})
                </div>
              </div>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                marginBottom: '2rem'
              }}>
                {tier.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                    fontSize: '0.95rem',
                    color: '#475569'
                  }}>
                    <span style={{
                      color: '#10b981',
                      marginRight: '0.75rem',
                      fontSize: '1.1rem',
                      marginTop: '0.1rem'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: selectedTier === tier.id ? '#1e40af' : '#f8fafc',
                color: selectedTier === tier.id ? 'white' : '#64748b',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                {selectedTier === tier.id ? 'Selected' : (tier.id === 'basic' ? 'Get Started' : tier.id === 'pro' ? 'Select Plan' : 'Get Featured')}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={nextStep}
            disabled={!selectedTier}
            style={{
              background: selectedTier ? '#1e40af' : '#94a3b8',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: selectedTier ? 'pointer' : 'not-allowed',
              marginRight: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            Continue to Business Details
          </button>
          <button
            onClick={onBackToAdvertiser}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '2px solid #e2e8f0',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Back
          </button>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Need a custom solution for your business? <a href="mailto:support@bopercheck.com" style={{ color: '#1e40af', textDecoration: 'none' }}>Contact Our Sales Team</a>
          </p>
        </div>
      </div>
    </div>
  )

  const renderBusinessForm = () => (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '1rem'
          }}>
            Business Details
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b'
          }}>
            Tell us about your business to get started with {pricingTiers.find(t => t.id === selectedTier)?.name}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail</option>
                  <option value="restaurant">Restaurant/Food Service</option>
                  <option value="professional">Professional Services</option>
                  <option value="health">Health & Beauty</option>
                  <option value="automotive">Automotive</option>
                  <option value="home">Home & Garden</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Target Location
              </label>
              <input
                type="text"
                name="targetLocation"
                value={formData.targetLocation}
                onChange={handleInputChange}
                placeholder="e.g., Newcastle, UK"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us more about your business and advertising goals"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#94a3b8' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginRight: '1rem',
                  transition: 'background-color 0.2s'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={prevStep}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Back to Plans
              </button>
            </div>

            {submitStatus === 'error' && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                textAlign: 'center'
              }}>
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )

  const renderSuccessMessage = () => (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#1e40af',
          marginBottom: '1rem'
        }}>
          Application Submitted Successfully!
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Thank you for choosing the {pricingTiers.find(t => t.id === selectedTier)?.name}. Our team will review your application and contact you within 24 hours to discuss next steps.
        </p>
        <div style={{
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '1rem'
          }}>
            What happens next?
          </h3>
          <ul style={{
            textAlign: 'left',
            color: '#475569',
            lineHeight: '1.8'
          }}>
            <li>• Account verification (within 24 hours)</li>
            <li>• Campaign strategy consultation</li>
            <li>• Ad creative development support</li>
            <li>• Launch your first campaign</li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onBackToAdvertiser}
            style={{
              background: '#1e40af',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Back to Advertiser Dashboard
          </button>
          <button
            onClick={() => window.open('mailto:support@bopercheck.com')}
            style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )

  if (currentStep === 1) {
    return renderPricingTiers()
  } else if (currentStep === 2) {
    return renderBusinessForm()
  } else if (currentStep === 3) {
    return renderSuccessMessage()
  }

  return renderPricingTiers()
}

export default PremiumAdvertiserSignup