// TikTok Pixel Integration for BoperCheck
declare global {
  interface Window {
    ttq: any;
  }
}

// Initialize TikTok Pixel
export const initTikTokPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;

  // Load TikTok Pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
  document.head.appendChild(script);

  // Initialize TikTok tracking queue
  window.ttq = window.ttq || [];
  window.ttq.load = window.ttq.load || function() {
    window.ttq.push(arguments);
  };
  window.ttq.page = window.ttq.page || function() {
    window.ttq.push(arguments);
  };

  // Load the pixel with your ID
  window.ttq.load(pixelId);
  window.ttq.page();
};

// Track price check events
export const trackPriceCheck = (itemName: string, category?: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('Search', {
    content_type: 'product',
    query: itemName,
    content_category: category || 'general'
  });
};

// Track user registration
export const trackSignup = () => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('CompleteRegistration');
};

// Track credit purchases
export const trackPurchase = (value: number, currency: string = 'GBP') => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('Purchase', {
    value: value,
    currency: currency,
    content_type: 'product'
  });
};

// Track PDF downloads
export const trackPDFDownload = (itemName: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('Download', {
    content_type: 'pdf',
    content_name: itemName
  });
};

// Track referral sharing
export const trackReferralShare = (platform: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('Share', {
    content_type: 'referral_link',
    method: platform
  });
};

// Track business outreach interactions
export const trackBusinessContact = (businessName: string, contactMethod: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('Contact', {
    content_type: 'business',
    content_name: businessName,
    method: contactMethod
  });
};

// Track page views for specific sections
export const trackPageView = (pageName: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('ViewContent', {
    content_type: 'page',
    content_name: pageName
  });
};

// Track user engagement events
export const trackEngagement = (action: string, details?: any) => {
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track('ClickButton', {
    button_text: action,
    ...details
  });
};

// Track viral sharing events
export const trackViralShare = (platform: string, contentType: string, itemName?: string) => {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('Share', {
    content_type: contentType,
    content_name: itemName || 'BoperCheck savings',
    description: `Shared on ${platform}`,
    value: 1
  });
};

// Track social proof events
export const trackSocialProof = (actionType: string, data?: any) => {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('Subscribe', {
    content_type: actionType,
    ...data
  });
};