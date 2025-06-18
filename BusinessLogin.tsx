import { useState } from 'react';
import { Building2, Lock, Mail } from 'lucide-react';

interface BusinessLoginProps {
  onSuccess: (token: string, businessName: string) => void;
}

export default function BusinessLogin({ onSuccess }: BusinessLoginProps) {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !accessCode) {
      setError('Please enter both email and access code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/business/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, accessCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store session token
      localStorage.setItem('businessToken', data.token);
      localStorage.setItem('businessEmail', email);
      localStorage.setItem('businessName', data.businessName);
      
      setSuccess(`Welcome back, ${data.businessName}!`);
      
      setTimeout(() => {
        onSuccess(data.token, data.businessName);
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Business Dashboard Access
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Enter your business email and access code to view your campaign performance
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#059669'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              Business Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '12px', 
                width: '16px', 
                height: '16px', 
                color: '#9ca3af' 
              }} />
              <input
                type="email"
                placeholder="your-business@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              Access Code
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '12px', 
                width: '16px', 
                height: '16px', 
                color: '#9ca3af' 
              }} />
              <input
                type="text"
                placeholder="BOP..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Access code was provided when your campaign was activated
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Signing In...' : 'Access Dashboard'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Need help accessing your dashboard?{' '}
            <a 
              href="mailto:support@bopercheck.com" 
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}