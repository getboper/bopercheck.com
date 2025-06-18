import React, { useEffect, useState } from 'react'

interface MilestonePopupProps {
  title: string
  subtitle: string
  onComplete?: () => void
}

const MilestonePopup: React.FC<MilestonePopupProps> = ({ title, subtitle, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed top-1/5 left-1/2 transform -translate-x-1/2 p-6 rounded-2xl text-center z-50"
      style={{
        background: "#fff7ed",
        border: "2px solid #fb923c",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        animation: "slideDownFade 4s ease",
        fontFamily: "sans-serif"
      }}
    >
      <h2 
        className="text-3xl font-bold mb-2"
        style={{ color: "#c2410c", margin: 0 }}
      >
        {title}
      </h2>
      <p 
        className="text-lg font-bold"
        style={{ color: "#92400e", marginTop: "0.5rem" }}
      >
        {subtitle}
      </p>
    </div>
  )
}

export default MilestonePopup