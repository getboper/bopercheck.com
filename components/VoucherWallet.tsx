import { useState, useEffect } from 'react';
import { Wallet, Gift, Trash2, Download, Share2, CreditCard } from 'lucide-react';

interface Voucher {
  id: string;
  businessName: string;
  discount: string;
  code: string;
  expiryDate: string;
  value: number;
  category: string;
  used: boolean;
}

export default function VoucherWallet() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('active');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/user/vouchers');
      const data = await response.json();
      setVouchers(data.vouchers || []);
      setTotalSaved(data.totalSaved || 0);
    } catch (error) {
      console.error('Voucher fetch error:', error);
    }
  };

  const useVoucher = async (voucherId: string) => {
    try {
      const response = await fetch(`/api/user/vouchers/${voucherId}/use`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchVouchers();
        alert('Voucher marked as used!');
      }
    } catch (error) {
      console.error('Voucher use error:', error);
    }
  };

  const deleteVoucher = async (voucherId: string) => {
    try {
      const response = await fetch(`/api/user/vouchers/${voucherId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Voucher delete error:', error);
    }
  };

  const shareVoucher = (voucher: Voucher) => {
    const shareText = `Check out this ${voucher.discount} voucher for ${voucher.businessName}! Use code: ${voucher.code}`;
    navigator.share ? navigator.share({ text: shareText }) : navigator.clipboard.writeText(shareText);
  };

  const cashOut = () => {
    window.location.href = '/api/stripe/voucher-cashout';
  };

  const filteredVouchers = vouchers.filter(voucher => {
    if (filter === 'active') return !voucher.used;
    if (filter === 'used') return voucher.used;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Wallet style={{ width: '3rem', height: '3rem', color: '#4f46e5' }} />
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e3a8a', margin: 0 }}>
                  Voucher Wallet
                </h1>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Manage your collected vouchers and savings
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Saved</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>£{totalSaved.toFixed(2)}</div>
              </div>
              
              <button
                onClick={cashOut}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                Cash Out
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '1rem'
        }}>
          {(['all', 'active', 'used'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              style={{
                background: filter === filterType ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f8fafc',
                color: filter === filterType ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filterType} ({filterType === 'all' ? vouchers.length : 
                filterType === 'active' ? vouchers.filter(v => !v.used).length :
                vouchers.filter(v => v.used).length})
            </button>
          ))}
        </div>

        {/* Vouchers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredVouchers.map((voucher) => (
            <div
              key={voucher.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: voucher.used ? '2px solid #d1d5db' : '2px solid #10b981',
                opacity: voucher.used ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e3a8a', margin: '0 0 0.5rem 0' }}>
                    {voucher.businessName}
                  </h3>
                  <span style={{
                    background: voucher.used ? '#f3f4f6' : '#ecfdf5',
                    color: voucher.used ? '#6b7280' : '#065f46',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {voucher.category}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    color: voucher.used ? '#6b7280' : '#10b981'
                  }}>
                    {voucher.discount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    £{voucher.value} value
                  </div>
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Voucher Code
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '900',
                  color: '#1e3a8a',
                  letterSpacing: '0.1em'
                }}>
                  {voucher.code}
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                Expires: {new Date(voucher.expiryDate).toLocaleDateString()}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {!voucher.used && (
                  <button
                    onClick={() => useVoucher(voucher.id)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Gift style={{ width: '1rem', height: '1rem' }} />
                    Use
                  </button>
                )}
                
                <button
                  onClick={() => shareVoucher(voucher)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Share2 style={{ width: '1rem', height: '1rem' }} />
                  Share
                </button>
                
                <button
                  onClick={() => deleteVoucher(voucher.id)}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVouchers.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <Gift style={{ width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
              No vouchers found
            </h3>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              Start using BoperCheck to collect vouchers and build your savings!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}