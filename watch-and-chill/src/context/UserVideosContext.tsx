import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { Title } from '../data/catalog';
import { deleteVideoBlob, getVideoBlob, saveVideoBlob } from '../utils/videoBlobStore';

const STORAGE_KEY = 'watchandchill.userVideos.v1';

type UserVideosContextValue = {
  videos: Title[];
  addVideo: (uri: string, caption: string, author: string) => void;
  deleteVideo: (id: string) => void;
};

const UserVideosContext = createContext<UserVideosContextValue | null>(null);

let nextId = 1;

export function UserVideosProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Title[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async value => {
      if (!value) return;
      const stored: Title[] = JSON.parse(value);
      if (Platform.OS !== 'web') {
        setVideos(stored);
        return;
      }
      // On web, the recorded video itself lives in IndexedDB — the blob: URL
      // saved alongside it dies with the page, so a fresh one is minted here.
      const restored = await Promise.all(
        stored.map(async video => {
          const blob = await getVideoBlob(video.id).catch(() => null);
          return blob ? { ...video, videoUrl: URL.createObjectURL(blob) } : video;
        })
      );
      setVideos(restored);
    });
  }, []);

  const persist = (next: Title[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addVideo = useCallback((uri: string, caption: string, author: string) => {
    const id = `mine-${nextId++}`;
    const video: Title = {
      id,
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
    setVideos(prev => {
      const next = [video, ...prev];
      persist(next);
      return next;
    });
    if (Platform.OS === 'web' && uri.startsWith('blob:')) {
      fetch(uri)
        .then(res => res.blob())
        .then(blob => saveVideoBlob(id, blob))
        .catch(() => {});
    }
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => {
      const next = prev.filter(v => v.id !== id);
      persist(next);
      return next;
    });
    if (Platform.OS === 'web') {
      deleteVideoBlob(id).catch(() => {});
    }
  }, []);

  const value = useMemo(() => ({ videos, addVideo, deleteVideo }), [videos, addVideo, deleteVideo]);

  return <UserVideosContext.Provider value={value}>{children}</UserVideosContext.Provider>;
}

export function useUserVideos() {
  const ctx = useContext(UserVideosContext);
  if (!ctx) throw new Error('useUserVideos must be used within UserVideosProvider');
  return ctx;
}
