import React, { useState } from 'react'

interface BusinessAd {
  id: string
  businessName: string
  description: string
  offer: string
  category: string
  imageUrl?: string
  websiteUrl?: string
  phoneNumber?: string
  isPromoted: boolean
  expiryDate?: Date
}

interface BusinessAdsSectionProps {
  category?: string
  maxAds?: number
  showPromotedFirst?: boolean
}

const BusinessAdsSection: React.FC<BusinessAdsSectionProps> = ({ 
  category = 'all',
  maxAds = 6,
  showPromotedFirst = true
}) => {
  const [ads] = useState<BusinessAd[]>([
    {
      id: 'ad1',
      businessName: 'Newcastle Electronics',
      description: 'Your local tech specialists with 20+ years experience',
      offer: '15% off all laptop repairs this month',
      category: 'electronics',
      websiteUrl: 'https://newcastle-electronics.com',
      phoneNumber: '0191 123 4567',
      isPromoted: true,
      expiryDate: new Date('2024-12-31')
    },
    {
      id: 'ad2',
      businessName: 'City Fashion Boutique',
      description: 'Trendy clothing and accessories for every occasion',
      offer: 'Buy 2 get 1 FREE on selected items',
      category: 'fashion',
      websiteUrl: 'https://cityfashion.co.uk',
      phoneNumber: '0191 987 6543',
      isPromoted: false
    },
    {
      id: 'ad3',
      businessName: 'Geordie Grub Cafe',
      description: 'Traditional British cuisine with a modern twist',
      offer: 'Free dessert with any main course',
      category: 'dining',
      websiteUrl: 'https://geordiegrubc.com',
      phoneNumber: '0191 555 0123',
      isPromoted: true,
      expiryDate: new Date('2024-11-30')
    },
    {
      id: 'ad4',
      businessName: 'Metro Car Services',
      description: 'Reliable car repairs and MOT testing centre',
      offer: '£20 off your next MOT test',
      category: 'automotive',
      phoneNumber: '0191 444 5678',
      isPromoted: false
    },
    {
      id: 'ad5',
      businessName: 'Wellness Spa Newcastle',
      description: 'Relaxation and beauty treatments in the heart of the city',
      offer: '30% off first-time massage booking',
      category: 'health',
      websiteUrl: 'https://wellnessspa-newcastle.com',
      phoneNumber: '0191 333 9876',
      isPromoted: true
    },
    {
      id: 'ad6',
      businessName: 'Home & Garden Centre',
      description: 'Everything for your home improvement projects',
      offer: 'Free delivery on orders over £50',
      category: 'home',
      websiteUrl: 'https://homeandgarden-newcastle.co.uk',
      isPromoted: false
    }
  ])

  const getFilteredAds = () => {
    let filteredAds = category === 'all' 
      ? ads 
      : ads.filter(ad => ad.category === category)

    if (showPromotedFirst) {
      filteredAds.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1
        if (!a.isPromoted && b.isPromoted) return 1
        return 0
      })
    }

    return filteredAds.slice(0, maxAds)
  }

  const handleAdClick = (ad: BusinessAd) => {
    // Track ad engagement
    console.log('Ad clicked:', ad.businessName)
    
    if (ad.websiteUrl) {
      window.open(ad.websiteUrl, '_blank')
    } else if (ad.phoneNumber) {
      window.open(`tel:${ad.phoneNumber}`)
    }
  }

  const isExpiringSoon = (ad: BusinessAd) => {
    if (!ad.expiryDate) return false
    const daysUntilExpiry = Math.ceil((ad.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7
  }

  return (
    <div className="business-ads-section">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold" style={{ color: "#0f172a" }}>
          Local Business Offers
        </h3>
        <div className="text-sm text-gray-500">
          Sponsored by local Newcastle businesses
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredAds().map(ad => (
          <div
            key={ad.id}
            onClick={() => handleAdClick(ad)}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
              ad.isPromoted 
                ? 'border-yellow-400 bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            {/* Promoted Badge */}
            {ad.isPromoted && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Promoted
              </div>
            )}

            {/* Expiry Warning */}
            {isExpiringSoon(ad) && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Ends Soon
              </div>
            )}

            {/* Business Info */}
            <div className="mb-3">
              <h4 className="font-bold text-lg mb-1" style={{ color: "#0f172a" }}>
                {ad.businessName}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {ad.description}
              </p>
            </div>

            {/* Offer */}
            <div className="mb-3 p-3 bg-green-100 rounded-lg">
              <div className="text-green-800 font-semibold text-sm">
                🎁 {ad.offer}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex justify-between items-center text-sm">
              {ad.phoneNumber && (
                <div className="text-blue-600 hover:text-blue-800">
                  📞 {ad.phoneNumber}
                </div>
              )}
              {ad.websiteUrl && (
                <div className="text-blue-600 hover:text-blue-800">
                  🌐 Visit Website
                </div>
              )}
              {!ad.phoneNumber && !ad.websiteUrl && (
                <div className="text-gray-500">
                  Click for details
                </div>
              )}
            </div>

            {/* Category Badge */}
            <div className="mt-3">
              <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
                {ad.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {getFilteredAds().length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏪</div>
          <h4 className="text-lg font-bold mb-2" style={{ color: "#0f172a" }}>
            No local offers available
          </h4>
          <p className="text-gray-600">
            Check back soon for new business promotions in this category.
          </p>
        </div>
      )}

      {/* Advertise Here CTA */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <h4 className="font-bold mb-2" style={{ color: "#1e40af" }}>
          Want to advertise your business here?
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          Reach local customers with targeted offers and promotions
        </p>
        <button 
          onClick={() => window.open('mailto:support@bopercheck.com?subject=Business Advertising Inquiry')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Get Started - Free Trial
        </button>
      </div>
    </div>
  )
}

export default BusinessAdsSection