import { useState } from 'react';
import { Check, Crown, Zap, Star, CreditCard } from 'lucide-react';

interface SubscriptionPlansProps {
  onSubscribe: (plan: string) => void;
  onBackToDashboard: () => void;
}

export default function SubscriptionPlans({ onSubscribe, onBackToDashboard }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free Shopper',
      price: '£0',
      period: 'forever',
      color: '#6b7280',
      features: [
        '5 price checks per day',
        'Basic voucher discovery',
        'Standard support',
        'Email alerts'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Saver',
      price: '£4.99',
      period: 'per month',
      color: '#4f46e5',
      features: [
        'Unlimited price checks',
        'AI-powered voucher discovery',
        'Priority support',
        'Real-time price alerts',
        'Advanced analytics',
        'Exclusive deals access'
      ],
      cta: 'Subscribe Now',
      popular: true
    },
    {
      id: 'business',
      name: 'Business Pro',
      price: '£19.99',
      period: 'per month',
      color: '#059669',
      features: [
        'Everything in Premium',
        'Business listing priority',
        'Weekly analytics reports',
        'Competitor analysis',
        'Custom branding',
        'API access',
        'Dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);
    
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkoutUrl;
      } else {
        alert('Subscription setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e3a8a', margin: '0 0 1rem 0' }}>
            Choose Your BoperCheck Plan
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: '0 0 2rem 0' }}>
            Unlock the full power of AI-driven price comparison and savings
          </p>
          
          <div style={{
            background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '2px solid #4f46e5',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p style={{ fontSize: '1rem', color: '#4f46e5', margin: 0, fontWeight: '600' }}>
              🎯 Average user saves £127.45 per month with Premium
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: plan.popular ? '0 20px 40px rgba(79, 70, 229, 0.2)' : '0 8px 24px rgba(0,0,0,0.08)',
                border: plan.popular ? '3px solid #4f46e5' : '2px solid #e5e7eb',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#4f46e5',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Crown size={16} />
                  Most Popular
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: plan.color, margin: '0 0 1rem 0' }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#111827' }}>{plan.price}</span>
                  <span style={{ fontSize: '1rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <Check style={{ width: '1.25rem', height: '1.25rem', color: plan.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', color: '#374151' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => plan.id !== 'free' ? handleSubscribe(plan.id) : null}
                disabled={isProcessing && selectedPlan === plan.id}
                style={{
                  width: '100%',
                  background: plan.id === 'free' ? '#e5e7eb' : plan.color,
                  color: plan.id === 'free' ? '#6b7280' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: plan.id === 'free' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: (isProcessing && selectedPlan === plan.id) ? 0.7 : 1
                }}
              >
                {plan.id !== 'free' && <CreditCard size={20} />}
                {(isProcessing && selectedPlan === plan.id) ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', margin: '0 0 1rem 0', textAlign: 'center' }}>
            Why Choose BoperCheck Premium?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Zap style={{ width: '2rem', height: '2rem', color: '#4f46e5', margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Instant AI Analysis</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>Claude AI scans 1000+ retailers in seconds</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Star style={{ width: '2rem', height: '2rem', color: '#4f46e5', margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Exclusive Vouchers</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>Access to hidden deals and member-only discounts</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <CreditCard style={{ width: '2rem', height: '2rem', color: '#4f46e5', margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Stripe Cash-Out</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>Direct deposit savings to your bank account</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'white',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}