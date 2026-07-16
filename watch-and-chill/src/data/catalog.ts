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

const MIXKIT = 'https://assets.mixkit.co/videos/preview';

export const catalog: Title[] = [
  // --- Gry ---
  {
    id: 'gaming-controller',
    title: 'Sesja z padem',
    author: '@gracz_pro',
    category: 'Gry',
    caption: 'Wieczorna sesja się zaczyna 🎮🔥 #gaming #gry',
    likes: 184200,
    comments: 3120,
    shares: 1450,
    poster: 'https://picsum.photos/seed/wc-gaming-controller/400/700',
    videoUrl: `${MIXKIT}/mixkit-hands-holding-a-game-controller-5145-large.mp4`,
  },
  {
    id: 'gaming-vr',
    title: 'VR na maksa',
    author: '@wirtualnyswiat',
    category: 'Gry',
    caption: 'Wchodzę do innego świata 🥽🌀 #vr #gaming',
    likes: 267800,
    comments: 5430,
    shares: 2980,
    poster: 'https://picsum.photos/seed/wc-gaming-vr/400/700',
    videoUrl: `${MIXKIT}/mixkit-man-playing-in-a-vr-headset-4404-large.mp4`,
  },
  {
    id: 'gaming-mobile-neon',
    title: 'Neonowy setup',
    author: '@gamerka_pl',
    category: 'Gry',
    caption: 'Telefon, neony i dobra gra 📱💜 #mobilegaming #neon',
    likes: 143900,
    comments: 2610,
    shares: 980,
    poster: 'https://picsum.photos/seed/wc-gaming-mobile/400/700',
    videoUrl: `${MIXKIT}/mixkit-gamer-girl-playing-on-her-cell-phone-in-a-neon-room-26053-large.mp4`,
  },
  {
    id: 'gaming-night',
    title: 'Nocna zmiana',
    author: '@nightowl_gg',
    category: 'Gry',
    caption: '3 nad ranem, jeszcze jeden mecz 🌙🎮 #gaming #nightgaming',
    likes: 98700,
    comments: 1870,
    shares: 640,
    poster: 'https://picsum.photos/seed/wc-gaming-night/400/700',
    videoUrl: `${MIXKIT}/mixkit-gamer-playing-video-games-at-night-4834-large.mp4`,
  },
  {
    id: 'gaming-headphones',
    title: 'W słuchawkach',
    author: '@kitty_plays',
    category: 'Gry',
    caption: 'Ulubione słuchawki, ulubiona gra 🎧✨ #gaming #cozy',
    likes: 205300,
    comments: 4020,
    shares: 1760,
    poster: 'https://picsum.photos/seed/wc-gaming-headphones/400/700',
    videoUrl: `${MIXKIT}/mixkit-a-young-woman-with-kitty-headphones-enjoys-a-gaming-session-51623-large.mp4`,
  },
  {
    id: 'gaming-cyberpunk',
    title: 'Cyberpunkowe miasto',
    author: '@futureplayer',
    category: 'Gry',
    caption: 'Kiedy gra wygląda jak film 🌆🤖 #cyberpunk #gry',
    likes: 312400,
    comments: 6750,
    shares: 3410,
    poster: 'https://picsum.photos/seed/wc-gaming-cyberpunk/400/700',
    videoUrl: `${MIXKIT}/mixkit-cyberpunk-soldier-running-in-a-futuristic-city-43187-large.mp4`,
  },

  // --- Impreza ---
  {
    id: 'party-friends',
    title: 'Ekipa w akcji',
    author: '@nocneklimaty',
    category: 'Impreza',
    caption: 'Najlepsza ekipa, najlepsza noc 🎉💃 #impreza #friends',
    likes: 156800,
    comments: 2890,
    shares: 1120,
    poster: 'https://picsum.photos/seed/wc-party-friends/400/700',
    videoUrl: `${MIXKIT}/mixkit-group-of-friends-partying-happily-4640-large.mp4`,
  },
  {
    id: 'party-dance',
    title: 'Taniec pod neonami',
    author: '@nocneklimaty',
    category: 'Impreza',
    caption: 'Światła, muzyka, ruch 💃🕺 #taniec #nightlife',
    likes: 121500,
    comments: 2340,
    shares: 870,
    poster: 'https://picsum.photos/seed/wc-party-dance/400/700',
    videoUrl: `${MIXKIT}/mixkit-man-dancing-under-changing-lights-1240-large.mp4`,
  },
  {
    id: 'party-neon-girl',
    title: 'Neonowe wibracje',
    author: '@neonvibes',
    category: 'Impreza',
    caption: 'Ten klimat nocnego miasta ✨🌃 #neon #vibes',
    likes: 89400,
    comments: 1560,
    shares: 510,
    poster: 'https://picsum.photos/seed/wc-party-neon/400/700',
    videoUrl: `${MIXKIT}/mixkit-girl-in-neon-sign-1232-large.mp4`,
  },

  // --- Relaks ---
  {
    id: 'relax-campfire',
    title: 'Ciepło przy ognisku',
    author: '@chillvibes',
    category: 'Relaks',
    caption: 'Gorąca herbata i dobre towarzystwo 🔥🍵 #chill #ognisko',
    likes: 67300,
    comments: 980,
    shares: 340,
    poster: 'https://picsum.photos/seed/wc-relax-campfire/400/700',
    videoUrl: `${MIXKIT}/mixkit-people-pouring-a-warm-drink-around-a-campfire-513-large.mp4`,
  },
  {
    id: 'relax-pool',
    title: 'Letnie odbicie',
    author: '@slowliving',
    category: 'Relaks',
    caption: 'Woda, słońce, spokój 💦☀️ #lato #relaks',
    likes: 78900,
    comments: 1120,
    shares: 390,
    poster: 'https://picsum.photos/seed/wc-relax-pool/400/700',
    videoUrl: `${MIXKIT}/mixkit-womans-feet-splashing-in-the-pool-1261-large.mp4`,
  },
  {
    id: 'space-stars',
    title: 'Gwiezdny pył',
    author: '@kosmiczne_klimaty',
    category: 'Kosmos',
    caption: 'Kiedy patrzysz w niebo i zapominasz o wszystkim 🌌✨ #kosmos #gwiazdy',
    likes: 234600,
    comments: 4210,
    shares: 2650,
    poster: 'https://picsum.photos/seed/wc-space-stars/400/700',
    videoUrl: `${MIXKIT}/mixkit-stars-in-space-1610-large.mp4`,
  },

  // --- Technologia ---
  {
    id: 'tech-laptop',
    title: 'Kod na laptopie',
    author: '@devlife',
    category: 'Technologia',
    caption: 'Kolejna linijka kodu... 💻⌨️ #tech #coding',
    likes: 54200,
    comments: 870,
    shares: 260,
    poster: 'https://picsum.photos/seed/wc-tech-laptop/400/700',
    videoUrl: `${MIXKIT}/mixkit-close-up-of-a-man-typing-on-a-laptop-4347-large.mp4`,
  },
  {
    id: 'tech-server',
    title: 'Serce serwerowni',
    author: '@devlife',
    category: 'Technologia',
    caption: 'Tu żyje internet 🖥️⚡ #tech #serwery',
    likes: 45700,
    comments: 690,
    shares: 210,
    poster: 'https://picsum.photos/seed/wc-tech-server/400/700',
    videoUrl: `${MIXKIT}/mixkit-server-room-rack-with-flashing-lights-21447-large.mp4`,
  },
  {
    id: 'tech-cyberpunk-city',
    title: 'Miasto przyszłości',
    author: '@futureplayer',
    category: 'Technologia',
    caption: 'Neonowe ulice 2077 🌆💜 #cyberpunk #future',
    likes: 189300,
    comments: 3450,
    shares: 1980,
    poster: 'https://picsum.photos/seed/wc-tech-cyberpunk-city/400/700',
    videoUrl: `${MIXKIT}/mixkit-cyberpunk-city-and-neon-lights-animation-94921-large.mp4`,
  },

  // --- Outdoor ---
  {
    id: 'outdoor-park',
    title: 'Słoneczny dzień w parku',
    author: '@miejskiwlóczykij',
    category: 'Outdoor',
    caption: 'Spacer, słońce, dobra energia ☀️🌳 #outdoor #park',
    likes: 41800,
    comments: 620,
    shares: 180,
    poster: 'https://picsum.photos/seed/wc-outdoor-park/400/700',
    videoUrl: `${MIXKIT}/mixkit-urban-man-in-a-park-on-a-sunny-day-2015-large.mp4`,
  },
];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
