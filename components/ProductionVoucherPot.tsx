import React, { useState, useEffect } from 'react';

interface VoucherData {
  id: string;
  provider: string;
  discount: string;
  value: number;
  terms: string;
  link: string;
  detectedBy: string;
  dateAdded: string;
  timeAdded: string;
}

interface VoucherPotProps {
  onBackToDemo?: () => void;
}

const ProductionVoucherPot: React.FC<VoucherPotProps> = ({ onBackToDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [voucherBalance, setVoucherBalance] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [milestones] = useState([100, 175, 200]);
  const [achievedMilestones, setAchievedMilestones] = useState<number[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bopercheck-voucher-pot');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setVoucherBalance(data.totalSavings || 0);
        setVouchers(data.vouchers || []);
        setAchievedMilestones(data.achievedMilestones || []);
        setSearchCount(data.searchCount || 0);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      totalSavings: voucherBalance,
      vouchers,
      achievedMilestones,
      searchCount
    };
    localStorage.setItem('bopercheck-voucher-pot', JSON.stringify(data));
  };

  // Perform real search with backend API
  const performSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setSearchCount(prev => prev + 1);
    setIsSearching(true);

    try {
      const response = await fetch('/api/check-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: searchQuery,
          location: location || 'UK'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data);
        
        // Trigger Claude AI voucher detection
        await detectVouchersWithClaude();
      } else {
        console.error('Search failed:', response.statusText);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      saveData();
    }
  };

  // Use Claude AI to detect real vouchers
  const detectVouchersWithClaude = async () => {
    try {
      const response = await fetch('/api/claude-voucher-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery,
          location: location || 'UK'
        })
      });

      if (response.ok) {
        const voucherData = await response.json();
        if (voucherData.voucher) {
          addVoucherToPool(voucherData.voucher);
        }
      }
    } catch (error) {
      console.error('Claude voucher detection error:', error);
    }
  };

  // Add voucher to user's pot
  const addVoucherToPool = (voucherData: any) => {
    const voucher: VoucherData = {
      id: Date.now().toString(),
      provider: voucherData.provider,
      discount: voucherData.discount,
      value: voucherData.value,
      terms: voucherData.terms,
      link: voucherData.link,
      detectedBy: 'Claude AI Research',
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString()
    };

    setVouchers(prev => [voucher, ...prev]);
    setVoucherBalance(prev => prev + voucher.value);
    
    checkMilestones(voucherBalance + voucher.value);
    saveData();
    
    showVoucherDetectedAnimation(voucher);
  };

  // Check if user has reached milestones
  const checkMilestones = (currentBalance: number) => {
    milestones.forEach(milestone => {
      if (currentBalance >= milestone && !achievedMilestones.includes(milestone)) {
        setAchievedMilestones(prev => [...prev, milestone]);
        showMilestonePopup(milestone);
      }
    });
  };

  // Show voucher detected animation
  const showVoucherDetectedAnimation = (voucher: VoucherData) => {
    const animation = document.createElement('div');
    animation.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(145deg, #10b981, #059669);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 16px;
      font-weight: 700;
      z-index: 3000;
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
      text-align: center;
      max-width: 300px;
      animation: voucherDetected 3s ease forwards;
    `;
    
    animation.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤖✨</div>
      <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Claude AI Detected!</div>
      <div style="font-size: 0.9rem; opacity: 0.9;">${voucher.provider} - £${voucher.value.toFixed(2)}</div>
      <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">${voucher.discount}</div>
    `;
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
      if (animation.parentNode) {
        animation.parentNode.removeChild(animation);
      }
    }, 3000);
  };

  // Show milestone popup
  const showMilestonePopup = (milestone: number) => {
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 25px 50px rgba(30, 64, 175, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 400px;
      width: 90%;
      text-align: center;
      animation: popupAppear 0.5s ease;
    `;
    
    popup.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
      <div style="font-size: 1.3rem; font-weight: 700; color: #1e40af; margin-bottom: 1rem;">£${milestone} Milestone Reached!</div>
      <div style="color: #64748b; margin-bottom: 2rem;">Congratulations! You've saved £${milestone} in vouchers. Keep going to unlock more rewards!</div>
      <button onclick="this.parentElement.remove()" style="background: linear-gradient(145deg, #1e40af, #1e3a8a); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Awesome!</button>
    `;
    
    document.body.appendChild(popup);
  };

  // Share voucher pot
  const shareVoucherPot = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BoperCheck - My Voucher Savings',
        text: `I've saved £${voucherBalance.toFixed(2)} in vouchers using BoperCheck! Join me and start saving money on everything you buy.`,
        url: window.location.href
      });
    } else {
      const shareText = `I've saved £${voucherBalance.toFixed(2)} in vouchers using BoperCheck! Join me: ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share link copied to clipboard!');
      });
    }
  };

  const maxMilestone = 200;
  const progress = Math.min((voucherBalance / maxMilestone) * 100, 100);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      color: '#334155'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(30, 64, 175, 0.2)'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
            BoperCheck
          </div>
          <div style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
            AI-Powered Price Comparison & Voucher Discovery
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <form onSubmit={performSearch} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end' }}>
              <input
                type="text"
                placeholder="Search for products or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '1rem 1.5rem',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#334155'
                }}
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  padding: '1rem 1.5rem',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#334155',
                  width: '200px'
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: 'linear-gradient(145deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSearching ? '🔄 Searching...' : '🔍 Search & Earn'}
              </button>
            </form>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          border: '1px solid rgba(30, 64, 175, 0.2)',
          borderRadius: '24px',
          padding: '3rem',
          marginBottom: '3rem',
          boxShadow: '0 25px 50px rgba(30, 64, 175, 0.08), 0 12px 24px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: '#1e40af', marginBottom: '0.5rem' }}>
            £{voucherBalance.toFixed(2)}
          </div>
          <div style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
            Total Voucher Savings
          </div>
          
          <div style={{ fontSize: '3rem', margin: '2rem 0', animation: 'bounce 2s infinite' }}>
            💰
          </div>

          <div style={{
            background: '#e2e8f0',
            height: '12px',
            borderRadius: '6px',
            margin: '2rem 0 1rem 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #10b981, #059669)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 1s ease',
              width: `${progress}%`,
              position: 'relative'
            }}></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '2rem' }}>
            <span>£0</span>
            <span>£100</span>
            <span>£175</span>
            <span>£200+</span>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '2rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#10b981',
                borderRadius: '50%',
                marginRight: '0.5rem',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ color: '#10b981', fontWeight: '600' }}>Claude AI Monitoring Active</span>
            </div>
            <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>
              Vouchers are automatically detected from verified partner feeds and Claude AI research
            </p>
          </div>

          <button
            onClick={shareVoucherPot}
            style={{
              background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              margin: '2rem 0',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🚀</span>
            Share My Voucher Pot
          </button>

          <div style={{ marginTop: '2rem', maxHeight: '400px', overflowY: 'auto' }}>
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                style={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '700', color: '#1e40af', fontSize: '1.1rem' }}>
                    {voucher.provider}
                  </div>
                  <div style={{ fontWeight: '800', color: '#10b981', fontSize: '1.2rem' }}>
                    £{voucher.value.toFixed(2)}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  display: 'inline-block'
                }}>
                  {voucher.discount}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  {voucher.terms}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>Added: {voucher.dateAdded} at {voucher.timeAdded}</span>
                  <span>Via: {voucher.detectedBy}</span>
                  {voucher.link && (
                    <a
                      href={voucher.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#1e40af',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Visit Store
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {onBackToDemo && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={onBackToDemo}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Back to Navigation
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes voucherDetected {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          }
          @keyframes popupAppear {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `
      }} />
    </div>
  );
};

export default ProductionVoucherPot;