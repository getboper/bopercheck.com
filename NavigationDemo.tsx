import React, { useState } from 'react'

interface NavigationDemoProps {
  onNavigate: (page: string) => void
  currentPage: string
}

const NavigationDemo: React.FC<NavigationDemoProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false)

  const demoFlows = [
    {
      title: "🔍 Searcher Journey",
      description: "Complete user experience from registration to rewards",
      pages: [
        { id: 'landing', name: 'Registration/Login', description: 'User signup and authentication' },
        { id: 'price-checker', name: 'Product Search', description: 'Claude AI price comparison' },
        { id: 'voucher-jar', name: 'Voucher Collection', description: 'Firebase reward accumulation' },
        { id: 'referral-unlock', name: 'Referral System', description: 'Social sharing and rewards' },
        { id: 'pdf-unlock', name: 'PDF Unlock', description: 'Stripe payment processing' }
      ]
    },
    {
      title: "🏪 Advertiser Journey", 
      description: "Business signup and campaign management",
      pages: [
        { id: 'weekly-report', name: 'Weekly Report CTA', description: 'SendGrid email automation' },
        { id: 'advertiser-signup', name: 'Business Signup', description: 'Multi-step verification' },
        { id: 'business-ads', name: 'Ad Dashboard', description: 'Campaign management' },
        { id: 'public-ads', name: 'Live Ad Feed', description: 'Published advertisements' }
      ]
    },
    {
      title: "👑 Owner Dashboard",
      description: "Admin analytics and system monitoring", 
      pages: [
        { id: 'owner-dashboard', name: 'Admin Access', description: 'System overview and metrics' },
        { id: 'admin', name: 'Live Analytics', description: 'Real-time business intelligence' },
        { id: 'sendgrid-rewards', name: 'Integration Status', description: 'SendGrid and Stripe monitoring' }
      ]
    },
    {
      title: "🎁 Reward Systems",
      description: "Comprehensive gamification features",
      pages: [
        { id: 'voucher-pot', name: 'Voucher Pot', description: 'Savings accumulation' },
        { id: 'freebie-panel', name: 'Freebie Panel', description: 'Task-based rewards' },
        { id: 'reward-centre', name: 'Reward Centre', description: 'Achievement tracking' },
        { id: 'streak-tracker', name: 'Streak Tracker', description: 'Daily activity rewards' }
      ]
    }
  ]

  const integrationStatus = [
    { name: 'Firebase', status: 'Connected', project: 'getboper' },
    { name: 'SendGrid', status: 'Active', project: 'Email automation' },
    { name: 'Stripe', status: 'Ready', project: 'Payment processing' },
    { name: 'Claude AI', status: 'Operational', project: 'Market analysis' }
  ]

  return (
    <>
      {/* Navigation Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Demo Navigation"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Navigation Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">BoperCheck Demo Navigation</h2>
              
              {/* Integration Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-700">Live Integration Status</h3>
                {integrationStatus.map((integration, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{integration.name}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {integration.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Demo Flows */}
              {demoFlows.map((flow, flowIndex) => (
                <div key={flowIndex} className="mb-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{flow.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{flow.description}</p>
                  
                  <div className="space-y-2">
                    {flow.pages.map((page, pageIndex) => (
                      <button
                        key={pageIndex}
                        onClick={() => {
                          onNavigate(page.id)
                          setIsOpen(false)
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          currentPage === page.id
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium text-sm">{page.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Recording Instructions */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Recording Guide</h3>
                <p className="text-sm text-red-700 mb-2">
                  Follow the demo flows in order for optimal walkthrough recording.
                </p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• Start with Searcher Journey (8 minutes)</li>
                  <li>• Continue to Advertiser Journey (7 minutes)</li>
                  <li>• Finish with Owner Dashboard (7 minutes)</li>
                  <li>• All integrations use live data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavigationDemo