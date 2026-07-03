import Link from "next/link";
import type { ReactNode } from "react";

export interface TocItem {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  effectiveDate: string;
  intro: ReactNode;
  toc: TocItem[];
  relatedPage?: { href: string; label: string };
  children: ReactNode;
}

export default function LegalPageLayout({
  effectiveDate,
  intro,
  toc,
  relatedPage,
  children,
}: LegalPageLayoutProps) {
  return (
    <section className="overflow-x-hidden bg-zinc-950 py-8 sm:py-16 md:py-24">
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:mb-10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              Effective {effectiveDate}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[10px] text-zinc-400 sm:px-4 sm:text-xs">
              {toc.length} sections
            </span>
          </div>
          {relatedPage && (
            <Link
              href={relatedPage.href}
              className="inline-flex w-fit text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
            >
              View {relatedPage.label} →
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-4 sm:rounded-2xl sm:p-8 md:p-10">
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
            {intro}
          </p>
        </div>

        <div className="mt-6 grid min-w-0 gap-6 sm:mt-12 sm:gap-10 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:mb-4 sm:text-xs">
              On this page
            </p>
            <nav className="flex flex-col gap-1 sm:gap-1.5">
              {toc.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex w-full min-w-0 items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-sm text-zinc-400 transition-all hover:border-zinc-800 hover:bg-zinc-900/60 hover:text-zinc-100 sm:gap-3 sm:rounded-xl sm:px-3 sm:py-2.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-500 transition-colors group-hover:bg-amber-500/15 group-hover:text-amber-400 sm:text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 break-words leading-snug">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 space-y-3 sm:space-y-6">{children}</article>
        </div>
      </div>
    </section>
  );
}

interface LegalSectionProps {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}

export function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 transition-colors hover:border-zinc-700 sm:scroll-mt-24 sm:rounded-2xl sm:p-6 md:p-8 lg:scroll-mt-28"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-4 md:gap-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg bg-amber-500/10 text-[11px] font-bold text-amber-400 ring-1 ring-amber-500/20 sm:h-11 sm:w-11 sm:rounded-xl sm:text-sm">
          {String(number).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-base font-semibold text-zinc-50 sm:text-xl md:text-2xl">
            {title}
          </h2>
          <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="break-words text-sm font-semibold text-zinc-200 sm:text-base md:text-lg">
      {children}
    </h3>
  );
}

export function LegalText({ children }: { children: ReactNode }) {
  return (
    <p className="break-words text-sm leading-relaxed text-zinc-400 sm:text-base">
      {children}
    </p>
  );
}

export function LegalBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400 sm:gap-3 sm:text-base">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
          <span className="min-w-0 flex-1 break-words leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface LegalContactProps {
  email: string;
  address: string;
}

export function LegalContact({ email, address }: LegalContactProps) {
  return (
    <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 sm:rounded-xl sm:p-5">
      <p className="text-sm font-semibold text-zinc-100 sm:text-base">The Movie Studio</p>
      <p className="mt-2 break-words text-sm text-zinc-400 sm:text-base">{address}</p>
      <a
        href={`mailto:${email}`}
        className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
      >
        {email}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

export function LegalEmailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="break-all font-medium text-amber-400 transition-colors hover:text-amber-300 hover:underline"
    >
      {email}
    </a>
  );
}
