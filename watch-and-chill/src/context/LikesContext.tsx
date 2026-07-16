import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type LikesContextValue = {
  ids: string[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
};

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const toggleLike = useCallback((id: string) => {
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  const isLiked = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(() => ({ ids, isLiked, toggleLike }), [ids, isLiked, toggleLike]);

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used within LikesProvider');
  return ctx;
}
