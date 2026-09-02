import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  const { user, ready: authReady } = useAuth();
  const [isPremium, setIsPremium] = useState(true);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumError, setPremiumError] = useState(null);

  const checkPremiumStatus = useCallback(async () => {
    setIsPremium(true);
    setPremiumLoading(false);
    setPremiumError(null);
  }, []);

  const verifyKkiapayPayment = useCallback(async () => {
    console.info('Kkiapay est désactivé : l’application est entièrement gratuite.');
    return { data: { success: true, message: 'Accès gratuit activé.' } };
  }, []);

  useEffect(() => {
    if (authReady) {
      checkPremiumStatus(user?.id);
    }
  }, [authReady, user?.id, checkPremiumStatus]);

  return (
    <PremiumContext.Provider value={{ isPremium, premiumLoading, premiumError, checkPremiumStatus, verifyKkiapayPayment }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);

  if (!context) {
    return {
      isPremium: true,
      premiumLoading: false,
      premiumError: null,
      checkPremiumStatus: async () => {},
      verifyKkiapayPayment: async () => ({ data: { success: true } }),
    };
  }

  return context;
}