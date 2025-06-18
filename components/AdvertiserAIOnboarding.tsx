import { useState } from 'react';
import { Bot, Globe, Zap, TrendingUp, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';

export default function AdvertiserAIOnboarding() {
  const [website, setWebsite] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<any>(null);
  const [step, setStep] = useState(1);

  const generateAdvert = async () => {
    if (!website.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/claude/generate-advert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedAd(data);
        setStep(2);
      }
    } catch (error) {
      console.error('Ad generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const publishAdvert = async () => {
    try {
      const response = await fetch('/api/stripe/create-advertiser-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adData: generatedAd,
          website,
          planType: 'premium_advertiser'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Publishing error:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Bot style={{ width: '4rem', height: '4rem', color: '#4f46e5', margin: '0 auto 1rem' }} />
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: '#1e3a8a',
                margin: '0 0 1rem 0'
              }}>
                Create Your Free Advert
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
                Drop your business website below and Claude AI will generate a custom advert preview for you.
              </p>
            </div>

            <div style={{
              background: '#ecfdf5',
              padding: '1.5rem',
              borderLeft: '5px solid #10b981',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                <span style={{ fontWeight: '600', color: '#059669' }}>
                  Claude AI will auto-fill your business name, contact info, and suggest a special offer.
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <Globe style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
                <input
                  type="url"
                  placeholder="https://yourbusinesssite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && generateAdvert()}
                />
              </div>
              
              <button
                onClick={generateAdvert}
                disabled={isGenerating || !website.trim()}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isGenerating || !website.trim() ? 'not-allowed' : 'pointer',
                  opacity: isGenerating || !website.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Bot style={{ width: '1.25rem', height: '1.25rem' }} />
                {isGenerating ? 'Claude AI is generating your advert...' : 'Preview My Advert'}
              </button>
            </div>

            <div style={{
              background: '#fef3c7',
              padding: '1.5rem',
              borderLeft: '5px solid #f59e0b',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#92400e', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <TrendingUp style={{ width: '1rem', height: '1rem' }} />
                  <span>Add a discount like 10% off and increase exposure by up to 65%!</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                  <span>You can edit your ad before publishing.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                  <span>No payment required until you're ready to go live.</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && generatedAd && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <CheckCircle style={{ width: '4rem', height: '4rem', color: '#10b981', margin: '0 auto 1rem' }} />
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: '#1e3a8a',
                margin: '0 0 1rem 0'
              }}>
                Your AI-Generated Advert
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
                Claude AI has analyzed your website and created this custom advert
              </p>
            </div>

            {/* Generated Ad Preview */}
            <div style={{
              border: '3px solid #10b981',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#065f46', marginBottom: '1rem' }}>
                {generatedAd.businessName || 'Professional Window Cleaning Services'}
              </h3>
              <p style={{ fontSize: '1rem', color: '#047857', marginBottom: '1rem', lineHeight: '1.6' }}>
                {generatedAd.description || 'Premium window cleaning services for residential and commercial properties. Professional, reliable, and affordable with 100% satisfaction guarantee.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {generatedAd.offer || '20% OFF First Clean'}
                </span>
                <span style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {generatedAd.location || 'Plymouth Area'}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
                <strong>Contact:</strong> {generatedAd.contact || 'Call 01752 123456 | book@windowcleaning.com'}
              </div>
            </div>

            {/* Subscription Options */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Choose Your Advertising Plan
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                    Basic Exposure
                  </h4>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#4f46e5', marginBottom: '0.5rem' }}>
                    £19.99
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    per month
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#374151', textAlign: 'left' }}>
                    • Top 5 search results
                    • Weekly performance reports
                    • Basic analytics
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  color: 'white',
                  textAlign: 'center',
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Premium Featured
                  </h4>
                  <div style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                    £49.99
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>
                    per month
                  </div>
                  <div style={{ fontSize: '0.875rem', textAlign: 'left' }}>
                    • #1 position guarantee
                    • Daily performance reports
                    • Advanced analytics
                    • Priority customer support
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit Website
              </button>
              <button
                onClick={publishAdvert}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                Publish & Start Advertising
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}