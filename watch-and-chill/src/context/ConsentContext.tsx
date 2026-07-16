import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.consent.v1';

type ConsentContextValue = {
  isLoading: boolean;
  hasAccepted: boolean;
  accept: () => Promise<void>;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => setHasAccepted(value === 'true'))
      .finally(() => setIsLoading(false));
  }, []);

  const accept = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setHasAccepted(true);
  };

  const value = useMemo(() => ({ isLoading, hasAccepted, accept }), [isLoading, hasAccepted]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
