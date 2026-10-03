"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  AUDITION_MAX_PHOTO_BYTES,
  AUDITION_MAX_PHOTO_MB,
  AUDITION_MAX_VIDEO_BYTES,
  AUDITION_MAX_VIDEO_MB,
} from "@/lib/auditionLimits";
import { useApi } from "@/context/ApiContext";

type WizardStep = "projects" | "dialogue" | "video" | "photo";

const STEPS: WizardStep[] = ["projects", "dialogue", "video", "photo"];

const STEP_LABELS: Record<WizardStep, string> = {
  projects: "Our Films",
  dialogue: "Your Scene",
  video: "Upload Video",
  photo: "Upload Photo",
};

const DUMMY_DIALOGUE = `"I've waited my whole life for this moment. The lights, the camera, the chance to prove I'm more than just a dreamer standing in the shadows. Every rejection, every late night, every doubt — they all led me here. So take a breath, find your truth, and when they call action… give them everything you've got."`;

interface ProductionMediaLinks {
  epkUrl: string;
  trailerUrl: string;
  anthemUrl: string;
}

interface ProductionArtwork {
  id: string;
  title: string;
  status: string;
  posterCard: string;
  synopsisSheet: string;
  synopsisCard: string;
  bannerClassName: string;
  mediaLinks?: ProductionMediaLinks;
}

const AMERICAN_DREAM_MEDIA: ProductionMediaLinks = {
  epkUrl: `/american-dream/${encodeURIComponent("American Dream 2026_PressKit_EMAIL.pdf")}`,
  trailerUrl: `/american-dream/${encodeURIComponent("ad_sizzle_trailer_2026_v1 (720p).mp4")}`,
  anthemUrl: `/american-dream/${encodeURIComponent("Paulina - American Dream - V2.mp3.mpeg")}`,
};

const PRODUCTIONS: ProductionArtwork[] = [
  {
    id: "american-dream",
    title: "American Dream",
    status: "Post Production",
    posterCard: "/artwork/new-images/american-dream-new-image.jpeg",
    synopsisSheet: "/artwork/american-dream-synopsis.jpg",
    synopsisCard: "/artwork/american-dream-synopsis-card.jpg",
    bannerClassName: "bg-amber-500 text-zinc-950",
    mediaLinks: AMERICAN_DREAM_MEDIA,
  },
  {
    id: "hope-broker",
    title: "The Hope Broker",
    status: "Pre-Production",
    posterCard: "/artwork/hope-broker-poster-card.jpg",
    synopsisSheet: "/artwork/hope-broker-synopsis.jpg",
    synopsisCard: "/artwork/hope-broker-synopsis-card.jpg",
    bannerClassName:
      "bg-zinc-950/90 text-amber-300 ring-1 ring-inset ring-amber-500/40",
  },
  {
    id: "sway",
    title: "Sway",
    status: "Pre-Production",
    posterCard: "/artwork/sway-poster-card.jpg",
    synopsisSheet: "/artwork/sway-synopsis.jpg",
    synopsisCard: "/artwork/sway-synopsis-card.jpg",
    bannerClassName:
      "bg-zinc-950/90 text-amber-300 ring-1 ring-inset ring-amber-500/40",
  },
];

function TrailerPopup({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      onClose();
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
    >
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-400">
              Trailer
            </p>
            <h4 className="mt-0.5 text-base font-bold text-zinc-50 sm:text-lg">
              {title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-lg text-zinc-200 transition-colors hover:border-amber-500 hover:text-amber-400"
            aria-label="Close trailer"
          >
            ✕
          </button>
        </div>
        <div className="bg-black">
          <video
            key={src}
            controls
            playsInline
            autoPlay
            className="aspect-video max-h-[80vh] w-full bg-black"
            src={src}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function AnthemPlayer({
  src,
  onClose,
}: {
  src: string;
  onClose?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    void audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }

  function seekTo(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(value)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(value: number) {
    const audio = audioRef.current;
    setVolume(value);
    setIsMuted(value === 0);
    if (audio) {
      audio.volume = value;
      audio.muted = value === 0;
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      changeVolume(0.7);
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-zinc-950/90 px-2.5 py-2 sm:px-3">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[11px] text-zinc-400">
          <span className="font-medium text-amber-400">Anthem</span>
          <span className="mx-1.5 text-zinc-600">·</span>
          <span className="text-zinc-200">American Dream</span>
          <span className="mx-1.5 text-zinc-600">·</span>
          Paulina
        </p>
        {onClose && (
          <button
            type="button"
            onClick={() => {
              audioRef.current?.pause();
              onClose();
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-[11px] text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400"
            aria-label="Close anthem player"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-zinc-950 transition-colors hover:bg-amber-400"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <span className="flex items-center gap-0.5" aria-hidden>
              <span className="h-2.5 w-0.5 rounded-sm bg-zinc-950" />
              <span className="h-2.5 w-0.5 rounded-sm bg-zinc-950" />
            </span>
          ) : (
            <span
              className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-zinc-950"
              aria-hidden
            />
          )}
        </button>

        <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-zinc-400">
          {formatAudioTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-amber-500"
          style={{
            background: `linear-gradient(to right, #f59e0b ${progress}%, #27272a ${progress}%)`,
          }}
          aria-label="Seek"
        />

        <span className="w-8 shrink-0 text-[10px] tabular-nums text-zinc-400">
          {formatAudioTime(duration)}
        </span>

        <div className="relative ml-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowVolume((prev) => !prev)}
            onDoubleClick={toggleMute}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              showVolume
                ? "bg-amber-500/15 text-amber-300"
                : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            }`}
            aria-label="Volume"
            aria-expanded={showVolume}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="M11 5 6 9H3v6h3l5 4V5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m16 10 5 5M21 10l-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="M11 5 6 9H3v6h3l5 4V5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 9.5a4 4 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {showVolume && (
            <div className="absolute bottom-full right-0 z-10 mb-2 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 shadow-xl">
              <button
                type="button"
                onClick={toggleMute}
                className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-zinc-400 transition-colors hover:text-amber-400"
              >
                {isMuted || volume === 0 ? "Unmute" : "Mute"}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-amber-500"
                style={{
                  background: `linear-gradient(to right, #fbbf24 ${volumePercent}%, #27272a ${volumePercent}%)`,
                }}
                aria-label="Volume"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductionMediaLinks({
  mediaLinks,
  title,
  compact,
}: {
  mediaLinks: ProductionMediaLinks;
  title: string;
  compact?: boolean;
}) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAnthem, setShowAnthem] = useState(false);
  const linkClass = compact
    ? "text-[10px] font-bold uppercase tracking-[0.16em] transition-colors sm:text-[11px]"
    : "text-xs font-bold uppercase tracking-[0.18em] transition-colors";

  return (
    <>
      <div className={compact ? "mt-3 space-y-3" : "space-y-3"}>
        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${
            compact ? "" : "justify-center gap-x-5 gap-y-2"
          }`}
        >
          <a
            href={mediaLinks.epkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} text-amber-400 hover:text-amber-300`}
          >
            EPK
          </a>
          <button
            type="button"
            onClick={() => {
              setShowTrailer(true);
              setShowAnthem(false);
            }}
            className={`${linkClass} ${
              showTrailer
                ? "text-amber-300"
                : "text-amber-400 hover:text-amber-300"
            }`}
            aria-expanded={showTrailer}
          >
            Trailer
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAnthem((prev) => !prev);
              setShowTrailer(false);
            }}
            className={`${linkClass} ${
              showAnthem
                ? "text-amber-300"
                : "text-amber-400 hover:text-amber-300"
            }`}
            aria-expanded={showAnthem}
          >
            American Dream Anthem
          </button>
        </div>

        {showAnthem && (
          <AnthemPlayer
            src={mediaLinks.anthemUrl}
            onClose={() => setShowAnthem(false)}
          />
        )}
      </div>

      {showTrailer && (
        <TrailerPopup
          src={mediaLinks.trailerUrl}
          title={title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}

function ProductionPosterCard({
  production,
  onOpenSynopsis,
}: {
  production: ProductionArtwork;
  onOpenSynopsis: (production: ProductionArtwork) => void;
}) {
  const mediaLinks = production.mediaLinks;

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left transition-colors hover:border-amber-500/50">
      <button
        type="button"
        onClick={() => onOpenSynopsis(production)}
        className="relative aspect-2/3 w-full flex-1 overflow-hidden bg-zinc-950"
        aria-label={`${production.title} — ${production.status}. Open synopsis`}
      >
        <Image
          src={production.posterCard}
          alt={`${production.title} poster`}
          fill
          unoptimized
          className="object-contain"
          sizes="(max-width: 640px) 92vw, 400px"
        />
        <Image
          src={production.synopsisCard}
          alt=""
          fill
          unoptimized
          className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          sizes="(max-width: 640px) 92vw, 400px"
        />
        <div
          className={`absolute inset-x-0 bottom-0 z-10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px] ${production.bannerClassName}`}
        >
          {production.status}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-linear-to-b from-black/80 to-transparent px-3 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="text-center text-[11px] font-medium text-zinc-100">
            Click for 1-sheet synopsis
          </p>
        </div>
      </button>
      <div className="shrink-0 border-t border-zinc-800 px-3 py-2.5">
        <p className="text-sm font-semibold text-zinc-50">{production.title}</p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-400/80">
          {production.status}
        </p>
        {mediaLinks && (
          <ProductionMediaLinks
            mediaLinks={mediaLinks}
            title={production.title}
            compact
          />
        )}
      </div>
    </div>
  );
}

interface AuditionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="flex w-full items-start">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={step}
            className={`flex min-w-0 items-start ${isLast ? "" : "flex-1"}`}
          >
            <div className="flex w-14 shrink-0 flex-col items-center gap-1.5 sm:w-20">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-amber-500 text-zinc-950"
                    : isComplete
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <span
                className={`w-full text-center text-[10px] font-medium uppercase tracking-wide ${
                  isActive ? "text-amber-400" : "text-zinc-500"
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1 mt-4 h-px min-w-0 flex-1 sm:mx-2 ${
                  index < currentIndex ? "bg-amber-500/50" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function UploadZone({
  accept,
  label,
  hint,
  fileName,
  error,
  compact,
  onFileSelect,
}: {
  accept: string;
  label: string;
  hint: string;
  fileName: string | null;
  error?: string | null;
  compact?: boolean;
  onFileSelect: (file: File | null) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 transition-colors hover:border-amber-500/50 hover:bg-zinc-900 ${
        compact ? "py-7" : "py-12"
      }`}
    >
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
      />
      <div
        className={`flex items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ${
          compact ? "h-11 w-11 text-xl" : "h-14 w-14 text-2xl"
        }`}
      >
        ↑
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-200">{label}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
      {fileName && (
        <p className="mt-3 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
          {fileName}
        </p>
      )}
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500 disabled:opacity-60";

export default function AuditionWizard({ isOpen, onClose }: AuditionWizardProps) {
  const { audition, toast, getErrorMessage } = useApi();
  const [step, setStep] = useState<WizardStep>("projects");
  const [openSynopsis, setOpenSynopsis] = useState<ProductionArtwork | null>(
    null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rightsAccepted, setRightsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || isSubmitting) return;
      if (openSynopsis) {
        closeSynopsis();
        return;
      }
      onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSubmitting, openSynopsis]);

  function closeSynopsis() {
    setOpenSynopsis(null);
  }

  function openSynopsisFor(production: ProductionArtwork) {
    setOpenSynopsis(production);
  }

  function resetAndClose() {
    if (isSubmitting) return;
    setStep("projects");
    setOpenSynopsis(null);
    setVideoFile(null);
    setPhotoFile(null);
    setVideoError(null);
    setPhotoError(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRightsAccepted(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
    setUploadProgress(0);
    onClose();
  }

  function selectVideo(file: File | null) {
    setVideoError(null);
    if (!file) {
      setVideoFile(null);
      return;
    }
    if (file.size > AUDITION_MAX_VIDEO_BYTES) {
      setVideoFile(null);
      setVideoError(`Video must be ${AUDITION_MAX_VIDEO_MB}MB or smaller.`);
      return;
    }
    setVideoFile(file);
  }

  function selectPhoto(file: File | null) {
    setPhotoError(null);
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (file.size > AUDITION_MAX_PHOTO_BYTES) {
      setPhotoFile(null);
      setPhotoError(`Photo must be ${AUDITION_MAX_PHOTO_MB}MB or smaller.`);
      return;
    }
    setPhotoFile(file);
  }

  function goNext() {
    const index = STEPS.indexOf(step);
    if (index < STEPS.length - 1) setStep(STEPS[index + 1]);
  }

  function goBack() {
    const index = STEPS.indexOf(step);
    if (index > 0) setStep(STEPS[index - 1]);
  }

  function validateSubmit(): string | null {
    if (!videoFile || !photoFile) {
      return "Audition video and photo are required.";
    }
    if (!firstName.trim() || !lastName.trim()) {
      return "Enter your first and last name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address.";
    }
    if (!rightsAccepted) {
      return "Please accept the publicity rights disclaimer to continue.";
    }
    return null;
  }

  async function submitAudition() {
    const error = validateSubmit();
    if (error) {
      setSubmitError(error);
      toast.warning(error);
      return;
    }
    if (!videoFile || !photoFile) return;

    setSubmitError(null);
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      formData.append("video", videoFile);
      formData.append("photo", photoFile);

      await audition.submit(formData, (update) => {
        if (typeof update === "number") {
          setUploadProgress(update);
          return;
        }
        setUploadProgress(update.percent);
      });

      setUploadProgress(100);
      setSubmitSuccess(true);
      toast.success("Audition submitted successfully");
    } catch (err) {
      const message = getErrorMessage(err, "Submission failed.");
      setSubmitError(message);
      toast.error(message);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepIndex = STEPS.indexOf(step);
  const isLastStep = step === "photo";

  const isContinueDisabled =
    (step === "video" && !videoFile) ||
    (isLastStep &&
      (!photoFile ||
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !rightsAccepted ||
        isSubmitting ||
        submitSuccess));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={() => {
        if (openSynopsis) return;
        resetAndClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Audition submission wizard"
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl ${
          step === "projects" ? "max-w-3xl" : "max-w-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-zinc-800 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                Step {stepIndex + 1} of {STEPS.length}
              </p>
              <h3 className="mt-1 text-lg font-bold text-zinc-50 sm:text-xl">
                {STEP_LABELS[step]}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              disabled={isSubmitting}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:opacity-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-5 w-full">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {step === "projects" && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-zinc-400">
                These are the films you could be a part of. Hover a poster to
                preview the synopsis, then click it to open the full
                synopsis.
              </p>
              <div className="grid items-stretch gap-4 sm:grid-cols-2">
                {PRODUCTIONS.map((production) => (
                  <div
                    key={production.id}
                    className={
                      production.id === "sway"
                        ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md"
                        : "h-full"
                    }
                  >
                    <ProductionPosterCard
                      production={production}
                      onOpenSynopsis={openSynopsisFor}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "dialogue" && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-zinc-400">
                Read the scene below, memorize your lines, and record yourself
                performing this monologue. This is your moment — bring the
                character to life.
              </p>
              <blockquote className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
                <p className="font-serif text-base italic leading-relaxed text-zinc-200 sm:text-lg">
                  {DUMMY_DIALOGUE}
                </p>
              </blockquote>
            </div>
          )}

          {step === "video" && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                Upload your audition video — perform the dialogue you just read
                and show us what you&apos;ve got.
              </p>
              <UploadZone
                accept="video/*"
                label="Drop your video here or click to browse"
                hint={`MP4, MOV, or WebM · Max ${AUDITION_MAX_VIDEO_MB}MB`}
                fileName={videoFile?.name ?? null}
                error={videoError}
                onFileSelect={selectVideo}
              />
            </div>
          )}

          {step === "photo" && (
            <div className="space-y-4">
              {submitSuccess ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                    <p className="text-lg font-bold text-emerald-400">
                      Submission received
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                      Thanks{firstName.trim() ? `, ${firstName.trim()}` : ""}.
                      We&apos;ve emailed you a confirmation and our team will
                      review your audition shortly.
                    </p>
                  </div>
                  <Link
                    href="/membership"
                    className="block rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-center transition-colors hover:bg-amber-500/15"
                  >
                    <p className="text-sm font-bold leading-snug text-amber-300 sm:text-base">
                      Become a Movie Studio Member and Receive Valuable Access
                      Behind the Velvet Rope!
                    </p>
                    <p className="mt-2 text-xs font-semibold text-amber-400">
                      Explore Membership →
                    </p>
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-400">
                    Add a headshot or profile photo, then enter your details and
                    submit your audition.
                  </p>
                  <UploadZone
                    accept="image/*"
                    label="Drop your photo here or click to browse"
                    hint={`JPG, PNG, or WebP · Max ${AUDITION_MAX_PHOTO_MB}MB`}
                    fileName={photoFile?.name ?? null}
                    error={photoError}
                    compact
                    onFileSelect={selectPhoto}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        First name
                      </span>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isSubmitting}
                        autoComplete="given-name"
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        Last name
                      </span>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isSubmitting}
                        autoComplete="family-name"
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-medium text-zinc-400">
                        Email
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        autoComplete="email"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  {submitError && (
                    <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {submitError}
                    </p>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <input
                      type="checkbox"
                      checked={rightsAccepted}
                      onChange={(e) => setRightsAccepted(e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-950 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs leading-relaxed text-zinc-400">
                      I understand and agree that The Movie Studio website and
                      The Movie Studio (and its affiliates) have the right to
                      use my audition video, headshot, name, and related
                      submission materials in any manner, anywhere, for
                      publicity, marketing, promotional, casting, or related
                      purposes, without further permission or compensation.
                    </span>
                  </label>

                  {isSubmitting && (
                    <div
                      className="space-y-2"
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Upload progress"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-300">
                          Uploading…
                        </span>
                        <span className="tabular-nums font-semibold text-amber-400">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-[width] duration-200 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={
              submitSuccess
                ? resetAndClose
                : stepIndex === 0
                  ? resetAndClose
                  : goBack
            }
            disabled={isSubmitting}
            className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-50"
          >
            {submitSuccess || stepIndex === 0 ? "Close" : "Back"}
          </button>
          {!submitSuccess && (
            <button
              type="button"
              onClick={isLastStep ? () => void submitAudition() : goNext}
              disabled={isContinueDisabled}
              className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLastStep
                ? isSubmitting
                  ? `${uploadProgress}%`
                  : "Submit"
                : "Continue"}
            </button>
          )}
        </div>
      </div>

      {openSynopsis && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closeSynopsis}
          role="dialog"
          aria-modal="true"
          aria-label={`${openSynopsis.title} synopsis`}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-400">
                  {openSynopsis.status}
                </p>
                <h4 className="mt-1 text-base font-bold text-zinc-50 sm:text-lg">
                  {openSynopsis.title} — Synopsis
                </h4>
              </div>
              <button
                type="button"
                onClick={closeSynopsis}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                aria-label="Close synopsis"
              >
                ✕
              </button>
            </div>
            <div className="thin-scroll relative min-h-0 flex-1 overflow-y-auto bg-black">
              <Image
                src={openSynopsis.synopsisSheet}
                alt={`${openSynopsis.title} synopsis`}
                width={1080}
                height={1620}
                className="mx-auto h-auto w-full object-contain"
              />
            </div>
            {openSynopsis.mediaLinks && (
              <div className="shrink-0 border-t border-zinc-800 px-4 py-4 sm:px-5">
                <ProductionMediaLinks
                  mediaLinks={openSynopsis.mediaLinks}
                  title={openSynopsis.title}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
