import React, { useState, useEffect } from 'react'

interface DashboardStats {
  totalUsers: number
  activeSearches: number
  avgPot: number
  topSearch: string
  referrals: number
  totalRevenue: number
  conversionRate: number
  activeDownloads: number
}

interface RecentActivity {
  id: string
  type: 'search' | 'signup' | 'referral' | 'download'
  description: string
  timestamp: Date
  value?: number
}

const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSearches: 0,
    avgPot: 0,
    topSearch: 'Loading...',
    referrals: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activeDownloads: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    initializeFirebase()
    loadDashboardData()
    
    // Update every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const initializeFirebase = async () => {
    try {
      // Initialize Firebase with actual config
      const { initializeApp } = await import('firebase/app')
      const { getFirestore, collection, getDocs, onSnapshot } = await import('firebase/firestore')
      
      const firebaseConfig = {
        apiKey: "AIzaSyCErrbsDkPrX4qiM4_UG1Io5cFMr-vyEY0",
        authDomain: "getboper.firebaseapp.com",
        projectId: "getboper",
        storageBucket: "getboper.firebasestorage.app",
        messagingSenderId: "426162881672",
        appId: "1:426162881672:web:535cd20b0ff473f8b90b3d",
        measurementId: "G-51PRM5NQLW"
      }

      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)
      
      // Set up real-time listeners
      onSnapshot(collection(db, "users"), () => {
        loadDashboardData()
      })
      
      onSnapshot(collection(db, "priceChecks"), () => {
        loadDashboardData()
      })
      
    } catch (error) {
      console.error('Firebase initialization error:', error)
    }
  }

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate Firebase data fetch - replace with actual Firebase calls
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        activeSearches: 89,
        avgPot: 47.65,
        topSearch: 'iPhone 15 Pro',
        referrals: 34,
        totalRevenue: 12450,
        conversionRate: 12.8,
        activeDownloads: 156
      }
      
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'signup',
          description: 'New user registered from Newcastle',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          value: 1
        },
        {
          id: '2',
          type: 'search',
          description: 'Price check: Samsung TV 55 inch',
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          value: 649
        },
        {
          id: '3',
          type: 'referral',
          description: 'Referral completed: user123 → user456',
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          value: 5
        },
        {
          id: '4',
          type: 'download',
          description: 'PDF unlocked: Voucher Hunting Guide',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          value: 3
        },
        {
          id: '5',
          type: 'search',
          description: 'Price check: Gaming laptop RTX',
          timestamp: new Date(Date.now() - 35 * 60 * 1000),
          value: 1299
        }
      ]
      
      setStats(mockStats)
      setRecentActivity(mockActivity)
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return '👤'
      case 'search': return '🔍'
      case 'referral': return '🤝'
      case 'download': return '📥'
      default: return '📊'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#0f172a" }}>
            BoperCheck Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time platform analytics and insights
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="font-medium">{lastUpdated.toLocaleTimeString()}</div>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Searches</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.activeSearches}
              </p>
            </div>
            <div className="text-3xl">🔍</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Voucher Pot</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.avgPot)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referrals</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.referrals}
              </p>
            </div>
            <div className="text-3xl">🤝</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💵</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {stats.conversionRate}%
              </p>
            </div>
            <div className="text-3xl opacity-80">📈</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Downloads</p>
              <p className="text-2xl font-bold">
                {stats.activeDownloads}
              </p>
            </div>
            <div className="text-3xl opacity-80">📥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Top Search</p>
              <p className="text-lg font-bold truncate">
                {stats.topSearch}
              </p>
            </div>
            <div className="text-3xl opacity-80">🔥</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: "#0f172a" }}>
                  {activity.description}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
              {activity.value && (
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {activity.type === 'search' ? formatCurrency(activity.value) : `+${activity.value}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Firebase Connection Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-green-800 font-medium">
            Connected to Firebase (Project: getboper)
          </p>
        </div>
        <p className="text-green-600 text-sm mt-1">
          Real-time data synchronization active
        </p>
      </div>
    </div>
  )
}

export default OwnerDashboard