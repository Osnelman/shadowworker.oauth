import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION);

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const { user, ready: authReady } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [premiumError, setPremiumError] = useState(null);

  const checkPremiumStatus = useCallback(async (userId) => {
    if (!userId || userId.startsWith('guest-')) {
      setIsPremium(false);
      setPremiumLoading(false);
      return;
    }

    setPremiumLoading(true);
    setPremiumError(null);
    try {
      const premiumDocRef = doc(db, 'premiumUsers', userId);
      const premiumDocSnap = await getDoc(premiumDocRef);

      if (premiumDocSnap.exists() && premiumDocSnap.data().isPremium) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut premium:", err);
      setPremiumError("Impossible de vérifier le statut premium.");
      setIsPremium(false);
    } finally {
      setPremiumLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) {
      checkPremiumStatus(user?.id);
    }
  }, [user?.id, authReady, checkPremiumStatus]);

  const verifyKkiapayPayment = httpsCallable(functions, 'verifyKkiapayPayment');

  return (
    <PremiumContext.Provider value={{ isPremium, premiumLoading, premiumError, checkPremiumStatus, verifyKkiapayPayment }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium doit être utilisé à l\'intérieur d\'un PremiumProvider');
  }
  return context;
}