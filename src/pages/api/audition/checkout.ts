import type { NextApiRequest, NextApiResponse } from "next";

import {
  AUDITION_PLANS,
  chargeAuditionSubscription,
  isKurvApproved,
  type AuditionPlanId,
} from "@/lib/kurv";

type CheckoutBody = {
  paymentToken?: string;
  planId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  zip?: string;
};

type CheckoutSuccess = {
  ok: true;
  transactionId: string;
  subscriptionId: string;
  planId: AuditionPlanId;
  amount: string;
};

type CheckoutError = {
  ok: false;
  error: string;
};

function isPlanId(value: unknown): value is AuditionPlanId {
  return value === "monthly" || value === "yearly";
}

function clientIp(req: NextApiRequest): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim();
  }
  return req.socket.remoteAddress ?? undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutSuccess | CheckoutError>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  if (!process.env.KURV_SECURITY_KEY) {
    return res.status(503).json({
      ok: false,
      error: "Payment is not configured. Add KURV_SECURITY_KEY.",
    });
  }

  const body = req.body as CheckoutBody;
  const paymentToken = body.paymentToken?.trim();
  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim();
  const zip = body.zip?.trim();

  if (!paymentToken) {
    return res.status(400).json({ ok: false, error: "Payment token is required." });
  }
  if (!isPlanId(body.planId)) {
    return res.status(400).json({ ok: false, error: "Invalid plan selected." });
  }
  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ ok: false, error: "First and last name are required." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "A valid email is required." });
  }

  try {
    const result = await chargeAuditionSubscription({
      paymentToken,
      planId: body.planId,
      firstName,
      lastName,
      email,
      zip,
      ipAddress: clientIp(req),
    });

    if (!isKurvApproved(result)) {
      return res.status(402).json({
        ok: false,
        error: result.responsetext || "Payment was declined.",
      });
    }

    return res.status(200).json({
      ok: true,
      transactionId: result.transactionid,
      subscriptionId: result.subscription_id,
      planId: body.planId,
      amount: AUDITION_PLANS[body.planId].amount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment processing failed.";
    console.error("[audition/checkout]", message);
    return res.status(502).json({
      ok: false,
      error: "Unable to process payment. Please try again.",
    });
  }
}
