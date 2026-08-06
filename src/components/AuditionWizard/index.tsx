"use client";

import { useEffect, useState } from "react";

import { AUDITION_PLANS, type AuditionPlanId } from "@/lib/auditionPlans";
import {
  AUDITION_MAX_UPLOAD_BYTES,
  AUDITION_MAX_UPLOAD_MB,
} from "@/lib/auditionLimits";
import type { AcceptJsResponse } from "@/types/acceptjs";

type WizardStep = "dialogue" | "video" | "photo" | "subscription";

const STEPS: WizardStep[] = ["dialogue", "video", "photo", "subscription"];

const STEP_LABELS: Record<WizardStep, string> = {
  dialogue: "Your Scene",
  video: "Upload Video",
  photo: "Upload Photo",
  subscription: "Choose Plan",
};

const DUMMY_DIALOGUE = `"I've waited my whole life for this moment. The lights, the camera, the chance to prove I'm more than just a dreamer standing in the shadows. Every rejection, every late night, every doubt — they all led me here. So take a breath, find your truth, and when they call action… give them everything you've got."`;

const SUBSCRIPTION_PLANS = [
  AUDITION_PLANS.monthly,
  AUDITION_PLANS.yearly,
] as const;

function acceptJsSrc(): string {
  const env = (
    process.env.NEXT_PUBLIC_AUTHORIZENET_ENV || "sandbox"
  ).toLowerCase();
  return env === "production"
    ? "https://js.authorize.net/v1/Accept.js"
    : "https://jstest.authorize.net/v1/Accept.js";
}

function loadAcceptJs(): Promise<void> {
  const src = acceptJsSrc();
  return new Promise((resolve, reject) => {
    // Drop the opposite env script if it was loaded earlier in this tab.
    document
      .querySelectorAll(
        'script[src="https://js.authorize.net/v1/Accept.js"], script[src="https://jstest.authorize.net/v1/Accept.js"]',
      )
      .forEach((node) => {
        const el = node as HTMLScriptElement;
        if (el.src !== src) el.remove();
      });

    if (window.Accept && document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    // Force a fresh Accept global when switching sandbox/live in the same tab.
    if (window.Accept) {
      delete window.Accept;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Accept.js")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Accept.js"));
    document.head.appendChild(script);
  });
}

function tokenizeCard(input: {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip?: string;
  fullName: string;
}): Promise<{ dataDescriptor: string; dataValue: string }> {
  const apiLoginID = process.env.NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID?.trim();
  const clientKey = process.env.NEXT_PUBLIC_AUTHORIZENET_CLIENT_KEY?.trim();

  if (!apiLoginID || !clientKey) {
    return Promise.reject(
      new Error(
        "Payment is not configured. Add NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID and NEXT_PUBLIC_AUTHORIZENET_CLIENT_KEY.",
      ),
    );
  }

  if (!window.Accept) {
    return Promise.reject(new Error("Secure payment library is not ready."));
  }

  return new Promise((resolve, reject) => {
    window.Accept!.dispatchData(
      {
        authData: { apiLoginID, clientKey },
        cardData: {
          cardNumber: input.cardNumber.replace(/\s+/g, ""),
          month: input.month.padStart(2, "0"),
          year: input.year.length === 2 ? `20${input.year}` : input.year,
          cardCode: input.cardCode,
          zip: input.zip || undefined,
          fullName: input.fullName,
        },
      },
      (response: AcceptJsResponse) => {
        if (response.messages.resultCode === "Error" || !response.opaqueData) {
          const text =
            response.messages.message?.[0]?.text ||
            "Unable to secure card details.";
          reject(new Error(text));
          return;
        }
        resolve({
          dataDescriptor: response.opaqueData.dataDescriptor,
          dataValue: response.opaqueData.dataValue,
        });
      },
    );
  });
}

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
  error,
  onFileSelect,
}: {
  accept: string;
  label: string;
  hint: string;
  fileName: string | null;
  error?: string | null;
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
      {error && (
        <p className="mt-3 text-xs text-red-300">{error}</p>
      )}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500 disabled:opacity-60";

/** Groups card digits in 4s: 4111111111111111 → 4111 1111 1111 1111 */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trimEnd();
}

export default function AuditionWizard({ isOpen, onClose }: AuditionWizardProps) {
  const [step, setStep] = useState<WizardStep>("dialogue");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AuditionPlanId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [acceptReady, setAcceptReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || step !== "subscription") return;

    let cancelled = false;
    loadAcceptJs()
      .then(() => {
        if (!cancelled) {
          setAcceptReady(true);
          setPaymentError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAcceptReady(false);
          setPaymentError("Unable to load secure payment form.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, step]);

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
    setVideoError(null);
    setPhotoError(null);
    setSelectedPlan(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setZip("");
    setCardNumber("");
    setExpMonth("");
    setExpYear("");
    setCvv("");
    setPaymentError(null);
    setPaymentSuccess(false);
    setIsPaying(false);
    onClose();
  }

  function selectVideo(file: File | null) {
    setVideoError(null);
    if (!file) {
      setVideoFile(null);
      return;
    }
    if (file.size > AUDITION_MAX_UPLOAD_BYTES) {
      setVideoFile(null);
      setVideoError(`Video must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`);
      return;
    }
    if (photoFile && file.size + photoFile.size > AUDITION_MAX_UPLOAD_BYTES) {
      setVideoFile(null);
      setVideoError(
        `Video + photo together must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`,
      );
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
    if (file.size > AUDITION_MAX_UPLOAD_BYTES) {
      setPhotoFile(null);
      setPhotoError(`Photo must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`);
      return;
    }
    if (videoFile && file.size + videoFile.size > AUDITION_MAX_UPLOAD_BYTES) {
      setPhotoFile(null);
      setPhotoError(
        `Video + photo together must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`,
      );
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

  function validateBilling(): string | null {
    if (!selectedPlan) return "Please select a plan.";
    if (!firstName.trim() || !lastName.trim()) {
      return "Enter your first and last name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address.";
    }
    const number = cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,16}$/.test(number)) return "Enter a valid card number.";
    if (!/^\d{1,2}$/.test(expMonth) || Number(expMonth) < 1 || Number(expMonth) > 12) {
      return "Enter a valid expiration month (MM).";
    }
    if (!/^\d{2}$/.test(expYear) && !/^\d{4}$/.test(expYear)) {
      return "Enter a valid expiration year (YY).";
    }
    if (!/^\d{3,4}$/.test(cvv)) return "Enter a valid CVV.";
    if (!acceptReady) return "Payment form is still loading. Please wait.";
    return null;
  }

  async function startCheckout() {
    const error = validateBilling();
    if (error) {
      setPaymentError(error);
      return;
    }
    if (!selectedPlan) return;

    setPaymentError(null);
    setIsPaying(true);

    try {
      const opaque = await tokenizeCard({
        cardNumber,
        month: expMonth,
        year: expYear,
        cardCode: cvv,
        zip: zip.trim() || undefined,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
      });

      if (!videoFile || !photoFile) {
        throw new Error("Audition video and photo are required.");
      }

      const formData = new FormData();
      formData.append("dataDescriptor", opaque.dataDescriptor);
      formData.append("dataValue", opaque.dataValue);
      formData.append("planId", selectedPlan);
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      if (zip.trim()) formData.append("zip", zip.trim());
      formData.append("video", videoFile);
      formData.append("photo", photoFile);

      const response = await fetch("/api/audition/checkout", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Payment failed.");
      }

      setPaymentSuccess(true);
      setCardNumber("");
      setCvv("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment failed.";
      const needsHttps =
        /https/i.test(message) &&
        typeof window !== "undefined" &&
        window.location.protocol !== "https:";
      setPaymentError(
        needsHttps
          ? "Authorize.net requires HTTPS. Stop the server and run: npm run dev:https — then open https://localhost:3000"
          : message,
      );
    } finally {
      setIsPaying(false);
    }
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
        !cardNumber.trim() ||
        !expMonth.trim() ||
        !expYear.trim() ||
        !cvv.trim() ||
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
                hint={`MP4, MOV, or WebM · Max ${AUDITION_MAX_UPLOAD_MB}MB total with photo`}
                fileName={videoFile?.name ?? null}
                error={videoError}
                onFileSelect={selectVideo}
              />
            </div>
          )}

          {step === "photo" && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                Add a headshot or profile photo so our casting team can put a
                face to your performance.
              </p>
              <UploadZone
                accept="image/*"
                label="Drop your photo here or click to browse"
                hint={`JPG, PNG, or WebP · Max ${AUDITION_MAX_UPLOAD_MB}MB total with video`}
                fileName={photoFile?.name ?? null}
                error={photoError}
                onFileSelect={selectPhoto}
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
                    Your {selectedPlanDetails?.name.toLowerCase()}{" "}
                    audition payment is complete. We&apos;ll review your
                    submission soon.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-400">
                    Choose a plan and pay securely with Authorize.net to submit
                    your audition.
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
                        disabled={isPaying}
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
                        disabled={isPaying}
                        autoComplete="email"
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-medium text-zinc-400">
                        Card number
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        disabled={isPaying}
                        placeholder="···· ···· ···· ····"
                        maxLength={19}
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        Exp month (MM)
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        disabled={isPaying}
                        placeholder="12"
                        maxLength={2}
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        Exp year (YY)
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        disabled={isPaying}
                        placeholder="27"
                        maxLength={4}
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        CVV
                      </span>
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        disabled={isPaying}
                        placeholder="123"
                        maxLength={4}
                        className={inputClassName}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400">
                        ZIP (optional)
                      </span>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        disabled={isPaying}
                        autoComplete="postal-code"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  {paymentError && (
                    <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {paymentError}
                    </p>
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
              onClick={isLastStep ? () => void startCheckout() : goNext}
              disabled={isContinueDisabled || (isLastStep && !acceptReady)}
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
