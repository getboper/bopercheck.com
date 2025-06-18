import React, { useState } from "react";

interface QuickReviewFormProps {
  onSubmit?: (review: string) => void;
}

export default function QuickReviewForm({ onSubmit }: QuickReviewFormProps) {
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: review.trim(),
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.voucherMessage || "Review submitted! Surprise voucher added to your account.");
        setReview("");
        if (onSubmit) {
          onSubmit(review);
        }
      } else {
        setMessage("Submission failed. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
          <input
            type="text"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="Share your experience…"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !review.trim()}
            style={{
              background: isSubmitting || !review.trim() ? '#9ca3af' : '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSubmitting || !review.trim() ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit & Win Voucher"}
          </button>
        </div>
      </form>
      
      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: message.includes('submitted') ? '#dcfce7' : '#fee2e2',
          color: message.includes('submitted') ? '#166534' : '#dc2626',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}