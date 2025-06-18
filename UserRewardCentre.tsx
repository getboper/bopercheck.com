import React, { useState, useEffect } from 'react'

interface RewardActivity {
  id: string
  type: 'voucher' | 'milestone' | 'referral' | 'download' | 'freebie' | 'streak'
  title: string
  description: string
  value: number
  timestamp: Date
  status: 'pending' | 'completed' | 'expired'
  category: string
}

interface RewardSummary {
  totalEarned: number
  totalPending: number
  totalVouchers: number
  currentStreak: number
  completedMilestones: number
  referralCount: number
  availableFreebies: number
  monthlyEarnings: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  target: number
  isUnlocked: boolean
  rewardValue: number
  category: string
}

const UserRewardCentre: React.FC = () => {
  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(null)
  const [recentActivity, setRecentActivity] = useState<RewardActivity[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    loadRewardData()
  }, [])

  const loadRewardData = async () => {
    try {
      // Load reward summary
      const summary: RewardSummary = {
        totalEarned: 127.50,
        totalPending: 23.75,
        totalVouchers: 8,
        currentStreak: 12,
        completedMilestones: 5,
        referralCount: 3,
        availableFreebies: 6,
        monthlyEarnings: 89.25
      }
      setRewardSummary(summary)

      // Load recent activity
      const activities: RewardActivity[] = [
        {
          id: 'act1',
          type: 'milestone',
          title: 'Savings Champion',
          description: 'Reached £100 total savings milestone',
          value: 15,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'completed',
          category: 'milestone'
        },
        {
          id: 'act2',
          type: 'voucher',
          title: 'Amazon Voucher Earned',
          description: 'Claimed £10 Amazon voucher from search activity',
          value: 10,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          status: 'completed',
          category: 'voucher'
        },
        {
          id: 'act3',
          type: 'referral',
          title: 'Friend Referral Bonus',
          description: 'Your friend Sarah completed registration',
          value: 5,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          status: 'pending',
          category: 'referral'
        },
        {
          id: 'act4',
          type: 'streak',
          title: '7-Day Streak Bonus',
          description: 'Maintained daily activity for one week',
          value: 7,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed',
          category: 'streak'
        },
        {
          id: 'act5',
          type: 'freebie',
          title: 'Daily Check-in Reward',
          description: 'Visited BoperCheck today',
          value: 1,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'completed',
          category: 'freebie'
        }
      ]
      setRecentActivity(activities)

      // Load achievements
      const achievementsList: Achievement[] = [
        {
          id: 'ach1',
          title: 'First Steps',
          description: 'Complete your first product search',
          icon: '🚀',
          progress: 1,
          target: 1,
          isUnlocked: true,
          rewardValue: 2,
          category: 'beginner'
        },
        {
          id: 'ach2',
          title: 'Search Master',
          description: 'Complete 50 product searches',
          icon: '🔍',
          progress: 37,
          target: 50,
          isUnlocked: false,
          rewardValue: 10,
          category: 'activity'
        },
        {
          id: 'ach3',
          title: 'Savings Guru',
          description: 'Save £200 through BoperCheck',
          icon: '💰',
          progress: 127.50,
          target: 200,
          isUnlocked: false,
          rewardValue: 25,
          category: 'savings'
        },
        {
          id: 'ach4',
          title: 'Social Butterfly',
          description: 'Refer 5 friends to BoperCheck',
          icon: '🦋',
          progress: 3,
          target: 5,
          isUnlocked: false,
          rewardValue: 50,
          category: 'social'
        },
        {
          id: 'ach5',
          title: 'Streak Legend',
          description: 'Maintain a 30-day activity streak',
          icon: '🔥',
          progress: 12,
          target: 30,
          isUnlocked: false,
          rewardValue: 75,
          category: 'engagement'
        }
      ]
      setAchievements(achievementsList)

    } catch (error) {
      console.error('Failed to load reward data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'voucher': return '🎫'
      case 'milestone': return '🏆'
      case 'referral': return '👥'
      case 'download': return '📥'
      case 'freebie': return '🎁'
      case 'streak': return '🔥'
      default: return '⭐'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#d1fae5', color: '#059669' }
      case 'pending': return { bg: '#fef3c7', color: '#d97706' }
      case 'expired': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Loading your reward centre...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Your Reward Centre 🏆
        </h2>
        <p className="text-gray-600">
          Track your earnings, achievements, and reward activity
        </p>
      </div>

      {/* Summary Stats */}
      {rewardSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-100 text-sm">Total Earned</div>
                <div className="text-3xl font-bold">£{rewardSummary.totalEarned.toFixed(2)}</div>
                <div className="text-green-100 text-sm">+£{rewardSummary.monthlyEarnings.toFixed(2)} this month</div>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm">Active Vouchers</div>
                <div className="text-3xl font-bold">{rewardSummary.totalVouchers}</div>
                <div className="text-blue-100 text-sm">£{rewardSummary.totalPending.toFixed(2)} pending</div>
              </div>
              <div className="text-4xl opacity-80">🎫</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm">Current Streak</div>
                <div className="text-3xl font-bold">{rewardSummary.currentStreak}</div>
                <div className="text-purple-100 text-sm">days active</div>
              </div>
              <div className="text-4xl opacity-80">🔥</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-100 text-sm">Achievements</div>
                <div className="text-3xl font-bold">{rewardSummary.completedMilestones}</div>
                <div className="text-orange-100 text-sm">{rewardSummary.availableFreebies} freebies available</div>
              </div>
              <div className="text-4xl opacity-80">🏆</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'activity', label: 'Recent Activity', icon: '📈' },
          { id: 'achievements', label: 'Achievements', icon: '🏆' },
          { id: 'vouchers', label: 'My Vouchers', icon: '🎫' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="text-2xl">🎁</div>
                <div className="text-left">
                  <div className="font-medium">Claim Daily Freebie</div>
                  <div className="text-sm text-gray-600">Earn £1 for today's visit</div>
                </div>
                <div className="ml-auto text-blue-600 font-bold">+£1</div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="text-2xl">👥</div>
                <div className="text-left">
                  <div className="font-medium">Invite Friends</div>
                  <div className="text-sm text-gray-600">Get £5 for each referral</div>
                </div>
                <div className="ml-auto text-green-600 font-bold">+£5</div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="text-2xl">🔍</div>
                <div className="text-left">
                  <div className="font-medium">Start Searching</div>
                  <div className="text-sm text-gray-600">Earn rewards for searches</div>
                </div>
                <div className="ml-auto text-purple-600 font-bold">+£2</div>
              </button>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
              Next Milestone
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Savings Master</div>
                  <div className="text-sm text-gray-600">Save £200 total</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">£25 reward</div>
                  <div className="text-sm text-gray-600">£72.50 to go</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: '63.75%' }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-600">
                63.75% complete
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'activity' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: "#0f172a" }}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map(activity => {
              const statusStyle = getStatusColor(activity.status)
              
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: "#0f172a" }}>
                      {activity.title}
                    </div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                      £{activity.value.toFixed(2)}
                    </div>
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}
                    >
                      {activity.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                achievement.isUnlocked 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="text-center mb-4">
                <div className={`text-4xl mb-2 ${achievement.isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <h4 className="font-bold text-lg" style={{ color: "#0f172a" }}>
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.isUnlocked ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                {achievement.isUnlocked ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                    ✅ Unlocked - £{achievement.rewardValue} Earned
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                    🎁 £{achievement.rewardValue} Reward
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'vouchers' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: "#0f172a" }}>
            Active Vouchers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock voucher data */}
            {[
              { brand: 'Amazon', value: 10, code: 'AMZ10-XXXX', expires: '2024-07-15' },
              { brand: 'Tesco', value: 5, code: 'TSC5-YYYY', expires: '2024-06-30' },
              { brand: 'ASOS', value: 15, code: 'ASO15-ZZZZ', expires: '2024-08-01' }
            ].map((voucher, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">{voucher.brand}</h4>
                  <div className="text-xl font-bold text-green-600">£{voucher.value}</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Code: {voucher.code}
                </div>
                <div className="text-xs text-gray-500">
                  Expires: {voucher.expires}
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Use Voucher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRewardCentre