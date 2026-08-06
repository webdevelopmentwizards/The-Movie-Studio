import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { IncomingForm, type File as FormidableFile } from "formidable";

import {
  AUDITION_MAX_PHOTO_BYTES,
  AUDITION_MAX_PHOTO_MB,
  AUDITION_MAX_VIDEO_BYTES,
  AUDITION_MAX_VIDEO_MB,
} from "@/lib/auditionLimits";
import { AUDITION_PLANS, type AuditionPlanId } from "@/lib/auditionPlans";
import {
  chargeAuditionPayment,
  isAuthorizeNetConfigured,
} from "@/lib/authorizenet";
import { isMailConfigured, sendAuditionPaymentEmails } from "@/lib/mail";
import { isMinioConfigured, uploadAuditionFile } from "@/lib/minio";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

type CheckoutSuccess = {
  ok: true;
  transactionId: string;
  subscriptionId: string;
  planId: AuditionPlanId;
  amount: string;
  videoUrl?: string;
  photoUrl?: string;
};

type CheckoutError = {
  ok: false;
  error: string;
};

function isPlanId(value: unknown): value is AuditionPlanId {
  return value === "monthly" || value === "yearly";
}

function firstFile(
  files: Record<string, FormidableFile | FormidableFile[] | undefined>,
  key: string,
): FormidableFile | null {
  const value = files[key];
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function parseForm(req: NextApiRequest): Promise<{
  fields: Record<string, string>;
  files: Record<string, FormidableFile | FormidableFile[] | undefined>;
}> {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    maxFileSize: AUDITION_MAX_VIDEO_BYTES,
    maxTotalFileSize: AUDITION_MAX_VIDEO_BYTES + AUDITION_MAX_PHOTO_BYTES,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(fields)) {
        const raw = Array.isArray(value) ? value[0] : value;
        normalized[key] = typeof raw === "string" ? raw : "";
      }

      resolve({ fields: normalized, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutSuccess | CheckoutError>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  if (!isAuthorizeNetConfigured()) {
    return res.status(503).json({
      ok: false,
      error:
        "Payment is not configured. Add AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY.",
    });
  }

  if (!isMinioConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "File storage is not configured. Add MinIO environment variables.",
    });
  }

  let fields: Record<string, string>;
  let files: Record<string, FormidableFile | FormidableFile[] | undefined>;

  try {
    ({ fields, files } = await parseForm(req));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read upload.";
    console.error("[audition/checkout] form parse", message);
    return res.status(400).json({
      ok: false,
      error: "Unable to read submission. File may be too large.",
    });
  }

  const dataDescriptor = fields.dataDescriptor?.trim();
  const dataValue = fields.dataValue?.trim();
  const firstName = fields.firstName?.trim();
  const lastName = fields.lastName?.trim();
  const email = fields.email?.trim();
  const zip = fields.zip?.trim();
  const planId = fields.planId?.trim();

  if (!dataDescriptor || !dataValue) {
    return res
      .status(400)
      .json({ ok: false, error: "Payment nonce is required." });
  }
  if (!isPlanId(planId)) {
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

  const video = firstFile(files, "video");
  const photo = firstFile(files, "photo");
  if (!video || !photo) {
    return res.status(400).json({
      ok: false,
      error: "Audition video and photo are required.",
    });
  }

  const videoSize = video.size ?? 0;
  const photoSize = photo.size ?? 0;
  if (videoSize <= 0 || videoSize > AUDITION_MAX_VIDEO_BYTES) {
    return res.status(400).json({
      ok: false,
      error: `Video must be ${AUDITION_MAX_VIDEO_MB}MB or smaller.`,
    });
  }
  if (photoSize <= 0 || photoSize > AUDITION_MAX_PHOTO_BYTES) {
    return res.status(400).json({
      ok: false,
      error: `Photo must be ${AUDITION_MAX_PHOTO_MB}MB or smaller.`,
    });
  }

  try {
    const result = await chargeAuditionPayment({
      planId,
      opaqueData: { dataDescriptor, dataValue },
      firstName,
      lastName,
      email,
      zip,
    });

    const plan = AUDITION_PLANS[planId];

    const [videoUpload, photoUpload] = await Promise.all([
      uploadAuditionFile({
        localPath: video.filepath,
        originalFilename: video.originalFilename || "audition-video.mp4",
        contentType: video.mimetype,
        kind: "video",
      }),
      uploadAuditionFile({
        localPath: photo.filepath,
        originalFilename: photo.originalFilename || "audition-photo.jpg",
        contentType: photo.mimetype,
        kind: "photo",
      }),
    ]);

    if (isMailConfigured()) {
      try {
        await sendAuditionPaymentEmails({
          firstName,
          lastName,
          email,
          planName: plan.name,
          amountLabel: plan.priceLabel,
          period: plan.period,
          transactionId: result.transactionId,
          subscriptionId: result.subscriptionId,
          videoUrl: videoUpload.url,
          photoUrl: photoUpload.url,
        });
      } catch (mailError) {
        const message =
          mailError instanceof Error ? mailError.message : "Mail failed";
        console.error("[audition/checkout] email failed:", message);
      }
    } else {
      console.warn(
        "[audition/checkout] mail not configured; skipped audition emails.",
      );
    }

    await Promise.allSettled(
      [video.filepath, photo.filepath].map((filepath) =>
        filepath ? fs.unlink(filepath) : Promise.resolve(),
      ),
    );

    return res.status(200).json({
      ok: true,
      transactionId: result.transactionId,
      subscriptionId: result.subscriptionId,
      planId,
      amount: plan.amount,
      videoUrl: videoUpload.url,
      photoUrl: photoUpload.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment processing failed.";
    console.error("[audition/checkout]", message);
    return res.status(402).json({
      ok: false,
      error: message || "Unable to process payment. Please try again.",
    });
  }
}
