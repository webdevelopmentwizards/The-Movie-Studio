import Link from "next/link";

import Logo from "@/components/Logo";
import SocialLinks from "@/components/SocialLinks";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/movies", label: "All Movies" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="w-full px-4 py-14 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 text-sm font-semibold tracking-wide text-amber-400">
              Watch Our Movies! Be In Our Movies!
            </p>
            <SocialLinks />
            <p className="mt-6 text-xs font-medium tracking-wide text-zinc-500">
              Publicly Traded Company
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Investor Information
            </h3>
            <a
              href="https://finance.yahoo.com/quote/MVES/?p=MVES"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              View Stock (MVES)
            </a>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Movie Studio. All rights reserved.{" "}
            <span className="font-semibold text-zinc-400">OTC: MVES</span>
          </p>
          <p className="text-sm text-zinc-500">Made with passion for cinema</p>
        </div>
      </div>
    </footer>
  );
}
