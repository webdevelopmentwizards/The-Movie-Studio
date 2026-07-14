"use client";

import { useState } from "react";

import AuditionWizard from "@/components/AuditionWizard";

export default function HomeAuditionCTA() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.12),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-400">
              Your Breakout Role Awaits
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl md:text-5xl">
              Watch Our Movies! Be in Our Movies! Submit Your Audition Today.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Whether you&apos;re chasing your first on-screen moment or ready
              for your next big role — record your scene, upload your media, and
              put yourself in front of our casting team. Real films. Real
              opportunities. Your story starts here.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Start Your Audition
              </button>
              <p className="text-xs text-zinc-500">
                Scene · Video · Photo · Plan — takes about 5 minutes
              </p>
            </div>

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              {[
                {
                  title: "Memorize Your Scene",
                  text: "We give you a monologue — you make it yours.",
                },
                {
                  title: "Upload Your Performance",
                  text: "Record on your phone and submit your audition video.",
                },
                {
                  title: "Get Discovered",
                  text: "Our team reviews every submission for upcoming projects.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
                >
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuditionWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
