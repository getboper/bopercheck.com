import React from 'react'

interface DashboardProps {
  totalSaved?: number
  vouchersUnlocked?: number
  referralCredits?: number
  recentSearches?: string[]
  onNewSearch?: () => void
  onReferAndEarn?: () => void
  onViewVouchers?: () => void
  onBackToHome?: () => void
}

const Dashboard: React.FC<DashboardProps> = ({
  totalSaved = 42.60,
  vouchersUnlocked = 6,
  referralCredits = 3,
  recentSearches = [
    'Decking Cleaner - £3.99 found',
    'LED Garden Lights - saved £7.80',
    'Window Cleaning Plymouth - 2 offers matched'
  ],
  onNewSearch,
  onReferAndEarn,
  onViewVouchers,
  onBackToHome
}) => {
  const handleNewSearch = () => {
    console.log('Navigate to price checker')
    onNewSearch?.()
  }

  const handleReferAndEarn = () => {
    console.log('Navigate to referral dashboard')
    onReferAndEarn?.()
  }

  const handleViewVouchers = () => {
    alert('More vouchers will be shown here soon')
    onViewVouchers?.()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f3f4f6"
      }}
    >
      <div 
        className="max-w-4xl mx-auto rounded-3xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)"
        }}
      >
        <h1 className="text-3xl mb-4">
          👋 Welcome Back!
        </h1>

        {/* Summary Cards */}
        <div className="flex gap-6 justify-center flex-wrap mb-8">
          <div 
            className="p-5 rounded-xl w-52"
            style={{ 
              background: "#eef2ff",
              boxShadow: "0 5px 12px rgba(0,0,0,0.05)"
            }}
          >
            <h2 className="text-lg text-gray-700 mb-2">💰 Total Saved</h2>
            <p className="text-3xl font-bold text-gray-900">£{totalSaved.toFixed(2)}</p>
          </div>
          
          <div 
            className="p-5 rounded-xl w-52"
            style={{ 
              background: "#eef2ff",
              boxShadow: "0 5px 12px rgba(0,0,0,0.05)"
            }}
          >
            <h2 className="text-lg text-gray-700 mb-2">🎁 Vouchers Unlocked</h2>
            <p className="text-3xl font-bold text-gray-900">{vouchersUnlocked}</p>
          </div>
          
          <div 
            className="p-5 rounded-xl w-52"
            style={{ 
              background: "#eef2ff",
              boxShadow: "0 5px 12px rgba(0,0,0,0.05)"
            }}
          >
            <h2 className="text-lg text-gray-700 mb-2">🤝 Referral Credits</h2>
            <p className="text-3xl font-bold text-gray-900">{referralCredits}</p>
          </div>
        </div>

        {/* Recent Searches */}
        <div 
          className="p-4 rounded-xl mb-8"
          style={{ background: "#fef3c7" }}
        >
          <h2 className="text-xl mt-0 mb-4">🕓 Recent Searches</h2>
          <ul className="list-none p-0 m-0">
            {recentSearches.map((search, index) => (
              <li key={index} className="my-2 text-base">
                {search}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button 
            onClick={handleNewSearch}
            className="py-3 px-6 rounded-lg text-white border-none cursor-pointer transition-colors duration-200"
            style={{ background: "#6366f1" }}
            onMouseOver={(e) => e.currentTarget.style.background = "#4f46e5"}
            onMouseOut={(e) => e.currentTarget.style.background = "#6366f1"}
          >
            Start New Search
          </button>
          
          <button 
            onClick={handleReferAndEarn}
            className="py-3 px-6 rounded-lg text-white border-none cursor-pointer transition-colors duration-200"
            style={{ background: "#6366f1" }}
            onMouseOver={(e) => e.currentTarget.style.background = "#4f46e5"}
            onMouseOut={(e) => e.currentTarget.style.background = "#6366f1"}
          >
            Refer & Earn
          </button>
          
          <button 
            onClick={handleViewVouchers}
            className="py-3 px-6 rounded-lg text-white border-none cursor-pointer transition-colors duration-200"
            style={{ background: "#6366f1" }}
            onMouseOver={(e) => e.currentTarget.style.background = "#4f46e5"}
            onMouseOut={(e) => e.currentTarget.style.background = "#6366f1"}
          >
            View My Vouchers
          </button>
        </div>

        {/* Bonus Banner */}
        <div 
          className="mt-6 p-4 rounded-lg font-medium"
          style={{ 
            background: "#dcfce7",
            color: "#065f46"
          }}
        >
          💡 Leave a video review and unlock bonus rewards!
        </div>

        {/* Back Navigation */}
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

export default Dashboard