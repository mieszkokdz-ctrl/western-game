export type Title = {
  id: string;
  title: string;
  category: string;
  year: number;
  duration: string;
  description: string;
  poster: string;
  backdrop: string;
  videoUrl: string;
};

const BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';

export const catalog: Title[] = [
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    category: 'Polecane',
    year: 2008,
    duration: '9 min',
    description:
      'Wielki, dobroduszny królik budzi się pewnego ranka w swoim lesie i odkrywa, że trójka wredowatych gryzoni robi mu kawały. W klasycznym stylu kreskówek, Buck postanawia się zemścić.',
    poster: 'https://picsum.photos/seed/wc-bunny/400/600',
    backdrop: 'https://picsum.photos/seed/wc-bunny/1280/720',
    videoUrl: `${BASE}/BigBuckBunny.mp4`,
  },
  {
    id: 'elephants-dream',
    title: "Elephant's Dream",
    category: 'Polecane',
    year: 2006,
    duration: '11 min',
    description:
      'Dwóch bohaterów podróżuje przez surrealistyczny, mechaniczny świat pełen dziwnych maszyn i ukrytych zagrożeń, próbując odnaleźć drogę do domu.',
    poster: 'https://picsum.photos/seed/wc-elephant/400/600',
    backdrop: 'https://picsum.photos/seed/wc-elephant/1280/720',
    videoUrl: `${BASE}/ElephantsDream.mp4`,
  },
  {
    id: 'sintel',
    title: 'Sintel',
    category: 'Akcja',
    year: 2010,
    duration: '15 min',
    description:
      'Samotna wojowniczka o imieniu Sintel wyrusza w niebezpieczną podróż, by odnaleźć małego smoka, którego wychowała i który zaginął.',
    poster: 'https://picsum.photos/seed/wc-sintel/400/600',
    backdrop: 'https://picsum.photos/seed/wc-sintel/1280/720',
    videoUrl: `${BASE}/Sintel.mp4`,
  },
  {
    id: 'tears-of-steel',
    title: 'Tears of Steel',
    category: 'Akcja',
    year: 2012,
    duration: '12 min',
    description:
      'Grupa wojowników i naukowców spotyka się w zrujnowanym Amsterdamie przyszłości, by cofnąć katastrofalny błąd popełniony w przeszłości.',
    poster: 'https://picsum.photos/seed/wc-tears/400/600',
    backdrop: 'https://picsum.photos/seed/wc-tears/1280/720',
    videoUrl: `${BASE}/TearsOfSteel.mp4`,
  },
  {
    id: 'blazes',
    title: 'Płomienie o zmierzchu',
    category: 'Relaks',
    year: 2015,
    duration: '1 min',
    description: 'Krótki, kojący materiał idealny na wieczorne odprężenie przy herbacie.',
    poster: 'https://picsum.photos/seed/wc-blazes/400/600',
    backdrop: 'https://picsum.photos/seed/wc-blazes/1280/720',
    videoUrl: `${BASE}/ForBiggerBlazes.mp4`,
  },
  {
    id: 'escapes',
    title: 'Ucieczka z miasta',
    category: 'Relaks',
    year: 2015,
    duration: '1 min',
    description: 'Zwolnij tempo i uciekaj myślami daleko od zgiełku codzienności.',
    poster: 'https://picsum.photos/seed/wc-escapes/400/600',
    backdrop: 'https://picsum.photos/seed/wc-escapes/1280/720',
    videoUrl: `${BASE}/ForBiggerEscapes.mp4`,
  },
  {
    id: 'fun',
    title: 'Chill Vibes',
    category: 'Relaks',
    year: 2015,
    duration: '1 min',
    description: 'Lekki, przyjemny materiał w sam raz na leniwy wieczór typu watch & chill.',
    poster: 'https://picsum.photos/seed/wc-fun/400/600',
    backdrop: 'https://picsum.photos/seed/wc-fun/1280/720',
    videoUrl: `${BASE}/ForBiggerFun.mp4`,
  },
  {
    id: 'joyrides',
    title: 'Nocna Przejażdżka',
    category: 'Dokumenty',
    year: 2015,
    duration: '1 min',
    description: 'Dokumentalne spojrzenie na pasjonatów motoryzacji i ich nocne przejażdżki.',
    poster: 'https://picsum.photos/seed/wc-joyrides/400/600',
    backdrop: 'https://picsum.photos/seed/wc-joyrides/1280/720',
    videoUrl: `${BASE}/ForBiggerJoyrides.mp4`,
  },
  {
    id: 'meltdowns',
    title: 'Kroniki Awarii',
    category: 'Dokumenty',
    year: 2015,
    duration: '1 min',
    description: 'Seria krótkich reportaży o tym, co dzieje się, gdy maszyny mówią „dość”.',
    poster: 'https://picsum.photos/seed/wc-meltdowns/400/600',
    backdrop: 'https://picsum.photos/seed/wc-meltdowns/1280/720',
    videoUrl: `${BASE}/ForBiggerMeltdowns.mp4`,
  },
  {
    id: 'subaru',
    title: 'Bezdroża',
    category: 'Komedia',
    year: 2013,
    duration: '1 min',
    description: 'Zabawna przygoda w terenie, gdzie nic nie idzie zgodnie z planem.',
    poster: 'https://picsum.photos/seed/wc-subaru/400/600',
    backdrop: 'https://picsum.photos/seed/wc-subaru/1280/720',
    videoUrl: `${BASE}/SubaruOutbackOnStreetAndDirt.mp4`,
  },
  {
    id: 'bullrun',
    title: 'Wielki Rajd',
    category: 'Komedia',
    year: 2013,
    duration: '1 min',
    description: 'Ekipa przyjaciół rusza w szalony, transkontynentalny rajd pełen wpadek.',
    poster: 'https://picsum.photos/seed/wc-bullrun/400/600',
    backdrop: 'https://picsum.photos/seed/wc-bullrun/1280/720',
    videoUrl: `${BASE}/WeAreGoingOnBullrun.mp4`,
  },
  {
    id: 'grand',
    title: 'Za Grosze',
    category: 'Komedia',
    year: 2013,
    duration: '1 min',
    description: 'Ile samochodu można kupić za symboliczną kwotę? Odpowiedź was zaskoczy.',
    poster: 'https://picsum.photos/seed/wc-grand/400/600',
    backdrop: 'https://picsum.photos/seed/wc-grand/1280/720',
    videoUrl: `${BASE}/WhatCarCanYouGetForAGrand.mp4`,
  },
];

export const categories = Array.from(new Set(catalog.map(t => t.category)));

export function getTitleById(id: string): Title | undefined {
  return catalog.find(t => t.id === id);
}
