import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.blockedUsers.v1';

type BlockedUsersContextValue = {
  blockedAuthors: string[];
  isBlocked: (author: string) => boolean;
  blockUser: (author: string) => void;
  unblockUser: (author: string) => void;
};

const BlockedUsersContext = createContext<BlockedUsersContextValue | null>(null);

export function BlockedUsersProvider({ children }: { children: React.ReactNode }) {
  const [blockedAuthors, setBlockedAuthors] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setBlockedAuthors(JSON.parse(value));
    });
  }, []);

  const blockUser = useCallback((author: string) => {
    setBlockedAuthors(prev => {
      if (prev.includes(author)) return prev;
      const next = [...prev, author];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unblockUser = useCallback((author: string) => {
    setBlockedAuthors(prev => {
      const next = prev.filter(a => a !== author);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBlocked = useCallback((author: string) => blockedAuthors.includes(author), [blockedAuthors]);

  const value = useMemo(
    () => ({ blockedAuthors, isBlocked, blockUser, unblockUser }),
    [blockedAuthors, isBlocked, blockUser, unblockUser]
  );

  return <BlockedUsersContext.Provider value={value}>{children}</BlockedUsersContext.Provider>;
}

export function useBlockedUsers() {
  const ctx = useContext(BlockedUsersContext);
  if (!ctx) throw new Error('useBlockedUsers must be used within BlockedUsersProvider');
  return ctx;
}
