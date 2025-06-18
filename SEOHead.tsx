import React from 'react'
import { Helmet } from 'react-helmet'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogType?: string
  ogImage?: string
  canonicalUrl?: string
  structuredData?: object
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "BoperCheck - AI-Powered Price Comparison & Voucher Discovery",
  description = "Save money on everything you buy with BoperCheck. Our AI finds the best prices across thousands of UK retailers and automatically discovers vouchers. Free searches, instant savings.",
  keywords = "price comparison, vouchers, discount codes, UK shopping, save money, best prices, deals, Claude AI, shopping comparison, voucher codes",
  ogType = "website",
  ogImage = "/images/bopercheck-og-image.jpg",
  canonicalUrl,
  structuredData
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bopercheck.replit.app'
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BoperCheck",
    "description": "AI-powered price comparison and voucher discovery platform for UK shoppers",
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "description": "Free price comparison and voucher discovery service"
    },
    "creator": {
      "@type": "Organization",
      "name": "BoperCheck",
      "url": baseUrl
    },
    "featureList": [
      "AI-powered price comparison",
      "Automatic voucher discovery", 
      "Savings pot gamification",
      "Business advertising platform",
      "Weekly market reports"
    ]
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="BoperCheck" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="BoperCheck" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:site" content="@BoperCheck" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="BoperCheck" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  )
}

export default SEOHead