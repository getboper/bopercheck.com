import React, { useState } from 'react'

interface AdvertiserDashboardProps {
  onBackToHome?: () => void
  onReportSignup?: (email: string, businessName: string) => void
  onPromoSignup?: () => void
}

const AdvertiserDashboard: React.FC<AdvertiserDashboardProps> = ({
  onBackToHome,
  onReportSignup,
  onPromoSignup
}) => {
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')

  const handleReportSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && businessName) {
      try {
        const response = await fetch('/api/business-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            businessName, 
            businessType: 'General Business' 
          })
        })
        
        if (response.ok) {
          alert(`Welcome ${businessName}! Your business has been registered and notifications will be sent to ${email}`)
          onReportSignup?.(email, businessName)
          setEmail('')
          setBusinessName('')
        } else {
          alert('Registration failed. Please try again.')
        }
      } catch (error) {
        console.error('Business signup error:', error)
        alert('Network error. Please check your connection and try again.')
      }
    }
  }

  const handlePromoSignup = () => {
    onPromoSignup?.()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#fffbea"
      }}
    >
      <div 
        className="max-w-3xl mx-auto rounded-3xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)"
        }}
      >
        <h1 className="text-3xl mb-2">
          📢 Business Intelligence Hub
        </h1>
        <p className="text-lg mb-8 text-gray-700">
          Get insights about your local market and reach more customers
        </p>

        {/* Free Report Signup */}
        <div 
          className="p-6 rounded-2xl mb-8"
          style={{ 
            background: "#f0fdf4",
            border: "2px dashed #34d399"
          }}
        >
          <h2 className="text-xl mb-4" style={{ color: "#065f46" }}>
            🎁 Get Your FREE Weekly Market Report
          </h2>
          <form onSubmit={handleReportSignup} className="flex flex-col gap-4 items-center">
            <input
              type="text"
              placeholder="Your Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="p-3 w-4/5 max-w-md border border-gray-300 rounded-lg text-base"
              required
            />
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-4/5 max-w-md border border-gray-300 rounded-lg text-base"
              required
            />
            <button 
              type="submit"
              className="py-3 px-6 text-base rounded-lg cursor-pointer transition-colors duration-200"
              style={{ 
                background: "#10b981",
                color: "white",
                border: "none"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
              onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
            >
              Claim My Free Report
            </button>
          </form>
        </div>

        {/* Premium Advertising Section */}
        <div 
          className="p-6 rounded-xl"
          style={{ background: "#fef9c3" }}
        >
          <h3 className="text-lg mb-4 mt-0">
            🚀 Want to advertise on BoperCheck?
          </h3>
          <p className="mb-4 text-gray-700">
            Reach customers exactly when they're comparing prices in your area.
            Our targeted advertising puts your business front and center.
          </p>
          <button 
            onClick={handlePromoSignup}
            className="py-3 px-5 text-base rounded-lg mt-4 cursor-pointer transition-colors duration-200"
            style={{ 
              background: "#facc15",
              border: "none"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#eab308"}
            onMouseOut={(e) => e.currentTarget.style.background = "#facc15"}
          >
            Get Premium Advertising
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <button 
            onClick={onBackToHome}
            className="py-2 px-4 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvertiserDashboard