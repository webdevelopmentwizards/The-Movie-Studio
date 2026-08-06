/**
 * Microsoft 365 / GoDaddy practical attachment budget.
 * Message limit is ~25MB; base64 encoding uses extra space, so ~18MB payload is safe.
 */
export const AUDITION_MAX_UPLOAD_BYTES = 18 * 1024 * 1024;
export const AUDITION_MAX_UPLOAD_MB = 18;

export function formatMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

export function isWithinAuditionUploadLimit(bytes: number): boolean {
  return bytes > 0 && bytes <= AUDITION_MAX_UPLOAD_BYTES;
}
