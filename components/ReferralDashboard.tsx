import React, { useState, useEffect } from 'react'

interface ReferralDashboardProps {
  onBackToHome?: () => void
  onReferralCopied?: (referralCode: string) => void
}

const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  onBackToHome,
  onReferralCopied
}) => {
  const [referralCode, setReferralCode] = useState<string>('')
  const [referralLink, setReferralLink] = useState<string>('Generating...')
  const [copied, setCopied] = useState<boolean>(false)

  const generateReferralCode = (): string => {
    const base = "BOP"
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
    return `${base}${random}`
  }

  useEffect(() => {
    const code = generateReferralCode()
    setReferralCode(code)
    const link = `${window.location.origin}/?ref=${code}`
    setReferralLink(link)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      alert('Referral link copied!')
      onReferralCopied?.(referralCode)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral link:', error)
      alert('Failed to copy link. Please try again.')
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f9f9ff"
      }}
    >
      <div 
        className="max-w-2xl mx-auto rounded-2xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
        }}
      >
        <h1 className="text-3xl mb-6">
          🎉 Share BoperCheck & Earn Credits
        </h1>
        
        <p className="text-lg mb-4">
          Your unique referral link:
        </p>
        
        <div 
          className="font-bold text-lg inline-block my-4 px-3 py-2 rounded-lg"
          style={{ 
            background: "#eef2ff",
            fontSize: "1.2rem"
          }}
        >
          {referralLink}
        </div>
        
        <br />
        
        <button 
          onClick={handleCopyLink}
          className="py-3 px-6 rounded-lg text-white border-none cursor-pointer transition-colors duration-200 mb-4"
          style={{ 
            background: copied ? "#10b981" : "#6366f1"
          }}
          onMouseOver={(e) => {
            if (!copied) {
              e.currentTarget.style.background = "#4f46e5"
            }
          }}
          onMouseOut={(e) => {
            if (!copied) {
              e.currentTarget.style.background = "#6366f1"
            }
          }}
        >
          {copied ? "✓ Copied!" : "Copy Referral Link"}
        </button>
        
        <p className="text-lg text-gray-700">
          Earn 1 free credit every time someone joins using your link!
        </p>

        {/* Back Navigation */}
        <div className="mt-8">
          <button 
            onClick={onBackToHome}
            className="py-2 px-4 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Money Pot
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralDashboard