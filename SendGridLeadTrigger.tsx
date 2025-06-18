import React, { useState } from 'react'

interface LeadData {
  name: string
  email: string
  businessName?: string
  phone?: string
  message?: string
  source: string
  timestamp: Date
}

interface SendGridLeadTriggerProps {
  onLeadSubmit?: (leadData: LeadData) => void
  templateType?: 'business' | 'general' | 'weekly-report'
}

const SendGridLeadTrigger: React.FC<SendGridLeadTriggerProps> = ({ 
  onLeadSubmit, 
  templateType = 'general' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const leadData: LeadData = {
      name: formData.name,
      email: formData.email,
      businessName: formData.businessName,
      phone: formData.phone,
      message: formData.message,
      source: templateType,
      timestamp: new Date()
    }

    try {
      // Send to backend API which will trigger SendGrid
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        onLeadSubmit?.(leadData)
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          businessName: '',
          phone: '',
          message: ''
        })
      } else {
        throw new Error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Lead submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFormTitle = () => {
    switch (templateType) {
      case 'business':
        return 'Get Your Free Weekly Report'
      case 'weekly-report':
        return 'Subscribe to Weekly Market Intelligence'
      default:
        return 'Get Started with BoperCheck'
    }
  }

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Submitting...'
    
    switch (templateType) {
      case 'business':
        return 'Claim My Free Report'
      case 'weekly-report':
        return 'Subscribe Now'
      default:
        return 'Get Started'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#0f172a" }}>
        {getFormTitle()}
      </h3>

      {submitStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Thank you! We'll send your information shortly.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        {templateType === 'business' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your phone number"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your needs..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {getSubmitButtonText()}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        We'll send your information to support@bopercheck.com
      </div>
    </div>
  )
}

export default SendGridLeadTrigger