import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.userProfile.v1';
const DEFAULT_USERNAME = '@ty';

type UserProfileContextValue = {
  username: string;
  setUsername: (username: string) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState(DEFAULT_USERNAME);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setUsernameState(value);
    });
  }, []);

  const setUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    setUsernameState(normalized);
    AsyncStorage.setItem(STORAGE_KEY, normalized);
  }, []);

  const value = useMemo(() => ({ username, setUsername }), [username, setUsername]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
