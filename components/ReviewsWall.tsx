import React from 'react'

interface Review {
  id: number
  stars: number
  text: string
  user: string
  location: string
}

interface ReviewsWallProps {
  rating?: number
  reviews?: Review[]
  onBackToDemo?: () => void
}

const ReviewsWall: React.FC<ReviewsWallProps> = ({
  rating = 4.8,
  reviews = [
    {
      id: 1,
      stars: 5,
      text: "This app saved me hours – love it!",
      user: "Sarah",
      location: "London"
    },
    {
      id: 2,
      stars: 5,
      text: "Found a deal on my boiler install that beat every quote!",
      user: "Mike",
      location: "Plymouth"
    },
    {
      id: 3,
      stars: 4,
      text: "Nice tool. Would love more categories.",
      user: "Jo",
      location: "Leeds"
    },
    {
      id: 4,
      stars: 5,
      text: "Brilliant for comparing prices quickly and easily.",
      user: "Emma",
      location: "Manchester"
    },
    {
      id: 5,
      stars: 5,
      text: "The voucher alerts are fantastic! Saved £200 last month.",
      user: "David",
      location: "Birmingham"
    }
  ],
  onBackToDemo
}) => {
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < count ? '#facc15' : '#e5e7eb' }}>
        ⭐
      </span>
    ))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#fff"
      }}
    >
      <div 
        className="max-w-3xl mx-auto rounded-2xl p-8 text-center"
        style={{ 
          background: "#f8fafc",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.07)"
        }}
      >
        <h1 
          className="text-3xl mb-6"
          style={{ color: "#111827" }}
        >
          ⭐ Rated {rating} by Our Users
        </h1>
        
        <div className="flex flex-col gap-6 mb-8">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="p-4 rounded-xl text-left"
              style={{ 
                background: "white",
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
              }}
            >
              <div className="text-xl mb-2">
                {renderStars(review.stars)}
              </div>
              <p 
                className="mb-2 text-base"
                style={{ color: "#374151" }}
              >
                "{review.text}"
              </p>
              <span 
                className="text-sm"
                style={{ color: "#6b7280" }}
              >
                – {review.user}, {review.location}
              </span>
            </div>
          ))}
        </div>
        
        <p 
          className="text-base italic mb-6"
          style={{ color: "#4b5563" }}
        >
          📣 More reviews loading live…
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg">
          <div>
            <div className="text-2xl font-bold text-green-600">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">12,500+</div>
            <div className="text-sm text-gray-600">Happy Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">£2M+</div>
            <div className="text-sm text-gray-600">Total Savings</div>
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

export default ReviewsWall