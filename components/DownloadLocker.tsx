import { useState } from 'react';
import { Lock, Star, Users, CreditCard, Download, CheckCircle } from 'lucide-react';

export default function DownloadLocker() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState<string>('');

  const unlockByReview = async () => {
    try {
      const response = await fetch('/api/unlock/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review_unlock' })
      });
      
      if (response.ok) {
        setUnlockMethod('review');
        setIsUnlocked(true);
      }
    } catch (error) {
      console.error('Review unlock error:', error);
    }
  };

  const unlockByReferral = async () => {
    try {
      const response = await fetch('/api/unlock/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'referral_unlock' })
      });
      
      if (response.ok) {
        setUnlockMethod('referral');
        setIsUnlocked(true);
      }
    } catch (error) {
      console.error('Referral unlock error:', error);
    }
  };

  const unlockByPayment = () => {
    window.location.href = '/api/stripe/download-unlock-checkout';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {!isUnlocked ? (
          <>
            <Lock style={{ width: '4rem', height: '4rem', color: '#f59e0b', margin: '0 auto 1.5rem' }} />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#92400e',
              margin: '0 0 1rem 0'
            }}>
              Unlock This Download
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: '0 0 2rem 0' }}>
              You've found a powerful price-check result! Choose how you'd like to unlock it:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={unlockByReview}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Star style={{ width: '1.25rem', height: '1.25rem' }} />
                Leave a Review
              </button>

              <button
                onClick={unlockByReferral}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6b21a8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Users style={{ width: '1.25rem', height: '1.25rem' }} />
                Refer a Friend
              </button>

              <button
                onClick={unlockByPayment}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                Pay 99p
              </button>
            </div>
          </>
        ) : (
          <>
            <CheckCircle style={{ width: '4rem', height: '4rem', color: '#10b981', margin: '0 auto 1.5rem' }} />
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#065f46',
              margin: '0 0 1rem 0'
            }}>
              Unlocked!
            </h3>
            <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0 0 2rem 0' }}>
              Thank you for {unlockMethod === 'review' ? 'leaving a review' : 'referring a friend'}!
            </p>
            
            <a
              href="/api/downloads/price-analysis-report"
              download="price-analysis-report.pdf"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download style={{ width: '1.25rem', height: '1.25rem' }} />
              Download Now
            </a>
          </>
        )}
      </div>
    </div>
  );
}