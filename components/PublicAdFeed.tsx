import React, { useState, useEffect } from 'react'

interface Advertisement {
  id: string
  businessName: string
  title: string
  description: string
  imageUrl?: string
  offer: string
  category: string
  location: string
  website?: string
  phoneNumber?: string
  email?: string
  isSponsored: boolean
  priority: 'high' | 'medium' | 'low'
  startDate: Date
  endDate: Date
  clickCount: number
  impressionCount: number
  budget: number
  costPerClick: number
}

interface PublicAdFeedProps {
  location?: string
  category?: string
  maxAds?: number
  showSponsored?: boolean
}

const PublicAdFeed: React.FC<PublicAdFeedProps> = ({
  location = 'Newcastle',
  category = 'all',
  maxAds = 10,
  showSponsored = true
}) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category)

  useEffect(() => {
    loadAdvertisements()
  }, [location])

  useEffect(() => {
    filterAdvertisements()
  }, [advertisements, selectedCategory, showSponsored])

  const loadAdvertisements = async () => {
    setLoading(true)
    
    try {
      // Mock advertisement data - replace with API call
      const mockAds: Advertisement[] = [
        {
          id: 'ad1',
          businessName: 'Newcastle Electronics Hub',
          title: 'Latest Tech at Unbeatable Prices',
          description: 'Premium electronics, laptops, smartphones, and accessories. Expert repairs and trade-ins available.',
          imageUrl: '/images/electronics-ad.jpg',
          offer: '20% off all laptop repairs + Free diagnostics',
          category: 'electronics',
          location: 'Newcastle',
          website: 'https://newcastle-electronics.com',
          phoneNumber: '0191 123 4567',
          email: 'info@newcastle-electronics.com',
          isSponsored: true,
          priority: 'high',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-12-31'),
          clickCount: 245,
          impressionCount: 3420,
          budget: 500,
          costPerClick: 0.75
        },
        {
          id: 'ad2',
          businessName: 'Metro Fashion Boutique',
          title: 'Trendy Clothing & Accessories',
          description: 'Discover the latest fashion trends for every occasion. Designer brands at affordable prices.',
          offer: 'Buy 2 Get 1 FREE on all summer collection',
          category: 'fashion',
          location: 'Newcastle',
          website: 'https://metrofashion.co.uk',
          phoneNumber: '0191 987 6543',
          isSponsored: false,
          priority: 'medium',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-09-30'),
          clickCount: 156,
          impressionCount: 2130,
          budget: 200,
          costPerClick: 0.45
        },
        {
          id: 'ad3',
          businessName: 'Geordie Grub Restaurant',
          title: 'Authentic British Cuisine',
          description: 'Traditional British dishes with a modern twist. Fresh, local ingredients and warm atmosphere.',
          offer: 'Free dessert with any main course this week',
          category: 'dining',
          location: 'Newcastle',
          website: 'https://geordiegrubc.com',
          phoneNumber: '0191 555 0123',
          isSponsored: true,
          priority: 'high',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-11-30'),
          clickCount: 189,
          impressionCount: 1890,
          budget: 300,
          costPerClick: 0.60
        },
        {
          id: 'ad4',
          businessName: 'City Auto Services',
          title: 'Professional Car Care',
          description: 'MOT testing, servicing, repairs, and tyre fitting. Qualified mechanics with 20+ years experience.',
          offer: '£20 off your next MOT test',
          category: 'automotive',
          location: 'Newcastle',
          phoneNumber: '0191 444 5678',
          isSponsored: false,
          priority: 'medium',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-12-31'),
          clickCount: 98,
          impressionCount: 1456,
          budget: 150,
          costPerClick: 0.35
        },
        {
          id: 'ad5',
          businessName: 'Wellness Spa Newcastle',
          title: 'Relaxation & Beauty Treatments',
          description: 'Professional spa treatments, massages, facials, and wellness therapies in a tranquil setting.',
          offer: '30% off first-time booking for new customers',
          category: 'health',
          location: 'Newcastle',
          website: 'https://wellnessspa-newcastle.com',
          phoneNumber: '0191 333 9876',
          isSponsored: true,
          priority: 'medium',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-08-31'),
          clickCount: 167,
          impressionCount: 2245,
          budget: 250,
          costPerClick: 0.50
        },
        {
          id: 'ad6',
          businessName: 'HomeStyle Furniture',
          title: 'Quality Home Furnishings',
          description: 'Stylish furniture for every room. Sofas, beds, dining sets, and home accessories.',
          offer: 'Free delivery on orders over £200',
          category: 'home',
          location: 'Newcastle',
          website: 'https://homestyle-newcastle.co.uk',
          phoneNumber: '0191 777 8899',
          isSponsored: false,
          priority: 'low',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-10-31'),
          clickCount: 134,
          impressionCount: 1789,
          budget: 180,
          costPerClick: 0.40
        }
      ]
      
      setAdvertisements(mockAds)
    } catch (error) {
      console.error('Failed to load advertisements:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAdvertisements = () => {
    let filtered = [...advertisements]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ad => ad.category === selectedCategory)
    }
    
    // Filter by sponsored status if needed
    if (!showSponsored) {
      filtered = filtered.filter(ad => !ad.isSponsored)
    }
    
    // Sort by priority and sponsored status
    filtered.sort((a, b) => {
      // Sponsored ads first
      if (a.isSponsored && !b.isSponsored) return -1
      if (!a.isSponsored && b.isSponsored) return 1
      
      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    
    setFilteredAds(filtered.slice(0, maxAds))
  }

  const handleAdClick = async (ad: Advertisement) => {
    try {
      // Track click
      setAdvertisements(prev => prev.map(a => 
        a.id === ad.id 
          ? { ...a, clickCount: a.clickCount + 1 }
          : a
      ))

      // Record click analytics
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId: ad.id,
          businessName: ad.businessName,
          timestamp: new Date().toISOString(),
          userLocation: location
        })
      })

      // Open business website or show contact info
      if (ad.website) {
        window.open(ad.website, '_blank')
      } else if (ad.phoneNumber) {
        window.open(`tel:${ad.phoneNumber}`)
      }
    } catch (error) {
      console.error('Failed to track ad click:', error)
    }
  }

  const trackImpression = (ad: Advertisement) => {
    // Track impression when ad comes into view
    setAdvertisements(prev => prev.map(a => 
      a.id === ad.id 
        ? { ...a, impressionCount: a.impressionCount + 1 }
        : a
    ))
  }

  const getPriorityBadge = (priority: string, isSponsored: boolean) => {
    if (isSponsored) {
      return { text: 'Sponsored', color: '#f59e0b', bg: '#fef3c7' }
    }
    
    switch (priority) {
      case 'high':
        return { text: 'Featured', color: '#dc2626', bg: '#fee2e2' }
      case 'medium':
        return { text: 'Popular', color: '#2563eb', bg: '#dbeafe' }
      default:
        return { text: 'Local', color: '#059669', bg: '#d1fae5' }
    }
  }

  const categories = ['all', 'electronics', 'fashion', 'dining', 'automotive', 'health', 'home']

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Loading local advertisements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Local Business Advertisements
        </h2>
        <p className="text-gray-600">
          Discover great offers from businesses in {location}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
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
      </div>

      {/* Advertisement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map(ad => {
          const badge = getPriorityBadge(ad.priority, ad.isSponsored)
          
          return (
            <div
              key={ad.id}
              onClick={() => handleAdClick(ad)}
              onLoad={() => trackImpression(ad)}
              className={`relative bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                ad.isSponsored 
                  ? 'border-yellow-400 hover:border-yellow-500' 
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              {/* Priority Badge */}
              <div 
                className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium z-10"
                style={{ 
                  backgroundColor: badge.bg,
                  color: badge.color
                }}
              >
                {badge.text}
              </div>

              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                <div className="text-4xl">
                  {ad.category === 'electronics' ? '💻' :
                   ad.category === 'fashion' ? '👗' :
                   ad.category === 'dining' ? '🍽️' :
                   ad.category === 'automotive' ? '🚗' :
                   ad.category === 'health' ? '🏥' :
                   ad.category === 'home' ? '🏠' : '🏪'}
                </div>
              </div>

              <div className="p-4">
                {/* Business Name */}
                <h3 className="font-bold text-lg mb-2" style={{ color: "#0f172a" }}>
                  {ad.businessName}
                </h3>

                {/* Title */}
                <h4 className="font-semibold mb-2 text-blue-600">
                  {ad.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {ad.description}
                </p>

                {/* Offer */}
                <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-3">
                  <div className="font-semibold text-sm">
                    🎁 {ad.offer}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex justify-between items-center text-sm mb-3">
                  {ad.phoneNumber && (
                    <div className="text-blue-600">
                      📞 {ad.phoneNumber}
                    </div>
                  )}
                  {ad.website && (
                    <div className="text-blue-600">
                      🌐 Visit Website
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{ad.clickCount} clicks</span>
                  <span>{ad.impressionCount} views</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏪</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#0f172a" }}>
            No advertisements found
          </h3>
          <p className="text-gray-600">
            No businesses are currently advertising in this category.
          </p>
        </div>
      )}

      {/* Advertise CTA */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold mb-2" style={{ color: "#1e40af" }}>
          Advertise Your Business Here
        </h3>
        <p className="text-blue-700 mb-4">
          Reach local customers with targeted advertisements on BoperCheck
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.open('mailto:support@bopercheck.com?subject=Business Advertising Inquiry')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Advertising
          </button>
          <button 
            onClick={() => window.open('/advertiser')}
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublicAdFeed