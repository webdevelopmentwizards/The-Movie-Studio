/** Max video size when storing in MinIO. */
export const AUDITION_MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const AUDITION_MAX_VIDEO_MB = 100;

/** Max headshot size. */
export const AUDITION_MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const AUDITION_MAX_PHOTO_MB = 10;

/** @deprecated Use AUDITION_MAX_VIDEO_BYTES / AUDITION_MAX_PHOTO_BYTES */
export const AUDITION_MAX_UPLOAD_BYTES = AUDITION_MAX_VIDEO_BYTES;
export const AUDITION_MAX_UPLOAD_MB = AUDITION_MAX_VIDEO_MB;

export function formatMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}
