import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { IncomingForm, type File as FormidableFile } from "formidable";

import {
  AUDITION_MAX_PHOTO_BYTES,
  AUDITION_MAX_PHOTO_MB,
  AUDITION_MAX_VIDEO_BYTES,
  AUDITION_MAX_VIDEO_MB,
} from "@/lib/auditionLimits";
import { isMailConfigured, sendAuditionSubmissionEmails } from "@/lib/mail";
import { isMinioConfigured, uploadAuditionFile } from "@/lib/minio";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

type SubmitSuccess = {
  ok: true;
  videoUrl?: string;
  photoUrl?: string;
};

type SubmitError = {
  ok: false;
  error: string;
};

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
  res: NextApiResponse<SubmitSuccess | SubmitError>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
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
    console.error("[audition/submit] form parse", message);
    return res.status(400).json({
      ok: false,
      error: "Unable to read submission. File may be too large.",
    });
  }

  const firstName = fields.firstName?.trim();
  const lastName = fields.lastName?.trim();
  const email = fields.email?.trim();

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
        await sendAuditionSubmissionEmails({
          firstName,
          lastName,
          email,
          videoUrl: videoUpload.url,
          photoUrl: photoUpload.url,
        });
      } catch (mailError) {
        const message =
          mailError instanceof Error ? mailError.message : "Mail failed";
        console.error("[audition/submit] email failed:", message);
        return res.status(502).json({
          ok: false,
          error: "Submission saved but email failed. Please try again later.",
        });
      }
    } else {
      console.warn(
        "[audition/submit] mail not configured; skipped audition emails.",
      );
    }

    await Promise.allSettled(
      [video.filepath, photo.filepath].map((filepath) =>
        filepath ? fs.unlink(filepath) : Promise.resolve(),
      ),
    );

    return res.status(200).json({
      ok: true,
      videoUrl: videoUpload.url,
      photoUrl: photoUpload.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Submission failed.";
    console.error("[audition/submit]", message);
    const unreachable =
      /ETIMEDOUT|ECONNREFUSED|ENOTFOUND|timeout|timed out/i.test(message);
    return res.status(unreachable ? 503 : 500).json({
      ok: false,
      error: unreachable
        ? "File storage server is unreachable. MinIO port 9000 may be blocked — open it on the server firewall or fix MINIO_ENDPOINT."
        : message || "Unable to submit audition. Please try again.",
    });
  }
}
