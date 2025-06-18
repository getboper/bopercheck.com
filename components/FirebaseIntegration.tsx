import React, { useState } from 'react'

interface FirebaseIntegrationProps {
  onBackToDemo?: () => void
}

const FirebaseIntegration: React.FC<FirebaseIntegrationProps> = ({
  onBackToDemo
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('Connected')
  const [lastSync, setLastSync] = useState<string | null>(null)

  const handleSyncData = async () => {
    setIsLoading(true)
    
    // Simulate Firebase data sync
    setTimeout(() => {
      setIsLoading(false)
      setLastSync(new Date().toLocaleTimeString())
      alert('Firebase data sync completed successfully!')
    }, 2000)
  }

  const firebaseConfig = `const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "getboper.firebaseapp.com",
  projectId: "getboper",
  storageBucket: "getboper.appspot.com",
  messagingSenderId: "426162881672",
  appId: "1:426162881672:web:535cd20b0ff473f8b90b3d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load reviews from Firestore
async function loadReviews() {
  try {
    const snapshot = await db.collection('reviews')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    let totalRating = 0;
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const stars = '⭐'.repeat(data.rating || 0);
      const comment = data.comment || '';
      const user = data.user || 'Anonymous';

      totalRating += data.rating;
      count++;

      // Render review to DOM
      const review = document.createElement('div');
      review.className = 'review';
      review.innerHTML = \`
        <div class="stars">\${stars}</div>
        \${comment ? \`<p>"\${comment}"</p>\` : ''}
        <span class="user">– \${user}</span>
      \`;
      reviewsContainer.appendChild(review);
    });

    // Update average rating
    if (count > 0) {
      const avg = (totalRating / count).toFixed(1);
      averageRatingDisplay.textContent = \`⭐ Rated \${avg} by Our Users\`;
    }

  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
}`

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
          🔥 Firebase Integration Dashboard
        </h1>
        
        <div className="mb-6">
          <h2 className="text-xl mb-4 text-gray-800">Connection Status</h2>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold">Status: {connectionStatus}</span>
              </div>
              <div className="text-sm text-gray-600">
                Project: getboper.firebaseapp.com
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Data Collections</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800">Reviews</div>
              <div className="text-sm text-blue-600">Live user testimonials</div>
              <div className="text-xs text-gray-500 mt-1">Last updated: 2 min ago</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800">Users</div>
              <div className="text-sm text-purple-600">User profiles and activity</div>
              <div className="text-xs text-gray-500 mt-1">Last updated: 5 min ago</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800">Searches</div>
              <div className="text-sm text-green-600">Price check queries</div>
              <div className="text-xs text-gray-500 mt-1">Last updated: 1 min ago</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-semibold text-orange-800">Businesses</div>
              <div className="text-sm text-orange-600">Advertiser profiles</div>
              <div className="text-xs text-gray-500 mt-1">Last updated: 10 min ago</div>
            </div>
          </div>
          
          {lastSync && (
            <p className="text-sm text-gray-600">
              Last sync: {lastSync}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Sync Data</h3>
          <button
            onClick={handleSyncData}
            disabled={isLoading}
            className="py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Syncing Data...' : 'Sync All Collections'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3">Integration Code</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {firebaseConfig}
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

export default FirebaseIntegration