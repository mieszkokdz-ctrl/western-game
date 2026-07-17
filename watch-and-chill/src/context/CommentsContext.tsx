import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.comments.v1';

export type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: number;
};

type CommentsByVideo = Record<string, Comment[]>;

type CommentsContextValue = {
  getComments: (videoId: string) => Comment[];
  addComment: (videoId: string, text: string) => void;
};

const CommentsContext = createContext<CommentsContextValue | null>(null);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [commentsByVideo, setCommentsByVideo] = useState<CommentsByVideo>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setCommentsByVideo(JSON.parse(value));
    });
  }, []);

  const addComment = useCallback((videoId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setCommentsByVideo(prev => {
      const comment: Comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        author: '@ty',
        text: trimmed,
        createdAt: Date.now(),
      };
      const next = { ...prev, [videoId]: [...(prev[videoId] ?? []), comment] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getComments = useCallback((videoId: string) => commentsByVideo[videoId] ?? [], [commentsByVideo]);

  const value = useMemo(() => ({ getComments, addComment }), [getComments, addComment]);

  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>;
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error('useComments must be used within CommentsProvider');
  return ctx;
}
