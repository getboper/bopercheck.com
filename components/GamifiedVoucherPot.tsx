import { useState, useEffect } from 'react';
import { Gift, TrendingUp, Star, Crown, Zap, DollarSign } from 'lucide-react';

interface VoucherMilestone {
  amount: number;
  bonus: number;
  title: string;
  icon: string;
}

export default function GamifiedVoucherPot() {
  const [total, setTotal] = useState(0);
  const [milestoneMessage, setMilestoneMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const milestones: VoucherMilestone[] = [
    { amount: 50, bonus: 10, title: 'First Milestone', icon: '🎯' },
    { amount: 100, bonus: 25, title: 'Century Club', icon: '💯' },
    { amount: 175, bonus: 25, title: 'Super Saver', icon: '⭐' },
    { amount: 250, bonus: 50, title: 'Voucher Master', icon: '👑' },
    { amount: 500, bonus: 100, title: 'Ultimate Collector', icon: '🏆' }
  ];

  useEffect(() => {
    const loadVoucherData = async () => {
      try {
        const response = await fetch('/api/user/voucher-pot-data');
        if (response.ok) {
          const data = await response.json();
          setTotal(data.totalAmount || 0);
          setStreak(data.streak || 0);
          setMultiplier(data.multiplier || 1);
        }
      } catch (error) {
        console.error('Error loading voucher data:', error);
      }
    };
    
    loadVoucherData();
  }, []);

  const addVoucher = async () => {
    const baseAmount = Math.floor(Math.random() * 10) + 1;
    const amount = baseAmount * multiplier;
    const newTotal = total + amount;
    
    setTotal(newTotal);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);

    // Check for milestones
    const milestone = milestones.find(m => total < m.amount && newTotal >= m.amount);
    if (milestone) {
      const bonusTotal = newTotal + milestone.bonus;
      setTotal(bonusTotal);
      setMilestoneMessage(`${milestone.icon} ${milestone.title} Achieved! £${milestone.bonus} Bonus Added! Pot now at £${bonusTotal.toFixed(2)}!`);
      setStreak(streak + 1);
      
      // Track milestone achievement
      await fetch('/api/track-voucher-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestone: milestone.title,
          amount: bonusTotal,
          bonus: milestone.bonus
        })
      });
    } else {
      const nextMilestone = Math.floor(newTotal / 10) * 10;
      if (newTotal % 10 < amount) {
        setMilestoneMessage(`You've reached £${nextMilestone} — keep going!`);
      } else {
        setMilestoneMessage('');
      }
    }

    // Update multiplier based on streak
    if (streak > 0 && streak % 5 === 0) {
      setMultiplier(Math.min(multiplier + 0.1, 2.0));
    }
  };

  const nextMilestone = milestones.find(m => m.amount > total);
  const progress = nextMilestone ? (total / nextMilestone.amount) * 100 : 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            margin: '0 0 1rem 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Voucher Pot 💰
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            Collect vouchers and unlock amazing bonuses!
          </p>
        </div>

        {/* Main Pot Display */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: showAnimation ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '900',
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            color: '#ffd700'
          }}>
            £{total.toFixed(2)}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#ffd700' }} />
              <span style={{ fontSize: '1rem', opacity: 0.9 }}>
                {streak} streak
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#ffd700' }} />
              <span style={{ fontSize: '1rem', opacity: 0.9 }}>
                {multiplier.toFixed(1)}x multiplier
              </span>
            </div>
          </div>

          <button
            onClick={addVoucher}
            style={{
              background: 'linear-gradient(135deg, #ffd700, #ffed4a)',
              color: '#1a202c',
              border: 'none',
              borderRadius: '16px',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
              boxShadow: '0 8px 20px rgba(255,215,0,0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Gift style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem', display: 'inline' }} />
            Collect Voucher
          </button>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', opacity: 0.9 }}>
                Next Milestone: {nextMilestone.title}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                £{total.toFixed(2)} / £{nextMilestone.amount}
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(progress, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ffd700, #ffed4a)',
                borderRadius: '6px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}

        {/* Milestone Message */}
        {milestoneMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            animation: 'pulse 2s infinite'
          }}>
            {milestoneMessage}
          </div>
        )}

        {/* Milestones Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {milestones.map((milestone, index) => {
            const isAchieved = total >= milestone.amount;
            const isCurrent = nextMilestone?.amount === milestone.amount;
            
            return (
              <div
                key={index}
                style={{
                  background: isAchieved 
                    ? 'linear-gradient(135deg, #ffd700, #ffed4a)' 
                    : 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  border: isCurrent ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                  color: isAchieved ? '#1a202c' : 'white'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {milestone.icon}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {milestone.title}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  £{milestone.amount} (+£{milestone.bonus})
                </div>
              </div>
            );
          })}
        </div>

        {/* Stripe Cash Out CTA */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Ready to Cash Out?
          </h3>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            Convert your voucher pot to real money via Stripe. Minimum £50 required.
          </p>
          <button
            disabled={total < 50}
            style={{
              background: total >= 50 
                ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: total >= 50 ? 'pointer' : 'not-allowed',
              opacity: total >= 50 ? 1 : 0.6,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
            Cash Out £{total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}