import type { Movie } from "@/types/movie";

import { CDN_ASSETS_BASE } from "@/constants/cdn";

/** Trailers are streamed directly from themoviestudio.com's CDN (not bundled). */
const TRAILER_CDN =
  "https://d10xsoss226fg9.cloudfront.net/MSq5OovipIm3HeamQRkYlEczgduT7J0T/F00F0B61022FC928F0340F2EE0784452/vl";

export const movies: Movie[] = [
  {
    id: "1",
    slug: "fractured",
    title: "Fractured",
    tagline: "Secrets don't stay buried forever.",
    synopsis:
      "A gripping psychological thriller from The Movie Studio. When the past resurfaces, one man must confront the fractures in his life before everything shatters.",
    poster: `${CDN_ASSETS_BASE}/FracturedPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    fullMovieUrl: "https://vimeo.com/1171955422",
    fullMoviePassword: "TMS2026!",
    genre: ["Thriller", "Drama"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 34m",
    rating: 7.8,
    featured: true,
  },
  {
    id: "2",
    slug: "night-of-the-demons",
    title: "Night Of The Demons",
    tagline: "The party ends at midnight. The terror doesn't.",
    synopsis:
      "A cult horror classic reimagined for a new generation. When a Halloween party goes wrong, ancient evil awakens and no one is safe.",
    poster: `${CDN_ASSETS_BASE}/Nightofthedemons.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/018a956e1aa04bcb95589bcf8577cc27/nightofthedemonsofficialtrailerv21080p-1773020863.mp4`,
    fullMovieUrl: "https://vimeo.com/1171245366",
    fullMoviePassword: "TMS2026!",
    genre: ["Horror"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 33m",
    rating: 7.5,
    featured: true,
  },
  {
    id: "3",
    slug: "the-pool-boys",
    title: "The Pool Boys",
    tagline: "Summer jobs have never been this dangerous.",
    synopsis:
      "A sharp comedy-drama about friendship, ambition, and the wild summer that changed everything for a crew of pool cleaners in Los Angeles.",
    poster: `${CDN_ASSETS_BASE}/ThePoolBoysPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/a08f455bd6324647a8881d36c0e036dd/thepoolboysofficialtrailerv1720p-1773020839.mp4`,
    fullMovieUrl: "https://vimeo.com/1173072736",
    fullMoviePassword: "TMS2026!",
    genre: ["Comedy", "Drama"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 24m",
    rating: 7.2,
    featured: true,
  },
  {
    id: "4",
    slug: "autopsy",
    title: "Autopsy",
    tagline: "Some secrets are buried deeper than others.",
    synopsis:
      "A chilling horror mystery set in a remote hospital where a young medical examiner uncovers something far more sinister than natural causes.",
    poster: `${CDN_ASSETS_BASE}/AutopsyPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/44da329358b44ea990cb85f69d50498b/autopsyofficialtrailerv11080p-1773020787.mp4`,
    fullMovieUrl: "https://vimeo.com/1171988896",
    fullMoviePassword: "TMS2026!",
    genre: ["Horror", "Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 27m",
    rating: 7.4,
  },
  {
    id: "5",
    slug: "a-broken-life",
    title: "A Broken Life",
    tagline: "Redemption has a price.",
    synopsis:
      "An emotional drama about a man searching for forgiveness after years of mistakes threaten to destroy the family he loves.",
    poster: `${CDN_ASSETS_BASE}/ABrokenLifePoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/15d8c92278f54e9a8cbcc9224c4f6cb5/abrokenlifeofficialtrailerv21080p-1773020709.mp4`,
    fullMovieUrl: "https://vimeo.com/1171989289",
    fullMoviePassword: "TMS2026!",
    genre: ["Drama"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 34m",
    rating: 8.0,
  },
  {
    id: "6",
    slug: "dancing-on-the-edge",
    title: "Dancing On The Edge",
    tagline: "When the music stops, the truth begins.",
    synopsis:
      "Set in 1930s London, a brilliant jazz band rises to fame while navigating race, class, and a mystery that could destroy them all.",
    poster: `${CDN_ASSETS_BASE}/Dancingontheedge.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/d42e70515e4a41c7a1fce5cbe8787ce1/dancingontheedgeofficialtrailerv11080p-1773020647.mp4`,
    fullMovieUrl: "https://vimeo.com/1171987711",
    fullMoviePassword: "TMS2026!",
    genre: ["Drama", "Music"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 33m",
    rating: 8.2,
  },
  {
    id: "7",
    slug: "drunkboat",
    title: "DrunkBoat",
    tagline: "The sea remembers everything.",
    synopsis:
      "Based on the legendary poem, a restless sailor returns to the ocean seeking freedom, only to find that some voyages change you forever.",
    poster: `${CDN_ASSETS_BASE}/DrunkboatPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/5070638efdf149288aca5611bba4e847/drunkboatofficialtrailerv11080p-1773020624.mp4`,
    fullMovieUrl: "https://vimeo.com/1171988151",
    fullMoviePassword: "TMS2026!",
    genre: ["Drama", "Adventure"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 38m",
    rating: 7.6,
  },
  {
    id: "8",
    slug: "shooting-gallery",
    title: "Shooting Gallery",
    tagline: "Every shot counts.",
    synopsis:
      "A high-stakes crime thriller following a hustler who enters the underground world of pool sharks where one wrong move could be his last.",
    poster: `${CDN_ASSETS_BASE}/ShootingGalleryPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/ShootingGalleryBanner.jpg`,
    trailer: `${TRAILER_CDN}/b1de3807737241ad96138d3dbd2f056b/shootinggalleryofficialtrailerv21080p-1773020590.mp4`,
    fullMovieUrl: "https://vimeo.com/1171245510",
    fullMoviePassword: "TMS2026!",
    genre: ["Crime", "Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 42m",
    rating: 7.7,
  },
  {
    id: "9",
    slug: "noise",
    title: "Noise",
    tagline: "Can you hear it?",
    synopsis:
      "A tense psychological thriller where a young artist's hearing begins to unravel, blurring the line between paranoia and terrifying reality.",
    poster: `${CDN_ASSETS_BASE}/Noise.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/7017e6975d524b13b51c5426d014b0d5/noiseofficialtrailerv21080p-1773020414.mp4`,
    genre: ["Thriller", "Horror"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 30m",
    rating: 7.3,
  },
  {
    id: "10",
    slug: "exposure",
    title: "Exposure",
    tagline: "What they capture changes everything.",
    synopsis:
      "A photographer stumbles upon a conspiracy while shooting in a remote wilderness, and every frame brings her closer to a truth someone will kill to hide.",
    poster: `${CDN_ASSETS_BASE}/ExposurePoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/ExposureBanner.jpg`,
    trailer: `${TRAILER_CDN}/99f6ae372ac7406185600969a970459e/exposureofficialtrailerv21080p-1771383519.mp4`,
    fullMovieUrl: "https://vimeo.com/1167051045",
    fullMoviePassword: "TMS2026!",
    genre: ["Thriller", "Mystery"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 23m",
    rating: 7.9,
  },
  {
    id: "11",
    slug: "bad-actress",
    title: "Bad Actress",
    tagline: "Fame has a darker script.",
    synopsis:
      "A rising star will do anything to stay in the spotlight — but the role of a lifetime soon blurs the line between performance and reality.",
    poster: `${CDN_ASSETS_BASE}/BadActressPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/BadActressBanner.jpg`,
    trailer: `${TRAILER_CDN}/b06a437de02045c9845f14ec11465741/badactressofficialtrailerv11080p-1771383501.mp4`,
    fullMoviePassword: "TMS2026!",
    genre: ["Drama", "Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 28m",
    rating: 7.4,
  },
  {
    id: "12",
    slug: "my-name-is-mohammad",
    title: "My Name is Mohammad",
    tagline: "One name. A thousand stories.",
    synopsis:
      "A powerful drama following one man's journey of faith, identity, and belonging in a world that is quick to judge.",
    poster: `${CDN_ASSETS_BASE}/Mynameismuhammad.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/MynameisMohammad.jpg`,
    trailer: `${TRAILER_CDN}/ecff4f49c64d4aa2bca1629ebef3d859/mynameismohammadofficialtrailerv41080p-1771382986.mp4`,
    fullMovieUrl: "https://vimeo.com/1109221106",
    fullMoviePassword: "TMS2026!",
    genre: ["Drama"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 40m",
    rating: 7.7,
  },
  {
    id: "13",
    slug: "retribution-venganza",
    title: "Retribution: Venganza",
    tagline: "Vengeance knows no borders.",
    synopsis:
      "When everything is taken from him, one man crosses the line between justice and revenge in a relentless hunt for those responsible.",
    poster: `${CDN_ASSETS_BASE}/RetributionPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/RetributionBanner.jpg`,
    trailer: `${TRAILER_CDN}/cc90cde2683542c38b715f136ba10cf6/retributionvenganzaofficialtrailerv51080p-1772064264.mp4`,
    fullMovieUrl: "https://vimeo.com/692890260",
    fullMoviePassword: "TMS2026!",
    genre: ["Action", "Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 36m",
    rating: 7.5,
  },
  {
    id: "14",
    slug: "billionaire-businessman",
    title: "Billionaire Businessman: The Frank Stronach Story",
    tagline: "From nothing to an empire.",
    synopsis:
      "The remarkable true story of Frank Stronach — an immigrant who built one of the world's largest auto-parts empires from a single one-man tool shop.",
    poster: `${CDN_ASSETS_BASE}/billionaire%20businessman.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/Billionare%20Bussinessman.jpg`,
    trailer: `${TRAILER_CDN}/604d0b6b1bc443c0b86e0691fd8b03d3/billionairebusinessmanfrankstronachofficialtrailerv51080p-1771383355.mp4`,
    fullMovieUrl: "https://vimeo.com/1034320778",
    fullMoviePassword: "TMS2026!",
    genre: ["Documentary"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 45m",
    rating: 7.6,
  },
  {
    id: "15",
    slug: "boo",
    title: "Boo",
    tagline: "Fear has a sense of humor.",
    synopsis:
      "Strange happenings turn one unforgettable night into a spiral of scares and surprises no one sees coming.",
    poster: `${CDN_ASSETS_BASE}/BooPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/9308e98340ca40d0a02a4a59e9e83beb/booprov11080p-1773020975.mp4`,
    fullMovieUrl: "https://vimeo.com/1171244232",
    fullMoviePassword: "TMS2026!",
    genre: ["Horror"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 22m",
    rating: 7.0,
  },
  {
    id: "16",
    slug: "deal",
    title: "Deal",
    tagline: "Every bargain has a price.",
    synopsis:
      "A high-stakes negotiation spins out of control when trust becomes the most dangerous currency of all.",
    poster: `${CDN_ASSETS_BASE}/Deal.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/de051d0f6c2f47bb958d26cf2922852c/dealofficialtrailerv11080p-1773020548.mp4`,
    fullMovieUrl: "https://vimeo.com/1171245188",
    fullMoviePassword: "TMS2026!",
    genre: ["Thriller", "Crime"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 30m",
    rating: 7.1,
  },
  {
    id: "17",
    slug: "knife-edge",
    title: "Knife Edge",
    tagline: "One wrong move.",
    synopsis:
      "Tensions cut deep as a group is pushed to the breaking point, where survival balances on a knife's edge.",
    poster: `${CDN_ASSETS_BASE}/KnifeEdgePoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    trailer: `${TRAILER_CDN}/e91d257884ca4e72ac0f875bbe0b0f48/knifeedgeofficialtrailerv21080p-1773020478.mp4`,
    fullMovieUrl: "https://vimeo.com/1171617496",
    fullMoviePassword: "TMS2026!",
    genre: ["Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 26m",
    rating: 7.2,
  },
  {
    id: "18",
    slug: "back-in-the-day",
    title: "Back In The Day",
    tagline: "They're gonna party like it's 1994.",
    synopsis:
      "A group of old high-school friends reunite for one wild weekend, rediscovering the laughs, chaos, and friendships that defined their glory days.",
    poster: `${CDN_ASSETS_BASE}/BackInTheDayPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    fullMovieUrl: "https://vimeo.com/1171988533",
    fullMoviePassword: "TMS2026!",
    genre: ["Comedy"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 34m",
    rating: 6.6,
  },
  {
    id: "19",
    slug: "nine-miles-down",
    title: "Nine Miles Down",
    tagline: "Deliver us from evil.",
    synopsis:
      "An engineer sent to a remote desert drilling station uncovers a terrifying presence beneath the sand, where reality and nightmare begin to merge.",
    poster: `${CDN_ASSETS_BASE}/NineMilesDownPoster.jpg`,
    backdrop: `${CDN_ASSETS_BASE}/main_banner.webp`,
    genre: ["Horror", "Thriller"],
    director: "The Movie Studio",
    cast: [],
    year: 2025,
    duration: "1h 36m",
    rating: 6.8,
  },
];

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((movie) => movie.slug === slug);
}

export function getFeaturedMovies(): Movie[] {
  return movies.filter((movie) => movie.featured);
}

export function getRelatedMovies(movie: Movie, limit = 6): Movie[] {
  const others = movies.filter((item) => item.slug !== movie.slug);

  const genreMatches = others
    .filter((item) =>
      item.genre.some((genre) => movie.genre.includes(genre)),
    )
    .sort((a, b) => b.rating - a.rating);

  if (genreMatches.length >= limit) {
    return genreMatches.slice(0, limit);
  }

  const picked = new Set(genreMatches.map((item) => item.slug));
  const fillers = others
    .filter((item) => !picked.has(item.slug))
    .sort((a, b) => b.rating - a.rating);

  return [...genreMatches, ...fillers].slice(0, limit);
}

export function getAllGenres(): string[] {
  return [...new Set(movies.flatMap((movie) => movie.genre))].sort();
}

export function getMoviesByGenres(genres: string[]): Movie[] {
  return movies.filter((movie) =>
    movie.genre.some((genre) => genres.includes(genre)),
  );
}

export function getTrendingMovies(): Movie[] {
  const trendingSlugs = [
    "my-name-is-mohammad",
    "billionaire-businessman",
    "retribution-venganza",
    "bad-actress",
    "exposure",
  ];

  return trendingSlugs
    .map((slug) => movies.find((movie) => movie.slug === slug))
    .filter((movie): movie is Movie => movie !== undefined);
}
