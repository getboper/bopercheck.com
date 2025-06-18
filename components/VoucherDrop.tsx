import { useState, useEffect } from 'react';
import { Gift, Tag, Clock, ArrowRight, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Voucher {
  id: string;
  title: string;
  discount: string;
  retailer: string;
  code: string;
  expiry: string;
  category: string;
  terms?: string;
  website?: string;
  minSpend?: string;
  verified?: boolean;
}

export default function VoucherDrop() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [savedVouchers, setSavedVouchers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const saveVoucherToPot = async (voucher: Voucher) => {
    try {
      const response = await fetch('/api/voucher-pot/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: voucher.id,
          title: voucher.title,
          discount: voucher.discount,
          retailer: voucher.retailer,
          code: voucher.code,
          category: voucher.category,
          terms: voucher.terms || '',
          website: voucher.website || '',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          value: parseFloat(voucher.discount.replace(/[^\d.]/g, '')) || 0
        })
      });

      if (response.ok) {
        setSavedVouchers(prev => new Set([...Array.from(prev), voucher.id]));
        toast({
          title: "Voucher Saved!",
          description: `${voucher.title} added to your voucher pot`,
        });
      } else {
        throw new Error('Failed to save voucher');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save voucher. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const query = localStorage.getItem('lastSearchQuery') || 'general';
        const location = localStorage.getItem('lastSearchLocation') || 'UK';
        
        const response = await fetch('/api/vouchers/real-discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, location })
        });
        
        if (response.ok) {
          const data = await response.json();
          setVouchers(data.vouchers || []);
        }
      } catch (error) {
        console.error('Error loading vouchers:', error);
        setVouchers([]);
      }
    };
    
    loadVouchers();
  }, []);

  const handleClaimVoucher = (voucher: Voucher) => {
    // Copy code to clipboard
    navigator.clipboard.writeText(voucher.code);
    alert(`Voucher code ${voucher.code} copied to clipboard!`);
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Gift style={{ width: '2rem', height: '2rem', color: '#4f46e5' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0 }}>Voucher Drop!</h1>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: '2px solid #10b981'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#374151', margin: '0 0 1rem 0' }}>
              Based on your search, we've found some exclusive offers for you:
            </p>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem' }}>
              <div>• Click voucher codes to copy to clipboard</div>
              <div>• Use codes during checkout at retailer websites</div>
              <div>• Vouchers expire in 7 days - use them quickly</div>
              <div>• New vouchers added daily based on your searches</div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {vouchers.map((voucher) => (
            <div key={voucher.id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              border: '2px solid #10b981',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => handleClaimVoucher(voucher)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  background: '#ecfdf5',
                  color: '#065f46',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {voucher.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', color: '#ea580c' }}>
                  <Clock style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem' }}>{voucher.expiry}</span>
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1.5rem' }}>
                {voucher.title}
              </h3>
              
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: '#ecfdf5',
                borderRadius: '12px',
                border: '2px dashed #10b981',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', marginBottom: '0.5rem' }}>
                  {voucher.discount}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#065f46' }}>at {voucher.retailer}</div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                background: '#f3f4f6',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <Tag style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                <code style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: '600' }}>
                  {voucher.code}
                </code>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClaimVoucher(voucher);
                  }}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  Copy Code
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    saveVoucherToPot(voucher);
                  }}
                  disabled={savedVouchers.has(voucher.id)}
                  style={{
                    background: savedVouchers.has(voucher.id) ? '#6b7280' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: savedVouchers.has(voucher.id) ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!savedVouchers.has(voucher.id)) {
                      e.currentTarget.style.background = '#4338ca';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!savedVouchers.has(voucher.id)) {
                      e.currentTarget.style.background = '#4f46e5';
                    }
                  }}
                >
                  {savedVouchers.has(voucher.id) ? (
                    <Check style={{ width: '1.2rem', height: '1.2rem' }} />
                  ) : (
                    <Plus style={{ width: '1.2rem', height: '1.2rem' }} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: '#6b7280',
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
            ← Back
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: 'white',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
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
            Go to Dashboard
            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}