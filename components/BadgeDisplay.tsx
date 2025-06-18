import React from 'react'

interface BadgeDisplayProps {
  totalSaved: number
  userId?: string
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ totalSaved }) => {
  const badges = []

  if (totalSaved >= 10) {
    badges.push({ icon: '🥉', label: 'Bronze', class: 'bronze' })
  }
  if (totalSaved >= 25) {
    badges.push({ icon: '🥈', label: 'Silver', class: 'silver' })
  }
  if (totalSaved >= 50) {
    badges.push({ icon: '🥇', label: 'Gold', class: 'gold' })
  }
  if (totalSaved >= 100) {
    badges.push({ icon: '👑', label: 'Platinum', class: 'platinum' })
  }

  if (badges.length === 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Save £10 to unlock your first badge!
        </p>
      </div>
    )
  }

  return (
    <div id="badge-display" className="flex gap-4 justify-center mt-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`badge-icon ${badge.class} flex flex-col items-center text-2xl p-2 rounded-lg w-20`}
          style={{
            background: "#f9fafb",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            border: getBorderColor(badge.class)
          }}
        >
          <div className="text-2xl">{badge.icon}</div>
          <span 
            className="text-sm font-bold mt-1"
            style={{ color: "#374151" }}
          >
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  )
}

const getBorderColor = (badgeClass: string) => {
  switch (badgeClass) {
    case 'bronze': return '2px solid #f97316'
    case 'silver': return '2px solid #9ca3af'
    case 'gold': return '2px solid #facc15'
    case 'platinum': return '2px solid #a855f7'
    default: return '2px solid #e5e7eb'
  }
}

export default BadgeDisplay