import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.shares.v1';
const SHARED_KEY = 'watchandchill.sharedIds.v1';

type SharesContextValue = {
  getShareCount: (id: string) => number;
  incrementShare: (id: string) => void;
  hasShared: (id: string) => boolean;
};

const SharesContext = createContext<SharesContextValue | null>(null);

export function SharesProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [sharedIds, setSharedIds] = useState<Record<string, true>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setCounts(JSON.parse(value));
    });
    AsyncStorage.getItem(SHARED_KEY).then(value => {
      if (value) setSharedIds(JSON.parse(value));
    });
  }, []);

  // Each video can only be counted as shared once per person, matching how
  // most apps avoid inflating share counts from repeated taps on the same link.
  const incrementShare = useCallback((id: string) => {
    setSharedIds(prevShared => {
      if (prevShared[id]) return prevShared;
      const nextShared = { ...prevShared, [id]: true as const };
      AsyncStorage.setItem(SHARED_KEY, JSON.stringify(nextShared));
      setCounts(prev => {
        const next = { ...prev, [id]: (prev[id] ?? 0) + 1 };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return nextShared;
    });
  }, []);

  const getShareCount = useCallback((id: string) => counts[id] ?? 0, [counts]);
  const hasShared = useCallback((id: string) => !!sharedIds[id], [sharedIds]);

  const value = useMemo(
    () => ({ getShareCount, incrementShare, hasShared }),
    [getShareCount, incrementShare, hasShared]
  );

  return <SharesContext.Provider value={value}>{children}</SharesContext.Provider>;
}

export function useShares() {
  const ctx = useContext(SharesContext);
  if (!ctx) throw new Error('useShares must be used within SharesProvider');
  return ctx;
}
