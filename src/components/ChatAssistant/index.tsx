"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import ChatMessageContent from "./ChatMessageContent";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm The Movie Studio assistant. Ask me about our films, auditions, company info, or how to navigate the site.",
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const TEXTAREA_MIN_HEIGHT = 44;
const TEXTAREA_MAX_HEIGHT = 128;

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-[18px] w-[18px] transition-transform ${active ? "-translate-y-px" : ""}`}
      aria-hidden
    >
      <path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298C9.68342 2.90245 10.3164 2.90245 10.707 3.29298L15.707 8.29298C16.0975 8.6835 16.0975 9.31652 15.707 9.70704C15.3164 10.0976 14.6834 10.0976 14.293 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, TEXTAREA_MIN_HEIGHT),
      TEXTAREA_MAX_HEIGHT,
    );
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
  }, [input]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = nextMessages
        .filter((msg) => msg.id !== "welcome")
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: data.reply ?? "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 hover:bg-amber-400 sm:bottom-6 sm:right-6"
          aria-label="Open chat assistant"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[min(560px,100dvh)] w-full flex-col border border-zinc-800 bg-zinc-950 shadow-2xl sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-zinc-50">Movie Studio Assistant</p>
              <p className="text-xs text-zinc-500">Movies · Auditions · Site help</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors hover:border-amber-500 hover:text-amber-400"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-amber-500 text-zinc-950"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-200"
                  }`}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <ChatMessageContent content={message.content} variant="assistant" />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-400">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-zinc-800 bg-zinc-950/95 p-3"
          >
            <div className="relative rounded-[1.25rem] border border-zinc-700/90 bg-zinc-900 p-2 shadow-inner shadow-black/20 transition-colors focus-within:border-amber-500/40 focus-within:bg-zinc-900/90">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) {
                    return;
                  }
                  e.preventDefault();
                  void sendMessage();
                }}
                rows={1}
                placeholder="Ask about our movies or site…"
                style={{
                  minHeight: TEXTAREA_MIN_HEIGHT,
                  maxHeight: TEXTAREA_MAX_HEIGHT,
                }}
                className="chat-scroll block w-full resize-none bg-transparent px-3 py-2.5 pr-14 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />

              <div className="absolute bottom-2 right-2">
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`group flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-3 transition-all duration-200 ${
                    input.trim() && !loading
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 hover:bg-amber-400 active:scale-95"
                      : "bg-zinc-800 text-zinc-500"
                  } disabled:cursor-not-allowed`}
                  aria-label="Send message"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <SendIcon active={!!input.trim()} />
                      {input.trim() && (
                        <span className="hidden text-xs font-bold tracking-wide sm:inline">
                          Send
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[10px] text-zinc-600">
              Enter to send · Shift+Enter for new line
            </p>
          </form>
        </div>
      )}
    </>
  );
}
