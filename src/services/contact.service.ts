import axiosInstance, { type ApiSuccess } from "@/services/axiosInstance";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
};

export const contactService = {
  async submit(input: ContactInput) {
    const { data } = await axiosInstance.post<
      ApiSuccess<{ id?: string; received: boolean }>
    >("/contact", input);
    return data;
  },
};
