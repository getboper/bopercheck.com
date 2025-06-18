import React, { useState } from 'react'
import VoucherDropAnimation from './VoucherDropAnimation'
import { useFirebaseVoucherListener } from '../hooks/useFirebaseVoucherListener'

interface Voucher {
  id: string
  brand: string
  value: number
  description: string
  code: string
  expires: string
}

interface VoucherJarData {
  realVouchers: Voucher[]
  pendingCredits: number
  totalSaved: number
}

interface VoucherJarProps {
  onBackToDemo?: () => void
}

const VoucherJar: React.FC<VoucherJarProps> = ({ onBackToDemo }) => {
  const [jarData, setJarData] = useState<VoucherJarData>({
    realVouchers: [
      {
        id: '1',
        brand: 'Amazon',
        value: 15.00,
        description: '10% off electronics purchase',
        code: 'SAVE10ELEC',
        expires: '31 Dec 2024'
      },
      {
        id: '2',
        brand: 'Argos',
        value: 8.50,
        description: 'Free delivery on orders over £30',
        code: 'FREEDEL30',
        expires: '15 Jan 2025'
      },
      {
        id: '3',
        brand: 'Tesco',
        value: 12.25,
        description: '£5 off weekly shop',
        code: 'WEEKLY5OFF',
        expires: '28 Feb 2025'
      }
    ],
    pendingCredits: 23.75,
    totalSaved: 59.50
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationAmount, setAnimationAmount] = useState('£1')

  // Firebase real-time listener for voucher updates
  useFirebaseVoucherListener({
    userId: 'demo-user-123',
    onVoucherUpdate: (earnedAmount) => {
      setAnimationAmount(`£${earnedAmount.toFixed(2)}`)
      setShowAnimation(true)
      
      // Update jar data with new earnings
      setJarData(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + earnedAmount
      }))
    }
  })

  const addFallbackCredit = (amount: number = 1.00) => {
    setIsLoading(true)
    
    // Simulate Firebase transaction
    setTimeout(() => {
      setJarData(prev => ({
        ...prev,
        pendingCredits: prev.pendingCredits + amount,
        totalSaved: prev.totalSaved + amount
      }))
      setIsLoading(false)
    }, 1000)
  }

  const renderVoucherCards = () => {
    return jarData.realVouchers.map((voucher) => (
      <div 
        key={voucher.id}
        className="rounded-xl p-4 mb-4"
        style={{ 
          background: "#ffffff",
          borderLeft: "6px solid #3b82f6",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <h4 className="text-xl font-semibold mb-2" style={{ color: "#0f172a" }}>
          {voucher.brand} – £{voucher.value.toFixed(2)}
        </h4>
        <div className="text-sm" style={{ color: "#64748b" }}>
          <div className="mb-1">{voucher.description}</div>
          <div className="mb-1">
            Code: <strong style={{ color: "#0f172a" }}>{voucher.code}</strong>
          </div>
          <div>Expires: {voucher.expires}</div>
        </div>
      </div>
    ))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
      }}
    >
      {showAnimation && (
        <VoucherDropAnimation 
          amount={animationAmount}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      <div className="max-w-2xl mx-auto">
        {/* Main Voucher Jar Container */}
        <div 
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{ 
            background: "linear-gradient(135deg, #f0fff4, #ecfdf5)",
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
            border: "3px solid #34d399"
          }}
        >
          {/* Pulsing glow effect */}
          <div 
            className="absolute inset-0 -top-1/2 -left-1/2 w-[200%] h-[200%]"
            style={{
              background: "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)",
              animation: "pulse-glow 3s infinite ease-in-out",
              zIndex: 0
            }}
          />
          
          {/* Content with higher z-index */}
          <div className="relative z-10">
          <h2 className="text-3xl mb-6" style={{ color: "#0f172a" }}>
            🎁 Your Voucher Jar
          </h2>
          
          <div 
            className="text-4xl font-bold mb-8"
            style={{ color: "#22c55e" }}
          >
            £{jarData.totalSaved.toFixed(2)} saved
          </div>
          
          {/* Voucher List */}
          <div className="space-y-1 mb-8">
            {renderVoucherCards()}
          </div>
          
          {/* Pending Credits */}
          {jarData.pendingCredits > 0 && (
            <div 
              className="p-4 rounded-lg mb-8"
              style={{ 
                background: "#fffbeb",
                border: "1px solid #fef3c7",
                color: "#d97706"
              }}
            >
              <div className="font-medium">
                💸 You have £{jarData.pendingCredits.toFixed(2)} in pending voucher credit.
              </div>
              <div className="text-sm mt-1">
                We'll notify you when voucher matches are found!
              </div>
            </div>
          )}
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
            Add Credit
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => addFallbackCredit(1.00)}
              disabled={isLoading}
              className="p-4 rounded-lg text-center transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#f0fdf4", border: "1px solid #dcfce7" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#dcfce7")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#f0fdf4")}
            >
              <div className="font-semibold" style={{ color: "#166534" }}>+ £1.00</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Small Find</div>
            </button>
            
            <button
              onClick={() => addFallbackCredit(2.50)}
              disabled={isLoading}
              className="p-4 rounded-lg text-center transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#fef7ff", border: "1px solid #f3e8ff" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#f3e8ff")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#fef7ff")}
            >
              <div className="font-semibold" style={{ color: "#7c3aed" }}>+ £2.50</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Good Deal</div>
            </button>
            
            <button
              onClick={() => addFallbackCredit(5.00)}
              disabled={isLoading}
              className="p-4 rounded-lg text-center transition-colors duration-200 disabled:opacity-50"
              style={{ background: "#fffbeb", border: "1px solid #fef3c7" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "#fef3c7")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "#fffbeb")}
            >
              <div className="font-semibold" style={{ color: "#d97706" }}>+ £5.00</div>
              <div className="text-sm" style={{ color: "#64748b" }}>Great Save</div>
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-4 text-center text-sm" style={{ color: "#64748b" }}>
              Adding credit to your jar...
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
            Voucher jar syncs with Firestore collections for real voucher codes and pending credits. 
            Authenticated users can accumulate actual discount codes and track savings across all activities.
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

export default VoucherJar