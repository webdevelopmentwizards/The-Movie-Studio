import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

import { buildAssistantSystemPrompt } from "@/data/assistantKnowledge";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

type ChatResponse =
  | { reply: string }
  | { error: string };

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(503)
      .json({ error: "Assistant is not configured. Please add OPENAI_API_KEY." });
  }

  const { messages } = req.body as ChatRequestBody;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages are required." });
  }

  const sanitized = messages
    .filter(
      (msg): msg is ChatMessage =>
        !!msg &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((msg) => ({
      role: msg.role,
      content: msg.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== "user") {
    return res.status(400).json({ error: "A user message is required." });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        { role: "system", content: buildAssistantSystemPrompt() },
        ...sanitized,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "No response from assistant." });
    }

    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
