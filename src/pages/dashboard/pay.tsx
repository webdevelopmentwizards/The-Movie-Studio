import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import Logo from "@/components/Logo";
import {
  clearMemberPending,
  getMemberPending,
  setMemberPending,
} from "@/lib/memberSession";
import {
  isMembershipPlanId,
  MEMBERSHIP_PLANS,
  type MembershipPlanId,
} from "@/lib/membershipPlans";
import { requireAuth, type SsrAuthProps } from "@/lib/auth/ssrAuth";
import { useApi } from "@/context/ApiContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { activateMembership, selectAuth } from "@/store/apps/auth";

export const getServerSideProps = requireAuth;

const inputClassName =
  "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvc(value: string) {
  return onlyDigits(value).slice(0, 4);
}

function isValidExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export default function MembershipPayPage(_props: SsrAuthProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { toast } = useApi();
  const [submitting, setSubmitting] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const planId: MembershipPlanId = useMemo(() => {
    const raw = router.query.plan;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return isMembershipPlanId(value) ? value : "yearly";
  }, [router.query.plan]);

  const plan = MEMBERSHIP_PLANS[planId];

  useEffect(() => {
    if (!auth.user) return;
    const pending = getMemberPending();
    const fallbackName =
      pending?.name ||
      [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ") ||
      "";
    if (fallbackName && !cardName) {
      setCardName(fallbackName);
    }
  }, [auth.user, cardName]);

  function validateCardFields(): string | null {
    const name = cardName.trim();
    const numberDigits = onlyDigits(cardNumber);
    const cvcDigits = onlyDigits(cvc);

    if (name.length < 2) return "Enter the name on the card.";
    if (numberDigits.length !== 16) {
      return "Enter a valid 16-digit card number.";
    }
    if (!isValidExpiry(expiry)) {
      return "Enter a valid expiry date (MM/YY).";
    }
    if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      return "Enter a valid 3 or 4 digit CVC.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!auth.user && !_props.user) {
      toast.error("Please sign in before completing payment.");
      return;
    }

    const user = auth.user || _props.user;

    const validationError = validateCardFields();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    setSubmitting(true);

    const pending = getMemberPending();
    if (!pending) {
      setMemberPending({
        name:
          cardName.trim() ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.email,
        email: user.email,
        planId,
      });
    }

    const result = await dispatch(activateMembership(planId));
    setSubmitting(false);

    if (activateMembership.fulfilled.match(result)) {
      clearMemberPending();
      toast.success("Membership activated");
      void router.push("/dashboard");
      return;
    }

    toast.error(
      (result.payload as string) ||
        "Unable to activate membership. Please try again.",
    );
  }

  return (
    <>
      <Head>
        <title>Complete Membership Payment — The Movie Studio</title>
        <meta
          name="description"
          content="Complete payment to unlock Movie Studio Membership benefits."
        />
      </Head>

      <section className="relative min-h-dvh overflow-x-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10 sm:px-8">
          <div className="mb-8">
            <Logo size="md" priority />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              Step 2 of 2 — Payment
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50">
              Unlock the velvet rope
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              You&apos;re joining the{" "}
              <span className="font-semibold text-zinc-200">{plan.name}</span>{" "}
              plan at{" "}
              <span className="font-semibold text-amber-400">
                {plan.priceLabel}
              </span>{" "}
              {plan.period}.
            </p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Due today</span>
                <span className="font-bold text-zinc-50">{plan.priceLabel}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{plan.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="cardName"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Name on card
                </label>
                <input
                  id="cardName"
                  name="cardName"
                  type="text"
                  autoComplete="cc-name"
                  required
                  disabled={submitting}
                  value={cardName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCardName(e.target.value)
                  }
                  className={inputClassName}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Card number
                </label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  disabled={submitting}
                  value={cardNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className={inputClassName}
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="expiry"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    required
                    disabled={submitting}
                    value={expiry}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setExpiry(formatExpiry(e.target.value))
                    }
                    maxLength={5}
                    placeholder="MM/YY"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    name="cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                    disabled={submitting}
                    value={cvc}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCvc(formatCvc(e.target.value))
                    }
                    maxLength={4}
                    placeholder="123"
                    className={inputClassName}
                  />
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-500">
                Demo tip: use{" "}
                <span className="font-medium text-zinc-300">
                  4242 4242 4242 4242
                </span>
                , any future expiry, and any 3-digit CVC.
              </p>

              <button
                type="submit"
                disabled={submitting || !(auth.user || _props.user)}
                className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
              >
                {submitting
                  ? "Processing…"
                  : `Pay ${plan.priceLabel} & unlock access`}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-zinc-500">
              <Link
                href="/membership"
                className="text-zinc-400 hover:text-amber-400"
              >
                ← Back to plans
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
