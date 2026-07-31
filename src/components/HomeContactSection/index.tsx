import Link from "next/link";

export default function HomeContactSection() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-950 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
              Coming Soon
            </p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-50 sm:text-3xl">
              Watch Our Movies! Be In Our Movies!
            </h2>
            <p className="mt-3 text-zinc-400">
              Partner with us, pitch a project, or just say hello — we&apos;d
              love to hear from filmmakers, fans, and collaborators.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
