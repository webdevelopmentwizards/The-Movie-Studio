import {
  API_BASE_URL,
  getStoredAccessToken,
  type ApiSuccess,
} from "@/services/axiosInstance";

export type AuditionSubmitResult = {
  id: string;
  videoUrl?: string;
  photoUrl?: string;
  emailSent?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string;
  status?: string;
};

/** Backend NDJSON stream event contract for POST /audition/submit */
export type AuditionStreamEvent = {
  type: "progress" | "done" | "error";
  percent?: number;
  stage?: string;
  message?: string;
  data?: AuditionSubmitResult;
};

export type AuditionSubmitProgress = {
  percent: number;
  stage?: string;
};

const STAGE_LABELS: Record<string, string> = {
  receiving: "Receiving files…",
  received: "Files received…",
  compressing: "Compressing media…",
  compressing_photo: "Compressing photo…",
  compressing_video: "Compressing video…",
  storing: "Saving to storage…",
  email: "Sending confirmation…",
  done: "Complete",
};

export function getAuditionStageLabel(stage?: string) {
  if (!stage) return "Uploading…";
  return STAGE_LABELS[stage] || stage;
}

function parseJsonSafe<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Submit audition with backend-driven progress streaming.
 *
 * Backend MUST respond with chunked `application/x-ndjson` lines:
 *   {"type":"progress","percent":20,"stage":"receiving"}
 *   {"type":"progress","percent":55,"stage":"compressing_video"}
 *   {"type":"done","percent":100,"data":{...}}
 *
 * Until the first progress event arrives, client maps bytes-sent to 1–15%
 * so the bar is not stuck at 0 while the request body is still uploading.
 */
function submitWithBackendStream(
  formData: FormData,
  onProgress?: (update: AuditionSubmitProgress) => void,
): Promise<AuditionSubmitResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/audition/submit`);
    xhr.timeout = 300000;
    xhr.responseType = "text";

    const token = getStoredAccessToken();
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.setRequestHeader("Accept", "application/x-ndjson, application/json");

    let cursor = 0;
    let settled = false;
    let gotServerProgress = false;
    let latestResult: AuditionSubmitResult | null = null;

    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      reject(new Error(message));
    };

    const succeed = (data: AuditionSubmitResult) => {
      if (settled) return;
      settled = true;
      onProgress?.({ percent: 100, stage: "done" });
      resolve(data);
    };

    const handleEvent = (event: AuditionStreamEvent) => {
      if (event.type === "progress") {
        gotServerProgress = true;
        const percent = Math.min(
          99,
          Math.max(1, Math.round(event.percent ?? 1)),
        );
        onProgress?.({ percent, stage: event.stage });
        return;
      }

      if (event.type === "error") {
        fail(event.message || "Submission failed.");
        return;
      }

      if (event.type === "done") {
        if (event.data) latestResult = event.data;
        const percent = Math.round(event.percent ?? 100);
        onProgress?.({ percent: Math.min(100, percent), stage: "done" });
        if (event.data) succeed(event.data);
      }
    };

    const consumeNewText = (fullText: string) => {
      const chunk = fullText.slice(cursor);
      if (!chunk) return;
      cursor = fullText.length;

      const parts = chunk.split("\n");
      // Keep incomplete last line in buffer by rewinding cursor
      const incomplete = chunk.endsWith("\n") ? "" : parts.pop() || "";
      if (incomplete) {
        cursor -= incomplete.length;
      }

      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue;

        // SSE-style "data: {...}"
        const payload = trimmed.startsWith("data:")
          ? trimmed.slice(5).trim()
          : trimmed;

        const event = parseJsonSafe<AuditionStreamEvent>(payload);
        if (event?.type) {
          handleEvent(event);
          continue;
        }

        // Legacy single JSON envelope (non-streaming backends)
        const legacy = parseJsonSafe<ApiSuccess<AuditionSubmitResult>>(payload);
        if (legacy?.data) {
          latestResult = legacy.data;
          onProgress?.({ percent: 100, stage: "done" });
        }
      }
    };

    xhr.upload.onprogress = (event) => {
      if (gotServerProgress || !onProgress) return;
      if (!event.lengthComputable || event.total <= 0) {
        onProgress({ percent: 1, stage: "receiving" });
        return;
      }
      // Soft client hint only (1–15%) until backend stream takes over
      const ratio = event.loaded / event.total;
      const percent = Math.min(15, Math.max(1, Math.round(ratio * 15)));
      onProgress({ percent, stage: "receiving" });
    };

    xhr.onprogress = () => {
      if (typeof xhr.responseText === "string") {
        consumeNewText(xhr.responseText);
      }
    };

    xhr.onload = () => {
      if (typeof xhr.responseText === "string") {
        consumeNewText(xhr.responseText);
      }

      if (settled) return;

      if (xhr.status < 200 || xhr.status >= 300) {
        const errBody = parseJsonSafe<{ message?: string }>(xhr.responseText);
        const streamErr = parseJsonSafe<AuditionStreamEvent>(
          xhr.responseText.trim().split("\n").pop() || "",
        );
        fail(
          streamErr?.message ||
            errBody?.message ||
            `Upload failed (${xhr.status})`,
        );
        return;
      }

      if (latestResult) {
        succeed(latestResult);
        return;
      }

      // Entire body is one JSON object (legacy)
      const legacy = parseJsonSafe<ApiSuccess<AuditionSubmitResult>>(
        xhr.responseText,
      );
      if (legacy?.data) {
        succeed(legacy.data);
        return;
      }

      const direct = parseJsonSafe<AuditionSubmitResult>(xhr.responseText);
      if (direct?.id) {
        succeed(direct);
        return;
      }

      fail("Invalid response from server.");
    };

    xhr.onerror = () => fail("Network error while uploading.");
    xhr.ontimeout = () => fail("Upload timed out. Please try again.");
    xhr.onabort = () => fail("Upload cancelled.");

    xhr.send(formData);
  });
}

export const auditionService = {
  async submit(
    formData: FormData,
    onProgress?: (update: AuditionSubmitProgress | number) => void,
  ) {
    return submitWithBackendStream(formData, (update) => {
      if (!onProgress) return;
      // Support both new object callback and legacy number-only callers
      onProgress(update);
    });
  },
};
