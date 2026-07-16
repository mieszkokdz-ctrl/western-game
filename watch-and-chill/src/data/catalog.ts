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

const BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';

export const catalog: Title[] = [
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    author: '@wesolykrolik',
    category: 'Polecane',
    caption: 'Gdy sąsiedzi robią Ci kawały, ale Ty masz plan 🐰 #polecane #animacja',
    likes: 128400,
    comments: 2310,
    shares: 890,
    poster: 'https://picsum.photos/seed/wc-bunny/400/700',
    videoUrl: `${BASE}/BigBuckBunny.mp4`,
  },
  {
    id: 'elephants-dream',
    title: "Elephant's Dream",
    author: '@snygrafika',
    category: 'Polecane',
    caption: 'Zgubieni w mechanicznym świecie... znajdziemy drogę? ⚙️ #scifi #polecane',
    likes: 98200,
    comments: 1540,
    shares: 430,
    poster: 'https://picsum.photos/seed/wc-elephant/400/700',
    videoUrl: `${BASE}/ElephantsDream.mp4`,
  },
  {
    id: 'sintel',
    title: 'Sintel',
    author: '@wojowniczka',
    category: 'Akcja',
    caption: 'Szukam mojego smoka do końca świata 🐉⚔️ #akcja #fantasy',
    likes: 341000,
    comments: 8760,
    shares: 5200,
    poster: 'https://picsum.photos/seed/wc-sintel/400/700',
    videoUrl: `${BASE}/Sintel.mp4`,
  },
  {
    id: 'tears-of-steel',
    title: 'Tears of Steel',
    author: '@amsterdam2065',
    category: 'Akcja',
    caption: 'Cofamy błąd, który zniszczył miasto 🤖 #akcja #future',
    likes: 156700,
    comments: 3020,
    shares: 1100,
    poster: 'https://picsum.photos/seed/wc-tears/400/700',
    videoUrl: `${BASE}/TearsOfSteel.mp4`,
  },
  {
    id: 'blazes',
    title: 'Płomienie o zmierzchu',
    author: '@chillvibes',
    category: 'Relaks',
    caption: 'Wieczorna herbata i ognisko 🔥🍵 #chill #relaks',
    likes: 45300,
    comments: 620,
    shares: 210,
    poster: 'https://picsum.photos/seed/wc-blazes/400/700',
    videoUrl: `${BASE}/ForBiggerBlazes.mp4`,
  },
  {
    id: 'escapes',
    title: 'Ucieczka z miasta',
    author: '@slowliving',
    category: 'Relaks',
    caption: 'Zwolnij tempo, uciekaj myślami 🌿 #chill #relaks',
    likes: 67800,
    comments: 980,
    shares: 340,
    poster: 'https://picsum.photos/seed/wc-escapes/400/700',
    videoUrl: `${BASE}/ForBiggerEscapes.mp4`,
  },
  {
    id: 'fun',
    title: 'Chill Vibes',
    author: '@watchandchill',
    category: 'Relaks',
    caption: 'Idealne na leniwy wieczór z watch&chill 🛋️✨ #chill',
    likes: 212500,
    comments: 4300,
    shares: 1890,
    poster: 'https://picsum.photos/seed/wc-fun/400/700',
    videoUrl: `${BASE}/ForBiggerFun.mp4`,
  },
  {
    id: 'joyrides',
    title: 'Nocna Przejażdżka',
    author: '@motopasja',
    category: 'Motoryzacja',
    caption: 'Nocne miasto i silnik na pełnych obrotach 🏍️🌃 #moto',
    likes: 88900,
    comments: 1230,
    shares: 560,
    poster: 'https://picsum.photos/seed/wc-joyrides/400/700',
    videoUrl: `${BASE}/ForBiggerJoyrides.mp4`,
  },
  {
    id: 'meltdowns',
    title: 'Kroniki Awarii',
    author: '@motopasja',
    category: 'Motoryzacja',
    caption: 'Kiedy maszyna mówi „dość” 💀🔧 #moto #fail',
    likes: 51200,
    comments: 900,
    shares: 300,
    poster: 'https://picsum.photos/seed/wc-meltdowns/400/700',
    videoUrl: `${BASE}/ForBiggerMeltdowns.mp4`,
  },
  {
    id: 'subaru',
    title: 'Bezdroża',
    author: '@terenoweszalenstwo',
    category: 'Komedia',
    caption: 'Nic nie idzie zgodnie z planem 😂🚙 #komedia #moto',
    likes: 73400,
    comments: 1560,
    shares: 640,
    poster: 'https://picsum.photos/seed/wc-subaru/400/700',
    videoUrl: `${BASE}/SubaruOutbackOnStreetAndDirt.mp4`,
  },
  {
    id: 'bullrun',
    title: 'Wielki Rajd',
    author: '@ekiparajd',
    category: 'Komedia',
    caption: 'Transkontynentalny rajd pełen wpadek 🗺️😅 #komedia',
    likes: 61900,
    comments: 1100,
    shares: 410,
    poster: 'https://picsum.photos/seed/wc-bullrun/400/700',
    videoUrl: `${BASE}/WeAreGoingOnBullrun.mp4`,
  },
  {
    id: 'grand',
    title: 'Za Grosze',
    author: '@ekiparajd',
    category: 'Komedia',
    caption: 'Ile auta kupisz za grosze? Zaskoczysz się 💸🚗 #komedia',
    likes: 39700,
    comments: 720,
    shares: 190,
    poster: 'https://picsum.photos/seed/wc-grand/400/700',
    videoUrl: `${BASE}/WhatCarCanYouGetForAGrand.mp4`,
  },
];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
