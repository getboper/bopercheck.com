import React, { useEffect, useState } from 'react'
import { audioEffects } from '../utils/audioEffects'

interface VoucherDropAnimationProps {
  amount?: string
  onComplete?: () => void
}

const VoucherDropAnimation: React.FC<VoucherDropAnimationProps> = ({ 
  amount = "£1", 
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Play coin drop sound when animation starts
    audioEffects.playCoinDrop()
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 1500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 w-30 h-30 rounded-full flex items-center justify-center font-bold text-slate-800 text-xl z-50"
      style={{
        background: "radial-gradient(circle, #facc15, #f59e0b)",
        boxShadow: "0 0 20px rgba(251, 191, 36, 0.7)",
        animation: "dropCoin 1s ease forwards",
        width: "120px",
        height: "120px",
        top: "-80px"
      }}
    >
      {amount}
    </div>
  )
}

export default VoucherDropAnimation