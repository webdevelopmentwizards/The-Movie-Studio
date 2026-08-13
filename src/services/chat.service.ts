import axiosInstance, { type ApiSuccess } from "@/services/axiosInstance";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const chatService = {
  async send(messages: ChatMessage[]) {
    const { data } = await axiosInstance.post<ApiSuccess<{ reply: string }>>(
      "/chat",
      { messages },
    );
    return data.data.reply;
  },
};
