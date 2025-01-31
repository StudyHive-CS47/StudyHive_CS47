import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0ic9ZNWsN_CzvOzl4tQO1_9t13QF_K70",
  authDomain: "studyhive-9c413.firebaseapp.com",
  projectId: "studyhive-9c413",
  storageBucket: "studyhive-9c413.firebasestorage.app",
  messagingSenderId: "359552143324",
  appId: "1:359552143324:web:64184da34b6955a5b24919",
  measurementId: "G-P9XJ4L7WM5"
};

// Initialize Firebase only if no apps exist
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;