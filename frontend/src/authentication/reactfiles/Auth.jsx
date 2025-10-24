import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// --- Dual-Environment Firebase Config ---

// 1. Try to get the injected config from the window
const injectedConfig = window.__firebase_config;

let firebaseConfig;

if (injectedConfig && injectedConfig !== '{}') {
  // We are in the deployed environment
  firebaseConfig = JSON.parse(injectedConfig);
} else {
  // We are in the local dev environment, use .env variables
  // Ensure Vite environment variables are loaded correctly
  // Note: The warnings about import.meta might indicate a build target issue,
  // but this is the standard Vite way to access them.
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

// 2. Initialize Firebase
// Add a check to ensure config is valid before initializing
let app;
let auth;
if (firebaseConfig && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    console.error("Firebase configuration is missing or invalid. Auth features will be disabled.");
    // Optionally handle this error more gracefully, e.g., show a message to the user
}

const initialAuthToken = window.__initial_auth_token;

// Create the context
const AuthContext = createContext();

// Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// --- AuthProvider Component ---
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Firebase Auth Functions ---
  // Ensure auth is initialized before defining functions
  const signup = (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized."));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized."));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized."));
    return signOut(auth);
  };

  // --- Auth State Listener ---
  useEffect(() => {
    // Only set up listener if auth is initialized
    if (!auth) {
        setLoading(false);
        return; // Exit if Firebase is not configured
    }

    const handleAuth = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(auth, initialAuthToken);
            } else {
              // Only sign in anonymously if all else fails
              await signInAnonymously(auth);
            }
            // Update currentUser after potential sign-in
             setCurrentUser(auth.currentUser);
          } catch (error) {
            console.error("Auth sign-in failed:", error);
             setCurrentUser(null); // Ensure currentUser is null on error
          }
        }
        setLoading(false);
      });
    };
    handleAuth();
    
    // Cleanup function
    // return () => unsubscribe(); // Assuming onAuthStateChanged returns an unsubscribe function
    // Note: Need to verify if onAuthStateChanged returns unsubscribe in this setup.
    // If it does, store the result of onAuthStateChanged and call it here.

  }, []); // Dependency array remains empty

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  // Render children only when loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

