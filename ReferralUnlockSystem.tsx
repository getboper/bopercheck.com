import React, { useState, useEffect } from 'react'

interface ReferralReward {
  id: string
  title: string
  description: string
  requiredReferrals: number
  rewardValue: number
  rewardType: 'credits' | 'voucher' | 'content' | 'feature'
  isUnlocked: boolean
  progress: number
}

interface Referral {
  id: string
  referrerEmail: string
  referredEmail: string
  status: 'pending' | 'completed' | 'credited'
  signupDate: Date
  creditedDate?: Date
  rewardAmount: number
}

interface ReferralUnlockSystemProps {
  userId: string
  userEmail: string
  onRewardUnlocked?: (reward: ReferralReward) => void
}

const ReferralUnlockSystem: React.FC<ReferralUnlockSystemProps> = ({
  userId,
  userEmail,
  onRewardUnlocked
}) => {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [rewards, setRewards] = useState<ReferralReward[]>([])
  const [shareLink, setShareLink] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    generateReferralCode()
    loadReferralData()
    loadReferralRewards()
  }, [userId])

  useEffect(() => {
    updateRewardProgress()
  }, [referrals, rewards])

  const generateReferralCode = () => {
    const code = `BOPER${userId.slice(-4).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    setReferralCode(code)
    
    const baseUrl = window.location.origin
    const link = `${baseUrl}/?ref=${code}`
    setShareLink(link)
    
    setShareMessage(
      `🎁 Join me on BoperCheck and start saving money! Use my referral code ${code} to get a £5 welcome bonus. ${link}`
    )
  }

  const loadReferralData = async () => {
    try {
      // Mock referral data - replace with API call
      const mockReferrals: Referral[] = [
        {
          id: 'ref1',
          referrerEmail: userEmail,
          referredEmail: 'friend1@example.com',
          status: 'completed',
          signupDate: new Date('2024-06-01'),
          creditedDate: new Date('2024-06-01'),
          rewardAmount: 5
        },
        {
          id: 'ref2',
          referrerEmail: userEmail,
          referredEmail: 'friend2@example.com',
          status: 'completed',
          signupDate: new Date('2024-06-05'),
          creditedDate: new Date('2024-06-05'),
          rewardAmount: 5
        },
        {
          id: 'ref3',
          referrerEmail: userEmail,
          referredEmail: 'friend3@example.com',
          status: 'pending',
          signupDate: new Date('2024-06-10'),
          rewardAmount: 5
        }
      ]
      
      setReferrals(mockReferrals)
      
      const earnings = mockReferrals
        .filter(ref => ref.status === 'completed')
        .reduce((sum, ref) => sum + ref.rewardAmount, 0)
      setTotalEarnings(earnings)
      
    } catch (error) {
      console.error('Failed to load referral data:', error)
    }
  }

  const loadReferralRewards = () => {
    const mockRewards: ReferralReward[] = [
      {
        id: 'reward1',
        title: 'First Friend Bonus',
        description: 'Unlock £10 bonus credits for your first referral',
        requiredReferrals: 1,
        rewardValue: 10,
        rewardType: 'credits',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'reward2',
        title: 'Social Butterfly',
        description: 'Premium voucher wallet features unlocked',
        requiredReferrals: 3,
        rewardValue: 25,
        rewardType: 'feature',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'reward3',
        title: 'Ambassador Status',
        description: 'Exclusive content library access',
        requiredReferrals: 5,
        rewardValue: 50,
        rewardType: 'content',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'reward4',
        title: 'Super Referrer',
        description: '£100 Amazon voucher reward',
        requiredReferrals: 10,
        rewardValue: 100,
        rewardType: 'voucher',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'reward5',
        title: 'Master Networker',
        description: 'Lifetime premium membership',
        requiredReferrals: 20,
        rewardValue: 500,
        rewardType: 'feature',
        isUnlocked: false,
        progress: 0
      }
    ]
    
    setRewards(mockRewards)
  }

  const updateRewardProgress = () => {
    const completedReferrals = referrals.filter(ref => ref.status === 'completed').length
    
    setRewards(prev => prev.map(reward => {
      const progress = Math.min(completedReferrals / reward.requiredReferrals, 1)
      const isUnlocked = completedReferrals >= reward.requiredReferrals && !reward.isUnlocked
      
      if (isUnlocked) {
        onRewardUnlocked?.(reward)
      }
      
      return {
        ...reward,
        progress: progress,
        isUnlocked: completedReferrals >= reward.requiredReferrals
      }
    }))
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join me on BoperCheck - Get £5 Welcome Bonus!')
    const body = encodeURIComponent(shareMessage)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(shareMessage)
    window.open(`sms:?body=${message}`)
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(shareMessage)
    window.open(`https://wa.me/?text=${message}`)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent('Join me on BoperCheck and start saving money! 💰')
    const url = encodeURIComponent(shareLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
  }

  const shareViaFacebook = () => {
    const url = encodeURIComponent(shareLink)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      alert('Referral link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'credits': return '💰'
      case 'voucher': return '🎫'
      case 'content': return '📚'
      case 'feature': return '⭐'
      default: return '🎁'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: '#059669', bg: '#d1fae5' }
      case 'pending':
        return { text: 'Pending', color: '#d97706', bg: '#fef3c7' }
      default:
        return { text: 'Unknown', color: '#6b7280', bg: '#f3f4f6' }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Referral Unlock System
        </h2>
        <p className="text-gray-600">
          Invite friends and unlock exclusive rewards and features
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold">{referrals.length}</div>
            <div className="text-blue-100">Total Invites</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">
              {referrals.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-green-100">Successful</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">£{totalEarnings}</div>
            <div className="text-purple-100">Total Earned</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold">
              {rewards.filter(r => r.isUnlocked).length}
            </div>
            <div className="text-orange-100">Rewards Unlocked</div>
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Your Referral Code
        </h3>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{referralCode}</div>
            <div className="text-sm text-gray-600 mb-4">Share this code with friends</div>
            <div className="bg-white p-3 rounded border text-sm font-mono break-all">
              {shareLink}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={copyReferralLink}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Copy Referral Link
          </button>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Share with Friends
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={shareViaEmail}
            className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm">Email</div>
          </button>
          
          <button
            onClick={shareViaSMS}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm">SMS</div>
          </button>
          
          <button
            onClick={shareViaWhatsApp}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm">WhatsApp</div>
          </button>
          
          <button
            onClick={shareViaTwitter}
            className="bg-blue-400 text-white p-4 rounded-lg hover:bg-blue-500 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🐦</div>
            <div className="text-sm">Twitter</div>
          </button>
          
          <button
            onClick={shareViaFacebook}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📘</div>
            <div className="text-sm">Facebook</div>
          </button>
        </div>
      </div>

      {/* Referral Rewards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Referral Rewards
        </h3>
        
        <div className="space-y-4">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className={`p-4 rounded-lg border-2 ${
                reward.isUnlocked 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getRewardIcon(reward.rewardType)}</div>
                  <div>
                    <h4 className="font-bold" style={{ color: "#0f172a" }}>
                      {reward.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{reward.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {reward.isUnlocked ? (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✅ Unlocked
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {Math.floor(reward.progress * reward.requiredReferrals)}/{reward.requiredReferrals} referrals
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    reward.isUnlocked ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${reward.progress * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Referral History
        </h3>
        
        <div className="space-y-3">
          {referrals.map(referral => {
            const badge = getStatusBadge(referral.status)
            
            return (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-xl">👤</div>
                  <div>
                    <div className="font-medium" style={{ color: "#0f172a" }}>
                      {referral.referredEmail}
                    </div>
                    <div className="text-sm text-gray-600">
                      Invited on {referral.signupDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: badge.bg,
                      color: badge.color
                    }}
                  >
                    {badge.text}
                  </div>
                  {referral.status === 'completed' && (
                    <div className="text-green-600 font-bold text-sm mt-1">
                      +£{referral.rewardAmount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <h4 className="text-lg font-bold mb-2" style={{ color: "#0f172a" }}>
              No referrals yet
            </h4>
            <p className="text-gray-600">
              Start inviting friends to earn rewards and unlock exclusive features!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralUnlockSystem