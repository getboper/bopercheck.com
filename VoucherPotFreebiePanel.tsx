import React, { useState, useEffect } from 'react'

interface FreebieOffer {
  id: string
  title: string
  description: string
  value: number
  provider: string
  category: string
  expiryDate: Date
  claimCount: number
  maxClaims: number
  requirements: string[]
  imageUrl?: string
  isLimited: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

interface UserProgress {
  totalClaimed: number
  totalValue: number
  completedRequirements: string[]
  availableOffers: number
  streak: number
  lastClaimDate?: Date
}

const VoucherPotFreebiePanel: React.FC = () => {
  const [freebieOffers, setFreebieOffers] = useState<FreebieOffer[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showClaimedOnly, setShowClaimedOnly] = useState(false)

  useEffect(() => {
    loadFreebieOffers()
    loadUserProgress()
  }, [])

  const loadFreebieOffers = async () => {
    try {
      // Mock freebie offers data - replace with API call
      const mockOffers: FreebieOffer[] = [
        {
          id: 'freebie1',
          title: 'Daily Check-in Bonus',
          description: 'Get £1 credit just for visiting BoperCheck today',
          value: 1,
          provider: 'BoperCheck',
          category: 'daily',
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          claimCount: 1247,
          maxClaims: -1, // Unlimited
          requirements: ['Visit the platform'],
          isLimited: false,
          difficulty: 'easy'
        },
        {
          id: 'freebie2',
          title: 'Email Verification Reward',
          description: 'Verify your email address and unlock £5 bonus',
          value: 5,
          provider: 'BoperCheck',
          category: 'verification',
          expiryDate: new Date('2024-12-31'),
          claimCount: 892,
          maxClaims: -1,
          requirements: ['Verify email address'],
          isLimited: false,
          difficulty: 'easy'
        },
        {
          id: 'freebie3',
          title: 'First Search Reward',
          description: 'Complete your first product search and earn £2',
          value: 2,
          provider: 'BoperCheck',
          category: 'search',
          expiryDate: new Date('2024-12-31'),
          claimCount: 567,
          maxClaims: -1,
          requirements: ['Complete first search'],
          isLimited: false,
          difficulty: 'easy'
        },
        {
          id: 'freebie4',
          title: 'Social Media Share',
          description: 'Share BoperCheck on social media for £3 bonus',
          value: 3,
          provider: 'BoperCheck',
          category: 'social',
          expiryDate: new Date('2024-12-31'),
          claimCount: 234,
          maxClaims: -1,
          requirements: ['Share on Facebook, Twitter, or LinkedIn'],
          isLimited: false,
          difficulty: 'medium'
        },
        {
          id: 'freebie5',
          title: 'Weekend Special Offer',
          description: 'Limited weekend offer - earn £10 for completing 5 searches',
          value: 10,
          provider: 'BoperCheck',
          category: 'weekend',
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
          claimCount: 89,
          maxClaims: 500,
          requirements: ['Complete 5 searches this weekend'],
          isLimited: true,
          difficulty: 'medium'
        },
        {
          id: 'freebie6',
          title: 'Review Writing Bonus',
          description: 'Write a detailed review of a product and earn £7',
          value: 7,
          provider: 'BoperCheck',
          category: 'content',
          expiryDate: new Date('2024-12-31'),
          claimCount: 156,
          maxClaims: -1,
          requirements: ['Write product review (min 100 words)', 'Include photos'],
          isLimited: false,
          difficulty: 'hard'
        },
        {
          id: 'freebie7',
          title: 'Friend Referral Mega Bonus',
          description: 'Refer 3 friends and unlock exclusive £25 reward',
          value: 25,
          provider: 'BoperCheck',
          category: 'referral',
          expiryDate: new Date('2024-12-31'),
          claimCount: 43,
          maxClaims: -1,
          requirements: ['Refer 3 friends who complete registration'],
          isLimited: false,
          difficulty: 'hard'
        },
        {
          id: 'freebie8',
          title: 'Business Directory Listing',
          description: 'Add your business to our directory for £15 credit',
          value: 15,
          provider: 'BoperCheck',
          category: 'business',
          expiryDate: new Date('2024-12-31'),
          claimCount: 78,
          maxClaims: -1,
          requirements: ['Valid business registration', 'Complete business profile'],
          isLimited: false,
          difficulty: 'medium'
        }
      ]
      
      setFreebieOffers(mockOffers)
    } catch (error) {
      console.error('Failed to load freebie offers:', error)
    }
  }

  const loadUserProgress = async () => {
    try {
      const mockProgress: UserProgress = {
        totalClaimed: 3,
        totalValue: 8,
        completedRequirements: ['Visit the platform', 'Verify email address', 'Complete first search'],
        availableOffers: 5,
        streak: 2,
        lastClaimDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }
      
      setUserProgress(mockProgress)
    } catch (error) {
      console.error('Failed to load user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimFreebie = async (freebieId: string) => {
    try {
      const offer = freebieOffers.find(f => f.id === freebieId)
      if (!offer) return

      // Check if requirements are met
      const unmetRequirements = offer.requirements.filter(req => 
        !userProgress?.completedRequirements.includes(req)
      )

      if (unmetRequirements.length > 0) {
        alert(`Please complete these requirements first:\n${unmetRequirements.join('\n')}`)
        return
      }

      // Update user progress
      if (userProgress) {
        setUserProgress(prev => ({
          ...prev!,
          totalClaimed: prev!.totalClaimed + 1,
          totalValue: prev!.totalValue + offer.value,
          lastClaimDate: new Date(),
          streak: prev!.streak + 1
        }))
      }

      // Update offer claim count
      setFreebieOffers(prev => prev.map(f => 
        f.id === freebieId 
          ? { ...f, claimCount: f.claimCount + 1 }
          : f
      ))

      alert(`Congratulations! You've claimed £${offer.value} from "${offer.title}"`)
      
    } catch (error) {
      console.error('Failed to claim freebie:', error)
      alert('Failed to claim offer. Please try again.')
    }
  }

  const filteredOffers = freebieOffers.filter(offer => {
    if (selectedCategory !== 'all' && offer.category !== selectedCategory) {
      return false
    }
    
    if (showClaimedOnly) {
      return userProgress?.completedRequirements.some(req => 
        offer.requirements.includes(req)
      )
    }
    
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return { bg: '#d1fae5', color: '#059669' }
      case 'medium': return { bg: '#fef3c7', color: '#d97706' }
      case 'hard': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  const categories = ['all', 'daily', 'verification', 'search', 'social', 'weekend', 'content', 'referral', 'business']

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Loading freebie offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Freebie Pot Panel 🎁
        </h2>
        <p className="text-gray-600">
          Complete simple tasks and claim free rewards to boost your savings
        </p>
      </div>

      {/* User Progress Stats */}
      {userProgress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold">{userProgress.totalClaimed}</div>
              <div className="text-green-100">Freebies Claimed</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold">£{userProgress.totalValue}</div>
              <div className="text-blue-100">Total Earned</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold">{userProgress.streak}</div>
              <div className="text-purple-100">Current Streak</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold">{userProgress.availableOffers}</div>
              <div className="text-orange-100">Available Offers</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showClaimedOnly}
            onChange={(e) => setShowClaimedOnly(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Show claimed only</span>
        </label>
      </div>

      {/* Freebie Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map(offer => {
          const difficultyStyle = getDifficultyColor(offer.difficulty)
          const isExpiringSoon = offer.expiryDate.getTime() - Date.now() < 48 * 60 * 60 * 1000 // 48 hours
          const canClaim = offer.requirements.every(req => 
            userProgress?.completedRequirements.includes(req)
          )
          const isLimitReached = offer.maxClaims > 0 && offer.claimCount >= offer.maxClaims
          
          return (
            <div
              key={offer.id}
              className={`bg-white rounded-xl border-2 transition-all hover:shadow-lg ${
                canClaim ? 'border-green-400 hover:border-green-500' : 'border-gray-200 hover:border-blue-400'
              } ${isExpiringSoon ? 'ring-2 ring-orange-400' : ''}`}
            >
              {/* Offer Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">
                      {offer.category === 'daily' ? '📅' :
                       offer.category === 'verification' ? '✅' :
                       offer.category === 'search' ? '🔍' :
                       offer.category === 'social' ? '📱' :
                       offer.category === 'weekend' ? '🎉' :
                       offer.category === 'content' ? '✍️' :
                       offer.category === 'referral' ? '👥' :
                       offer.category === 'business' ? '🏢' : '🎁'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "#0f172a" }}>
                        {offer.title}
                      </h3>
                      <p className="text-sm text-gray-600">{offer.provider}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      £{offer.value}
                    </div>
                    {offer.isLimited && (
                      <div className="text-xs text-orange-600 font-medium">
                        LIMITED
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">
                  {offer.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: difficultyStyle.bg,
                      color: difficultyStyle.color
                    }}
                  >
                    {offer.difficulty.toUpperCase()}
                  </div>
                  
                  {isExpiringSoon && (
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      EXPIRES SOON
                    </div>
                  )}
                  
                  {canClaim && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      READY TO CLAIM
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2" style={{ color: "#0f172a" }}>
                    Requirements:
                  </h4>
                  <ul className="space-y-1">
                    {offer.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          userProgress?.completedRequirements.includes(req)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {userProgress?.completedRequirements.includes(req) ? '✓' : '•'}
                        </div>
                        <span className={
                          userProgress?.completedRequirements.includes(req)
                            ? 'text-green-700 line-through'
                            : 'text-gray-700'
                        }>
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Claim Stats */}
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{offer.claimCount.toLocaleString()} people claimed</span>
                  <span>Expires: {offer.expiryDate.toLocaleDateString()}</span>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => claimFreebie(offer.id)}
                  disabled={!canClaim || isLimitReached}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    canClaim && !isLimitReached
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLimitReached ? 'Limit Reached' : 
                   canClaim ? `Claim £${offer.value}` : 'Complete Requirements'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#0f172a" }}>
            No offers found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new offers
          </p>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3" style={{ color: "#1e40af" }}>
          💡 Tips for Maximizing Your Freebie Earnings
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Check daily for new offers and limited-time bonuses</li>
          <li>• Complete easy tasks first to build up your streak</li>
          <li>• Share on social media to unlock social category rewards</li>
          <li>• Refer friends for the highest value bonuses</li>
          <li>• Keep an eye on expiring offers for time-sensitive rewards</li>
        </ul>
      </div>
    </div>
  )
}

export default VoucherPotFreebiePanel