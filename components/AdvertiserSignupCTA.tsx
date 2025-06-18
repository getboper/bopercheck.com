import React, { useState } from 'react'

interface BusinessDetails {
  businessName: string
  ownerName: string
  email: string
  phone: string
  website?: string
  category: string
  description: string
  address: string
  city: string
  postcode: string
  budgetRange: string
  campaignType: string[]
  targetAudience: string
  experience: string
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

const AdvertiserSignupCTA: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    description: '',
    address: '',
    city: '',
    postcode: '',
    budgetRange: '',
    campaignType: [],
    targetAudience: '',
    experience: ''
  })
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pricingTiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      maxCampaigns: 2,
      maxBudget: 200,
      analytics: false,
      support: 'Email only',
      features: [
        'Up to 2 active campaigns',
        'Basic audience targeting',
        'Standard ad placement',
        'Monthly budget: £200',
        'Email support',
        'Basic reporting'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      maxCampaigns: 10,
      maxBudget: 1000,
      analytics: true,
      support: 'Phone & Email',
      recommended: true,
      features: [
        'Up to 10 active campaigns',
        'Advanced targeting options',
        'Priority ad placement',
        'Monthly budget: £1,000',
        'Phone & email support',
        'Advanced analytics dashboard',
        'A/B testing capabilities',
        'Custom audience insights'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      maxCampaigns: -1,
      maxBudget: -1,
      analytics: true,
      support: 'Dedicated account manager',
      features: [
        'Unlimited campaigns',
        'Premium targeting & AI optimization',
        'Top-tier ad placement',
        'Unlimited monthly budget',
        'Dedicated account manager',
        'Real-time analytics & reporting',
        'Custom integrations',
        'White-label options',
        'Priority customer support'
      ]
    }
  ]

  const categories = [
    'Electronics', 'Fashion', 'Food & Dining', 'Automotive', 'Health & Beauty',
    'Home & Garden', 'Education', 'Professional Services', 'Entertainment',
    'Travel & Tourism', 'Sports & Fitness', 'Other'
  ]

  const campaignTypes = [
    'Local awareness', 'Product promotion', 'Service advertising',
    'Event marketing', 'Brand awareness', 'Lead generation'
  ]

  const handleInputChange = (field: keyof BusinessDetails, value: string | string[]) => {
    setBusinessDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCampaignTypeChange = (type: string, checked: boolean) => {
    const currentTypes = businessDetails.campaignType
    if (checked) {
      handleInputChange('campaignType', [...currentTypes, type])
    } else {
      handleInputChange('campaignType', currentTypes.filter(t => t !== type))
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(businessDetails.businessName && businessDetails.ownerName && 
                 businessDetails.email && businessDetails.phone && businessDetails.category)
      case 2:
        return !!(businessDetails.description && businessDetails.address && 
                 businessDetails.city && businessDetails.postcode)
      case 3:
        return !!(businessDetails.budgetRange && businessDetails.campaignType.length > 0 && 
                 businessDetails.targetAudience)
      case 4:
        return !!selectedTier
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    
    try {
      // Send to business lead system
      const leadData = {
        ...businessDetails,
        selectedTier,
        timestamp: new Date().toISOString(),
        source: 'advertiser_signup',
        status: 'new_lead'
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Business lead submitted:', leadData)
      
      // Show success step
      setCurrentStep(5)
      
    } catch (error) {
      console.error('Failed to submit business lead:', error)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
        Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Business Name *</label>
          <input
            type="text"
            value={businessDetails.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your business name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Owner/Manager Name *</label>
          <input
            type="text"
            value={businessDetails.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email Address *</label>
          <input
            type="email"
            value={businessDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="business@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number *</label>
          <input
            type="tel"
            value={businessDetails.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0191 123 4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={businessDetails.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourbusiness.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Business Category *</label>
          <select
            value={businessDetails.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
        Business Details
      </h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Business Description *</label>
        <textarea
          value={businessDetails.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your business, products, and services..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Business Address *</label>
          <input
            type="text"
            value={businessDetails.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Street address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">City *</label>
          <input
            type="text"
            value={businessDetails.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Newcastle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Postcode *</label>
          <input
            type="text"
            value={businessDetails.postcode}
            onChange={(e) => handleInputChange('postcode', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="NE1 1AA"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
        Campaign Preferences
      </h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Monthly Advertising Budget *</label>
        <select
          value={businessDetails.budgetRange}
          onChange={(e) => handleInputChange('budgetRange', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select budget range</option>
          <option value="under-200">Under £200</option>
          <option value="200-500">£200 - £500</option>
          <option value="500-1000">£500 - £1,000</option>
          <option value="1000-2500">£1,000 - £2,500</option>
          <option value="over-2500">Over £2,500</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Campaign Types (select all that apply) *</label>
        <div className="grid grid-cols-2 gap-3">
          {campaignTypes.map(type => (
            <label key={type} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={businessDetails.campaignType.includes(type)}
                onChange={(e) => handleCampaignTypeChange(type, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Target Audience *</label>
        <textarea
          value={businessDetails.targetAudience}
          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your ideal customers (age, location, interests, etc.)"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Advertising Experience</label>
        <select
          value={businessDetails.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner - New to digital advertising</option>
          <option value="intermediate">Intermediate - Some experience</option>
          <option value="advanced">Advanced - Experienced marketer</option>
        </select>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
        Choose Your Plan
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingTiers.map(tier => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedTier === tier.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${tier.recommended ? 'ring-2 ring-blue-400' : ''}`}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
              <div className="text-3xl font-bold text-blue-600">
                £{tier.price}
                <span className="text-lg text-gray-600">/{tier.period}</span>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <div className="text-green-500 mr-2">✓</div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className={`w-full py-2 px-4 rounded-lg text-center transition-colors ${
              selectedTier === tier.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
        Application Submitted Successfully!
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Thank you for your interest in advertising with BoperCheck. Our team will review your 
        application and contact you within 24 hours to discuss next steps and set up your campaigns.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-lg mx-auto">
        <h4 className="font-bold mb-2">What happens next?</h4>
        <ul className="text-sm space-y-1 text-left">
          <li>• Account verification (24 hours)</li>
          <li>• Campaign strategy consultation</li>
          <li>• Ad creative development support</li>
          <li>• Launch your first campaign</li>
        </ul>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to BoperCheck
        </button>
        <button
          onClick={() => window.open('mailto:support@bopercheck.com')}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Start Advertising Your Business
        </h2>
        <p className="text-gray-600">
          Join hundreds of local businesses reaching customers through BoperCheck
        </p>
      </div>

      {/* Progress Bar */}
      {currentStep < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Business Info</span>
            <span>Details</span>
            <span>Campaigns</span>
            <span>Pricing</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                validateStep(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                validateStep(currentStep) && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvertiserSignupCTA