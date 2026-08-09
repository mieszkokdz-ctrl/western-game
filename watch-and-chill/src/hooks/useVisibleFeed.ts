import { useMemo } from 'react';
import { useBlockedUsers } from '../context/BlockedUsersContext';
import { useReports } from '../context/ReportsContext';
import { useUserVideos } from '../context/UserVideosContext';
import { catalog } from '../data/catalog';

export function useVisibleFeed() {
  const { videos } = useUserVideos();
  const { isBlocked } = useBlockedUsers();
  const { isReported } = useReports();

  return useMemo(() => {
    return [...videos, ...catalog].filter(item => !isBlocked(item.author) && !isReported(item.id));
  }, [videos, isBlocked, isReported]);
}
