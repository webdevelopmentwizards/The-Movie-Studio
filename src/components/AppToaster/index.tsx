"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg shadow-black/40",
          title: "text-sm font-semibold text-zinc-50",
          description: "text-xs text-zinc-400",
          success: "border-amber-500/30",
          error: "border-red-500/40",
          warning: "border-amber-500/40",
          closeButton: "border-zinc-700 bg-zinc-900 text-zinc-300",
        },
      }}
    />
  );
}
