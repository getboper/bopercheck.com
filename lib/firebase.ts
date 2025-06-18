import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Validate Firebase environment variables with graceful fallback
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Firebase authentication will not work properly. Please check your environment configuration.');
  // Don't throw an error in production to prevent complete app failure
  if (import.meta.env.MODE === 'development') {
    throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
  }
}

// Only initialize Firebase if all required variables are present
let app = null;
let auth = null;
let analytics: Analytics | null = null;

if (import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_PROJECT_ID && 
    import.meta.env.VITE_FIREBASE_APP_ID) {
  
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: "426162881672",
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID
  };

  console.log('Firebase config initialized for project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    
    // Initialize Firebase Analytics - works in both development and production
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      try {
        // Firebase Analytics automatically uses the measurementId from config
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized successfully with measurement ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
        
        // Test analytics by sending an immediate test event
        setTimeout(() => {
          import('firebase/analytics').then(({ logEvent }) => {
            if (analytics) {
              logEvent(analytics, 'app_startup', {
                timestamp: new Date().toISOString(),
                environment: import.meta.env.MODE,
                measurement_id: import.meta.env.VITE_GA_MEASUREMENT_ID
              });
              console.log('Firebase Analytics test event sent successfully');
              console.log('Analytics sync status: Firebase connected to GA4 measurement ID', import.meta.env.VITE_GA_MEASUREMENT_ID);
            }
          });
        }, 1000);
      } catch (analyticsError) {
        console.error('Failed to initialize Firebase Analytics:', analyticsError);
        console.error('This may be due to missing Firebase configuration or network issues');
        analytics = null;
      }
    } else {
      console.warn('Firebase Analytics not initialized: Missing VITE_GA_MEASUREMENT_ID');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase not initialized due to missing environment variables');
}

export { auth, analytics };
export default app;