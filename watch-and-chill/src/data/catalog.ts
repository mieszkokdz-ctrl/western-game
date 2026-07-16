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

const PIXABAY = 'https://cdn.pixabay.com/video';

export const catalog: Title[] = [
  // --- Gry ---
  {
    id: 'gaming-cyberpunk-city',
    title: 'Cyfrowe miasto',
    author: '@futureplayer',
    category: 'Gry',
    caption: 'Kiedy gra wygląda jak film 🌆🤖 #cyberpunk #gry',
    likes: 312400,
    comments: 6750,
    shares: 3410,
    poster: 'https://picsum.photos/seed/wc-gaming-cyberpunk/400/700',
    videoUrl: `${PIXABAY}/2023/10/18/185526-875605342_large.mp4`,
  },
  {
    id: 'gaming-controller-closeup',
    title: 'Palce na padzie',
    author: '@gracz_pro',
    category: 'Gry',
    caption: 'Wieczorna sesja się zaczyna 🎮🔥 #gaming #gry',
    likes: 184200,
    comments: 3120,
    shares: 1450,
    poster: 'https://picsum.photos/seed/wc-gaming-controller/400/700',
    videoUrl: `${PIXABAY}/2021/07/25/82663-580974605_large.mp4`,
  },
  {
    id: 'gaming-session-bg',
    title: 'Nocna sesja',
    author: '@nightowl_gg',
    category: 'Gry',
    caption: '3 nad ranem, jeszcze jeden mecz 🌙🎮 #gaming #nightgaming',
    likes: 98700,
    comments: 1870,
    shares: 640,
    poster: 'https://picsum.photos/seed/wc-gaming-night/400/700',
    videoUrl: `${PIXABAY}/2021/02/23/66317-516453498_large.mp4`,
  },
  {
    id: 'gaming-playstation',
    title: 'Klasyczny kontroler',
    author: '@kitty_plays',
    category: 'Gry',
    caption: 'PlayStation w akcji 🕹️✨ #gaming #playstation',
    likes: 205300,
    comments: 4020,
    shares: 1760,
    poster: 'https://picsum.photos/seed/wc-gaming-ps/400/700',
    videoUrl: `${PIXABAY}/2019/09/06/26619-359604050_large.mp4`,
  },
  {
    id: 'gaming-montage',
    title: 'Najlepsze momenty',
    author: '@gamerka_pl',
    category: 'Gry',
    caption: 'Montaż z ostatniego tygodnia 🎬🎮 #montage #gaming',
    likes: 267800,
    comments: 5430,
    shares: 2980,
    poster: 'https://picsum.photos/seed/wc-gaming-montage/400/700',
    videoUrl: `${PIXABAY}/2023/09/15/180776-865216724_large.mp4`,
  },

  // --- Sport ---
  {
    id: 'sport-basketball',
    title: 'Czysty rzut',
    author: '@ulicznakoszykowka',
    category: 'Sport',
    caption: 'Swoosh i po sprawie 🏀🔥 #basketball #sport',
    likes: 143900,
    comments: 2610,
    shares: 980,
    poster: 'https://picsum.photos/seed/wc-sport-basketball/400/700',
    videoUrl: `${PIXABAY}/2024/04/18/208442_large.mp4`,
  },
  {
    id: 'sport-jogging',
    title: 'Poranny bieg',
    author: '@aktywnezycie',
    category: 'Sport',
    caption: 'Plaża, poranek, kilometry 🏃‍♀️🌊 #jogging #fitness',
    likes: 78900,
    comments: 1120,
    shares: 390,
    poster: 'https://picsum.photos/seed/wc-sport-jogging/400/700',
    videoUrl: `${PIXABAY}/2019/11/21/29331-374868343_large.mp4`,
  },
  {
    id: 'sport-pushups',
    title: 'Codzienny trening',
    author: '@aktywnezycie',
    category: 'Sport',
    caption: 'Bez wymówek, tylko powtórzenia 💪🔥 #fitness #trening',
    likes: 54200,
    comments: 870,
    shares: 260,
    poster: 'https://picsum.photos/seed/wc-sport-pushups/400/700',
    videoUrl: `${PIXABAY}/2022/12/18/143431-782373969_large.mp4`,
  },

  // --- Jedzenie ---
  {
    id: 'food-bbq',
    title: 'Skwierczący stek',
    author: '@grillmaster',
    category: 'Jedzenie',
    caption: 'Ten dźwięk grilla 🥩🔥 #bbq #jedzenie',
    likes: 121500,
    comments: 2340,
    shares: 870,
    poster: 'https://picsum.photos/seed/wc-food-bbq/400/700',
    videoUrl: `${PIXABAY}/2022/07/20/124829-732633113_large.mp4`,
  },
  {
    id: 'food-popcorn',
    title: 'Czas na przekąskę',
    author: '@snacktime',
    category: 'Jedzenie',
    caption: 'Popcorn gotowy na wieczór filmowy 🍿🎬 #snack #popcorn',
    likes: 67300,
    comments: 980,
    shares: 340,
    poster: 'https://picsum.photos/seed/wc-food-popcorn/400/700',
    videoUrl: `${PIXABAY}/2020/04/28/37441-414024639_large.mp4`,
  },
  {
    id: 'food-salad',
    title: 'Zdrowy obiad',
    author: '@slowliving',
    category: 'Jedzenie',
    caption: 'Świeże składniki, dobra energia 🥗🌿 #zdrowo #jedzenie',
    likes: 41800,
    comments: 620,
    shares: 180,
    poster: 'https://picsum.photos/seed/wc-food-salad/400/700',
    videoUrl: `${PIXABAY}/2021/04/15/71125-537986747_large.mp4`,
  },

  // --- Relaks ---
  {
    id: 'relax-yoga',
    title: 'Poranna joga',
    author: '@chillvibes',
    category: 'Relaks',
    caption: 'Zacznij dzień na spokojnie 🧘‍♀️🌅 #yoga #relaks',
    likes: 89400,
    comments: 1560,
    shares: 510,
    poster: 'https://picsum.photos/seed/wc-relax-yoga/400/700',
    videoUrl: `${PIXABAY}/2022/12/18/143436-782373975_large.mp4`,
  },

  // --- Technologia ---
  {
    id: 'tech-code-scroll',
    title: 'Kod w ruchu',
    author: '@devlife',
    category: 'Technologia',
    caption: 'Kolejna linijka kodu... 💻⚡ #tech #coding',
    likes: 45700,
    comments: 690,
    shares: 210,
    poster: 'https://picsum.photos/seed/wc-tech-code/400/700',
    videoUrl: `${PIXABAY}/2019/05/06/23355-334950213_large.mp4`,
  },
  {
    id: 'tech-typing',
    title: 'Praca nad projektem',
    author: '@devlife',
    category: 'Technologia',
    caption: 'Deadline coraz bliżej ⌨️🔥 #tech #praca',
    likes: 38200,
    comments: 540,
    shares: 150,
    poster: 'https://picsum.photos/seed/wc-tech-typing/400/700',
    videoUrl: `${PIXABAY}/2015/12/11/1656-148614494_medium.mp4`,
  },

  // --- Muzyka ---
  {
    id: 'music-dj',
    title: 'Set na żywo',
    author: '@nocneklimaty',
    category: 'Muzyka',
    caption: 'Energia na całej sali 🎧🔥 #dj #muzyka',
    likes: 156800,
    comments: 2890,
    shares: 1120,
    poster: 'https://picsum.photos/seed/wc-music-dj/400/700',
    videoUrl: `${PIXABAY}/2015/11/07/1275-145116912_medium.mp4`,
  },
  {
    id: 'music-jazz',
    title: 'Jazz na ulicy',
    author: '@ulicznimuzycy',
    category: 'Muzyka',
    caption: 'Najlepsza muzyka gra się spontanicznie 🎷✨ #jazz #muzyka',
    likes: 47600,
    comments: 720,
    shares: 230,
    poster: 'https://picsum.photos/seed/wc-music-jazz/400/700',
    videoUrl: `${PIXABAY}/2015/08/08/48-135716440_medium.mp4`,
  },
  {
    id: 'music-acoustic',
    title: 'Akustyczny wieczór',
    author: '@chillvibes',
    category: 'Muzyka',
    caption: 'Gitara i spokój na koniec dnia 🎸🌙 #acoustic #chill',
    likes: 62400,
    comments: 910,
    shares: 310,
    poster: 'https://picsum.photos/seed/wc-music-acoustic/400/700',
    videoUrl: `${PIXABAY}/2015/08/08/139-135737102_large.mp4`,
  },
];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
