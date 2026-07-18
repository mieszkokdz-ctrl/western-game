import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.shares.v1';

type SharesContextValue = {
  getShareCount: (id: string) => number;
  incrementShare: (id: string) => void;
};

const SharesContext = createContext<SharesContextValue | null>(null);

export function SharesProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setCounts(JSON.parse(value));
    });
  }, []);

  const incrementShare = useCallback((id: string) => {
    setCounts(prev => {
      const next = { ...prev, [id]: (prev[id] ?? 0) + 1 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getShareCount = useCallback((id: string) => counts[id] ?? 0, [counts]);

  const value = useMemo(() => ({ getShareCount, incrementShare }), [getShareCount, incrementShare]);

  return <SharesContext.Provider value={value}>{children}</SharesContext.Provider>;
}

export function useShares() {
  const ctx = useContext(SharesContext);
  if (!ctx) throw new Error('useShares must be used within SharesProvider');
  return ctx;
}
