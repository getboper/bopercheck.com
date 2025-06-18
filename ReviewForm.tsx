import React, { useState } from 'react'

interface ReviewFormProps {
  onSubmitSuccess?: () => void
  onBackToDemo?: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmitSuccess,
  onBackToDemo
}) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rating) {
      alert('Please select a star rating.')
      return
    }

    setIsSubmitting(true)
    
    // Simulate Firebase submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSubmitSuccess?.()
    }, 1500)
  }

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => {
      const starValue = i + 1
      return (
        <span
          key={i}
          onClick={() => handleStarClick(starValue)}
          className="cursor-pointer text-4xl transition-colors duration-200"
          style={{ 
            color: starValue <= rating ? '#facc15' : '#94a3b8'
          }}
        >
          ⭐
        </span>
      )
    })
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-8"
        style={{ 
          fontFamily: "'Segoe UI', sans-serif",
          background: "#f1f5f9"
        }}
      >
        <div 
          className="max-w-lg mx-auto rounded-2xl p-8 text-center"
          style={{ 
            background: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.07)"
          }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl mb-4" style={{ color: "#0f172a" }}>
            Thank you for your feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Your review helps us improve our service for everyone.
          </p>
          
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

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f1f5f9"
      }}
    >
      <div 
        className="max-w-lg mx-auto rounded-2xl p-8"
        style={{ 
          background: "white",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.07)"
        }}
      >
        <h2 className="text-2xl mb-6 text-center" style={{ color: "#0f172a" }}>
          ⭐ Leave a Review
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Your Rating:</label>
            <div className="flex justify-center gap-1 mb-4">
              {renderStars()}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block mb-2 font-semibold">
              Comment (optional):
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write something..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-vertical"
              style={{ minHeight: '100px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !rating}
            className="w-full py-3 px-6 text-base font-medium rounded-lg text-white border-none cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: isSubmitting ? "#0284c7" : "#0ea5e9" }}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = "#0284c7")}
            onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = "#0ea5e9")}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Firebase Integration Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm">
          <h4 className="font-semibold text-blue-800 mb-2">Firebase Integration</h4>
          <p className="text-blue-600">
            Reviews are stored in Firestore with real-time sync to the reviews wall.
          </p>
        </div>

        {/* Back Navigation */}
        <div className="mt-6 text-center">
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

export default ReviewForm