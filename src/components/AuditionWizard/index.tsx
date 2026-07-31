"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  AUDITION_PLANS,
  type AuditionPlanId,
} from "@/lib/kurv";
import type { CollectJsTokenResponse } from "@/types/collectjs";

type WizardStep = "dialogue" | "video" | "photo" | "subscription";

const STEPS: WizardStep[] = ["dialogue", "video", "photo", "subscription"];

const STEP_LABELS: Record<WizardStep, string> = {
  dialogue: "Your Scene",
  video: "Upload Video",
  photo: "Upload Photo",
  subscription: "Choose Plan",
};

const DUMMY_DIALOGUE = `"I've waited my whole life for this moment. The lights, the camera, the chance to prove I'm more than just a dreamer standing in the shadows. Every rejection, every late night, every doubt — they all led me here. So take a breath, find your truth, and when they call action… give them everything you've got."`;

const COLLECT_JS_SRC =
  "https://kurv.transactiongateway.com/token/Collect.js";

const SUBSCRIPTION_PLANS = [
  AUDITION_PLANS.monthly,
  AUDITION_PLANS.yearly,
] as const;

interface AuditionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
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
                className={`hidden text-[10px] font-medium uppercase tracking-wide sm:block ${
                  isActive ? "text-amber-400" : "text-zinc-500"
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mb-5 h-px flex-1 ${
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
  onFileSelect,
}: {
  accept: string;
  label: string;
  hint: string;
  fileName: string | null;
  onFileSelect: (file: File | null) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-12 transition-colors hover:border-amber-500/50 hover:bg-zinc-900">
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-2xl text-amber-400">
        ↑
      </div>
      <p className="mt-4 text-sm font-semibold text-zinc-200">{label}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
      {fileName && (
        <p className="mt-4 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
          {fileName}
        </p>
      )}
    </label>
  );
}

function loadCollectJs(tokenizationKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${COLLECT_JS_SRC}"]`,
    );
    if (existing && window.CollectJS) {
      resolve();
      return;
    }

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Collect.js")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = COLLECT_JS_SRC;
    script.async = true;
    script.dataset.tokenizationKey = tokenizationKey;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Collect.js"));
    document.head.appendChild(script);
  });
}

export default function AuditionWizard({ isOpen, onClose }: AuditionWizardProps) {
  const [step, setStep] = useState<WizardStep>("dialogue");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AuditionPlanId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [isCollectReady, setIsCollectReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const billingRef = useRef({
    firstName: "",
    lastName: "",
    email: "",
    zip: "",
    planId: null as AuditionPlanId | null,
  });

  useEffect(() => {
    billingRef.current = {
      firstName,
      lastName,
      email,
      zip,
      planId: selectedPlan,
    };
  }, [firstName, lastName, email, zip, selectedPlan]);

  const processPayment = useCallback(async (token: string) => {
    const billing = billingRef.current;
    if (!billing.planId) {
      setPaymentError("Please select a plan.");
      return;
    }

    setIsPaying(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/audition/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentToken: token,
          planId: billing.planId,
          firstName: billing.firstName.trim(),
          lastName: billing.lastName.trim(),
          email: billing.email.trim(),
          zip: billing.zip.trim() || undefined,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Payment failed.");
      }

      setPaymentSuccess(true);
      setPaymentError(null);
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Payment failed.",
      );
    } finally {
      setIsPaying(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || step !== "subscription") return;

    const tokenizationKey = process.env.NEXT_PUBLIC_KURV_TOKENIZATION_KEY;
    if (!tokenizationKey) {
      setPaymentError(
        "Payment is not configured. Add NEXT_PUBLIC_KURV_TOKENIZATION_KEY.",
      );
      setIsCollectReady(false);
      return;
    }

    let cancelled = false;

    loadCollectJs(tokenizationKey)
      .then(() => {
        if (cancelled || !window.CollectJS) return;

        window.CollectJS.configure({
          paymentType: "cc",
          theme: "bootstrap",
          primaryColor: "#f59e0b",
          secondaryColor: "#18181b",
          buttonText: "Pay securely",
          instructionText: "Enter your card details",
          // Avoid auto-binding a #payButton; we call startPaymentRequest manually.
          paymentSelector: "#kurv-collect-trigger",
          callback: (response: CollectJsTokenResponse) => {
            if (!response?.token) {
              setPaymentError("Could not tokenize card. Please try again.");
              return;
            }
            void processPayment(response.token);
          },
        });

        setIsCollectReady(true);
        setPaymentError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setIsCollectReady(false);
          setPaymentError("Unable to load secure payment form.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, step, processPayment]);

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
      if (event.key === "Escape" && !isPaying) onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isPaying]);

  function resetAndClose() {
    if (isPaying) return;
    setStep("dialogue");
    setVideoFile(null);
    setPhotoFile(null);
    setSelectedPlan(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setZip("");
    setPaymentError(null);
    setPaymentSuccess(false);
    setIsPaying(false);
    onClose();
  }

  function goNext() {
    const index = STEPS.indexOf(step);
    if (index < STEPS.length - 1) {
      setStep(STEPS[index + 1]);
    }
  }

  function goBack() {
    const index = STEPS.indexOf(step);
    if (index > 0) {
      setStep(STEPS[index - 1]);
    }
  }

  function validateBilling(): string | null {
    if (!selectedPlan) return "Please select a plan.";
    if (!firstName.trim() || !lastName.trim()) {
      return "Enter your first and last name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address.";
    }
    if (!isCollectReady || !window.CollectJS) {
      return "Payment form is still loading. Please wait a moment.";
    }
    return null;
  }

  function startCheckout() {
    const error = validateBilling();
    if (error) {
      setPaymentError(error);
      return;
    }

    setPaymentError(null);
    // Opens Kurv Collect.js lightbox; charge runs only after a token is returned.
    window.CollectJS?.startPaymentRequest();
  }

  const stepIndex = STEPS.indexOf(step);
  const isLastStep = step === "subscription";
  const selectedPlanDetails = selectedPlan
    ? AUDITION_PLANS[selectedPlan]
    : null;

  const isContinueDisabled =
    (step === "video" && !videoFile) ||
    (step === "photo" && !photoFile) ||
    (isLastStep &&
      (!selectedPlan ||
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        isPaying ||
        paymentSuccess));

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
              disabled={isPaying}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:opacity-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-5">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
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
              <p className="text-xs text-zinc-500">
                Tip: Find a quiet space, look into the camera, and deliver the
                lines with emotion. You&apos;ll upload your recording on the
                next step.
              </p>
            </div>
          )}

          {step === "video" && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                Upload your audition video — perform the dialogue you just read
                and show us what you&apos;ve got.
              </p>
              {!videoFile && (
                <p className="text-xs text-amber-400/80">
                  A video upload is required to continue.
                </p>
              )}
              <UploadZone
                accept="video/*"
                label="Drop your video here or click to browse"
                hint="MP4, MOV, or WebM · Max 500MB"
                fileName={videoFile?.name ?? null}
                onFileSelect={setVideoFile}
              />
            </div>
          )}

          {step === "photo" && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                Add a headshot or profile photo so our casting team can put a
                face to your performance.
              </p>
              {!photoFile && (
                <p className="text-xs text-amber-400/80">
                  A photo upload is required to continue.
                </p>
              )}
              <UploadZone
                accept="image/*"
                label="Drop your photo here or click to browse"
                hint="JPG, PNG, or WebP · Clear, well-lit headshot preferred"
                fileName={photoFile?.name ?? null}
                onFileSelect={setPhotoFile}
              />
            </div>
          )}

          {step === "subscription" && (
            <div className="space-y-5">
              {paymentSuccess ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                  <p className="text-lg font-bold text-emerald-400">
                    Payment successful
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Your {selectedPlanDetails?.name.toLowerCase()} audition plan
                    is active. We&apos;ll review your submission soon.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-400">
                    Choose a plan, enter your billing details, then pay securely
                    with Kurv to submit your audition.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {SUBSCRIPTION_PLANS.map((plan) => {
                      const isSelected = selectedPlan === plan.id;

                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          disabled={isPaying}
                          className={`relative rounded-xl border p-5 text-left transition-all disabled:opacity-60 ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50"
                              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                          }`}
                        >
                          {"badge" in plan && plan.badge && (
                            <span className="absolute -top-2.5 right-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                              {plan.badge}
                            </span>
                          )}
                          <p className="text-sm font-semibold text-zinc-300">
                            {plan.name}
                          </p>
                          <p className="mt-2 flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-zinc-50">
                              {plan.priceLabel}
                            </span>
                            <span className="text-sm text-zinc-500">
                              {plan.period}
                            </span>
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                            {plan.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        First name
                      </span>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isPaying}
                        autoComplete="given-name"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500"
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
                        disabled={isPaying}
                        autoComplete="family-name"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500"
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
                        disabled={isPaying}
                        autoComplete="email"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500"
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-medium text-zinc-400">
                        ZIP / Postal code (optional)
                      </span>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        disabled={isPaying}
                        autoComplete="postal-code"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500"
                      />
                    </label>
                  </div>

                  {/* Hidden trigger so Collect.js does not hijack our primary CTA */}
                  <button
                    type="button"
                    id="kurv-collect-trigger"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {paymentError && (
                    <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {paymentError}
                    </p>
                  )}

                  <p className="text-xs text-zinc-500">
                    Card details are collected securely by Kurv and never touch
                    our servers. You&apos;ll be charged{" "}
                    {selectedPlanDetails
                      ? `${selectedPlanDetails.priceLabel} ${selectedPlanDetails.period}`
                      : "after selecting a plan"}
                    .
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={
              paymentSuccess
                ? resetAndClose
                : stepIndex === 0
                  ? resetAndClose
                  : goBack
            }
            disabled={isPaying}
            className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-50"
          >
            {paymentSuccess || stepIndex === 0 ? "Close" : "Back"}
          </button>
          {!paymentSuccess && (
            <button
              type="button"
              onClick={isLastStep ? startCheckout : goNext}
              disabled={isContinueDisabled || (isLastStep && !isCollectReady)}
              className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLastStep
                ? isPaying
                  ? "Processing…"
                  : selectedPlanDetails
                    ? `Pay ${selectedPlanDetails.priceLabel}`
                    : "Pay & Submit"
                : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
