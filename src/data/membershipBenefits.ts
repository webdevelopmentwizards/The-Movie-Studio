import { CDN_ASSETS_BASE } from "@/constants/cdn";

export type BenefitItem = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  image?: string;
  tag?: string;
};

export type BenefitSection = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: BenefitItem[];
};

export const MEMBERSHIP_BENEFIT_SECTIONS: BenefitSection[] = [
  {
    id: "bts",
    eyebrow: "Exclusive",
    title: "Behind-the-scenes!",
    subtitle:
      "Go past the final cut — watch how scenes were shot, directed, and cut together.",
    items: [
      {
        id: "bts-1",
        title: "Fractured — Night Shoot Diary",
        description:
          "Camera team walks through the downtown night sequence, lighting setups, and last-take improvisations.",
        meta: "12 min · 4K",
        tag: "New",
        image: `${CDN_ASSETS_BASE}/FracturedPoster.jpg`,
      },
      {
        id: "bts-2",
        title: "Night of the Demons — Makeup FX Reel",
        description:
          "Prosthetic application, creature tests, and on-set reactions from the horror unit.",
        meta: "18 min · HD",
        image: `${CDN_ASSETS_BASE}/Nightofthedemons.jpg`,
      },
      {
        id: "bts-3",
        title: "Director’s Commentary Capsule",
        description:
          "Short-form commentary clips recorded between takes on the primary unit.",
        meta: "8 min · HD",
        tag: "Member only",
      },
    ],
  },
  {
    id: "location",
    eyebrow: "On set",
    title: "Live on-location access",
    subtitle:
      "RSVP to member set visits, livestream walkthroughs, and location scouting days.",
    items: [
      {
        id: "loc-1",
        title: "Fort Lauderdale Waterfront Unit",
        description:
          "Live set access window for an upcoming thriller sequence. Limited member slots.",
        meta: "Sat · 2:00 PM ET · 24 spots left",
        tag: "RSVP open",
      },
      {
        id: "loc-2",
        title: "Warehouse Night Exterior — Livestream",
        description:
          "Join a guided livestream as the second unit rolls on practical rain and neon work.",
        meta: "Thu · 8:30 PM ET",
      },
      {
        id: "loc-3",
        title: "Location Scout: Historic Theater",
        description:
          "Walk the candidate venue with production design before cameras arrive.",
        meta: "Next month · Members",
      },
    ],
  },
  {
    id: "first-look",
    eyebrow: "Coming soon",
    title: "First look at upcoming movie projects",
    subtitle:
      "Scripts in development, early posters, and casting news before public release.",
    items: [
      {
        id: "fl-1",
        title: "Project Velvet — Teaser Poster",
        description:
          "First official key art for a neo-noir in early pre-production.",
        meta: "Locked art · Member exclusive",
        tag: "Sneak peek",
      },
      {
        id: "fl-2",
        title: "Working Title: Signal Fire",
        description:
          "Logline, tone board, and director shortlist shared with members only.",
        meta: "Development slate Q3",
      },
      {
        id: "fl-3",
        title: "Casting Call Preview",
        description:
          "Roles being considered for an upcoming ensemble drama — ahead of public notices.",
        meta: "Updated weekly",
      },
    ],
  },
  {
    id: "no-ads",
    eyebrow: "Streaming",
    title: "Watch new releases with no ads",
    subtitle:
      "Stream the latest Movie Studio titles ad-free on your membership plan.",
    items: [
      {
        id: "na-1",
        title: "Fractured",
        description:
          "Psychological thriller — stream the full feature without commercial breaks.",
        meta: "1h 34m · Ad-free",
        image: `${CDN_ASSETS_BASE}/FracturedPoster.jpg`,
        tag: "Available now",
      },
      {
        id: "na-2",
        title: "Night Of The Demons",
        description:
          "Horror classic reimagined — member playback with no ads and early access windows.",
        meta: "1h 33m · Ad-free",
        image: `${CDN_ASSETS_BASE}/Nightofthedemons.jpg`,
      },
      {
        id: "na-3",
        title: "Member Queue",
        description:
          "Build a personal watchlist of ad-free titles and continue across devices.",
        meta: "Synced · Unlimited",
      },
    ],
  },
  {
    id: "vip",
    eyebrow: "Events",
    title: "VIP movie parties & step-and-repeat",
    subtitle:
      "Premieres, after-parties, photo walls, and member lounges — invite-only access.",
    items: [
      {
        id: "vip-1",
        title: "Red Carpet Premiere Night",
        description:
          "Screening plus step-and-repeat photo wall with cast meet-and-greet windows.",
        meta: "Downtown Ft. Lauderdale · Formal",
        tag: "Invite",
      },
      {
        id: "vip-2",
        title: "Velvet Rope After-Party",
        description:
          "Members-only lounge with soundtrack DJ set and exclusive stills gallery.",
        meta: "Same night · 21+",
      },
      {
        id: "vip-3",
        title: "Season Kickoff Mixer",
        description:
          "Meet producers, crew, and fellow members before the next production cycle.",
        meta: "Quarterly · RSVP",
      },
    ],
  },
  {
    id: "merch",
    eyebrow: "Gear",
    title: "Movie Studio merchandise & gear",
    subtitle:
      "Claim member pricing on branded gear — yearly members unlock the full merch drop.",
    items: [
      {
        id: "merch-1",
        title: "Studio Crest Tee",
        description:
          "Soft black tee with registered aperture mark. Member-exclusive colorways.",
        meta: "From $28 · S–XXL",
        tag: "In stock",
      },
      {
        id: "merch-2",
        title: "Velvet Rope Cap",
        description: "Structured hat with embroidered studio wordmark.",
        meta: "From $24 · Adjustable",
      },
      {
        id: "merch-3",
        title: "On-Set Mug",
        description: "Ceramic mug used on craft tables during production days.",
        meta: "$18 · Dishwasher safe",
      },
      {
        id: "merch-4",
        title: "Laptop Sleeve",
        description:
          "Padded 13–16\" sleeve with subtle studio branding — yearly perk highlight.",
        meta: "Yearly members · Priority",
        tag: "Yearly extra",
      },
      {
        id: "merch-5",
        title: "Car Decal Pack",
        description: "Weatherproof aperture-mark decals for windows and gear cases.",
        meta: "$12 · Pack of 3",
      },
      {
        id: "merch-6",
        title: "One-Sheet Poster Set",
        description:
          "Museum-quality prints of current slate one-sheets, rolled and shipped.",
        meta: "$45 · Set of 3",
      },
    ],
  },
];
