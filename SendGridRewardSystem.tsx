import React, { useState, useEffect } from 'react'

interface RewardNotification {
  id: string
  type: 'milestone' | 'voucher' | 'referral' | 'download' | 'streak'
  title: string
  description: string
  value: number
  timestamp: Date
  emailSent: boolean
  userId: string
}

interface SendGridRewardSystemProps {
  userId: string
  userEmail: string
  onRewardTriggered?: (reward: RewardNotification) => void
}

const SendGridRewardSystem: React.FC<SendGridRewardSystemProps> = ({
  userId,
  userEmail,
  onRewardTriggered
}) => {
  const [pendingRewards, setPendingRewards] = useState<RewardNotification[]>([])
  const [sentRewards, setSentRewards] = useState<RewardNotification[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadPendingRewards()
    startRewardProcessor()
  }, [userId])

  const loadPendingRewards = async () => {
    try {
      // Load rewards that haven't been emailed yet
      const mockPendingRewards: RewardNotification[] = [
        {
          id: 'reward_1',
          type: 'milestone',
          title: 'Milestone Achievement',
          description: 'Congratulations! You reached £50 in savings',
          value: 50,
          timestamp: new Date(),
          emailSent: false,
          userId: userId
        },
        {
          id: 'reward_2',
          type: 'voucher',
          title: 'New Voucher Earned',
          description: 'You earned a £10 Amazon voucher',
          value: 10,
          timestamp: new Date(Date.now() - 30000),
          emailSent: false,
          userId: userId
        }
      ]
      
      setPendingRewards(mockPendingRewards)
    } catch (error) {
      console.error('Failed to load pending rewards:', error)
    }
  }

  const startRewardProcessor = () => {
    // Process pending rewards every 30 seconds
    setInterval(async () => {
      if (pendingRewards.length > 0 && !isProcessing) {
        await processPendingRewards()
      }
    }, 30000)
  }

  const processPendingRewards = async () => {
    setIsProcessing(true)
    
    try {
      for (const reward of pendingRewards) {
        if (!reward.emailSent) {
          const success = await sendRewardEmail(reward)
          
          if (success) {
            // Mark as sent and move to sent rewards
            const updatedReward = { ...reward, emailSent: true }
            setSentRewards(prev => [...prev, updatedReward])
            setPendingRewards(prev => prev.filter(r => r.id !== reward.id))
            onRewardTriggered?.(updatedReward)
          }
        }
      }
    } catch (error) {
      console.error('Error processing rewards:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendRewardEmail = async (reward: RewardNotification): Promise<boolean> => {
    try {
      const emailData = {
        to: userEmail,
        templateId: getTemplateId(reward.type),
        dynamicTemplateData: {
          userName: userEmail.split('@')[0],
          rewardTitle: reward.title,
          rewardDescription: reward.description,
          rewardValue: reward.value,
          rewardType: reward.type,
          timestamp: reward.timestamp.toLocaleDateString(),
          platformUrl: window.location.origin,
          unsubscribeUrl: `${window.location.origin}/unsubscribe?email=${encodeURIComponent(userEmail)}`
        }
      }

      const response = await fetch('/api/sendgrid/reward-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (response.ok) {
        console.log(`Reward email sent successfully for ${reward.type}:`, reward.title)
        return true
      } else {
        throw new Error(`Failed to send reward email: ${response.statusText}`)
      }
    } catch (error) {
      console.error('SendGrid reward email error:', error)
      return false
    }
  }

  const getTemplateId = (rewardType: string): string => {
    // SendGrid template IDs for different reward types
    const templates = {
      milestone: 'd-milestone-achievement-template',
      voucher: 'd-voucher-earned-template',
      referral: 'd-referral-bonus-template',
      download: 'd-download-unlock-template',
      streak: 'd-streak-bonus-template'
    }
    
    return templates[rewardType as keyof typeof templates] || 'd-generic-reward-template'
  }

  const triggerManualReward = async (type: string, value: number, description: string) => {
    const newReward: RewardNotification = {
      id: `reward_${Date.now()}`,
      type: type as any,
      title: getRewardTitle(type),
      description: description,
      value: value,
      timestamp: new Date(),
      emailSent: false,
      userId: userId
    }

    setPendingRewards(prev => [...prev, newReward])
  }

  const getRewardTitle = (type: string): string => {
    const titles = {
      milestone: 'Milestone Achievement',
      voucher: 'New Voucher Earned',
      referral: 'Referral Bonus',
      download: 'Content Unlocked',
      streak: 'Streak Bonus'
    }
    
    return titles[type as keyof typeof titles] || 'Reward Earned'
  }

  const getRewardIcon = (type: string): string => {
    const icons = {
      milestone: '🏆',
      voucher: '🎫',
      referral: '🤝',
      download: '📥',
      streak: '🔥'
    }
    
    return icons[type as keyof typeof icons] || '🎁'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
          SendGrid Reward System
        </h2>
        <p className="text-gray-600">
          Automated reward notifications and user engagement emails
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Pending Rewards</p>
              <p className="text-2xl font-bold text-blue-800">
                {pendingRewards.length}
              </p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium">Emails Sent</p>
              <p className="text-2xl font-bold text-green-800">
                {sentRewards.length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Processing</p>
              <p className="text-2xl font-bold text-purple-800">
                {isProcessing ? 'Active' : 'Idle'}
              </p>
            </div>
            <div className="text-3xl">{isProcessing ? '🔄' : '💤'}</div>
          </div>
        </div>
      </div>

      {/* Pending Rewards */}
      {pendingRewards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
            Pending Reward Emails
          </h3>
          <div className="space-y-4">
            {pendingRewards.map(reward => (
              <div key={reward.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getRewardIcon(reward.type)}</div>
                    <div>
                      <h4 className="font-bold" style={{ color: "#0f172a" }}>
                        {reward.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {reward.type === 'milestone' ? `£${reward.value}` : `+£${reward.value}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {reward.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sent Rewards */}
      {sentRewards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
            Recently Sent Emails
          </h3>
          <div className="space-y-4">
            {sentRewards.slice(-5).map(reward => (
              <div key={reward.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getRewardIcon(reward.type)}</div>
                    <div>
                      <h4 className="font-bold" style={{ color: "#0f172a" }}>
                        {reward.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Email sent to {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium text-sm">
                      ✅ Delivered
                    </p>
                    <p className="text-xs text-gray-500">
                      {reward.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Trigger Controls */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Manual Reward Triggers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => triggerManualReward('milestone', 25, 'You reached £25 in savings!')}
            className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
          >
            🏆 Milestone
          </button>
          
          <button
            onClick={() => triggerManualReward('voucher', 5, 'You earned a £5 voucher!')}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🎫 Voucher
          </button>
          
          <button
            onClick={() => triggerManualReward('referral', 10, 'Your friend signed up!')}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            🤝 Referral
          </button>
          
          <button
            onClick={() => triggerManualReward('download', 3, 'Content unlocked successfully!')}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            📥 Download
          </button>
          
          <button
            onClick={() => triggerManualReward('streak', 2, '7-day streak bonus!')}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            🔥 Streak
          </button>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-blue-800 font-medium">
            SendGrid Integration Active
          </p>
        </div>
        <p className="text-blue-600 text-sm">
          Automated reward emails configured for: {userEmail}
        </p>
        <p className="text-blue-600 text-sm">
          Processing interval: 30 seconds | Templates: 5 configured
        </p>
      </div>
    </div>
  )
}

export default SendGridRewardSystem