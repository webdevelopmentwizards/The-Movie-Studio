"use client";

import { useEffect, useState } from "react";

import {
  AUDITION_MAX_PHOTO_BYTES,
  AUDITION_MAX_PHOTO_MB,
  AUDITION_MAX_VIDEO_BYTES,
  AUDITION_MAX_VIDEO_MB,
} from "@/lib/auditionLimits";

type WizardStep = "dialogue" | "video" | "photo";

const STEPS: WizardStep[] = ["dialogue", "video", "photo"];

const STEP_LABELS: Record<WizardStep, string> = {
  dialogue: "Your Scene",
  video: "Upload Video",
  photo: "Upload Photo",
};

const DUMMY_DIALOGUE = `"I've waited my whole life for this moment. The lights, the camera, the chance to prove I'm more than just a dreamer standing in the shadows. Every rejection, every late night, every doubt — they all led me here. So take a breath, find your truth, and when they call action… give them everything you've got."`;

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
            <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-20">
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
  const [step, setStep] = useState<WizardStep>("dialogue");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rightsAccepted, setRightsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (event.key === "Escape" && !isSubmitting) onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  function resetAndClose() {
    if (isSubmitting) return;
    setStep("dialogue");
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
      return;
    }
    if (!videoFile || !photoFile) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      formData.append("video", videoFile);
      formData.append("photo", photoFile);

      const response = await fetch("/api/audition/submit", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed.",
      );
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
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
      aria-label="Audition submission wizard"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
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
                  ? "Submitting…"
                  : "Submit"
                : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
