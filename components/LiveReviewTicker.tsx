import React, { useEffect, useState } from "react";

export default function LiveReviewTicker() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState<string[]>([]);

  // Sample reviews to display
  const sampleReviews = [
    "🎉 Emily in Leeds saved £24 on gym gear",
    "💬 Josh: 'Great tool. Saved £45 on tyres!'",
    "🔍 New search: 'Window Cleaner in Plymouth'",
    "🛍️ Claire in Birmingham: 'Found 3 vouchers in 1 search!'",
    "🔥 James: '£60 saving on my new fridge. Boper nailed it!'"
  ];

  // Load authentic reviews from API
  useEffect(() => {
    fetch('/api/reviews/approved')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const reviewTexts = data.map((review: any) => 
            `💬 ${review.userName} in ${review.location}: "${review.text}"`
          );
          setReviews(reviewTexts);
        } else {
          setReviews(sampleReviews);
        }
      })
      .catch(() => {
        setReviews(sampleReviews);
      });
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : sampleReviews;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayReviews.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [displayReviews.length]);

  return (
    <div style={{
      background: '#eff6ff',
      border: '2px solid #bfdbfe',
      borderRadius: '12px',
      padding: '1rem',
      textAlign: 'center',
      fontWeight: '500',
      color: '#1e40af',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      {displayReviews[index]}
    </div>
  );
}