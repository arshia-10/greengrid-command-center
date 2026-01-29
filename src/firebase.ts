// Mock Firebase implementation for hackathon demo
// Replace with actual Firebase imports when configuring authentication

let currentUser: any = null;
const authStateListeners: Array<(user: any) => void> = [];

const notifyAuthStateChange = (user: any) => {
  authStateListeners.forEach((listener) => listener(user));
};

export const auth = {
  get currentUser() {
    return currentUser;
  },
  signInWithEmailAndPassword: async (_auth: any, email: string, password: string) => {
    // Mock authentication - always succeeds for demo
    console.log("Demo mode: Sign in with", email);
    const user = { 
      uid: "demo-user-" + Date.now(), 
      email: email,
      emailVerified: false 
    };
    currentUser = user;
    // Notify listeners of auth state change
    notifyAuthStateChange(user);
    return Promise.resolve({ user });
  },
  createUserWithEmailAndPassword: async (_auth: any, email: string, password: string) => {
    // Mock user creation - always succeeds for demo
    console.log("Demo mode: Create user with", email);
    const user = { 
      uid: "demo-user-" + Date.now(), 
      email: email,
      emailVerified: false 
    };
    currentUser = user;
    // Notify listeners of auth state change
    notifyAuthStateChange(user);
    return Promise.resolve({ user });
  },
  sendEmailVerification: async (user: any) => {
    console.log("Demo mode: Email verification sent to", user.email);
    return Promise.resolve();
  },
  // Mock onAuthStateChanged for demo
  onAuthStateChanged: (callback: (user: any) => void) => {
    authStateListeners.push(callback);
    // Immediately call with current user
    callback(currentUser);
    // Return unsubscribe function
    return () => {
      const index = authStateListeners.indexOf(callback);
      if (index > -1) {
        authStateListeners.splice(index, 1);
      }
    };
  },
};

export const db = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      set: async (data: any) => {
        console.log("Demo mode: Save to", name, id, data);
        return Promise.resolve();
      },
      get: async () => {
        return Promise.resolve({ data: () => ({}) });
      },
    }),
  }),
};

// Uncomment below and comment above when Firebase is configured:
/*
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
<<<<<<< Updated upstream
*/
=======
export const storage = getStorage(app); 
>>>>>>> Stashed changes
