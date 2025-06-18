import { useState } from 'react';
import { Video, Users, Share2, Gift, Upload, Copy, Trophy, Star } from 'lucide-react';

export default function RewardCentre() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [referralCode] = useState('BOPER-1234');
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideo = async () => {
    if (!videoFile) return;
    
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('video', videoFile);
    
    try {
      const response = await fetch('/api/rewards/upload-video', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Video uploaded successfully! Your reward has been added to your account.');
        setVideoFile(null);
      }
    } catch (error) {
      console.error('Video upload error:', error);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const claimSocialReward = async () => {
    try {
      const response = await fetch('/api/rewards/claim-social', {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Social sharing reward claimed! Check your voucher pot.');
      }
    } catch (error) {
      console.error('Social reward error:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Trophy style={{ width: '4rem', height: '4rem', color: '#f59e0b', margin: '0 auto 1rem' }} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#92400e',
            margin: '0 0 1rem 0'
          }}>
            Reward Centre
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
            Unlock bonus vouchers and perks by engaging with BoperCheck
          </p>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Video Review Upload */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Video style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                  Upload a Video Review
                </h2>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Send us a short video of your experience and get a FREE download credit + exclusive voucher
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                style={{
                  padding: '1rem',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '12px',
                  background: '#f9fafb'
                }}
              />
              
              {videoFile && (
                <div style={{
                  background: '#ecfdf5',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #10b981'
                }}>
                  <p style={{ margin: 0, color: '#065f46', fontWeight: '600' }}>
                    Selected: {videoFile.name}
                  </p>
                </div>
              )}
              
              <button
                onClick={uploadVideo}
                disabled={!videoFile}
                style={{
                  background: videoFile ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: videoFile ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Upload style={{ width: '1.25rem', height: '1.25rem' }} />
                Upload Video Review
              </button>
            </div>
          </div>

          {/* Referral System */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Users style={{ width: '2rem', height: '2rem', color: '#7c3aed' }} />
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                  Refer a Friend
                </h2>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Share your referral code and get bonus vouchers when friends sign up
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                value={referralCode}
                readOnly
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: '#f9fafb',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#7c3aed'
                }}
              />
              <button
                onClick={copyReferralCode}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6b21a8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Copy style={{ width: '1.25rem', height: '1.25rem' }} />
                Copy
              </button>
            </div>

            <div style={{
              background: '#fef3c7',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              border: '1px solid #f59e0b'
            }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>
                <Star style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                Earn £5 bonus vouchers for each successful referral!
              </p>
            </div>
          </div>

          {/* Social Sharing */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Share2 style={{ width: '2rem', height: '2rem', color: '#10b981' }} />
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                  Share BoperCheck
                </h2>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Post us on social media to earn weekly streak bonuses and surprise rewards
                </p>
              </div>
            </div>

            <button
              onClick={claimSocialReward}
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
                gap: '0.5rem',
                width: '100%'
              }}
            >
              <Gift style={{ width: '1.25rem', height: '1.25rem' }} />
              Claim Sharing Reward
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>£2.50</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Per Share</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>£10</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Weekly Streak</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dc2626' }}>£25</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monthly Bonus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}