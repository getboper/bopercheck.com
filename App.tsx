import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import PriceChecker from './components/PriceChecker'
import AdvertiserDashboard from './components/AdvertiserDashboard'
import EnhancedMoneyPot from './components/EnhancedMoneyPot'
import VoucherJar from './components/VoucherJar'
import ComprehensiveHomePage from './components/ComprehensiveHomePage'
import VoucherDrop from './components/VoucherDrop'
import WeeklyReport from './components/WeeklyReport'
import NavigationMenu from './components/NavigationMenu'

import AdminDashboard from './pages/AdminDashboard'
import BusinessNotificationMonitor from './pages/BusinessNotificationMonitor'
import QuickAdminAccess from './pages/QuickAdminAccess'
import AdminBusinessOverride from './pages/AdminBusinessOverride'
import AdvertiserEmailTemplates from './components/AdvertiserEmailTemplates'
import GamifiedVoucherPot from './components/GamifiedVoucherPot'
import AdvertiserAIOnboarding from './components/AdvertiserAIOnboarding'
import BusinessDashboard from './components/BusinessDashboard'
import BusinessLogin from './components/BusinessLogin'
import RewardCentre from './components/RewardCentre'
import VoucherWallet from './components/VoucherWallet'
import DownloadLocker from './components/DownloadLocker'

import EmailConfirmation from './components/EmailConfirmation'
import PremiumAdvertiserSignup from './components/PremiumAdvertiserSignup'
import BusinessAdvertising from './components/BusinessAdvertising'
import BusinessSuccess from './components/BusinessSuccess'
import StreamlinedAdBuilder from './components/StreamlinedAdBuilder'
import FreeBusinessReport from './components/FreeBusinessReport'
import BusinessReport from './components/BusinessReport'

type Page = 'landing' | 'price-checker' | 'advertiser' | 'money-pot' | 'voucher-jar' | 'dashboard' | 'voucher-drop' | 'weekly-report' | 'admin-dashboard' | 'business-notifications' | 'quick-admin' | 'admin-business-override' | 'email-templates' | 'gamified-pot' | 'ai-onboarding' | 'business-dashboard' | 'reward-centre' | 'voucher-wallet' | 'download-locker' | 'email-confirmation' | 'premium-advertiser-signup' | 'advertiser-signup' | 'business-report' | 'free-business-report' | 'business' | 'business-success' | 'ad-builder'

// Device detection utility
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
};



// Visitor tracking utility
const trackVisitor = async (sessionId: string, landingPage: string, conversionType?: string) => {
  try {
    const response = await fetch('/api/visitor-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        landingPage,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
        browserName: getBrowserName(),
        countryCode: null,
        cityName: null,
        userId: null
      })
    });
    
    if (!response.ok) {
      console.error('Failed to track visitor');
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

const updateVisitorActivity = async (sessionId: string, conversionType?: string, pageViews?: number) => {
  try {
    await fetch('/api/update-visitor-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        conversionType,
        pageViews,
        lastActivity: new Date()
      })
    });
  } catch (error) {
    console.error('Error updating visitor activity:', error);
  }
};



// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [sessionId] = useState<string>(getSessionId())
  const [pageViews, setPageViews] = useState<number>(1)

  // Track initial visitor and handle hash routing
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash === 'free-business-report') {
      setCurrentPage('free-business-report');
    }
    
    trackVisitor(sessionId, '/landing');
  }, [sessionId]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    
    // Update page views and track navigation
    const newPageViews = pageViews + 1;
    setPageViews(newPageViews);
    
    // Track specific conversion events
    let conversionType;
    if (page === 'dashboard' || page === 'price-checker') {
      conversionType = 'user_registration';
    } else if (page === 'business' || page === 'premium-advertiser-signup') {
      conversionType = 'business_signup';
    } else if (page === 'voucher-jar' || page === 'money-pot') {
      conversionType = 'voucher_interaction';
    }
    
    updateVisitorActivity(sessionId, conversionType, newPageViews);
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'price-checker':
        return (
          <PriceChecker 
            onBackToHome={() => navigateTo('dashboard')}
            onViewVouchers={() => navigateTo('voucher-jar')}
          />
        )
      case 'money-pot':
        return (
          <EnhancedMoneyPot 
            onKeepSaving={() => navigateTo('price-checker')}
            onReferAndEarn={() => navigateTo('voucher-jar')}
          />
        )
      case 'voucher-jar':
        return (
          <VoucherJar 
            onBackToDemo={() => navigateTo('landing')}
          />
        )
      case 'dashboard':
        return (
          <ComprehensiveHomePage 
            onPriceCheck={() => navigateTo('price-checker')}
            onAdvertise={() => navigateTo('advertiser')}
            onVoucherPot={() => navigateTo('money-pot')}
          />
        )
      case 'advertiser':
        return (
          <AdvertiserDashboard 
            onBackToHome={() => navigateTo('landing')}
            onReportSignup={(email, businessName) => {
              console.log('Report signup:', { email, businessName })
            }}
            onPromoSignup={() => navigateTo('premium-advertiser-signup')}
          />
        )
      case 'voucher-drop':
        return <VoucherDrop />
      case 'weekly-report': {
        const businessToken = localStorage.getItem('businessToken');
        if (!businessToken) {
          return <BusinessLogin onSuccess={(token, businessName) => {
            // Refresh the navigation to show the authenticated portal
            window.location.reload();
          }} />;
        }
        return <WeeklyReport />
      }
      case 'admin-dashboard':
        return <AdminDashboard />
      case 'business-notifications':
        return <BusinessNotificationMonitor />
      case 'quick-admin':
        return <QuickAdminAccess onNavigate={navigateTo} />
      case 'admin-business-override':
        return <AdminBusinessOverride />
      case 'email-templates':
        return <AdvertiserEmailTemplates />
      case 'gamified-pot':
        return <GamifiedVoucherPot />
      case 'ai-onboarding':
        return <AdvertiserAIOnboarding />
      case 'business-dashboard': {
        const businessTokenForDashboard = localStorage.getItem('businessToken');
        if (!businessTokenForDashboard) {
          return <BusinessLogin onSuccess={(token, businessName) => {
            // Refresh the navigation to show the authenticated portal
            window.location.reload();
          }} />;
        }
        return <BusinessDashboard />
      }
      case 'reward-centre':
        return <RewardCentre />
      case 'voucher-wallet':
        return <VoucherWallet />
      case 'download-locker':
        return <DownloadLocker />
      case 'email-confirmation':
        return <EmailConfirmation />
      case 'premium-advertiser-signup':
        return <PremiumAdvertiserSignup onBackToAdvertiser={() => navigateTo('advertiser')} />
      case 'advertiser-signup':
        return <PremiumAdvertiserSignup onBackToAdvertiser={() => navigateTo('advertiser')} />
      case 'business-report':
        return <BusinessReport />
      case 'free-business-report':
        return <FreeBusinessReport onNavigate={navigateTo} />
      case 'business':
        return <BusinessAdvertising onClose={() => navigateTo('landing')} />
      case 'business-success':
        return <BusinessSuccess onNavigate={navigateTo} />
      case 'ad-builder':
        return <StreamlinedAdBuilder onNavigate={navigateTo} />
      default:
        return (
          <LandingPage 
            onShopperClick={() => navigateTo('price-checker')}
            onBusinessClick={() => navigateTo('business')}
          />
        )
    }
  }

  return (
    <div>
      <NavigationMenu currentPage={currentPage} onNavigate={(page: string) => navigateTo(page as Page)} />
      {renderPage()}
    </div>
  )
}

export default App