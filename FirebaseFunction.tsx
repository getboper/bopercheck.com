import React, { useState } from 'react'

interface FirebaseFunctionProps {
  onBackToDemo?: () => void
}

const FirebaseFunction: React.FC<FirebaseFunctionProps> = ({
  onBackToDemo
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastTriggered, setLastTriggered] = useState<string | null>(null)

  const handleTestFunction = async () => {
    setIsLoading(true)
    
    // Simulate Firebase function execution
    setTimeout(() => {
      setIsLoading(false)
      setLastTriggered(new Date().toLocaleTimeString())
      alert('Firebase function executed successfully! Email alerts sent to matching advertisers.')
    }, 2000)
  }

  const functionCode = `const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendAdvertiserAlert = functions.firestore
  .document("priceChecks/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { searchTerm, location } = data;

    // Lookup advertisers matching location + keyword
    const advertisersRef = admin.firestore().collection("advertisers");
    const snapshot = await advertisersRef
      .where("location", "==", location)
      .get();

    if (snapshot.empty) {
      console.log("No matching advertisers.");
      return null;
    }

    const advertisers = [];
    snapshot.forEach(doc => advertisers.push(doc.data()));

    // Send email to each matching advertiser
    for (const advertiser of advertisers) {
      const msg = {
        to: advertiser.email,
        from: "support@bopercheck.com",
        subject: \`Someone just searched "\${searchTerm}" in \${location}\`,
        html: \`
          <h2>📢 Your Business Opportunity Alert</h2>
          <p>We detected someone searched for <strong>\${searchTerm}</strong> in <strong>\${location}</strong>.</p>
          <p>You're not currently featured — would you like to be?</p>
          <a href="https://bopercheck.com/advertise" style="padding:10px 18px;background:#3b82f6;color:white;text-decoration:none;border-radius:8px;">Feature My Business</a>
          <p style="font-size:12px;color:#888;margin-top:20px;">You received this alert based on a relevant match. Unsubscribe in your settings.</p>
        \`
      };

      await sgMail.send(msg);
      console.log("Email sent to:", advertiser.email);
    }

    return null;
  });`

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f8fafc"
      }}
    >
      <div 
        className="max-w-4xl mx-auto rounded-xl p-8"
        style={{ 
          background: "white",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)"
        }}
      >
        <h1 className="text-3xl mb-6 text-center">
          🔥 Firebase Function: Advertiser Alerts
        </h1>
        
        <div className="mb-6">
          <h2 className="text-xl mb-4 text-gray-800">Function Overview</h2>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-4">
            <p className="text-blue-800">
              <strong>Trigger:</strong> Firestore document creation in "priceChecks" collection
            </p>
            <p className="text-blue-800">
              <strong>Action:</strong> Send email alerts to matching local businesses
            </p>
            <p className="text-blue-800">
              <strong>Integration:</strong> SendGrid for email delivery
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Function Status</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Function Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>SendGrid Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Firestore Listening</span>
            </div>
          </div>
          
          {lastTriggered && (
            <p className="text-sm text-gray-600">
              Last triggered: {lastTriggered}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Test Function</h3>
          <button
            onClick={handleTestFunction}
            disabled={isLoading}
            className="py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Executing Function...' : 'Trigger Test Alert'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Function Code</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {functionCode}
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={onBackToDemo}
            className="py-2 px-4 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirebaseFunction