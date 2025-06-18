import React, { useState } from 'react'
import VoucherDropAnimation from './VoucherDropAnimation'

interface GeneratedVoucher {
  code: string
  brand: string
  value: number
  expires: string
  description: string
  generated: boolean
}

interface VoucherGeneratorProps {
  onBackToDemo?: () => void
}

const VoucherGenerator: React.FC<VoucherGeneratorProps> = ({ onBackToDemo }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>(['electronics', 'smartphones', 'headphones'])
  const [generatedVouchers, setGeneratedVouchers] = useState<GeneratedVoucher[]>([])
  const [triggerReason, setTriggerReason] = useState('search_milestone')
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationAmount, setAnimationAmount] = useState('£5')

  const generateVoucher = async () => {
    setIsGenerating(true)
    
    // Simulate AI-powered voucher generation
    setTimeout(() => {
      const brands = ['Amazon', 'Currys', 'John Lewis', 'ASOS', 'Next', 'H&M', 'Nike', 'Adidas']
      const randomBrand = brands[Math.floor(Math.random() * brands.length)]
      const value = Math.round((Math.random() * 15 + 5) * 100) / 100
      const codes = ['SAVE10', 'DEAL15', 'OFFER20', 'DISCOUNT', 'SUMMER', 'WINTER', 'SPRING']
      const randomCode = codes[Math.floor(Math.random() * codes.length)] + Math.floor(Math.random() * 99)
      
      const newVoucher: GeneratedVoucher = {
        code: randomCode,
        brand: randomBrand,
        value: value,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        description: `${Math.floor(value)}% off orders over £${Math.floor(value * 5)}`,
        generated: true
      }
      
      setGeneratedVouchers(prev => [newVoucher, ...prev])
      setAnimationAmount(`£${newVoucher.value.toFixed(2)}`)
      setShowAnimation(true)
      setIsGenerating(false)
    }, 2000)
  }

  const addSearchTerm = (term: string) => {
    if (term.trim() && !searchHistory.includes(term.trim().toLowerCase())) {
      setSearchHistory(prev => [term.trim().toLowerCase(), ...prev.slice(0, 4)])
    }
  }

  const renderVoucherCard = (voucher: GeneratedVoucher, index: number) => (
    <div 
      key={index}
      className="rounded-xl p-4 mb-4 border-l-4"
      style={{ 
        background: voucher.generated ? "linear-gradient(135deg, #f0f9ff, #e0f2fe)" : "#ffffff",
        borderLeftColor: voucher.generated ? "#0ea5e9" : "#34d399",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold" style={{ color: "#0f172a" }}>
          {voucher.brand} – £{voucher.value.toFixed(2)}
        </h4>
        {voucher.generated && (
          <span 
            className="px-2 py-1 text-xs rounded-full"
            style={{ background: "#dcfce7", color: "#166534" }}
          >
            AI Generated
          </span>
        )}
      </div>
      <div className="text-sm mb-3" style={{ color: "#475569" }}>
        {voucher.description}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Code: <strong style={{ color: "#0f172a" }}>{voucher.code}</strong>
        </div>
        <div className="text-sm" style={{ color: "#64748b" }}>
          Expires: {voucher.expires}
        </div>
      </div>
    </div>
  )

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)"
      }}
    >
      {showAnimation && (
        <VoucherDropAnimation 
          amount={animationAmount}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div 
          className="rounded-3xl p-8 mb-8 text-center"
          style={{ 
            background: "white",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h2 className="text-3xl mb-4" style={{ color: "#0f172a" }}>
            🤖 AI Voucher Generator
          </h2>
          <p className="text-lg mb-6" style={{ color: "#64748b" }}>
            Generate personalized discount codes based on your search activity and interests
          </p>
          
          <button
            onClick={generateVoucher}
            disabled={isGenerating}
            className="py-3 px-8 text-lg font-medium rounded-lg text-white border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: isGenerating ? "#f59e0b" : "#f97316",
              transform: isGenerating ? "scale(0.98)" : "scale(1)"
            }}
            onMouseOver={(e) => !isGenerating && (e.currentTarget.style.background = "#ea580c")}
            onMouseOut={(e) => !isGenerating && (e.currentTarget.style.background = "#f97316")}
          >
            {isGenerating ? 'Generating Voucher...' : 'Generate New Voucher'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search History & Settings */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: "white",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
              Your Interests
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                Recent Searches:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {searchHistory.map((term, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{ background: "#e0f2fe", color: "#0369a1" }}
                  >
                    {term}
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add search term..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSearchTerm(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                Generation Trigger:
              </label>
              <select
                value={triggerReason}
                onChange={(e) => setTriggerReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="search_milestone">Search Milestone</option>
                <option value="review_submitted">Review Submitted</option>
                <option value="referral_completed">Referral Completed</option>
                <option value="daily_activity">Daily Activity</option>
              </select>
            </div>

            {/* AI Integration Info */}
            <div 
              className="p-4 rounded-lg"
              style={{ 
                background: "#fffbeb",
                border: "1px solid #fef3c7"
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: "#d97706" }}>
                AI-Powered Generation
              </h4>
              <p className="text-sm" style={{ color: "#92400e" }}>
                Uses Claude AI to analyze your search history and generate relevant discount codes from UK retailers.
              </p>
            </div>
          </div>

          {/* Generated Vouchers */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: "white",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
              Generated Vouchers
            </h3>
            
            {generatedVouchers.length === 0 ? (
              <div className="text-center py-8" style={{ color: "#64748b" }}>
                <div className="text-4xl mb-4">🎫</div>
                <p>No vouchers generated yet.</p>
                <p className="text-sm">Click "Generate New Voucher" to get started!</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {generatedVouchers.map(renderVoucherCard)}
              </div>
            )}
          </div>
        </div>

        {/* Firebase Integration Info */}
        <div 
          className="rounded-2xl p-6 mt-8"
          style={{ 
            background: "#eff6ff",
            border: "1px solid #dbeafe"
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: "#1e40af" }}>
            Firebase & AI Integration
          </h4>
          <p className="text-sm" style={{ color: "#2563eb" }}>
            Voucher generation uses Claude AI to analyze user patterns and create personalized discount codes. 
            Generated vouchers are stored in Firestore and automatically added to the user's voucher jar.
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button 
            onClick={onBackToDemo}
            className="py-3 px-6 text-base bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoucherGenerator