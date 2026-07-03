import { getMovieBySlug } from "./movies";

export interface HeroSlide {
  id: string;
  title: string;
  image?: string;
  video?: string;
  href?: string;
}

const BANNERS = "/assets/banners";

/** Hero carousel slides — image + banner folder videos */
export const heroSlides: HeroSlide[] = [
  {
    id: "main-banner",
    title: "Watch our Movies! Be in our Movies!",
    image: `${BANNERS}/main-banner-new.webp`,
    href: "/movies",
  },
  {
    id: "subscribe-promo",
    title: "Subscribe Now & Get One Month Free!",
    video: `${BANNERS}/TMS%20SIzzle_BANNER.mp4`,
    href: "/movies",
  },
  {
    id: "my-name-is-mohammad",
    title: "My Name is Mohammad",
    video: `${BANNERS}/MNIM_BANNER.mp4`,
    href: "/movies/my-name-is-mohammad",
  },
  {
    id: "retribution-venganza",
    title: "Retribution: Venganza",
    video: `${BANNERS}/Retribution%20V_BANNER.mp4`,
    href: "/movies/retribution-venganza",
  },
  {
    id: "billionaire-businessman",
    title: "Billionaire Businessman: The Frank Stronach Story",
    video: `${BANNERS}/BB_BANNER.mp4`,
    href: "/movies/billionaire-businessman",
  },
  {
    id: "bad-actress",
    title: "Bad Actress",
    video: `${BANNERS}/Bad%20Actress._BANNER.mp4`,
    href: "/movies/bad-actress",
  },
  {
    id: "exposure",
    title: "Exposure",
    video: `${BANNERS}/Exposure_BANNER.mp4`,
    href: "/movies/exposure",
  },
];

export function getHeroSlideBySlug(slug: string): HeroSlide | undefined {
  return heroSlides.find(
    (slide) => slide.id === slug || slide.href === `/movies/${slug}`,
  );
}

export function getHeroBackdropForMovie(
  slug: string,
  fallbackBackdrop: string,
): string {
  const slide = getHeroSlideBySlug(slug);
  if (!slide) return fallbackBackdrop;

  const movie = getMovieBySlug(slug);
  return movie?.backdrop ?? fallbackBackdrop;
}
