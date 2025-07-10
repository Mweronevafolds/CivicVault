import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQoP2thvMIveTamnMLxpIEnJN6vePYfeg",
  authDomain: "civicvault-17dad.firebaseapp.com",
  projectId: "civicvault-17dad",
  storageBucket: "civicvault-17dad.firebasestorage.app",
  messagingSenderId: "7696407243",
  appId: "1:7696407243:web:1234567890abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
