import React, { useState, useEffect } from 'react'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: () => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showThanks, setShowThanks] = useState<boolean>(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0)
      setComment('')
      setIsSubmitting(false)
      setShowThanks(false)
    }
  }, [isOpen])

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please select a star rating.')
      return
    }

    setIsSubmitting(true)

    // Simulate Firebase submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowThanks(true)
      onSubmitSuccess?.()
      
      // Close modal after showing thanks
      setTimeout(() => {
        onClose()
      }, 3000)
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

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        background: "rgba(0, 0, 0, 0.5)"
      }}
    >
      <div 
        className="max-w-md mx-4 rounded-2xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
        }}
      >
        <h2 className="text-2xl mb-6" style={{ color: "#0f172a" }}>
          ⭐ Leave a Quick Review
        </h2>

        {!showThanks ? (
          <div>
            <div className="flex justify-center gap-1 mb-6">
              {renderStars()}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something nice (optional)..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-vertical mb-6"
              style={{ minHeight: '80px' }}
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !rating}
              className="w-full py-3 px-6 text-base font-medium rounded-lg text-white border-none cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: isSubmitting ? "#0284c7" : "#0ea5e9" }}
              onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = "#0284c7")}
              onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = "#0ea5e9")}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-lg text-gray-700">
              Thanks for your review! You've earned a reward.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewModal