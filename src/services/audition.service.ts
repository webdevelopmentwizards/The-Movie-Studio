import axiosInstance, { type ApiSuccess } from "@/services/axiosInstance";

export type AuditionSubmitResult = {
  id: string;
  videoUrl: string;
  photoUrl: string;
  emailSent?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string;
};

export const auditionService = {
  async submit(
    formData: FormData,
    onProgress?: (percent: number) => void,
  ) {
    const { data } = await axiosInstance.post<ApiSuccess<AuditionSubmitResult>>(
      "/audition/submit",
      formData,
      {
        timeout: 300000, // 5 minutes for larger files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(Math.min(percent, 99)); // Keep at 99% until server finishes processing
          }
        },
      },
    );
    if (onProgress) onProgress(100);
    return data.data;
  },
};
