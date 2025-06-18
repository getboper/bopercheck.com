// Firebase Analytics Integration for BoperCheck
import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

// Track page views in Firebase
export const trackFirebasePageView = (pagePath: string, pageTitle?: string) => {
  if (!analytics) {
    console.warn('Firebase Analytics not available for page view tracking');
    return;
  }
  
  try {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href
    });
    console.log('Firebase page view tracked:', pagePath);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Track price analysis searches
export const trackPriceAnalysis = (item: string, category?: string, budget?: number) => {
  if (!analytics) {
    console.warn('Firebase Analytics not available for price analysis tracking');
    return;
  }
  
  try {
    logEvent(analytics, 'search', {
      search_term: item,
      item_category: category,
      currency: 'GBP',
      value: budget
    });
    
    // Custom event for price checks
    logEvent(analytics, 'price_check', {
      item_name: item,
      item_category: category,
      budget: budget
    });
    console.log('Firebase price analysis tracked:', item);
  } catch (error) {
    console.error('Failed to track price analysis:', error);
  }
};

// Track user registration
export const trackUserSignup = (method: string = 'email') => {
  if (!analytics) return;
  
  logEvent(analytics, 'sign_up', {
    method: method
  });
};

// Track business contact form submissions
export const trackBusinessContact = (planType?: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'generate_lead', {
    lead_type: 'business_contact',
    plan_type: planType || 'unknown'
  });
};

// Track business subscription purchases
export const trackBusinessSubscription = (planType: string, value: number) => {
  if (!analytics) return;
  
  logEvent(analytics, 'purchase', {
    transaction_id: Date.now().toString(),
    value: value,
    currency: 'GBP',
    items: [{
      item_id: `business_plan_${planType}`,
      item_name: `Business Plan - ${planType}`,
      item_category: 'subscription',
      price: value,
      quantity: 1
    }]
  });
};

// Track user engagement events
export const trackEngagement = (action: string, category: string, label?: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'custom_engagement', {
    engagement_type: action,
    category: category,
    label: label
  });
};

// Set user properties for better segmentation
export const setUserAnalyticsProperties = (properties: { [key: string]: string }) => {
  if (!analytics) return;
  
  setUserProperties(analytics, properties);
};