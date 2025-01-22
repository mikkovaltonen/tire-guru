import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.error('Firebase API key is missing');
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('Initializing Firebase with project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);

// Use new cache settings instead of enableIndexedDbPersistence
const db = initializeFirestore(app, {
  cacheSizeBytes: 50 * 1024 * 1024, // 50 MB cache size
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  cache: {
    lru: {
      sizeBytes: 50 * 1024 * 1024 // 50 MB
    }
  }
});

// Add connection state logging
window.addEventListener('online', () => {
  console.log('App is online - reconnecting to Firebase');
});

window.addEventListener('offline', () => {
  console.warn('App is offline - using cached data');
});

export { db };
export default app; 