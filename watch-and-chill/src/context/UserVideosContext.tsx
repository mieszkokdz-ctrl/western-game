import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Title } from '../data/catalog';

type UserVideosContextValue = {
  videos: Title[];
  addVideo: (uri: string, caption: string, author: string) => void;
  deleteVideo: (id: string) => void;
};

const UserVideosContext = createContext<UserVideosContextValue | null>(null);

let nextId = 1;

export function UserVideosProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Title[]>([]);

  const addVideo = useCallback((uri: string, caption: string, author: string) => {
    const video: Title = {
      id: `mine-${nextId++}`,
      title: 'Twój short',
      author,
      category: 'Twoje',
      caption: caption.trim() || 'Mój nowy short 🎬',
      likes: 0,
      comments: 0,
      shares: 0,
      poster: '',
      videoUrl: uri,
      isMine: true,
    };
    setVideos(prev => [video, ...prev]);
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  const value = useMemo(() => ({ videos, addVideo, deleteVideo }), [videos, addVideo, deleteVideo]);

  return <UserVideosContext.Provider value={value}>{children}</UserVideosContext.Provider>;
}

export function useUserVideos() {
  const ctx = useContext(UserVideosContext);
  if (!ctx) throw new Error('useUserVideos must be used within UserVideosProvider');
  return ctx;
}
