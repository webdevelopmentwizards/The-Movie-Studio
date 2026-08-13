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
  async submit(formData: FormData) {
    const { data } = await axiosInstance.post<ApiSuccess<AuditionSubmitResult>>(
      "/audition/submit",
      formData,
      {
        timeout: 180000,
      },
    );
    return data.data;
  },
};
