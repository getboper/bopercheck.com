// Google Analytics 4 Integration for BoperCheck

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not found. Please add VITE_GA_MEASUREMENT_ID to your environment variables.');
    return;
  }

  console.log('Initializing Google Analytics with ID:', measurementId);

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script1.onload = () => console.log('Google Analytics script loaded successfully');
  script1.onerror = () => console.error('Failed to load Google Analytics script');
  document.head.appendChild(script1);

  // Initialize gtag with proper configuration
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    // Configure Google Analytics with enhanced settings
    gtag('config', '${measurementId}', {
      send_page_view: true,
      debug_mode: ${import.meta.env.MODE === 'development'},
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'price_check_item'
      }
    });
    
    // Send initial page view
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    
    console.log('Google Analytics gtag configured and initial page view sent');
  `;
  document.head.appendChild(script2);
};

// Track page views - essential for single-page applications
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not available for page view tracking');
    return;
  }
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Missing measurement ID for page view tracking');
    return;
  }
  
  console.log('Tracking page view:', url, title);
  
  // Send page view event
  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: url
  });
  
  // Also update config for SPA navigation
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title || document.title
  });
};

// Track custom events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not available for event tracking');
    return;
  }
  
  console.log('Tracking event:', action, category, label, value);
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track price check events
export const trackPriceCheck = (item: string, category?: string) => {
  trackEvent('price_check', 'engagement', item);
};

// Track business signup events
export const trackBusinessSignup = (plan: string) => {
  trackEvent('business_signup', 'conversion', plan);
};

// Track user registration
export const trackUserRegistration = (method: string = 'email') => {
  trackEvent('sign_up', 'engagement', method);
};