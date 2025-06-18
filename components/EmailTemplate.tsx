import React from 'react'

interface EmailTemplateProps {
  businessName?: string
  searchTerm?: string
  location?: string
  searchVolume?: number
  competitorCount?: number
  onFeatureBusiness?: () => void
  onManagePreferences?: () => void
  onBackToDemo?: () => void
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  businessName = "Your Business",
  searchTerm = "Gutter Cleaning",
  location = "Plymouth",
  searchVolume = 22,
  competitorCount = 3,
  onFeatureBusiness,
  onManagePreferences,
  onBackToDemo
}) => {
  const handleFeatureBusiness = () => {
    alert('Redirecting to business feature page...')
    onFeatureBusiness?.()
  }

  const handleManagePreferences = () => {
    alert('Opening preference management...')
    onManagePreferences?.()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f5f9ff"
      }}
    >
      <div 
        className="max-w-2xl mx-auto rounded-xl p-8"
        style={{ 
          background: "white",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
          color: "#333"
        }}
      >
        <h1 
          className="text-3xl mb-4"
          style={{ color: "#1d4ed8" }}
        >
          👀 Someone Just Searched for Your Services
        </h1>
        
        <p className="mb-4">Hello there!</p>
        
        <p className="mb-6">
          Our system spotted a recent search for <strong>"{searchTerm}"</strong> in <strong>{location}</strong>.
        </p>
        
        <div 
          className="p-4 my-6 rounded-lg"
          style={{ 
            background: "#eff6ff",
            borderLeft: "4px solid #3b82f6"
          }}
        >
          <p className="mb-2">
            <strong>Search Volume:</strong> {searchVolume} people searched this week
          </p>
          <p className="mb-0">
            <strong>Competitor Mentions:</strong> {competitorCount} local businesses appeared in the top results
          </p>
        </div>
        
        <p className="mb-6">
          Would you like your business to appear next time?
        </p>
        
        <button
          onClick={handleFeatureBusiness}
          className="py-3 px-6 text-base rounded-lg text-white border-none cursor-pointer transition-colors duration-200 mb-8"
          style={{ background: "#3b82f6" }}
          onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
          onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
        >
          Feature My Business
        </button>
        
        <div 
          className="text-sm mt-8"
          style={{ color: "#888" }}
        >
          You're receiving this update as part of your free exposure tracking.
          <br />
          <button
            onClick={handleManagePreferences}
            className="text-blue-600 underline bg-transparent border-none cursor-pointer text-sm"
          >
            Click here to manage preferences
          </button>
        </div>

        {/* Demo Navigation */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button 
            onClick={onBackToDemo}
            className="py-2 px-4 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplate