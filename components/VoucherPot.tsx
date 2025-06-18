import React, { useState } from 'react'
import VoucherDropAnimation from './VoucherDropAnimation'
import BoosterCTA from './BoosterCTA'
import MilestonePopup from './MilestonePopup'
import BadgeDisplay from './BadgeDisplay'
import { useVoucherPotFirestore } from '../hooks/useVoucherPotFirestore'
import { useMilestoneBadges } from '../hooks/useMilestoneBadges'

interface VoucherPotData {
  totalSaved: number
  earnedFrom: {
    reviews: number
    shares: number
    referrals: number
    searchFinds: number
  }
  streakDays: number
  lastUpdated: string
}

interface VoucherPotProps {
  onBackToDemo?: () => void
}

const VoucherPot: React.FC<VoucherPotProps> = ({ onBackToDemo }) => {
  const [potData, setPotData] = useState<VoucherPotData>({
    totalSaved: 47.85,
    earnedFrom: {
      reviews: 12.50,
      shares: 8.75,
      referrals: 15.00,
      searchFinds: 11.60
    },
    streakDays: 8,
    lastUpdated: '2024-06-11'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationAmount, setAnimationAmount] = useState('£1')
  const [milestoneData, setMilestoneData] = useState<{title: string, subtitle: string} | null>(null)

  // Firebase Firestore real-time listener
  const { data: firestoreData } = useVoucherPotFirestore({
    userId: 'demo-user-123',
    onUpdate: (data) => {
      // Update local state with Firestore data
      setPotData(prev => ({
        ...prev,
        totalSaved: data.totalSaved,
        lastUpdated: prev.lastUpdated
      }))
      
      // Trigger animation for new vouchers
      if (data.vouchers.length > 0) {
        const latestVoucher = data.vouchers[0]
        const isNew = new Date().getTime() - latestVoucher.timestamp.getTime() < 5000
        
        if (isNew) {
          setAnimationAmount(`£${latestVoucher.amount.toFixed(2)}`)
          setShowAnimation(true)
        }
      }
    }
  })

  // Milestone badges system
  const { getBadgeList } = useMilestoneBadges({
    userId: 'demo-user-123',
    totalSaved: potData.totalSaved,
    onMilestone: (data) => {
      setMilestoneData({ title: data.title, subtitle: data.subtitle })
    }
  })

  const addReward = (type: keyof VoucherPotData['earnedFrom'], amount: number) => {
    setIsLoading(true)
    
    // Simulate Firebase transaction
    setTimeout(() => {
      setPotData(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + amount,
        earnedFrom: {
          ...prev.earnedFrom,
          [type]: prev.earnedFrom[type] + amount
        },
        lastUpdated: potData.lastUpdated
      }))
      setIsLoading(false)
    }, 1000)
  }

  const renderBreakdown = () => {
    return Object.entries(potData.earnedFrom).map(([key, value]) => (
      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span className="font-medium capitalize text-gray-700">
          {key === 'searchFinds' ? 'Search Finds' : key}
        </span>
        <span className="font-bold text-gray-900">
          £{value.toFixed(2)}
        </span>
      </div>
    ))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Main Voucher Pot Card */}
        <div 
          className="rounded-3xl p-8 text-center mb-8"
          style={{ 
            background: "white",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h2 className="text-3xl mb-6" style={{ color: "#0f172a" }}>
            Your Voucher Pot 💷
          </h2>
          
          <div 
            className="text-6xl font-bold mb-4"
            style={{ 
              background: "linear-gradient(to right, #facc15, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            £{potData.totalSaved.toFixed(2)}
          </div>
          
          <p className="text-lg mb-6" style={{ color: "#64748b" }}>
            Total discounts and rewards you've earned so far.
          </p>

          {/* Streak Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
               style={{ background: "#fef3c7", color: "#92400e" }}>
            <span>🔥</span>
            <span className="font-semibold">{potData.streakDays} day streak</span>
          </div>
        </div>

        {/* Breakdown Card */}
        <div 
          className="rounded-2xl p-6 mb-8"
          style={{ 
            background: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
            Earnings Breakdown
          </h3>
          
          <div className="space-y-1">
            {renderBreakdown()}
          </div>
          
          <div className="mt-4 text-sm" style={{ color: "#64748b" }}>
            Last updated: {potData.lastUpdated}
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="rounded-2xl p-6 mb-8"
          style={{ 
            background: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
            Earn More Rewards
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => addReward('reviews', 2.50)}
              disabled={isLoading}
              className="p-4 rounded-lg text-left transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#f0f9ff", border: "1px solid #e0f2fe" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#e0f2fe")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#f0f9ff")}
            >
              <div className="font-semibold" style={{ color: "#0369a1" }}>+ £2.50</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Write Review</div>
            </button>
            
            <button
              onClick={() => addReward('referrals', 5.00)}
              disabled={isLoading}
              className="p-4 rounded-lg text-left transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#f0fdf4", border: "1px solid #dcfce7" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#dcfce7")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#f0fdf4")}
            >
              <div className="font-semibold" style={{ color: "#166534" }}>+ £5.00</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Refer Friend</div>
            </button>
            
            <button
              onClick={() => addReward('shares', 1.25)}
              disabled={isLoading}
              className="p-4 rounded-lg text-left transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#fef7ff", border: "1px solid #f3e8ff" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#f3e8ff")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#fef7ff")}
            >
              <div className="font-semibold" style={{ color: "#7c3aed" }}>+ £1.25</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Share Find</div>
            </button>
            
            <button
              onClick={() => addReward('searchFinds', 1.75)}
              disabled={isLoading}
              className="p-4 rounded-lg text-left transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#fffbeb", border: "1px solid #fef3c7" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#fef3c7")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#fffbeb")}
            >
              <div className="font-semibold" style={{ color: "#d97706" }}>+ £1.75</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Search & Find</div>
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-4 text-center text-sm" style={{ color: "#64748b" }}>
              Updating your voucher pot...
            </div>
          )}
        </div>

        {/* Firebase Integration Info */}
        <div 
          className="rounded-2xl p-6 mb-8"
          style={{ 
            background: "#eff6ff",
            border: "1px solid #dbeafe"
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: "#1e40af" }}>
            Firebase Integration
          </h4>
          <p className="text-sm" style={{ color: "#2563eb" }}>
            Voucher pot data syncs with Firestore collections and user authentication. 
            Real-time transactions ensure accurate reward tracking across all platform activities.
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center">
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

export default VoucherPot