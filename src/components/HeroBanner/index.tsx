"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { HeroSlide } from "@/data/heroSlides";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface HeroBannerProps {
  slides: HeroSlide[];
}

interface HeroSlideViewProps {
  slide: HeroSlide;
  isActive: boolean;
  isMuted: boolean;
  audioUnlocked: boolean;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

const navButtonClass =
  "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/75 text-amber-400 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-amber-500/15 hover:text-amber-300 disabled:pointer-events-none disabled:opacity-30 md:flex md:h-12 md:w-12";

const muteButtonClass =
  "absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/75 text-amber-400 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-amber-500/15 hover:text-amber-300 sm:right-6 sm:top-6 sm:h-11 sm:w-11";

const heroSectionClass =
  "relative w-full overflow-x-hidden bg-black aspect-video sm:aspect-auto sm:min-h-[85vh] md:min-h-[90vh]";

const heroSwiperClass =
  "hero-swiper h-full w-full sm:h-[85vh] md:h-[90vh]";

const heroPaginationClass =
  "hero-swiper-pagination absolute bottom-2.5 left-0 right-0 z-50 flex justify-center gap-1.5 md:hidden";

const heroSlideClass = "relative h-full w-full";

const heroMediaClass =
  "absolute inset-0 h-full w-full bg-black object-contain object-center sm:object-cover sm:object-top";

const IMAGE_SLIDE_DELAY = 3000;
const VIDEO_SLIDE_DELAY = 14000;

function getSlideAutoplayDelay(slide: HeroSlide | undefined) {
  return slide?.image ? IMAGE_SLIDE_DELAY : VIDEO_SLIDE_DELAY;
}

function updateAutoplayDelay(swiper: SwiperType, slides: HeroSlide[]) {
  if (!swiper.autoplay || typeof swiper.params.autoplay !== "object") return;

  swiper.params.autoplay.delay = getSlideAutoplayDelay(
    slides[swiper.realIndex],
  );
  swiper.autoplay.stop();
  swiper.autoplay.start();
}

function applySound(video: HTMLVideoElement, playSound: boolean) {
  video.muted = !playSound;
  video.volume = playSound ? 1 : 0;
}

async function startMutedAutoplay(video: HTMLVideoElement) {
  video.muted = true;
  video.volume = 1;

  try {
    await video.play();
  } catch {
    await video.play().catch(() => undefined);
  }
}

function HeroSlideView({
  slide,
  isActive,
  isMuted,
  audioUnlocked,
  onVideoRef,
}: HeroSlideViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoSlide = Boolean(slide.video);
  const shouldPlaySound = audioUnlocked && !isMuted;

  useEffect(() => {
    if (!isVideoSlide) return;

    if (isActive) {
      onVideoRef?.(videoRef.current);
      return () => onVideoRef?.(null);
    }

    onVideoRef?.(null);
  }, [isActive, isVideoSlide, onVideoRef]);

  useEffect(() => {
    if (!isVideoSlide || !isActive) return;

    const video = videoRef.current;
    if (!video) return;

    void startMutedAutoplay(video);
  }, [isActive, isVideoSlide, slide.video]);

  useEffect(() => {
    if (!isVideoSlide || !isActive) return;

    const video = videoRef.current;
    if (!video) return;

    if (!shouldPlaySound) {
      applySound(video, false);
      return;
    }

    if (!video.paused) {
      applySound(video, true);
      return;
    }

    const onPlaying = () => {
      applySound(video, true);
    };

    video.addEventListener("playing", onPlaying, { once: true });
    return () => video.removeEventListener("playing", onPlaying);
  }, [shouldPlaySound, isActive, isVideoSlide]);

  const handleVideoCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.paused) {
      void startMutedAutoplay(video);
    }
  };

  return (
    <div className={heroSlideClass}>
      {slide.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.image}
          alt={slide.title}
          className={heroMediaClass}
        />
      ) : (
        isActive && (
          <video
            key={slide.id}
            ref={videoRef}
            src={slide.video}
            loop
            playsInline
            preload="auto"
            onCanPlay={handleVideoCanPlay}
            className={heroMediaClass}
          />
        )
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-zinc-950/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />

      {isActive && (
        <div className="relative z-30 flex h-full w-full items-end px-4 pb-14 sm:px-8 sm:pb-14 md:items-center md:pb-0 md:pl-12 lg:pl-20 xl:pl-28">
          <div className="max-w-xl lg:max-w-2xl">
            {isVideoSlide && (
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400 sm:text-xs md:text-sm md:tracking-[0.25em]">
                Now Streaming
              </p>
            )}
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-3xl md:text-4xl lg:text-5xl">
              {slide.title}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {!slide.image && (
                <Link
                  href={slide.href ?? "/movies"}
                  className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 md:px-7 md:py-3"
                >
                  Watch Now
                </Link>
              )}
              <Link
                href="/movies"
                className="rounded-full border border-zinc-600 px-6 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-500 hover:text-amber-400 md:px-7 md:py-3"
              >
                All Movies
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const isMutedRef = useRef(false);
  const audioUnlockedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const activeSlide = slides[activeIndex];
  const showMuteButton = Boolean(activeSlide?.video);
  const showMutedIcon = !audioUnlocked || isMuted;

  isMutedRef.current = isMuted;
  audioUnlockedRef.current = audioUnlocked;

  const setActiveVideoRef = useCallback((el: HTMLVideoElement | null) => {
    activeVideoRef.current = el;
  }, []);

  const applySoundToActiveVideo = useCallback(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    const playSound = audioUnlockedRef.current && !isMutedRef.current;
    applySound(video, playSound);

    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  }, []);

  const unlockAudio = useCallback(() => {
    audioUnlockedRef.current = true;
    setAudioUnlocked(true);
    applySoundToActiveVideo();
  }, [applySoundToActiveVideo]);

  useEffect(() => {
    const onInteract = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-hero-mute-btn]")
      ) {
        return;
      }

      unlockAudio();
    };

    window.addEventListener("pointerdown", onInteract, true);
    window.addEventListener("keydown", onInteract, true);
    return () => {
      window.removeEventListener("pointerdown", onInteract, true);
      window.removeEventListener("keydown", onInteract, true);
    };
  }, [unlockAudio]);

  const handleToggleMute = () => {
    if (!audioUnlockedRef.current) {
      audioUnlockedRef.current = true;
      setAudioUnlocked(true);
      isMutedRef.current = false;
      setIsMuted(false);
      applySoundToActiveVideo();
      return;
    }

    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    applySoundToActiveVideo();
  };

  return (
    <section className={heroSectionClass}>
      {showMuteButton && (
        <button
          type="button"
          data-hero-mute-btn
          aria-label={showMutedIcon ? "Unmute video" : "Mute video"}
          onClick={handleToggleMute}
          className={muteButtonClass}
        >
          {showMutedIcon ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </button>
      )}
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous slide"
        className={`${navButtonClass} left-2 sm:left-4 md:left-8`}
      >
        <ChevronLeft />
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next slide"
        className={`${navButtonClass} right-2 sm:right-4 md:right-8`}
      >
        <ChevronRight />
      </button>

      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={900}
        loop
        autoplay={{
          delay: getSlideAutoplayDelay(slides[0]),
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          el: paginationRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (
            swiper.params.pagination &&
            typeof swiper.params.pagination !== "boolean"
          ) {
            swiper.params.pagination.el = paginationRef.current;
          }
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        onInit={(swiper) => {
          setActiveIndex(swiper.realIndex);
          if (
            swiper.params.pagination &&
            typeof swiper.params.pagination !== "boolean"
          ) {
            swiper.params.pagination.el = paginationRef.current;
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();
          }
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          updateAutoplayDelay(swiper, slides);
        }}
        className={heroSwiperClass}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="!h-full">
            <HeroSlideView
              slide={slide}
              isActive={activeIndex === index}
              isMuted={isMuted}
              audioUnlocked={audioUnlocked}
              onVideoRef={setActiveVideoRef}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        ref={paginationRef}
        className={heroPaginationClass}
        aria-label="Hero slide pagination"
      />
    </section>
  );
}
