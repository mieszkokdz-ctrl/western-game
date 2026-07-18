export type Title = {
  id: string;
  title: string;
  author: string;
  category: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  poster: string;
  videoUrl: string;
  isMine?: boolean;
};

export const catalog: Title[] = [
  {
    id: 'gaming-lan-center',
    title: 'Ranked w salonie gier',
    author: '@appcreator',
    category: 'Gry',
    caption: 'Piątkowy wieczór to zawsze ranked 🎮💜 #leagueoflegends #gaming',
    likes: 0,
    comments: 0,
    shares: 0,
    poster: '',
    videoUrl: 'https://videos.pexels.com/video-files/7915036/7915036-hd_1080_1920_30fps.mp4',
  },
];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
