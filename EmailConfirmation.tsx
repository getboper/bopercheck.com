import { useState } from 'react';
import { Mail, CheckCircle, Send } from 'lucide-react';

export default function EmailConfirmation() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/email/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Email confirmation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
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
        {!isSubmitted ? (
          <>
            <Mail style={{ width: '4rem', height: '4rem', color: '#10b981', margin: '0 auto 1.5rem' }} />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#065f46',
              margin: '0 0 1rem 0'
            }}>
              Confirm Your Email
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: '0 0 2rem 0' }}>
              We'll send your voucher pot or download link to your inbox after verification
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                style={{
                  background: isLoading || !email.trim() ? '#d1d5db' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                {isLoading ? 'Sending...' : 'Send Confirmation'}
              </button>
            </form>
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
              Email Sent!
            </h3>
            <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
              We've sent a confirmation email to:
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#065f46', margin: '0 0 2rem 0' }}>
              {email}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
              Please check your inbox and click the confirmation link to complete the process.
            </p>
          </>
        )}
      </div>
    </div>
  );
}