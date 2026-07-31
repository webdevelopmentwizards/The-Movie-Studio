import type { NextApiRequest, NextApiResponse } from "next";

import { isMailConfigured, sendContactEmails } from "@/lib/mail";
import { consumeRateLimit, pruneRateLimits } from "@/lib/rateLimit";

const SUBJECTS: Record<string, string> = {
  general: "General Inquiry",
  partnership: "Partnership",
  press: "Press & Media",
  careers: "Careers",
};

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  /** Honeypot — must stay empty */
  company?: string;
};

type ContactSuccess = { ok: true };
type ContactError = { ok: false; error: string };

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim() || "unknown";
  }
  return req.socket.remoteAddress || "unknown";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function originAllowed(req: NextApiRequest): boolean {
  const allowed = process.env.CONTACT_ALLOWED_ORIGIN?.trim();
  if (!allowed) return true;

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (origin && origin === allowed) return true;
  if (typeof referer === "string" && referer.startsWith(allowed)) return true;

  // Same-origin browser posts may omit Origin on some navigations; allow if no Origin/Referer in prod only when configured carefully.
  // Prefer rejecting when Origin is present but wrong.
  if (origin && origin !== allowed) return false;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactSuccess | ContactError>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  if (!isMailConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "Email is not configured. Please try again later.",
    });
  }

  if (!originAllowed(req)) {
    return res.status(403).json({ ok: false, error: "Forbidden." });
  }

  pruneRateLimits();
  const rate = consumeRateLimit(
    `contact:${clientIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSec));
    return res.status(429).json({
      ok: false,
      error: "Too many messages. Please try again later.",
    });
  }

  const body = (req.body || {}) as ContactBody;

  // Bot honeypot — pretend success so scrapers do not retry.
  if (body.company && String(body.company).trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || name.length > MAX_NAME) {
    return res.status(400).json({ ok: false, error: "Please enter your name." });
  }
  if (!email || email.length > MAX_EMAIL || !isValidEmail(email)) {
    return res
      .status(400)
      .json({ ok: false, error: "Please enter a valid email address." });
  }
  if (!subject || !SUBJECTS[subject]) {
    return res
      .status(400)
      .json({ ok: false, error: "Please select a subject." });
  }
  if (!message || message.length < 10) {
    return res.status(400).json({
      ok: false,
      error: "Please enter a message (at least 10 characters).",
    });
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({
      ok: false,
      error: "Message is too long. Please shorten it.",
    });
  }

  try {
    await sendContactEmails({
      name,
      email,
      subjectValue: subject,
      subjectLabel: SUBJECTS[subject],
      message,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    console.error("[contact]", detail);
    return res.status(502).json({
      ok: false,
      error: "Unable to send your message right now. Please try again shortly.",
    });
  }
}
