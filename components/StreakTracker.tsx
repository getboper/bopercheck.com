import React from 'react'

interface StreakTrackerProps {
  currentStreak?: number
  maxStreak?: number
  onViewRewards?: () => void
  onBackToDemo?: () => void
}

const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak = 3,
  maxStreak = 7,
  onViewRewards,
  onBackToDemo
}) => {
  const handleViewRewards = () => {
    alert('More rewards coming soon!')
    onViewRewards?.()
  }

  const renderFlames = () => {
    const flames = []
    for (let i = 0; i < maxStreak; i++) {
      flames.push(
        <div
          key={i}
          className={`flame ${i < currentStreak ? 'active' : ''}`}
          style={{
            filter: i < currentStreak ? 'none' : 'grayscale(100%)',
            transition: 'filter 0.3s ease-in-out',
            fontSize: '2rem'
          }}
        >
          🔥
        </div>
      )
    }
    return flames
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f0f9ff"
      }}
    >
      <div 
        className="max-w-2xl mx-auto rounded-2xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
        }}
      >
        <h1 
          className="text-4xl mb-4"
          style={{ color: "#ef4444" }}
        >
          🔥 Your Daily Search Streak
        </h1>
        
        <p className="mb-6 text-lg">
          <strong>Current Streak:</strong> {currentStreak} Days
        </p>
        
        <div 
          className="flex justify-center gap-2 my-6"
          style={{ fontSize: '2rem' }}
        >
          {renderFlames()}
        </div>
        
        <p 
          className="my-6 text-lg"
          style={{ color: "#ef4444" }}
        >
          Keep it going to unlock your next bonus reward!
        </p>
        
        <button
          onClick={handleViewRewards}
          className="py-3 px-6 text-base rounded-lg cursor-pointer transition-colors duration-200 text-white border-none mb-6"
          style={{ background: "#ef4444" }}
          onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
          onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
        >
          View Rewards
        </button>

        {/* Streak Benefits */}
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#ef4444" }}>
            Streak Benefits
          </h3>
          <div className="text-sm text-gray-600">
            <p>• 3 days: Extra voucher notifications</p>
            <p>• 7 days: Priority search results</p>
            <p>• 14 days: Exclusive discount alerts</p>
            <p>• 30 days: VIP savings dashboard</p>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8">
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

export default StreakTracker