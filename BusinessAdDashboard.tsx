import React, { useState, useEffect } from 'react'

interface AdCampaign {
  id: string
  businessName: string
  title: string
  description: string
  category: string
  location: string
  budget: number
  dailyBudget: number
  costPerClick: number
  startDate: Date
  endDate: Date
  status: 'active' | 'paused' | 'completed' | 'pending'
  clickCount: number
  impressionCount: number
  conversionCount: number
  totalSpent: number
  isSponsored: boolean
  priority: 'high' | 'medium' | 'low'
}

interface BusinessStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSpent: number
  totalClicks: number
  totalImpressions: number
  averageCTR: number
  totalConversions: number
  conversionRate: number
}

const BusinessAdDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null)

  useEffect(() => {
    loadBusinessData()
  }, [selectedPeriod])

  const loadBusinessData = async () => {
    setLoading(true)
    
    try {
      // Mock campaign data - replace with API call
      const mockCampaigns: AdCampaign[] = [
        {
          id: 'camp1',
          businessName: 'Newcastle Electronics Hub',
          title: 'Summer Tech Sale',
          description: 'Latest laptops, smartphones and accessories at unbeatable prices',
          category: 'electronics',
          location: 'Newcastle',
          budget: 500,
          dailyBudget: 25,
          costPerClick: 0.75,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-30'),
          status: 'active',
          clickCount: 245,
          impressionCount: 3420,
          conversionCount: 12,
          totalSpent: 183.75,
          isSponsored: true,
          priority: 'high'
        },
        {
          id: 'camp2',
          businessName: 'Metro Fashion Boutique',
          title: 'Summer Collection Launch',
          description: 'New arrivals from top fashion brands',
          category: 'fashion',
          location: 'Newcastle',
          budget: 300,
          dailyBudget: 15,
          costPerClick: 0.45,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-07-15'),
          status: 'active',
          clickCount: 156,
          impressionCount: 2130,
          conversionCount: 8,
          totalSpent: 70.20,
          isSponsored: false,
          priority: 'medium'
        },
        {
          id: 'camp3',
          businessName: 'Geordie Grub Restaurant',
          title: 'Weekend Special Menu',
          description: 'Traditional British cuisine with modern twist',
          category: 'dining',
          location: 'Newcastle',
          budget: 200,
          dailyBudget: 20,
          costPerClick: 0.60,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-21'),
          status: 'completed',
          clickCount: 189,
          impressionCount: 1890,
          conversionCount: 15,
          totalSpent: 113.40,
          isSponsored: true,
          priority: 'high'
        }
      ]
      
      setCampaigns(mockCampaigns)
      
      // Calculate stats
      const totalCampaigns = mockCampaigns.length
      const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length
      const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.totalSpent, 0)
      const totalClicks = mockCampaigns.reduce((sum, c) => sum + c.clickCount, 0)
      const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressionCount, 0)
      const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversionCount, 0)
      
      setStats({
        totalCampaigns,
        activeCampaigns,
        totalSpent,
        totalClicks,
        totalImpressions,
        averageCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        totalConversions,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      })
      
    } catch (error) {
      console.error('Failed to load business data:', error)
    } finally {
      setLoading(false)
    }
  }

  const pauseCampaign = async (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'paused' as const }
        : campaign
    ))
  }

  const resumeCampaign = async (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'active' as const }
        : campaign
    ))
  }

  const deleteCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Active', color: '#059669', bg: '#d1fae5' }
      case 'paused':
        return { text: 'Paused', color: '#d97706', bg: '#fef3c7' }
      case 'completed':
        return { text: 'Completed', color: '#6b7280', bg: '#f3f4f6' }
      case 'pending':
        return { text: 'Pending', color: '#dc2626', bg: '#fee2e2' }
      default:
        return { text: 'Unknown', color: '#6b7280', bg: '#f3f4f6' }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Loading business dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#0f172a" }}>
            Business Advertising Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your advertising campaigns and track performance
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm">Total Campaigns</div>
                <div className="text-3xl font-bold">{stats.totalCampaigns}</div>
                <div className="text-blue-100 text-sm">{stats.activeCampaigns} active</div>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-100 text-sm">Total Spent</div>
                <div className="text-3xl font-bold">£{stats.totalSpent.toFixed(2)}</div>
                <div className="text-green-100 text-sm">This period</div>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm">Click-through Rate</div>
                <div className="text-3xl font-bold">{stats.averageCTR.toFixed(2)}%</div>
                <div className="text-purple-100 text-sm">{stats.totalClicks} total clicks</div>
              </div>
              <div className="text-4xl opacity-80">🎯</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-100 text-sm">Conversion Rate</div>
                <div className="text-3xl font-bold">{stats.conversionRate.toFixed(2)}%</div>
                <div className="text-orange-100 text-sm">{stats.totalConversions} conversions</div>
              </div>
              <div className="text-4xl opacity-80">🏆</div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Performance Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
          Performance Overview
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-gray-600">Campaign performance chart would appear here</p>
            <p className="text-sm text-gray-500">Showing clicks, impressions, and conversions over time</p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: "#0f172a" }}>
            Your Campaigns
          </h3>
          <div className="text-sm text-gray-600">
            {campaigns.length} total campaigns
          </div>
        </div>

        <div className="space-y-4">
          {campaigns.map(campaign => {
            const badge = getStatusBadge(campaign.status)
            const ctr = campaign.impressionCount > 0 ? (campaign.clickCount / campaign.impressionCount) * 100 : 0
            const conversionRate = campaign.clickCount > 0 ? (campaign.conversionCount / campaign.clickCount) * 100 : 0
            
            return (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold" style={{ color: "#0f172a" }}>
                        {campaign.title}
                      </h4>
                      <div 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}
                      >
                        {badge.text}
                      </div>
                      {campaign.isSponsored && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Sponsored
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{campaign.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📍 {campaign.location}</span>
                      <span>🏷️ {campaign.category}</span>
                      <span>💰 £{campaign.dailyBudget}/day</span>
                      <span>📅 {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCampaign(campaign)}
                      className="text-blue-600 hover:text-blue-700 p-2"
                      title="Edit campaign"
                    >
                      ✏️
                    </button>
                    {campaign.status === 'active' ? (
                      <button
                        onClick={() => pauseCampaign(campaign.id)}
                        className="text-orange-600 hover:text-orange-700 p-2"
                        title="Pause campaign"
                      >
                        ⏸️
                      </button>
                    ) : campaign.status === 'paused' ? (
                      <button
                        onClick={() => resumeCampaign(campaign.id)}
                        className="text-green-600 hover:text-green-700 p-2"
                        title="Resume campaign"
                      >
                        ▶️
                      </button>
                    ) : null}
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Delete campaign"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{campaign.impressionCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.clickCount}</div>
                    <div className="text-xs text-gray-600">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{ctr.toFixed(2)}%</div>
                    <div className="text-xs text-gray-600">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{campaign.conversionCount}</div>
                    <div className="text-xs text-gray-600">Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">£{campaign.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Spent</div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Budget Used</span>
                    <span>£{campaign.totalSpent.toFixed(2)} / £{campaign.budget}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((campaign.totalSpent / campaign.budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-bold mb-2" style={{ color: "#0f172a" }}>
              No campaigns yet
            </h4>
            <p className="text-gray-600 mb-4">
              Create your first advertising campaign to start reaching customers
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Campaign
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#1e40af" }}>
            Boost Performance
          </h3>
          <p className="text-blue-700 mb-4">
            Optimize your campaigns for better results
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Tips
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#059669" }}>
            Billing & Payments
          </h3>
          <p className="text-green-700 mb-4">
            Manage your advertising budget and payments
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            View Billing
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#7c3aed" }}>
            Detailed Reports
          </h3>
          <p className="text-purple-700 mb-4">
            Download comprehensive performance reports
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessAdDashboard