import { createRoot } from "react-dom/client";
import "./index.css";

// Emergency minimal app to get site working
function EmergencyApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BoperCheck</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#business" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Business</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Instant AI Price Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get AI-powered price comparisons to find the best deals on any purchase. 
            Save money with intelligent price checking.
          </p>
          
          {/* Simple Price Check Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-4">
              <textarea
                placeholder="Describe what you want to buy... (e.g., 'iPhone 15 Pro 256GB', 'Gaming laptop under £1000')"
                className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24"
              />
              <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
                🔍 Check Prices Now - FREE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            🚀 Grow Your Business with BoperCheck
          </h2>
          <p className="text-xl mb-8">
            Get featured when customers search for your products & services
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
            <a 
              href="mailto:support@bopercheck.com?subject=Business Advertising Inquiry"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              🎯 Start Advertising Today
            </a>
            <a 
              href="mailto:support@bopercheck.com?subject=Business Plans Inquiry"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              📈 View Business Plans
            </a>
          </div>
          <p className="text-lg mt-6 opacity-90">
            From £35/month • Get customers actively searching for you
          </p>
        </div>
      </section>

      {/* Contact */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
          <p className="text-gray-300 mb-6">
            Questions? Want to advertise your business? Contact us today.
          </p>
          <a 
            href="mailto:support@bopercheck.com"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Email: support@bopercheck.com
          </a>
        </div>
      </footer>
    </div>
  );
}

// Mount the emergency app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(<EmergencyApp />);
  
  console.log("Emergency BoperCheck app loaded successfully");
} catch (error) {
  console.error("Failed to load emergency app:", error);
  
  // Last resort: show basic HTML
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>BoperCheck - Temporarily Unavailable</h1>
        <p>We're experiencing technical difficulties. Please contact support@bopercheck.com</p>
        <a href="mailto:support@bopercheck.com" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Contact Support</a>
      </div>
    `;
  }
}