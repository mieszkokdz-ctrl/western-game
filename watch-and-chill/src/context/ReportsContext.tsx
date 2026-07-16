import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchandchill.reportedVideos.v1';

export const REPORT_REASONS = [
  'Spam lub wprowadzanie w błąd',
  'Nagość lub treści dla dorosłych',
  'Przemoc lub niebezpieczne treści',
  'Nękanie lub mowa nienawiści',
  'Naruszenie praw autorskich',
  'Inne',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

type Report = { id: string; reason: ReportReason; reportedAt: number };

type ReportsContextValue = {
  reports: Report[];
  isReported: (id: string) => boolean;
  reportVideo: (id: string, reason: ReportReason) => void;
};

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) setReports(JSON.parse(value));
    });
  }, []);

  const reportVideo = useCallback((id: string, reason: ReportReason) => {
    setReports(prev => {
      if (prev.some(r => r.id === id)) return prev;
      const next = [...prev, { id, reason, reportedAt: Date.now() }];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isReported = useCallback((id: string) => reports.some(r => r.id === id), [reports]);

  const value = useMemo(() => ({ reports, isReported, reportVideo }), [reports, isReported, reportVideo]);

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
