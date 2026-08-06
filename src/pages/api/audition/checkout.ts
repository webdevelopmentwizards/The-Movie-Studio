import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import { IncomingForm, type File as FormidableFile } from "formidable";

import { AUDITION_PLANS, type AuditionPlanId } from "@/lib/auditionPlans";
import {
  AUDITION_MAX_UPLOAD_BYTES,
  AUDITION_MAX_UPLOAD_MB,
} from "@/lib/auditionLimits";
import {
  chargeAuditionPayment,
  isAuthorizeNetConfigured,
} from "@/lib/authorizenet";
import {
  isMailConfigured,
  sendAuditionPaymentEmails,
  type AuditionMailAttachment,
} from "@/lib/mail";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: `${AUDITION_MAX_UPLOAD_MB * 2}mb`,
  },
};

type CheckoutSuccess = {
  ok: true;
  transactionId: string;
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
    maxFileSize: AUDITION_MAX_UPLOAD_BYTES,
    maxTotalFileSize: AUDITION_MAX_UPLOAD_BYTES * 2,
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

async function fileToAttachment(
  file: FormidableFile | null,
  fallbackName: string,
): Promise<AuditionMailAttachment> {
  if (!file?.filepath) {
    throw new Error(`${fallbackName} is required.`);
  }

  const filename = file.originalFilename || fallbackName;
  const contentType = file.mimetype || undefined;
  const size = file.size ?? 0;

  if (size <= 0 || size > AUDITION_MAX_UPLOAD_BYTES) {
    throw new Error(
      `${filename} must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`,
    );
  }

  const buffer = await fs.readFile(file.filepath);

  const uploadRoot = path.join(process.cwd(), "uploads", "auditions");
  await fs.mkdir(uploadRoot, { recursive: true });
  const safeName = `${Date.now()}-${filename.replace(/[^\w.\-]+/g, "_")}`;
  const savedPath = path.join(uploadRoot, safeName);
  await fs.writeFile(savedPath, buffer);

  return { filename, content: buffer, contentType };
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
  if (
    videoSize <= 0 ||
    photoSize <= 0 ||
    videoSize > AUDITION_MAX_UPLOAD_BYTES ||
    photoSize > AUDITION_MAX_UPLOAD_BYTES
  ) {
    return res.status(400).json({
      ok: false,
      error: `Each file must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`,
    });
  }
  if (videoSize + photoSize > AUDITION_MAX_UPLOAD_BYTES) {
    return res.status(400).json({
      ok: false,
      error: `Video and photo together must be ${AUDITION_MAX_UPLOAD_MB}MB or smaller.`,
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
    const videoAttachment = await fileToAttachment(video, "audition-video");
    const photoAttachment = await fileToAttachment(photo, "audition-photo.jpg");

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
          attachments: [videoAttachment, photoAttachment],
        });
      } catch (mailError) {
        const message =
          mailError instanceof Error ? mailError.message : "Mail failed";
        console.error("[audition/checkout] email failed:", message);
        // Payment already succeeded — do not fail the user submission.
      }
    } else {
      console.warn(
        "[audition/checkout] mail not configured; skipped audition emails.",
      );
    }

    // Cleanup formidable temp files
    await Promise.allSettled(
      [video.filepath, photo.filepath].map((filepath) =>
        filepath ? fs.unlink(filepath) : Promise.resolve(),
      ),
    );

    return res.status(200).json({
      ok: true,
      transactionId: result.transactionId,
      planId,
      amount: plan.amount,
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
