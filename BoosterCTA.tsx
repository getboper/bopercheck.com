import React from 'react'

interface BoosterCTAProps {
  onAction?: (action: string, amount: number) => void
}

const BoosterCTA: React.FC<BoosterCTAProps> = ({ onAction }) => {
  const handleAction = (action: string, amount: number) => {
    onAction?.(action, amount)
  }

  return (
    <div 
      className="mx-auto mt-8 p-6 rounded-2xl text-center"
      style={{
        background: "#ecfccb",
        boxShadow: "0 4px 12px rgba(34,197,94,0.2)",
        maxWidth: "500px"
      }}
    >
      <h3 className="mb-4 text-xl font-bold" style={{ color: "#166534" }}>
        Boost Your Pot 💥
      </h3>
      
      <div className="flex flex-col gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
          }}
        >
          <div className="font-bold mb-2" style={{ color: "#0f172a" }}>
            🎥 Leave a Video Review
          </div>
          <p className="mb-3 font-bold" style={{ color: "#15803d", margin: "0.3rem 0" }}>
            +£3 Voucher
          </p>
          <button
            onClick={() => handleAction('video_review', 3.00)}
            className="px-5 py-2 text-white font-bold rounded-lg border-none cursor-pointer"
            style={{
              background: "linear-gradient(to right, #34d399, #059669)",
              marginTop: "0.5rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Submit Video
          </button>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
          }}
        >
          <div className="font-bold mb-2" style={{ color: "#0f172a" }}>
            💬 Share on Social Media
          </div>
          <p className="mb-3 font-bold" style={{ color: "#15803d", margin: "0.3rem 0" }}>
            +£2 Voucher
          </p>
          <button
            onClick={() => handleAction('social_share', 2.00)}
            className="px-5 py-2 text-white font-bold rounded-lg border-none cursor-pointer"
            style={{
              background: "linear-gradient(to right, #34d399, #059669)",
              marginTop: "0.5rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Share Now
          </button>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
          }}
        >
          <div className="font-bold mb-2" style={{ color: "#0f172a" }}>
            🤝 Refer a Friend
          </div>
          <p className="mb-3 font-bold" style={{ color: "#15803d", margin: "0.3rem 0" }}>
            +£5 Voucher
          </p>
          <button
            onClick={() => handleAction('friend_referral', 5.00)}
            className="px-5 py-2 text-white font-bold rounded-lg border-none cursor-pointer"
            style={{
              background: "linear-gradient(to right, #34d399, #059669)",
              marginTop: "0.5rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Your Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoosterCTA