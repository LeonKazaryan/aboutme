import type { Lang } from "./copy";

type L = Record<Lang, string>;

export type Photo = {
  src: string;
  w: number;
  h: number;
  /** Index of the pipeline stage this photo belongs to. */
  stage: number;
  date: L;
  place: L;
  alt: L;
};

const astana: L = { en: "Astana", ru: "Астана" };
const almaty: L = { en: "Almaty", ru: "Алматы" };
const warsaw: L = { en: "Warsaw", ru: "Варшава" };

const portrait = { w: 1500, h: 2000 };
const landscape = { w: 2000, h: 1500 };

export const photos = {
  gradSquare: {
    src: "/photos/2022-06-graduation-square.webp",
    ...portrait,
    stage: 0,
    date: { en: "17 Jun 2022", ru: "17 июня 2022" },
    place: astana,
    alt: {
      en: "Leon in a suit and graduation sash on a crowded square in Astana",
      ru: "Леон в костюме и выпускной ленте на людной площади в Астане",
    },
  },
  gradSash: {
    src: "/photos/2022-06-graduation-sash.webp",
    ...portrait,
    stage: 0,
    date: { en: "17 Jun 2022", ru: "17 июня 2022" },
    place: astana,
    alt: {
      en: "Close-up of Leon in a yellow graduation sash under a blue sky",
      ru: "Леон крупным планом в жёлтой выпускной ленте под синим небом",
    },
  },
  medal: {
    src: "/photos/2022-06-altyn-belgi-medal.webp",
    ...portrait,
    stage: 0,
    date: { en: "17 Jun 2022", ru: "17 июня 2022" },
    place: astana,
    alt: {
      en: "The Altyn Belgi gold badge pinned to a dark jacket",
      ru: "Золотой знак «Алтын белгі» на тёмном пиджаке",
    },
  },
  medalCase: {
    src: "/photos/2022-06-altyn-belgi-case.webp",
    ...portrait,
    stage: 0,
    date: { en: "17 Jun 2022", ru: "17 июня 2022" },
    place: astana,
    alt: {
      en: "The gold badge in a red case between two school certificates",
      ru: "Золотой знак в красном футляре между двумя аттестатами",
    },
  },
  university: {
    src: "/photos/2022-07-nazarbayev-university.webp",
    ...portrait,
    stage: 1,
    date: { en: "13 Jul 2022", ru: "13 июля 2022" },
    place: astana,
    alt: {
      en: "Leon in front of the domed main building of Nazarbayev University",
      ru: "Леон перед главным зданием Назарбаев Университета с куполом",
    },
  },
  firstDay: {
    src: "/photos/2025-06-nfactorial-first-day.webp",
    ...landscape,
    stage: 2,
    date: { en: "16 Jun 2025", ru: "16 июня 2025" },
    place: almaty,
    alt: {
      en: "A MacBook open on a desk in a lecture hall with code on the big screen",
      ru: "Открытый MacBook на столе в аудитории, на большом экране код",
    },
  },
  cohort: {
    src: "/photos/2025-07-nfactorial-cohort.webp",
    ...portrait,
    stage: 2,
    date: { en: "17 Jul 2025", ru: "17 июля 2025" },
    place: almaty,
    alt: {
      en: "The whole nFactorial cohort posing together under a large portrait",
      ru: "Весь поток nFactorial на общем фото под большим портретом",
    },
  },
  certificates: {
    src: "/photos/2025-07-nfactorial-hackathon-certificates.webp",
    ...portrait,
    stage: 2,
    date: { en: "18 Jul 2025", ru: "18 июля 2025" },
    place: almaty,
    alt: {
      en: "Two Outstanding Achievement certificates for third place at the nFactorial hackathon",
      ru: "Две грамоты Outstanding Achievement за третье место на хакатоне nFactorial",
    },
  },
  laptop: {
    src: "/photos/2025-07-chathut-demo-laptop.webp",
    ...portrait,
    stage: 2,
    date: { en: "22 Jul 2025", ru: "22 июля 2025" },
    place: almaty,
    alt: {
      en: "Leon smiling and holding a laptop that shows ChatHut",
      ru: "Леон улыбается и держит ноутбук с открытым ChatHut",
    },
  },
  banner: {
    src: "/photos/2025-08-chathut-banner.webp",
    ...portrait,
    stage: 2,
    date: { en: "7 Aug 2025", ru: "7 августа 2025" },
    place: almaty,
    alt: {
      en: "Leon and a teammate next to the ChatHut roll-up banner",
      ru: "Леон с напарником у ролл-апа ChatHut",
    },
  },
  demoWall: {
    src: "/photos/2025-08-demo-day-wall.webp",
    ...portrait,
    stage: 2,
    date: { en: "8 Aug 2025", ru: "8 августа 2025" },
    place: almaty,
    alt: {
      en: "Leon with arms crossed in front of the nFactorial Demo Day wall",
      ru: "Леон со скрещёнными руками у стены nFactorial Demo Day",
    },
  },
  demoStage: {
    src: "/photos/2025-08-demo-day-stage.webp",
    ...landscape,
    stage: 2,
    date: { en: "8 Aug 2025", ru: "8 августа 2025" },
    place: almaty,
    alt: {
      en: "The nFactorial cohort applauding on the Demo Day stage",
      ru: "Поток nFactorial аплодирует на сцене Demo Day",
    },
  },
  pizza: {
    src: "/photos/2025-08-demo-day-pizza.webp",
    ...portrait,
    stage: 2,
    date: { en: "8 Aug 2025", ru: "8 августа 2025" },
    place: almaty,
    alt: {
      en: "Leon laughing behind towers of pizza boxes",
      ru: "Леон смеётся за башнями из коробок пиццы",
    },
  },
  hackBanner: {
    src: "/photos/2026-04-hacknu-team-banner.webp",
    ...landscape,
    stage: 4,
    date: { en: "5 Apr 2026", ru: "5 апреля 2026" },
    place: astana,
    alt: {
      en: "Leon and two teammates holding the HackNU first place board of 500,000 tenge",
      ru: "Леон с двумя напарниками и доска первого места HackNU на 500 000 тенге",
    },
  },
  hackStage: {
    src: "/photos/2026-04-hacknu-winners-stage.webp",
    ...portrait,
    stage: 4,
    date: { en: "5 Apr 2026", ru: "5 апреля 2026" },
    place: astana,
    alt: {
      en: "All the HackNU winners on stage holding their prize boards",
      ru: "Все победители HackNU на сцене с призовыми досками",
    },
  },
  hackNight: {
    src: "/photos/2026-04-hacknu-night-board.webp",
    ...portrait,
    stage: 4,
    date: { en: "5 Apr 2026", ru: "5 апреля 2026" },
    place: astana,
    alt: {
      en: "Leon in a black hoodie carrying the HackNU board to a blue car at dusk",
      ru: "Леон в чёрном худи несёт доску HackNU к синей машине в сумерках",
    },
  },
  hackMirror: {
    src: "/photos/2026-04-hacknu-mirror-board.webp",
    ...portrait,
    stage: 4,
    date: { en: "5 Apr 2026", ru: "5 апреля 2026" },
    place: astana,
    alt: {
      en: "Leon peeking over the HackNU board in a mirror selfie",
      ru: "Леон выглядывает из-за доски HackNU на селфи в зеркале",
    },
  },
  warRoom: {
    src: "/photos/2026-04-business-cup-war-room.webp",
    ...portrait,
    stage: 4,
    date: { en: "11 Apr 2026", ru: "11 апреля 2026" },
    place: astana,
    alt: {
      en: "Two laptops, cans of iced tea and coffee on a lecture hall desk",
      ru: "Два ноутбука, банки холодного чая и кофе на столе в аудитории",
    },
  },
  truth: {
    src: "/photos/2026-04-business-cup-moments-of-truth.webp",
    w: 1125,
    h: 2000,
    stage: 4,
    date: { en: "12 Apr 2026", ru: "12 апреля 2026" },
    place: astana,
    alt: {
      en: "The team on stage under a Moments of Truth slide naming the Business Cup winners",
      ru: "Команда на сцене под слайдом Moments of Truth с победителями Business Cup",
    },
  },
  podium: {
    src: "/photos/2026-04-business-cup-podium-team.webp",
    w: 2000,
    h: 1333,
    stage: 4,
    date: { en: "12 Apr 2026", ru: "12 апреля 2026" },
    place: astana,
    alt: {
      en: "The team holding the Business Cup first place board of 1,250,000 tenge and a MAANG conference trip",
      ru: "Команда с доской первого места Business Cup: 1 250 000 тенге и поездка на конференцию MAANG",
    },
  },
  firstPlace: {
    src: "/photos/2026-04-business-cup-first-place.webp",
    ...portrait,
    stage: 4,
    date: { en: "12 Apr 2026", ru: "12 апреля 2026" },
    place: astana,
    alt: {
      en: "Leon alone on stage holding the Business Cup first place board",
      ru: "Леон один на сцене с доской первого места Business Cup",
    },
  },
  palace: {
    src: "/photos/2026-05-warsaw-palace-of-culture.webp",
    ...portrait,
    stage: 5,
    date: { en: "18 May 2026", ru: "18 мая 2026" },
    place: warsaw,
    alt: {
      en: "Leon on a Warsaw street with the Palace of Culture and Science behind him",
      ru: "Леон на улице Варшавы, за ним Дворец культуры и науки",
    },
  },
  metaWall: {
    src: "/photos/2026-05-meta-conference-wall.webp",
    ...portrait,
    stage: 5,
    date: { en: "20 May 2026", ru: "20 мая 2026" },
    place: warsaw,
    alt: {
      en: "Leon and a friend wearing badges in front of a large Meta wall",
      ru: "Леон с другом с бейджами на фоне большой стены Meta",
    },
  },
  metaWelcome: {
    src: "/photos/2026-05-meta-conference-welcome.webp",
    ...portrait,
    stage: 5,
    date: { en: "20 May 2026", ru: "20 мая 2026" },
    place: warsaw,
    alt: {
      en: "Three friends with badges on cobblestones in front of Welcome stands",
      ru: "Трое друзей с бейджами на брусчатке у стоек Welcome",
    },
  },
  metaNeon: {
    src: "/photos/2026-05-meta-office-neon.webp",
    ...portrait,
    stage: 5,
    date: { en: "21 May 2026", ru: "21 мая 2026" },
    place: warsaw,
    alt: {
      en: "Leon holding a thumbs-up sign under a neon Meta logo",
      ru: "Леон с табличкой лайка под неоновым логотипом Meta",
    },
  },
  skyline: {
    src: "/photos/2026-05-warsaw-skyline.webp",
    ...landscape,
    stage: 5,
    date: { en: "21 May 2026", ru: "21 мая 2026" },
    place: warsaw,
    alt: {
      en: "Selfie of Leon and a friend high above the Warsaw skyline",
      ru: "Селфи Леона с другом высоко над Варшавой",
    },
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** The hero ring: one life, in order, once around the dial. */
export const ringKeys: PhotoKey[] = [
  "gradSquare",
  "medal",
  "gradSash",
  "medalCase",
  "university",
  "firstDay",
  "cohort",
  "certificates",
  "laptop",
  "banner",
  "demoWall",
  "pizza",
  "hackBanner",
  "hackStage",
  "hackNight",
  "warRoom",
  "podium",
  "firstPlace",
  "truth",
  "palace",
  "metaWall",
  "metaNeon",
  "metaWelcome",
  "skyline",
];

export const cutouts = {
  graduation: { src: "/cutouts/leon-graduation.webp", w: 1350, h: 1800 },
  laptop: { src: "/cutouts/leon-laptop.webp", w: 595, h: 1626 },
  meta: { src: "/cutouts/leon-meta.webp", w: 842, h: 1525 },
  warsaw: { src: "/cutouts/leon-warsaw.webp", w: 325, h: 972 },
  pointing: { src: "/cutouts/leon-pointing.webp", w: 666, h: 1800 },
  firstPlace: { src: "/cutouts/leon-first-place.webp", w: 779, h: 1400 },
  preggo: { src: "/cutouts/preggo-phone.webp", w: 609, h: 1128 },
} as const;
