interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export default function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:py-28">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-amber-400 sm:mb-4 sm:text-xs sm:tracking-[0.2em] md:text-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl break-words text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-zinc-400 sm:mt-6 sm:text-base md:text-lg lg:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
