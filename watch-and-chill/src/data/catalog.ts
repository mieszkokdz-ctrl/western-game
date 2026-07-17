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

export const catalog: Title[] = [];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
